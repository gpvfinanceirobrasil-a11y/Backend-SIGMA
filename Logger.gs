function logAction(action, message) {
  const ss = getSigmaSpreadsheet();
  const sheet = getOrCreateSheet(ss, CONFIG.SHEETS.LOGS);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['data_hora', 'acao', 'mensagem']);
  }

  sheet.appendRow([new Date(), action, message]);
}
