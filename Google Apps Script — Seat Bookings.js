// ============================================================
//  PASSPORT & VIBES TRAVEL — Bus Seat Booking Script
//  Google Apps Script (paste this into script.google.com)
// ============================================================
//
//  SETUP INSTRUCTIONS (do this once):
//  1. Go to Google Sheets → create a new sheet
//  2. Name the first sheet tab exactly: Seat Bookings
//  3. Add these headers in Row 1:
//     A1: Trip ID   B1: Seat #   C1: Name   D1: Email   E1: Timestamp
//  4. Click Extensions → Apps Script
//  5. Delete any existing code and paste this entire file
//  6. Save (Ctrl+S), then click Deploy → New Deployment
//  7. Choose type: Web App
//     Execute as: Me
//     Who has access: Anyone
//  8. Click Deploy → copy the Web App URL
//  9. Paste that URL into your index.html CONFIG block:
//     googleScriptUrl: "https://script.google.com/macros/s/YOUR_ID/exec"
//
// ============================================================

const SHEET_NAME = 'Seat Bookings';

// GET — returns taken seat numbers for a given trip
function doGet(e) {
  const tripId = e.parameter.trip || '';
  const sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data   = sheet.getDataRange().getValues();

  // Skip header row (row 0), find matching tripId, collect seat numbers
  const takenSeats = data
    .slice(1)
    .filter(row => row[0] === tripId)
    .map(row => parseInt(row[1]))
    .filter(n => !isNaN(n));

  return ContentService
    .createTextOutput(JSON.stringify({ takenSeats }))
    .setMimeType(ContentService.MimeType.JSON);
}

// POST — records a new seat booking (receives URLSearchParams from browser)
function doPost(e) {
  try {
    const sheet     = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const tripId    = e.parameter.tripId    || '';
    const seatNum   = e.parameter.seatNum   || '';
    const name      = e.parameter.name      || '';
    const email     = e.parameter.email     || '';
    const timestamp = e.parameter.timestamp || new Date().toISOString();

    sheet.appendRow([tripId, seatNum, name, email, timestamp]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
