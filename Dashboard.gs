function getDashboard() {
  const mgr = getMGR();
  const rows = mgr.data || [];

  return {
    ok: true,
    data: {
      receita: getMGRValue(rows, 'Receita Líquida'),
      despesa: getMGRValue(rows, '(-) Despesas'),
      resultado: getMGRValue(rows, 'Resultado'),
      status: 'online',
      updatedAt: new Date()
    }
  };
}
