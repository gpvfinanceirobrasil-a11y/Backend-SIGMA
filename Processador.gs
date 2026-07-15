function processarSigma(competencia) {
  const inicio = new Date();
  const idProcessamento = gerarIdProcessamento();
  const versao = gerarVersaoProcessamento(competencia);

  try {
    registrarExecucao(idProcessamento, competencia, versao, inicio, 'em_processamento', 'Processamento iniciado.');

    const receitas = readSheetAsObjects(CONFIG.SHEETS.RECEITAS);
    const despesas = readSheetAsObjects(CONFIG.SHEETS.DESPESAS);
    const base = readSheetAsObjects(CONFIG.SHEETS.BASE);
    const inadimplencia = readSheetAsObjects(CONFIG.SHEETS.INADIMPLENCIA);

    const resultados = [];

    resultados.push(...calcularDashboardSigma(idProcessamento, competencia, versao, receitas, despesas));
    resultados.push(...calcularPerformanceSigma(idProcessamento, competencia, versao, base, inadimplencia));

    salvarResultadoAtual(resultados);
    salvarHistorico(resultados);

    finalizarExecucao(idProcessamento, new Date(), 'concluido', 'Processamento concluído com sucesso.');

    return {
      ok: true,
      message: 'SIGMA processado com sucesso.',
      data: resultados,
      meta: {
        id_processamento: idProcessamento,
        competencia,
        versao,
        tempo_ms: new Date() - inicio
      }
    };

  } catch (err) {
    registrarErro(idProcessamento, 'processarSigma', err.message, err.stack);
    finalizarExecucao(idProcessamento, new Date(), 'erro', err.message);

    return errorResponse(err);
  }
}

function calcularDashboardSigma(
  idProcessamento,
  competencia,
  versao,
  receitas,
  despesas
) {
  const data = new Date();
  const sociedades = ['GPV', 'BJ', 'BR'];

  const totais = {
    GPV: { receita: 0, despesa: 0 },
    BJ: { receita: 0, despesa: 0 },
    BR: { receita: 0, despesa: 0 }
  };

  receitas.forEach(row => {
    const sociedade = normalizarSociedadeSigma(
      row.sociedade || classificarSociedade(row.projeto)
    );

    if (!totais[sociedade]) return;

    totais[sociedade].receita += parseMoney(
      row.valor_liquido || row.valor_pagamento || 0
    );
  });

  despesas.forEach(row => {
    const sociedade = normalizarSociedadeSigma(
      row.sociedade || classificarSociedade(row.projeto)
    );

    if (!totais[sociedade]) return;

    totais[sociedade].despesa += Math.abs(
      parseMoney(row.valor || 0)
    );
  });

  const resultados = [];

  sociedades.forEach(sociedade => {
    const receita = totais[sociedade].receita;
    const despesa = totais[sociedade].despesa;
    const resultado = receita - despesa;

    resultados.push(
      montarResultado(
        idProcessamento,
        competencia,
        versao,
        'Dashboard',
        'Receita Líquida',
        sociedade,
        receita,
        '',
        percentual(receita, receita),
        data
      ),
      montarResultado(
        idProcessamento,
        competencia,
        versao,
        'Dashboard',
        'Despesas',
        sociedade,
        despesa,
        '',
        percentual(despesa, receita),
        data
      ),
      montarResultado(
        idProcessamento,
        competencia,
        versao,
        'Dashboard',
        'Resultado',
        sociedade,
        resultado,
        '',
        percentual(resultado, receita),
        data
      )
    );
  });

  const receitaConsolidada = sociedades.reduce(
    (total, sociedade) => total + totais[sociedade].receita,
    0
  );

  const despesaConsolidada = sociedades.reduce(
    (total, sociedade) => total + totais[sociedade].despesa,
    0
  );

  const resultadoConsolidado =
    receitaConsolidada - despesaConsolidada;

  resultados.push(
    montarResultado(
      idProcessamento,
      competencia,
      versao,
      'Dashboard',
      'Receita Líquida',
      'CONSOLIDADO',
      receitaConsolidada,
      '',
      percentual(receitaConsolidada, receitaConsolidada),
      data
    ),
    montarResultado(
      idProcessamento,
      competencia,
      versao,
      'Dashboard',
      'Despesas',
      'CONSOLIDADO',
      despesaConsolidada,
      '',
      percentual(despesaConsolidada, receitaConsolidada),
      data
    ),
    montarResultado(
      idProcessamento,
      competencia,
      versao,
      'Dashboard',
      'Resultado',
      'CONSOLIDADO',
      resultadoConsolidado,
      '',
      percentual(resultadoConsolidado, receitaConsolidada),
      data
    )
  );

  return resultados;
}

function normalizarSociedadeSigma(value) {
  const sociedade = String(value || '')
    .trim()
    .toUpperCase();

  if (sociedade === 'BJ') return 'BJ';
  if (sociedade === 'BR') return 'BR';
  if (sociedade === 'GPV') return 'GPV';

  return 'GPV';
}

function calcularPerformanceSigma(idProcessamento, competencia, versao, base, inadimplencia) {
  const data = new Date();

  const ativos = base.filter(row => normalizar(row.situacao) === 'ativo').length;

  const producao = base.filter(row => {
    const origem = normalizar(row.origem);
    return origem.includes('adesao') || origem.includes('producao');
  }).length;

  const inadimplentes = inadimplencia.length;

  const evasao = base.filter(row => {
    const situacao = normalizar(row.situacao);
    return situacao === 'negativado' || situacao === 'recuperacao';
  }).length;

  const cancelados = base.filter(row => {
    const situacao = normalizar(row.situacao);
    return situacao === 'cancelado' || situacao === 'pre-cancelado' || situacao === 'pre_cancelado';
  }).length;

  const reativacoes = base.filter(row => {
    const origem = normalizar(row.origem);
    return origem.includes('reativacao');
  }).length;

  const saldo = producao + reativacoes - evasao - cancelados;

  return [
    montarResultado(idProcessamento, competencia, versao, 'Performance', 'Ativos', 'CONSOLIDADO', '', ativos, 100, data),
    montarResultado(idProcessamento, competencia, versao, 'Performance', 'Produção', 'CONSOLIDADO', '', producao, percentual(producao, ativos), data),
    montarResultado(idProcessamento, competencia, versao, 'Performance', 'Inadimplência', 'CONSOLIDADO', '', inadimplentes, percentual(inadimplentes, ativos), data),
    montarResultado(idProcessamento, competencia, versao, 'Performance', 'Evasão', 'CONSOLIDADO', '', evasao, percentual(evasao, ativos), data),
    montarResultado(idProcessamento, competencia, versao, 'Performance', 'Cancelados', 'CONSOLIDADO', '', cancelados, percentual(cancelados, ativos), data),
    montarResultado(idProcessamento, competencia, versao, 'Performance', 'Reativações', 'CONSOLIDADO', '', reativacoes, percentual(reativacoes, ativos), data),
    montarResultado(idProcessamento, competencia, versao, 'Performance', 'Saldo da Performance', 'CONSOLIDADO', '', saldo, percentual(saldo, ativos), data)
  ];
}

function montarResultado(idProcessamento, competencia, versao, modulo, indicador, sociedade, valor, quantidade, percentual, data) {
  return {
    id_processamento: idProcessamento,
    competencia,
    modulo,
    indicador,
    sociedade,
    base: '',
    regional: '',
    categoria: '',
    estado: '',
    valor,
    quantidade,
    percentual,
    versao,
    data_processamento: data
  };
}
