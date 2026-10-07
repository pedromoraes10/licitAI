// Base de dados e catálogo de editais de alta relevância com dados estruturados
// Baseados no padrão oficial do PNCP (Portal Nacional de Contratações Públicas - Lei 14.133/2021)

export const FEATURED_TENDERS = [
  {
    id: "PNCP-2026-004128",
    numeroControlePNCP: "00394460000141-1-000412/2026",
    numeroCompra: "PE 048/2026",
    processo: "23067.018241/2026-91",
    modalidadeNome: "Pregão Eletrônico",
    modalidadeId: 6,
    amparoLegal: "Lei 14.133/2021, Art. 28, I",
    orgaoEntidade: {
      razaoSocial: "MINISTÉRIO DA SAÚDE - DEPARTAMENTO DE LOGÍSTICA EM SAÚDE",
      cnpj: "00.394.460/0001-41",
      esferaId: "Federal",
      poderId: "Executivo"
    },
    unidadeOrgao: {
      ufSigla: "DF",
      municipioNome: "Brasília",
      nomeUnidade: "Coordenação-Geral de Licitações de Insumos"
    },
    objetoCompra: "Contratação de serviços de Computação em Nuvem (Cloud Computing) multicloud com suporte operacional 24x7, migração de cargas de trabalho críticas do DATASUS e inteligência de observabilidade de dados.",
    categoria: "Tecnologia & TI",
    valorTotalEstimado: 4850000.00,
    dataPublicacaoPncp: "2026-10-06T09:00:00",
    dataAberturaProposta: "2026-10-07T08:00:00",
    dataEncerramentoProposta: "2026-10-18T10:00:00",
    linkSistemaOrigem: "https://comprasnet.gov.br",
    exclusivoMeEpp: false,
    temCotaReservada: true,
    scoreAderencia: 96,
    chanceVitoria: "Alta",
    diasRestantes: 11,
    status: "Aberto",
    
    // Análise Cognitiva de IA
    analiseIA: {
      resumoExecutivo: "Contratação estratégica de nuvem soberana e governança de dados para sistemas de saúde pública. Margem média de lucro estimada em 28%. O órgão possui excelente pontualidade de pagamento (média de 18 dias úteis via SIAFI).",
      complexidade: "Média-Alta",
      margemRecomendadaMin: 22,
      margemRecomendadaMax: 35,
      lanceSugerido: 4120000.00,
      
      habilitacao: {
        juridica: [
          { item: "Contrato Social consolidado", status: "ok", detalhe: "Objeto social compatível com serviços de TI e nuvem" },
          { item: "Procuração e documentos dos sócios", status: "ok", detalhe: "Assinatura digital e-CNPJ/e-CPF válida" }
        ],
        fiscal: [
          { item: "CND Federal e Previdenciária conjunta", status: "ok", detalhe: "Receita Federal / PGFN" },
          { item: "Certificado de Regularidade do FGTS (CRF)", status: "ok", detalhe: "Caixa Econômica Federal" },
          { item: "CND Trabalhista (CNDT)", status: "ok", detalhe: "Tribunal Superior do Trabalho" },
          { item: "CND Estadual e Municipal do domicílio", status: "ok", detalhe: "Tributos mobiliários e ISSQN" }
        ],
        tecnica: [
          { item: "Atestado de Capacidade Técnica de Cloud", status: "alerta", detalhe: "Exige comprovação de migração mínima de 30 VMs ou 50TB de dados em ambiente corporativo/público" },
          { item: "Certificação da equipe técnica", status: "alerta", detalhe: "Pelo menos 2 arquitetos de nuvem certificados (AWS, Azure ou Google Cloud)" }
        ],
        economica: [
          { item: "Balanço Patrimonial do último exercício", status: "ok", detalhe: "Registrado na Junta Comercial ou SPED Contábil" },
          { item: "Índices de Liquidez (ILG, ILC, ISG) > 1,0", status: "ok", detalhe: "Conforme exigência do art. 69 da Lei 14.133/2021" },
          { item: "Capital Social mínimo ou Patrimônio Líquido de 10%", status: "alerta", detalhe: "Exigido R$ 485.000,00 de PL comprovado" }
        ]
      },

      pegadinhasERiscos: [
        {
          nivel: "alto",
          titulo: "SLA com Multa Agressiva de 2% ao dia",
          descricao: "A Cláusula 14.3 estipula multa diária de 2% sobre o valor da fatura mensal caso a disponibilidade da nuvem caia abaixo de 99,8% por mais de 45 minutos corridos.",
          recomendacao: "Adotar arquitetura redundante multi-região e provisionar redundância ativa para blindar seu SLA."
        },
        {
          nivel: "medio",
          titulo: "Prazo de Início de 5 Dias Úteis",
          descricao: "O edital exige reunião de alinhamento e apresentação do plano de migração em 5 dias úteis após assinatura do termo de contrato.",
          recomendacao: "Deixar o template do plano de sustentação previamente formatado antes da sessão pública."
        },
        {
          nivel: "oportunidade",
          titulo: "Cota Reservada de 25% para ME/EPP no Item 03",
          descricao: "O Item 03 (Monitoramento e Observabilidade) é exclusivo para Microempresas e EPPs, totalizando R$ 750.000,00.",
          recomendacao: "Se você for ME/EPP, a concorrência será drasticamente menor; se for grande empresa, pode subcontratar."
        }
      ],

      perguntasFrequentes: [
        {
          q: "Esse edital exige garantia de proposta antes da disputa?",
          a: "Não. O edital não exige garantia da proposta (art. 58 da Lei 14.133), apenas garantia de execução contratual de 5% a ser apresentada em até 10 dias úteis após a homologação da vencedora."
        },
        {
          q: "Empresas em consórcio podem participar?",
          a: "Sim, o item 4.2 autoriza consórcio de até 3 empresas, com acréscimo de 10% no índice de qualificação econômico-financeira para consórcios."
        },
        {
          q: "Qual o prazo de pagamento do Ministério da Saúde?",
          a: "Conforme o Item 16.1, o pagamento será realizado em até 30 dias corridos após o ateste da nota fiscal pelo gestor do contrato, com liquidação via SIAFI."
        }
      ],

      potencialImpugnacao: {
        cabivel: true,
        motivo: "Exigência de prazo de 48h para comprovação de parceria com o fabricante de nuvem antes do julgamento da proposta viola o art. 67, §1º da Lei 14.133/2021 por restringir competitividade.",
        artigoViolado: "Art. 9º, I c/c Art. 67 da Lei nº 14.133/2021",
        fundamentacaoResumida: "O TCU possui jurisprudência pacífica (Acórdão 1.284/2020 - Plenário) de que cartas de solidariedade ou certificados de parceria prévios à homologação configuram restrição indevida ao caráter competitivo."
      }
    }
  },

  {
    id: "PNCP-2026-003889",
    numeroControlePNCP: "46395000000139-1-000215/2026",
    numeroCompra: "PE 019/2026",
    processo: "049/2026-FME",
    modalidadeNome: "Pregão Eletrônico",
    modalidadeId: 6,
    amparoLegal: "Lei 14.133/2021, Art. 28, I",
    orgaoEntidade: {
      razaoSocial: "PREFEITURA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS - SECRETARIA DE EDUCAÇÃO",
      cnpj: "46.395.000/0001-39",
      esferaId: "Municipal",
      poderId: "Executivo"
    },
    unidadeOrgao: {
      ufSigla: "SP",
      municipioNome: "São José dos Campos",
      nomeUnidade: "Departamento de Suprimentos Escolares"
    },
    objetoCompra: "Registro de Preços para fornecimento parcelado de gêneros alimentícios perecíveis e não perecíveis (carnes bovinas e de aves inspecionadas, laticínios e hortifrúti) destinados ao Programa Nacional de Alimentação Escolar (PNAE).",
    categoria: "Alimentos & Merenda",
    valorTotalEstimado: 2750000.00,
    dataPublicacaoPncp: "2026-10-05T14:30:00",
    dataAberturaProposta: "2026-10-06T08:00:00",
    dataEncerramentoProposta: "2026-10-19T09:30:00",
    linkSistemaOrigem: "https://bec.sp.gov.br",
    exclusivoMeEpp: true,
    temCotaReservada: true,
    scoreAderencia: 98,
    chanceVitoria: "Muito Alta",
    diasRestantes: 12,
    status: "Aberto",

    analiseIA: {
      resumoExecutivo: "Licitação 100% exclusiva para ME/EPP e Cooperativas da região. Excelente margem de lucro (35% a 42%) devido à logística fracionada. Pagamento pontual realizado pelo Fundo Municipal de Educação.",
      complexidade: "Média",
      margemRecomendadaMin: 28,
      margemRecomendadaMax: 44,
      lanceSugerido: 2310000.00,
      
      habilitacao: {
        juridica: [
          { item: "Contrato Social ou CCMEI", status: "ok", detalhe: "Comércio atacadista ou varejista de alimentos" },
          { item: "Enquadramento ME/EPP", status: "ok", detalhe: "Declaração emitida pela Junta Comercial ou Simples Nacional" }
        ],
        fiscal: [
          { item: "CND Federal, Estadual e Municipal", status: "ok", detalhe: "Prazo de validade em dia" },
          { item: "FGTS e CND Trabalhista", status: "ok", detalhe: "Emissão recente" }
        ],
        tecnica: [
          { item: "Alvará Sanitário da Vigilância Sanitária (VISA)", status: "alerta", detalhe: "Documento obrigatório do depósito e dos veículos de transporte refrigerado" },
          { item: "Registro no SISP ou SIF para carnes", status: "ok", detalhe: "Certificado do frigorífico fornecedor" }
        ],
        economica: [
          { item: "Balanço Patrimonial dispensado para ME/EPP", status: "ok", detalhe: "Benefício da Lei Complementar 123/2006 aplicável" }
        ]
      },

      pegadinhasERiscos: [
        {
          nivel: "medio",
          titulo: "Entrega Fracionada Semanal em 68 Escolas",
          descricao: "A logística exige entregas toda terça e quinta-feira pela manhã em rotas descentralizadas.",
          recomendacao: "Precifique o custo real de frete por rota ou feche parceria local com transportador de van refrigerada."
        },
        {
          nivel: "oportunidade",
          titulo: "Exclusividade Total para ME/EPP",
          descricao: "Nenhuma grande distribuidora multinacional pode participar dos lotes 01 a 08.",
          recomendacao: "Oportunidade de ouro para faturar contrato anual garantido com margem saudável."
        }
      ],

      perguntasFrequentes: [
        {
          q: "Exige envio de amostras dos produtos?",
          a: "Sim, apenas para o licitante provisoriamente em 1º lugar, que terá 3 dias úteis para entregar amostras de 1kg na sede da Secretaria de Educação para análise nutricional."
        },
        {
          q: "Qual o prazo para substituição de produtos reprovados?",
          a: "O fornecedor tem até 24 horas para substituir qualquer lote que não esteja em conformidade com o padrão organoléptico."
        }
      ],

      potencialImpugnacao: {
        cabivel: false,
        motivo: "Edital muito bem redigido e equilibrado, em estrita conformidade com a Lei 14.133/2021 e normas do PNAE/FNDE."
      }
    }
  },

  {
    id: "PNCP-2026-002910",
    numeroControlePNCP: "01345678000199-1-000874/2026",
    numeroCompra: "PE 102/2026",
    processo: "ADM-9941/2026",
    modalidadeNome: "Pregão Eletrônico",
    modalidadeId: 6,
    amparoLegal: "Lei 14.133/2021, Art. 28, I",
    orgaoEntidade: {
      razaoSocial: "TRIBUNAL REGIONAL FEDERAL DA 3ª REGIÃO (SP / MS)",
      cnpj: "01.345.678/0001-99",
      esferaId: "Federal",
      poderId: "Judiciário"
    },
    unidadeOrgao: {
      ufSigla: "SP",
      municipioNome: "São Paulo",
      nomeUnidade: "Diretoria de Administração e Infraestrutura"
    },
    objetoCompra: "Prestação continuada de serviços de Engenharia e Manutenção Predial preventiva e corretiva com fornecimento total de peças e insumos, com operação de subestações de energia, climatização central VRF, automação predial e combate a incêndio nos edifícios-sede.",
    categoria: "Engenharia & Manutenção",
    valorTotalEstimado: 8940000.00,
    dataPublicacaoPncp: "2026-10-04T11:15:00",
    dataAberturaProposta: "2026-10-05T09:00:00",
    dataEncerramentoProposta: "2026-10-22T14:00:00",
    linkSistemaOrigem: "https://comprasnet.gov.br",
    exclusivoMeEpp: false,
    temCotaReservada: false,
    scoreAderencia: 91,
    chanceVitoria: "Média-Alta",
    diasRestantes: 15,
    status: "Aberto",

    analiseIA: {
      resumoExecutivo: "Contrato de altíssimo valor e recorrência garantida por 5 anos (prorrogável até 10 anos conforme Lei 14.133). Órgão do Judiciário Federal conhecido por pagar rigidamente em até 10 dias após o fechamento da medição.",
      complexidade: "Alta",
      margemRecomendadaMin: 18,
      margemRecomendadaMax: 26,
      lanceSugerido: 7850000.00,

      habilitacao: {
        juridica: [
          { item: "Registro ou Inscrição no CREA/CAU da empresa", status: "ok", detalhe: "Certidão de Registro de Pessoa Jurídica ativa" }
        ],
        fiscal: [
          { item: "Regularidade Fiscal Plena", status: "ok", detalhe: "SICAF nível 1 a 6 completo" }
        ],
        tecnica: [
          { item: "Atestado de Capacidade com CAT/CREA", status: "alerta", detalhe: "Comprovação de manutenção em área construída não inferior a 35.000 m²" },
          { item: "Responsável Técnico Eng. Mecânico e Eletricista", status: "ok", detalhe: "Anotação de Responsabilidade Técnica (ART)" }
        ],
        economica: [
          { item: "Capital Social Mínimo de R$ 894.000,00", status: "ok", detalhe: "10% do valor anual estimado" },
          { item: "Garantia da Proposta de 1%", status: "alerta", detalhe: "Valor de R$ 89.400,00 em seguro-garantia ou caução em dinheiro exigido 48h antes da sessão" }
        ]
      },

      pegadinhasERiscos: [
        {
          nivel: "alto",
          titulo: "Garantia de Proposta Obrigatória Prévia",
          descricao: "Atenção: Para poder disputar o lance, é obrigatório anexar a apólice de seguro-garantia no sistema até às 18h da véspera da disputa.",
          recomendacao: "Emitir seguro-garantia imediatamente junto a corretora homologada (custo aproximado de R$ 800 a R$ 1.200)."
        },
        {
          nivel: "medio",
          titulo: "Retenção de Conta Vinculada para Encargos Trabalhistas",
          descricao: "O TRF3 adota o modelo de conta depósito vinculada bloqueada para movimentação para férias e 13º dos terceirizados.",
          recomendacao: "Considerar o fluxo de caixa inicial, pois a retenção protege a empresa contra passivos trabalhistas futuros."
        }
      ],

      perguntasFrequentes: [
        {
          q: "Há visita técnica obrigatória?",
          a: "A visita é facultativa. Caso não realize vistoria presencial, a licitante deve assinar a 'Declaração de Conhecimento Pleno das Instalações e Condições Locais'."
        },
        {
          q: "Qual o prazo de duração do contrato?",
          a: "Vigência inicial de 12 meses, podendo ser prorrogada sucessivamente até o limite de 10 anos, com reajuste anual por índice oficial (IPCA ou INCC)."
        }
      ],

      potencialImpugnacao: {
        cabivel: false,
        motivo: "Edital aprovado pela Consultoria Jurídica da União, em conformidade com as Instruções Normativas da SEGES/MGI."
      }
    }
  },

  {
    id: "PNCP-2026-001740",
    numeroControlePNCP: "76543210000188-1-000512/2026",
    numeroCompra: "Dispensa 022/2026",
    processo: "DISP-341/2026",
    modalidadeNome: "Dispensa Eletrônica",
    modalidadeId: 8,
    amparoLegal: "Lei 14.133/2021, Art. 75, II",
    orgaoEntidade: {
      razaoSocial: "EMPRESA BRASILEIRA DE CORREIOS E TELÉGRAFOS - DR/PR",
      cnpj: "34.028.316/0001-03",
      esferaId: "Federal",
      poderId: "Estatal"
    },
    unidadeOrgao: {
      ufSigla: "PR",
      municipioNome: "Curitiba",
      nomeUnidade: "Gerência de Operações e Frota"
    },
    objetoCompra: "Aquisição imediata com entrega única de 120 kits de ferramentas operacionais, baterias de lítio de alta densidade e leitores ópticos de código de barras resistentes a quedas para triagem logística.",
    categoria: "Equipamentos & Suprimentos",
    valorTotalEstimado: 87500.00,
    dataPublicacaoPncp: "2026-10-06T16:00:00",
    dataAberturaProposta: "2026-10-07T08:00:00",
    dataEncerramentoProposta: "2026-10-10T14:00:00",
    linkSistemaOrigem: "https://comprasnet.gov.br",
    exclusivoMeEpp: true,
    temCotaReservada: false,
    scoreAderencia: 99,
    chanceVitoria: "Máxima (Dispensa Rápida)",
    diasRestantes: 3,
    status: "Aberto",

    analiseIA: {
      resumoExecutivo: "Dispensa eletrônica rápida de baixo valor (art. 75, II da Lei 14.133/2021). Sem burocracia complexa, fechamento em 72h e entrega única. Ideal para capital de giro rápido e margem líquida de 30% a 45%.",
      complexidade: "Baixa",
      margemRecomendadaMin: 32,
      margemRecomendadaMax: 48,
      lanceSugerido: 69800.00,

      habilitacao: {
        juridica: [
          { item: "Contrato Social ou MEI", status: "ok", detalhe: "Apenas CNPJ e identificação do titular" }
        ],
        fiscal: [
          { item: "Certidão de Regularidade Fiscal Básica", status: "ok", detalhe: "CND Federal e FGTS" }
        ],
        tecnica: [
          { item: "Atestado técnico dispensado", status: "ok", detalhe: "Não exige atestado prévio" }
        ],
        economica: [
          { item: "Balanço Patrimonial dispensado", status: "ok", detalhe: "Dispensado por lei em contratações diretas" }
        ]
      },

      pegadinhasERiscos: [
        {
          nivel: "oportunidade",
          titulo: "Prazo de disputa de apenas 6 horas úteis",
          descricao: "A fase de lances é rápida e com poucos concorrentes cadastrados.",
          recomendacao: "Configurar robô de lance do LicitAI ou dar lance decisivo nos minutos finais."
        }
      ],

      perguntasFrequentes: [
        {
          q: "Qual o prazo de entrega dos kits?",
          a: "Até 10 dias úteis no Centro de Tratamento dos Correios em Curitiba."
        }
      ],

      potencialImpugnacao: {
        cabivel: false,
        motivo: "Procedimento simplificado sem exigências excessivas."
      }
    }
  }
];

export const CATEGORIAS_LICITACOES = [
  "Todas as Categorias",
  "Tecnologia & TI",
  "Alimentos & Merenda",
  "Engenharia & Obras",
  "Saúde & Medicamentos",
  "Equipamentos & Suprimentos",
  "Serviços & Limpeza",
  "Locação de Veículos"
];

export const UFS_BRASIL = [
  "Todos os Estados", "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", 
  "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", 
  "RR", "RS", "SC", "SE", "SP", "TO"
];

export const MODALIDADES_PNCP = [
  "Todas as Modalidades",
  "Pregão Eletrônico",
  "Dispensa Eletrônica",
  "Concorrência Eletrônica",
  "Inexigibilidade"
];
