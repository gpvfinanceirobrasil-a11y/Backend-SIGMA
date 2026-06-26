const CONFIG = {
  SHEETS: {
    RECEITAS: 'receitas',
    DESPESAS: 'despesas',
    RATEIOS: 'rateios',
    BASE: 'base',
    INADIMPLENCIA: 'inadimplencia',

    SOCIEDADES: 'sociedades',
    PROJETOS: 'projetos',
    PARAMETROS: 'parametros',
    INDICADORES: 'indicadores',

    RESULTADO_ATUAL: 'resultado_atual',
    HISTORICO: 'historico',

    IMPORTACOES: 'importacoes',
    EXECUCOES: 'execucoes',
    LOGS: 'logs',
    ERROS: 'erros',
    DICIONARIO_DADOS: 'dicionario_dados'
  }
};

const DATABASE = {
  receitas: [
    'id_receita',
    'id_importacao',
    'competencia',
    'data_pagamento',
    'mes_referente',
    'projeto',
    'sociedade',
    'base',
    'regional',
    'consultor',
    'placa',
    'tipo_veiculo',
    'categoria',
    'cidade',
    'estado',
    'valor_pagamento',
    'tarifa_bancaria',
    'valor_liquido',
    'forma_pagamento',
    'observacao'
  ],

  despesas: [
    'id_despesa',
    'id_importacao',
    'competencia',
    'data',
    'projeto',
    'sociedade',
    'base',
    'regional',
    'departamento',
    'grupo',
    'categoria',
    'subcategoria',
    'descricao',
    'fornecedor',
    'valor',
    'atuarial',
    'pilar_sigma',
    'observacao'
  ],

  rateios: [
    'id_rateio',
    'id_importacao',
    'competencia',
    'sociedade_origem',
    'sociedade_destino',
    'tipo_rateio',
    'base_rateio',
    'app_visto',
    'gestora',
    'assistencia',
    'monitoramento',
    'total_administrativo',
    'total_operacional',
    'total_geral',
    'observacao'
  ],

  base: [
    'id_item',
    'id_importacao',
    'competencia',
    'sociedade',
    'base',
    'regional',
    'consultor',
    'placa',
    'renavam',
    'tipo_veiculo',
    'categoria',
    'estado',
    'cidade',
    'situacao',
    'valor_mensalidade',
    'valor_fipe',
    'data_adesao',
    'data_cancelamento',
    'origem',
    'observacao'
  ],

  inadimplencia: [
    'id_inadimplencia',
    'id_importacao',
    'competencia',
    'sociedade',
    'base',
    'regional',
    'consultor',
    'placa',
    'tipo_boleto',
    'situacao_boleto',
    'valor',
    'vencimento',
    'dias_atraso',
    'estado',
    'categoria',
    'observacao'
  ],

  sociedades: [
    'sociedade',
    'descricao',
    'socio_1',
    'socio_2',
    'socio_3',
    'socio_4',
    'status'
  ],

  projetos: [
    'projeto',
    'sociedade',
    'base',
    'regional',
    'estado',
    'cidade',
    'tipo',
    'regra_classificacao',
    'status'
  ],

  parametros: [
    'chave',
    'valor',
    'descricao',
    'modulo',
    'ativo'
  ],

  indicadores: [
    'codigo',
    'modulo',
    'indicador',
    'descricao',
    'formula',
    'base_percentual',
    'tipo',
    'ativo'
  ],

  resultado_atual: [
    'id_processamento',
    'competencia',
    'modulo',
    'indicador',
    'sociedade',
    'base',
    'regional',
    'categoria',
    'estado',
    'valor',
    'quantidade',
    'percentual',
    'versao',
    'data_processamento'
  ],

  historico: [
    'id_processamento',
    'competencia',
    'versao',
    'modulo',
    'indicador',
    'sociedade',
    'base',
    'regional',
    'categoria',
    'estado',
    'valor',
    'quantidade',
    'percentual',
    'data_processamento',
    'status'
  ],

  importacoes: [
    'id_importacao',
    'id_processamento',
    'competencia',
    'tipo_arquivo',
    'nome_arquivo',
    'quantidade_linhas',
    'data_importacao',
    'usuario',
    'status',
    'observacao'
  ],

  execucoes: [
    'id_processamento',
    'competencia',
    'versao',
    'data_inicio',
    'data_fim',
    'usuario',
    'status',
    'observacao'
  ],

  logs: [
    'data_hora',
    'id_processamento',
    'acao',
    'mensagem'
  ],

  erros: [
    'data_hora',
    'id_processamento',
    'acao',
    'mensagem',
    'detalhe'
  ],

  dicionario_dados: [
    'aba',
    'campo',
    'descricao',
    'tipo_sugerido',
    'obrigatorio',
    'observacao'
  ]
};
