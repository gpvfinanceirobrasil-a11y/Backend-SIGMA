function processarSigma() {
  const receitas = readSheetAsObjects(CONFIG.SHEETS.RECEITAS);
  const despesas = readSheetAsObjects(CONFIG.SHEETS.DESPESAS);

  const result = {
    receita: { GPV: 0, BJ: 0, BR: 0 },
    despesa: { GPV: 0, BJ: 0, BR: 0 },
    resultado: { GPV: 0, BJ: 0, BR: 0 },
    total: { receita: 0, despesa: 0, resultado: 0 }
  };

  receitas.forEach(row => {
    const sociedade = row.sociedade || classificarSociedade(row.projeto);
    const valor = parseMoney(row.valor_liquido || row.valor_pagamento || 0);
    if (result.receita[sociedade] !== undefined) result.receita[sociedade] += valor;
  });

  despesas.forEach(row => {
    const sociedade = row.sociedade || classificarSociedade(row.projeto);
    const valor = Math.abs(parseMoney(row.valor || 0));
    if (result.despesa[sociedade] !== undefined) result.despesa[sociedade] += valor;
  });

  ['GPV', 'BJ', 'BR'].forEach(soc => {
    result.resultado[soc] = result.receita[soc] - result.despesa[soc];
    result.total.receita += result.receita[soc];
    result.total.despesa += result.despesa[soc];
    result.total.resultado += result.resultado[soc];
  });

  salvarMGR(result);
  logAction('processarSigma', 'Processamento SIGMA executado.');

  return { ok: true, message: 'SIGMA processado com sucesso.', data: result };
}

function salvarMGR(result) {
  const ss = getSigmaSpreadsheet();
  const sheet = getOrCreateSheet(ss, CONFIG.SHEETS.MGR);

  sheet.clearContents();

  const rows = [
    ['linha', 'gpv', 'bj', 'br', 'consolidado'],
    ['Receita Líquida', result.receita.GPV, result.receita.BJ, result.receita.BR, result.total.receita],
    ['(-) Despesas', result.despesa.GPV, result.despesa.BJ, result.despesa.BR, result.total.despesa],
    ['Resultado', result.resultado.GPV, result.resultado.BJ, result.resultado.BR, result.total.resultado]
  ];

  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
}

function getMGR() {
  return { ok: true, data: readSheetAsObjects(CONFIG.SHEETS.MGR) };
}

function getMGRValue(rows, linha) {
  const found = rows.find(r => r.linha === linha);
  if (!found) return { gpv: 0, bj: 0, br: 0, consolidado: 0 };

  return {
    gpv: Number(found.gpv || 0),
    bj: Number(found.bj || 0),
    br: Number(found.br || 0),
    consolidado: Number(found.consolidado || 0)
  };
}
