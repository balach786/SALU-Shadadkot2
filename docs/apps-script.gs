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
 *    POST  ?action=submit         – Submit a new application (FormData)
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
    const action = (e.parameter && e.parameter.action) || 'submit';
    if (action === 'submit')        return jsonOk(handleSubmit_(e));
    if (action === 'updateStatus')  return jsonOk(handleUpdateStatus_(e));
    if (action === 'contact')       return jsonOk(handleContact_(e));
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
    return jsonErr('Unknown action: ' + action);
  } catch (err) {
    return jsonErr(err.message || String(err));
  }
}

// ---------- HANDLERS --------------------------------------------------

function handleSubmit_(e) {
  ensureSheets_();
  const p = e.parameter || {};

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

  const photoUrl   = uploadFile_(e, 'photo', applicantFolder);
  const docsUrl    = uploadFile_(e, 'documents', applicantFolder);
  const feeUrl     = uploadFile_(e, 'feeScreenshot', applicantFolder);

  const applicationId = nextApplicationId_();
  const timestamp = new Date();

  // QR encodes the verification URL (or app id + cnic)
  const qrPayload = applicationId + '|' + p.cnic + '|' + p.fullName;
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=' + encodeURIComponent(qrPayload);

  // Generate PDF card
  const cardUrl = generateCardPdf_(applicantFolder, {
    applicationId, fullName: p.fullName, fatherName: p.fatherName,
    cnic: p.cnic, program: p.program, dob: p.dob,
    timestamp, photoUrl, qrUrl
  });

  // Append row
  const row = [
    applicationId, timestamp, p.fullName, p.fatherName, p.cnic, p.dob,
    p.gender, p.phone, p.email, p.address, p.program,
    photoUrl, docsUrl, feeUrl, cardUrl, qrUrl, 'Submitted'
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

function handleUpdateStatus_(e) {
  const id     = e.parameter.applicationId;
  const status = e.parameter.status;
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

function handleContact_(e) {
  ensureSheets_();
  const p = e.parameter;
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

function uploadFile_(e, field, folder) {
  const blob = e.files && e.files[field];
  if (!blob) return '';
  const file = folder.createFile(blob).setName(field + '_' + Date.now() + '_' + blob.getName());
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  // Use a direct-display URL so <img> tags can render the photo on the applicant card.
  // getUrl() returns a Google Drive "open" page which browsers cannot embed directly.
  return 'https://drive.google.com/uc?export=view&id=' + file.getId();
}

function escapeHtml_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

/** Generate a simple PDF admission card and return its shared URL. */
function generateCardPdf_(folder, d) {
  const html =
    '<html><head><style>' +
    'body{font-family:Arial,sans-serif;margin:0;padding:24px;color:#111}' +
    '.card{border:2px solid #0E5A3C;border-radius:12px;overflow:hidden}' +
    '.band{background:#0E5A3C;color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center}' +
    '.band h1{margin:0;font-size:18px}' +
    '.tag{background:#C9A227;color:#3a2a00;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:bold;letter-spacing:.1em;text-transform:uppercase}' +
    '.body{display:flex;gap:18px;padding:18px}' +
    '.photo{width:110px;height:140px;border:2px solid #C9A227;border-radius:8px;overflow:hidden;background:#eee}' +
    '.photo img{width:100%;height:100%;object-fit:cover}' +
    '.details{flex:1;font-size:13px;line-height:1.7}' +
    '.k{color:#666;text-transform:uppercase;font-size:10px;letter-spacing:.08em}' +
    '.qr{width:120px;text-align:center;font-size:10px;color:#666}' +
    '.qr img{width:120px;height:120px;border:1px solid #ddd;border-radius:6px;background:#fff}' +
    '.foot{background:#f5f5f1;text-align:center;font-size:10px;color:#666;padding:8px}' +
    '</style></head><body>' +
    '<div class="card">' +
      '<div class="band"><h1>Shah Abdul Latif University · Shadadkot Campus</h1><span class="tag">Admission Card</span></div>' +
      '<div class="body">' +
        '<div class="photo">' + (d.photoUrl ? '<img src="' + d.photoUrl + '"/>' : '') + '</div>' +
        '<div class="details">' +
          '<div><span class="k">Application ID</span><br><b style="color:#0E5A3C">' + d.applicationId + '</b></div>' +
          '<div><span class="k">Name</span><br>' + escapeHtml_(d.fullName) + '</div>' +
          '<div><span class="k">Father</span><br>' + escapeHtml_(d.fatherName) + '</div>' +
          '<div><span class="k">CNIC</span><br>' + escapeHtml_(d.cnic) + '</div>' +
          '<div><span class="k">Program</span><br>' + escapeHtml_(d.program) + '</div>' +
          '<div><span class="k">Date</span><br>' + Utilities.formatDate(d.timestamp, Session.getScriptTimeZone(), 'dd MMM yyyy') + '</div>' +
        '</div>' +
        '<div class="qr"><img src="' + d.qrUrl + '"/><div>Scan to verify</div></div>' +
      '</div>' +
      '<div class="foot">Computer-generated · Bring original CNIC on test day</div>' +
    '</div></body></html>';

  const blob = Utilities.newBlob(html, 'text/html', d.applicationId + '.html').getAs('application/pdf');
  const file = folder.createFile(blob).setName(d.applicationId + '_card.pdf');
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}
