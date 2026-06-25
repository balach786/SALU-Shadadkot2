/**
 * =====================================================================
 *  SALU SHADADKOT CAMPUS – SMART ADMISSION SYSTEM (Google Apps Script)
 * =====================================================================
 *
 *  Paste this file into a new Google Apps Script project, configure the
 *  three IDs below, then deploy as a Web App.
 *
 *  ▸ Frontend integration point: paste the deployed /exec URL into
 *    `src/lib/config.ts → APPS_SCRIPT_URL`.
 *  ▸ See `docs/SETUP.md` for full step-by-step instructions.
 *
 *  ENDPOINTS
 *    POST  ?action=submit         – Submit a new application (JSON Payload)
 *    POST  ?action=updateStatus   – Update an application's status
 *    POST  ?action=contact        – Contact form message
 *    GET   ?action=search&cnic=…  – Lookup an applicant by CNIC
 *    GET   ?action=list           – List all applications (admin)
 * =====================================================================
 */

// ====================== CONFIGURE THESE ==============================
const SHEET_ID         = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const DRIVE_FOLDER_ID  = 'PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE';
const NOTIFY_FROM_NAME = 'SALU Shadadkot Admissions';
// =====================================================================

const SHEET_APPLICATIONS = 'Applications';
const SHEET_CONTACT      = 'ContactMessages';
const SHEET_LOGS         = 'AdminLogs';

const APP_HEADERS = [
  'Application ID', 'Timestamp', 'Full Name', 'Father Name', 'CNIC',
  'Date of Birth', 'Gender', 'Phone', 'Email', 'Address', 'Program',
  'Photo URL', 'Documents URL', 'Fee Screenshot URL',
  'Card URL', 'QR URL', 'Status'
];

// ---------- ENTRY POINTS ---------------------------------------------

function doPost(e) {
  try {
    let p = {};
    let files = {};
    
    // 1. Try parsing JSON from request body
    if (e.postData && e.postData.contents) {
      try {
        const payload = JSON.parse(e.postData.contents);
        if (payload && typeof payload === 'object') {
          p = payload;
          if (payload.files) {
            files = payload.files;
          }
        }
      } catch (jsonErr) {
        // Not valid JSON, ignore and fallback to parameters
      }
    }
    
    // 2. Merge URL parameters / URL-encoded form data parameters if present
    if (e.parameter) {
      for (const key in e.parameter) {
        p[key] = e.parameter[key];
      }
    }
    
    const action = p.action || 'submit';
    if (action === 'submit')        return jsonOk(handleSubmit_(p, files));
    if (action === 'updateStatus')  return jsonOk(handleUpdateStatus_(p));
    if (action === 'contact')       return jsonOk(handleContact_(p));
    return jsonErr('Unknown action: ' + action);
  } catch (err) {
    return jsonErr(err.message || String(err));
  }
}

function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) || 'search';
    if (action === 'search') return jsonOk(handleSearch_(e.parameter.cnic));
    if (action === 'list')   return jsonOk(handleList_());
    if (action === 'photo')  return jsonOk(handleGetPhoto_(e.parameter.cnic));
    return jsonErr('Unknown action: ' + action);
  } catch (err) {
    return jsonErr(err.message || String(err));
  }
}

// ---------- HANDLERS --------------------------------------------------

function handleSubmit_(p, files) {
  ensureSheets_();

  // Validate
  const required = ['fullName','fatherName','cnic','dob','gender','phone','email','address','program'];
  for (const k of required) if (!p[k]) throw new Error('Missing field: ' + k);
  if (!/^\d{5}-\d{7}-\d$/.test(p.cnic)) throw new Error('Invalid CNIC format');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) throw new Error('Invalid email');

  // Duplicate check
  if (findRowByCnic_(p.cnic)) {
    throw new Error('An application with this CNIC already exists.');
  }

  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const applicantFolder = folder.createFolder(p.cnic + '_' + Date.now());

  // Upload files using base64 decoding
  const photoData = uploadFile_(files.photo, 'photo', applicantFolder);
  const docsData  = uploadFile_(files.documents, 'documents', applicantFolder);
  const feeData   = uploadFile_(files.feeScreenshot, 'feeScreenshot', applicantFolder);

  const photoUrl = photoData.url;
  const docsUrl  = docsData.url;
  const feeUrl   = feeData.url;

  const applicationId = nextApplicationId_();
  const timestamp = new Date();

  // QR encodes the verification URL (or app id + cnic)
  const qrPayload = applicationId + '|' + p.cnic + '|' + p.fullName;
  const rawQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent(qrPayload);
  
  // Fetch QR Code and convert to base64 so it gets permanently embedded in the PDF
  const qrBase64 = getQrCodeBase64_(rawQrUrl);

  // Generate PDF card with inlined base64 images
  const cardUrl = generateCardPdf_(applicantFolder, {
    applicationId, fullName: p.fullName, fatherName: p.fatherName,
    cnic: p.cnic, program: p.program, dob: p.dob,
    timestamp, 
    photoBase64: photoData.base64DataUrl, 
    qrBase64: qrBase64
  });

  // Append row
  const row = [
    applicationId, timestamp, p.fullName, p.fatherName, p.cnic, p.dob,
    p.gender, p.phone, p.email, p.address, p.program,
    photoUrl, docsUrl, feeUrl, cardUrl, rawQrUrl, 'Submitted'
  ];
  sheet_(SHEET_APPLICATIONS).appendRow(row);

  // Email notification (best-effort)
  try {
    MailApp.sendEmail({
      to: p.email,
      name: NOTIFY_FROM_NAME,
      subject: 'Application received — ' + applicationId,
      htmlBody:
        '<p>Dear ' + escapeHtml_(p.fullName) + ',</p>' +
        '<p>Your application to <b>' + escapeHtml_(p.program) + '</b> has been received.</p>' +
        '<p><b>Application ID:</b> ' + applicationId + '</p>' +
        '<p>You can download your applicant card here:<br>' +
        '<a href="' + cardUrl + '">' + cardUrl + '</a></p>' +
        '<p>Best regards,<br>SALU Shadadkot Admissions Office</p>'
    });
  } catch (err) { /* ignore quota errors */ }

  log_('SUBMIT', applicationId + ' / ' + p.cnic);

  return recordFromRow_(row);
}

function handleSearch_(cnic) {
  if (!cnic) throw new Error('CNIC is required');
  const row = findRowByCnic_(cnic);
  if (!row) throw new Error('No application found for this CNIC.');
  return recordFromRow_(row);
}

function handleList_() {
  ensureSheets_();
  const data = sheet_(SHEET_APPLICATIONS).getDataRange().getValues();
  if (data.length <= 1) return [];
  return data.slice(1).map(recordFromRow_);
}

function handleUpdateStatus_(p) {
  const id     = p.applicationId;
  const status = p.status;
  if (!id || !status) throw new Error('applicationId and status are required');
  const sh = sheet_(SHEET_APPLICATIONS);
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
     if (values[i][0] === id) {
       sh.getRange(i + 1, APP_HEADERS.indexOf('Status') + 1).setValue(status);
       log_('STATUS', id + ' -> ' + status);
       return { applicationId: id, status: status };
     }
  }
  throw new Error('Application not found');
}

function handleContact_(p) {
  ensureSheets_();
  sheet_(SHEET_CONTACT).appendRow([new Date(), p.name || '', p.email || '', p.subject || '', p.message || '']);
  return { received: true };
}

// ---------- HELPERS ---------------------------------------------------

function jsonOk(data)  { return ContentService.createTextOutput(JSON.stringify({ ok: true, data: data })).setMimeType(ContentService.MimeType.JSON); }
function jsonErr(msg)  { return ContentService.createTextOutput(JSON.stringify({ ok: false, error: msg })).setMimeType(ContentService.MimeType.JSON); }

function sheet_(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function ensureSheets_() {
  const apps = sheet_(SHEET_APPLICATIONS);
  if (apps.getLastRow() === 0) apps.appendRow(APP_HEADERS);
  const c = sheet_(SHEET_CONTACT);
  if (c.getLastRow() === 0) c.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message']);
  const l = sheet_(SHEET_LOGS);
  if (l.getLastRow() === 0) l.appendRow(['Timestamp', 'Event', 'Detail']);
}

function log_(event, detail) {
  try { sheet_(SHEET_LOGS).appendRow([new Date(), event, detail]); } catch (e) {}
}

function nextApplicationId_() {
  const sh = sheet_(SHEET_APPLICATIONS);
  const count = Math.max(0, sh.getLastRow() - 1);
  const year = new Date().getFullYear();
  return 'ADM-' + year + '-' + String(count + 1).padStart(6, '0');
}

function findRowByCnic_(cnic) {
  ensureSheets_();
  const data = sheet_(SHEET_APPLICATIONS).getDataRange().getValues();
  for (let i = 1; i < data.length; i++) if (String(data[i][4]) === cnic) return data[i];
  return null;
}

function recordFromRow_(row) {
  return {
    applicationId:    row[0],
    timestamp:        row[1] instanceof Date ? row[1].toISOString() : row[1],
    fullName:         row[2],
    fatherName:       row[3],
    cnic:             row[4],
    dob:              row[5],
    gender:           row[6],
    phone:            row[7],
    email:            row[8],
    address:          row[9],
    program:          row[10],
    photoUrl:         row[11],
    documentsUrl:     row[12],
    feeScreenshotUrl: row[13],
    cardUrl:          row[14],
    qrUrl:            row[15],
    status:           row[16] || 'Submitted'
  };
}

function uploadFile_(fileObj, defaultName, folder) {
  if (!fileObj || !fileObj.base64) return { url: '', base64DataUrl: '' };
  try {
    const decoded = Utilities.base64Decode(fileObj.base64);
    const blob = Utilities.newBlob(decoded, fileObj.mimeType || 'application/octet-stream', fileObj.name || defaultName);
    const file = folder.createFile(blob).setName(defaultName + '_' + Date.now() + '_' + blob.getName());
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const url = 'https://drive.google.com/uc?export=view&id=' + file.getId();
    const base64DataUrl = 'data:' + (fileObj.mimeType || 'image/jpeg') + ';base64,' + fileObj.base64;
    return { url: url, base64DataUrl: base64DataUrl };
  } catch (err) {
    console.error('File upload failed: ' + err.message);
    return { url: '', base64DataUrl: '' };
  }
}

function getQrCodeBase64_(qrUrl) {
  try {
    const response = UrlFetchApp.fetch(qrUrl);
    const blob = response.getBlob();
    const base64 = Utilities.base64Encode(blob.getBytes());
    return 'data:image/png;base64,' + base64;
  } catch (err) {
    console.error('Failed to fetch QR code: ' + err.message);
    return qrUrl; // fallback to URL if fetch fails
  }
}

function escapeHtml_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

/** Generate a simple PDF admission card using a highly compatible HTML table structure and return its shared URL. */
function generateCardPdf_(folder, d) {
  const html =
    '<html><head><style>' +
    'body{font-family:Arial,sans-serif;margin:0;padding:20px;color:#111}' +
    '.card-table{width:100%;border-collapse:collapse;border:2px solid #0E5A3C;background:#fff;border-radius:10px;overflow:hidden}' +
    '.header-band{background:#0E5A3C;color:#fff;padding:12px 18px}' +
    '.header-title{font-size:16px;font-weight:bold;margin:0;color:#ffffff}' +
    '.header-tag{background:#C9A227;color:#3a2a00;padding:3px 8px;border-radius:10px;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;white-space:nowrap}' +
    '.photo-cell{width:120px;padding:15px;vertical-align:top}' +
    '.photo-box{width:110px;height:135px;border:2px solid #C9A227;border-radius:6px;overflow:hidden;background:#f5f5f5;text-align:center}' +
    '.photo-img{width:110px;height:135px;object-fit:cover}' +
    '.details-cell{padding:15px;vertical-align:top;font-size:13px;line-height:1.6}' +
    '.k{color:#666;text-transform:uppercase;font-size:10px;letter-spacing:0.5px;font-weight:bold;margin-bottom:2px}' +
    '.v{color:#111;font-weight:normal;margin-bottom:10px}' +
    '.qr-cell{width:130px;padding:15px;vertical-align:middle;text-align:center}' +
    '.qr-box{width:110px;border:1px solid #ddd;border-radius:6px;background:#fff;padding:4px;display:inline-block}' +
    '.qr-img{width:100px;height:100px}' +
    '.qr-label{font-size:9px;color:#666;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px}' +
    '.footer-band{background:#f5f5f1;border-top:1px solid #eee;text-align:center;font-size:10px;color:#666;padding:8px}' +
    '</style></head><body>' +
    
    '<table class="card-table">' +
      '<tr>' +
        '<td class="header-band" colspan="3">' +
          '<table style="width:100%;border-collapse:collapse;"><tr>' +
            '<td><span style="font-size:16px;font-weight:bold;color:#ffffff;margin:0;">Shah Abdul Latif University &middot; Shadadkot Campus</span></td>' +
            '<td style="text-align:right;"><span class="header-tag">Admission Card</span></td>' +
          '</tr></table>' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td class="photo-cell">' +
          '<div class="photo-box">' + 
            (d.photoBase64 ? '<img class="photo-img" src="' + d.photoBase64 + '"/>' : '<div style="line-height:135px;color:#999;font-size:12px;">No Photo</div>') + 
          '</div>' +
        '</td>' +
        '<td class="details-cell">' +
          '<div class="k">Application ID</div>' +
          '<div class="v" style="font-size:15px;font-weight:bold;color:#0E5A3C">' + d.applicationId + '</div>' +
          '<div class="k">Full Name</div>' +
          '<div class="v">' + escapeHtml_(d.fullName) + '</div>' +
          '<div class="k">Father\'s Name</div>' +
          '<div class="v">' + escapeHtml_(d.fatherName) + '</div>' +
          '<div class="k">CNIC / B-Form</div>' +
          '<div class="v">' + escapeHtml_(d.cnic) + '</div>' +
          '<div class="k">Applied Program</div>' +
          '<div class="v">' + escapeHtml_(d.program) + '</div>' +
          '<div class="k">Issue Date</div>' +
          '<div class="v">' + Utilities.formatDate(d.timestamp, Session.getScriptTimeZone(), 'dd MMM yyyy') + '</div>' +
        '</td>' +
        '<td class="qr-cell">' +
          '<div class="qr-box">' +
            (d.qrBase64 ? '<img class="qr-img" src="' + d.qrBase64 + '"/>' : '') +
            '<div class="qr-label">Scan to verify</div>' +
          '</div>' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td class="footer-band" colspan="3">' +
          'Computer-generated Admission Slip &bull; Bring original CNIC and printed copy on test day.' +
        '</td>' +
      '</tr>' +
    '</table>' +
    
    '</body></html>';

  const blob = Utilities.newBlob(html, 'text/html', d.applicationId + '.html').getAs('application/pdf');
  const file = folder.createFile(blob).setName(d.applicationId + '_card.pdf');
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function handleGetPhoto_(cnic) {
  if (!cnic) throw new Error('CNIC is required');
  const row = findRowByCnic_(cnic);
  if (!row) throw new Error('Application not found');
  
  const photoUrl = row[11]; // Photo URL is index 11
  if (!photoUrl) return { base64: '' };
  
  const match = photoUrl.match(/id=([^&]+)/);
  if (!match) return { base64: '' };
  const fileId = match[1];
  
  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    const base64 = Utilities.base64Encode(blob.getBytes());
    const mimeType = blob.getContentType();
    return {
      base64: 'data:' + mimeType + ';base64,' + base64
    };
  } catch (err) {
    console.error('Failed to get photo: ' + err.message);
    return { base64: '' };
  }
}
