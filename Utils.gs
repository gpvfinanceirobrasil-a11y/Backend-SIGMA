function uploadRows(sheetName, rows) {
  if (!Array.isArray(rows)) throw new Error('rows deve ser um array.');

  const ss = getSigmaSpreadsheet();
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
  const ss = getSigmaSpreadsheet();
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

// =====================================================
// SIGMA CORE
// =====================================================
function gerarIdProcessamento() {
  const agora = new Date();
  const data = Utilities.formatDate(agora, Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
  return `PROC-${data}`;
}

function gerarVersaoProcessamento(competencia) {
  const rows = readSheetAsObjects(CONFIG.SHEETS.EXECUCOES);
  const filtradas = rows.filter(r => r.competencia === competencia);
  return `V${filtradas.length + 1}`;
}

function registrarExecucao(idProcessamento, competencia, versao, dataInicio, status, observacao) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, CONFIG.SHEETS.EXECUCOES);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(DATABASE.execucoes);
  }

  sheet.appendRow([
    idProcessamento,
    competencia,
    versao,
    dataInicio,
    '',
    '',
    status,
    observacao
  ]);
}

function finalizarExecucao(idProcessamento, dataFim, status, observacao) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, CONFIG.SHEETS.EXECUCOES);
  const values = sheet.getDataRange().getValues();

  for (let i = values.length - 1; i >= 1; i--) {
    if (values[i][0] === idProcessamento) {
      sheet.getRange(i + 1, 5).setValue(dataFim);
      sheet.getRange(i + 1, 7).setValue(status);
      sheet.getRange(i + 1, 8).setValue(observacao);
      return;
    }
  }
}

function registrarErro(idProcessamento, acao, mensagem, detalhe) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, CONFIG.SHEETS.ERROS);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(DATABASE.erros);
  }

  sheet.appendRow([
    new Date(),
    idProcessamento,
    acao,
    mensagem,
    detalhe || ''
  ]);
}

function percentual(valor, base) {
  const v = Number(valor || 0);
  const b = Number(base || 0);

  if (!b) return 0;

  return v / b;
}

function normalizar(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
function getSigmaSpreadsheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}
