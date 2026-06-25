# Smart Admission System – Setup Guide

This site is the frontend. The backend is a **Google Apps Script Web App**
backed by **Google Sheets** + **Google Drive**. Setup takes ~15 minutes.

---

## 1. Create the Google Sheet

1. Open [sheets.google.com](https://sheets.google.com) and create a new
   spreadsheet named **SALU Shadadkot — Admissions**.
2. From the URL, copy the **Sheet ID**. It's the long string between
   `/d/` and `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/<<<THIS_IS_THE_SHEET_ID>>>/edit
   ```
3. The script will auto-create three tabs on first run:
   - `Applications` – every admission submission
   - `ContactMessages` – contact form messages
   - `AdminLogs` – internal event log

## 2. Create the Drive folder

1. Open [drive.google.com](https://drive.google.com) and create a folder
   named **SALU Admissions Uploads**.
2. Open it and copy the **Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/<<<THIS_IS_THE_FOLDER_ID>>>
   ```

## 3. Create the Apps Script project

1. Open [script.google.com](https://script.google.com) → **New project**.
2. Delete the boilerplate and paste the **entire** contents of
   `docs/apps-script.gs`.
3. At the top of the file, set:
   ```js
   const SHEET_ID        = '...';  // from step 1
   const DRIVE_FOLDER_ID = '...';  // from step 2
   ```
4. Save (⌘/Ctrl+S). Name the project **SALU Admissions API**.

## 4. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear → **Web app**.
3. Settings:
   - **Description**: `SALU Admissions API`
   - **Execute as**: `Me` (your Google account)
   - **Who has access**: `Anyone`
4. Click **Deploy** and authorize the requested scopes
   (Sheets, Drive, Gmail).
5. Copy the **Web app URL** — it ends with `/exec`.

> Every time you change the script, redeploy via
> **Deploy → Manage deployments → Edit (pencil) → Version: New version**.

## 5. Wire the frontend

Open `src/lib/config.ts` and paste the `/exec` URL:

```ts
export const APPS_SCRIPT_URL: string = "https://script.google.com/macros/s/AKfy.../exec";
```

That's it — the admission form, CNIC search, contact form, and admin
panel will all start working immediately.

---

## Admin panel

- Visit `/admin` (linked from the footer).
- The password is the `ADMIN_PASSWORD` env secret (set via the project
  Secrets panel). It is **server-side only** — never shipped to the browser.
- A 64-character `SESSION_SECRET` encrypts the admin session cookie.
- Default password is `salu-admin-change-me` — **change it immediately**
  via Project Settings → Secrets → `ADMIN_PASSWORD`.

## API reference

The Apps Script exposes these endpoints on its single `/exec` URL:

| Method | `action`       | Inputs                                       | Returns                                  |
| ------ | -------------- | -------------------------------------------- | ---------------------------------------- |
| POST   | `submit`       | All form fields + `photo`, `documents`, `feeScreenshot` files | full `ApplicantRecord` |
| POST   | `updateStatus` | `applicationId`, `status`                    | `{applicationId,status}`                 |
| POST   | `contact`      | `name`, `email`, `subject`, `message`        | `{received:true}`                        |
| GET    | `search`       | `?cnic=12345-1234567-1`                      | `ApplicantRecord`                        |
| GET    | `list`         | —                                            | `ApplicantRecord[]`                      |

All responses use the JSON envelope `{ ok: true, data }` or
`{ ok: false, error }`.

## Application ID format

`ADM-<YEAR>-<6-digit-zero-padded-count>` — e.g. `ADM-2026-000145`.

## What gets uploaded to Drive

For each submission a subfolder is created inside your Drive folder:
```
<CNIC>_<timestamp>/
   photo_*.jpg
   documents_*.pdf
   feeScreenshot_*.png
   ADM-2026-XXXXXX_card.pdf
```
All files are shared with **anyone with the link**.
