function handleGet(e) {
  try {
    const action = (e.parameter.action || 'status');

    if (action === 'status') return jsonResponse(status());
    if (action === 'setup') return jsonResponse(setup());
    if (action === 'getDashboard') return jsonResponse(getDashboard());
    if (action === 'getMGR') return jsonResponse(getMGR());

    return jsonResponse({
      ok: false,
      message: 'Ação GET não encontrada',
      action
    });

  } catch (err) {
    return jsonResponse(errorResponse(err));
  }
}

function handlePost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const action = body.action;

    if (action === 'setup') return jsonResponse(setup());
    if (action === 'uploadReceitas') return jsonResponse(uploadRows(CONFIG.SHEETS.RECEITAS, body.rows || []));
    if (action === 'uploadDespesas') return jsonResponse(uploadRows(CONFIG.SHEETS.DESPESAS, body.rows || []));
    if (action === 'uploadRateios') return jsonResponse(uploadRows(CONFIG.SHEETS.RATEIOS, body.rows || []));
    if (action === 'processarSigma') return jsonResponse(processarSigma());

    return jsonResponse({
      ok: false,
      message: 'Ação POST não encontrada',
      action
    });

  } catch (err) {
    return jsonResponse(errorResponse(err));
  }
}
