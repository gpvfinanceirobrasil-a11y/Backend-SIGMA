function uploadRows(sheetName, rows) {
  if (!Array.isArray(rows)) throw new Error('rows deve ser um array.');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, sheetName);

  if (rows.length === 0) return { ok: true, sheet: sheetName, inserted: 0 };

  const headers = Object.keys(rows[0]);

  sheet.clearContents();
  sheet.appendRow(headers);

  const values = rows.map(row => headers.map(h => row[h] ?? ''));
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);

  logAction('uploadRows', `${rows.length} linhas inseridas em ${sheetName}.`);
  return { ok: true, sheet: sheetName, inserted: rows.length };
}

function readSheetAsObjects(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(h => normalizeHeader(h));

  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function classificarSociedade(projeto) {
  const p = normalize(projeto);

  if (p.startsWith('bj.')) return 'BJ';
  if (p.startsWith('br.')) return 'BR';

  const filiaisBJ = ['anb', 'nigro', 'petrolina', 'sanharo', 'sao bento'];
  const filiaisBR = ['br adm', 'br. adm'];

  if (filiaisBJ.some(f => p.includes(f))) return 'BJ';
  if (filiaisBR.some(f => p.includes(f))) return 'BR';

  return 'GPV';
}

function parseMoney(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  let v = String(value).replace('R$', '').replace(/\s/g, '').trim();

  if (v.includes(',') && v.includes('.')) {
    v = v.replace(/\./g, '').replace(',', '.');
  } else if (v.includes(',')) {
    v = v.replace(',', '.');
  }

  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeHeader(value) {
  return normalize(value).replace(/\./g, '').replace(/\s+/g, '_');
}

function createSheetIfNotExists(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(err) {
  return {
    ok: false,
    message: err.message || String(err),
    stack: err.stack || null
  };
}
