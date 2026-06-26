function status() {
  return {
    ok: true,
    app: 'SIGMA Backend',
    version: CONFIG.VERSION,
    status: 'online',
    timestamp: new Date()
  };
}

function setup() {
  const ss = getSigmaSpreadsheet();

  createSheetIfNotExists(ss, CONFIG.SHEETS.RECEITAS, [
    'data_pagamento','mes_referente','projeto','placa','tipo_veiculo',
    'cidade','estado','valor_pagamento','tarifa_bancaria','valor_liquido',
    'forma_pagamento','sociedade'
  ]);

  createSheetIfNotExists(ss, CONFIG.SHEETS.DESPESAS, [
    'data','projeto','departamento','grupo','categoria','descricao',
    'valor','atuarial','sociedade','pilar_sigma'
  ]);

  createSheetIfNotExists(ss, CONFIG.SHEETS.RATEIOS, [
    'mes','sociedade','app_visto','gestora','assistencia','monitoramento',
    'total_administrativo','total_operacional','total_geral'
  ]);

  createSheetIfNotExists(ss, CONFIG.SHEETS.PARAMETROS, [
    'chave','valor','descricao'
  ]);

  createSheetIfNotExists(ss, CONFIG.SHEETS.MGR, [
    'linha','gpv','bj','br','consolidado'
  ]);

  createSheetIfNotExists(ss, CONFIG.SHEETS.LOGS, [
    'data_hora','acao','mensagem'
  ]);

  logAction('setup', 'Estrutura inicial verificada.');
  return { ok: true, message: 'Setup executado com sucesso.' };
}
