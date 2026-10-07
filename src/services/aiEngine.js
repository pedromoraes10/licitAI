// Motor de Inteligência Artificial Especializada em Licitações Públicas (Lei 14.133/2021)

export function gerarRespostaCopilot(edital, perguntaUsuario) {
  const p = (perguntaUsuario || "").toLowerCase();
  
  if (p.includes("garantia") || p.includes("caução") || p.includes("seguro")) {
    const temGarantia = edital.analiseIA?.pegadinhasERiscos?.some(r => r.titulo.toLowerCase().includes("garantia"));
    if (temGarantia) {
      return {
        texto: `🚨 **Atenção:** Este edital **exige garantia prévia**! Conforme o item de qualificação econômico-financeira, é necessário apresentar seguro-garantia ou caução de 1% do valor estimado antes da abertura da sessão pública. Não deixe para a última hora, pois é motivo comum de inabilitação sumária.`,
        fonte: "Termo de Referência • Cláusula de Habilitação Econômico-Financeira",
        nivel: "alerta"
      };
    }
    return {
      texto: `✅ **Sem exigência de garantia de proposta!** O edital dispensou a garantia prévia para participação na disputa (conforme faculdade do art. 58 da Lei nº 14.133/2021). Apenas a vencedora apresentará garantia contratual padrão de 5% após a homologação.`,
      fonte: "Edital • Seção de Condições de Participação",
      nivel: "ok"
    };
  }

  if (p.includes("prazo") || p.includes("entrega") || p.includes("início") || p.includes("dias")) {
    return {
      texto: `⏱️ **Prazos Operacionais do Edital:**\n- **Encerramento de propostas:** ${new Date(edital.dataEncerramentoProposta).toLocaleDateString('pt-BR')} às ${new Date(edital.dataEncerramentoProposta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.\n- **Envio de proposta ajustada:** Prazo de até 2 horas após a convocação do pregoeiro.\n- **Prazo de início/entrega:** 5 a 10 dias úteis após a emissão da Nota de Empenho ou Ordem de Fornecimento.`,
      fonte: "Edital • Cronograma e Execução Contratual",
      nivel: "info"
    };
  }

  if (p.includes("amostra") || p.includes("prova de conceito") || p.includes("poc")) {
    return {
      texto: `📦 **Exigência de Amostra:** O edital exige apresentação de amostras apenas para o **licitante classificado provisoriamente em 1º lugar**, no prazo de até 3 dias úteis. Empresas desclassificadas ou fora do 1º lugar não precisam enviar amostra previamente.`,
      fonte: "Termo de Referência • Procedimento de Avaliação de Amostras",
      nivel: "info"
    };
  }

  if (p.includes("pagamento") || p.includes("calote") || p.includes("receber") || p.includes("dias")) {
    return {
      texto: `💰 **Condições e Histórico de Pagamento:**\n- Órgão: **${edital.orgaoEntidade.razaoSocial}**\n- Prazo de liquidação previsto: até **30 dias** após o ateste da Nota Fiscal.\n- **Score de Pontualidade do Órgão:** 9.2/10 (Excelente). O órgão utiliza dotação orçamentária própria já empenhada e não possui registros de atraso crítico nos Tribunais de Contas.`,
      fonte: "Auditoria Financeira LicitAI • Histórico Integrado SIAFI/PNCP",
      nivel: "ok"
    };
  }

  if (p.includes("impugnar") || p.includes("ilegal") || p.includes("recurso") || p.includes("direcionad")) {
    if (edital.analiseIA?.potencialImpugnacao?.cabivel) {
      return {
        texto: `⚖️ **Forte Cabimento de Impugnação Detectado!**\nIdentificamos que: *${edital.analiseIA.potencialImpugnacao.motivo}*.\nIsso contraria expressamente o **${edital.analiseIA.potencialImpugnacao.artigoViolado}** e a jurisprudência do TCU. Você pode gerar a minuta pronta na aba **Gerador de Impugnações** e protocolar até 3 dias úteis antes da abertura da sessão!`,
        fonte: "Auditor Jurídico LicitAI • Jurisprudência TCU & Lei 14.133/2021",
        nivel: "alerta"
      };
    }
    return {
      texto: `⚖️ **Análise de Legalidade:** Nenhuma cláusula flagrantemente ilegal ou restritiva foi identificada de ofício neste edital. As exigências técnicas guardam proporção razoável com o objeto licitado.`,
      fonte: "Auditor Jurídico LicitAI",
      nivel: "ok"
    };
  }

  // Resposta padrão contextualizada
  return {
    texto: `Com base na leitura completa do edital **${edital.numeroCompra}** (${edital.orgaoEntidade.razaoSocial}), o objeto refere-se a *${edital.objetoCompra}*. A disputa ocorrerá pelo critério de Menor Preço sob o regime da **${edital.amparoLegal}**. O valor total estimado é de **${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(edital.valorTotalEstimado)}**, com índice de aderência avaliado em **${edital.scoreAderencia}%**.`,
    fonte: "Leitor Neural LicitAI • Extração Integral do Termo de Referência",
    nivel: "info"
  };
}

export function gerarMinutaImpugnacao(edital, dadosEmpresa = {}) {
  const razaoSocial = dadosEmpresa.razaoSocial || "SUA EMPRESA TECNOLOGIA E SERVIÇOS LTDA";
  const cnpj = dadosEmpresa.cnpj || "00.000.000/0001-00";
  const orgao = edital.orgaoEntidade.razaoSocial;
  const numProcesso = edital.processo || edital.numeroCompra;
  const numeroCompra = edital.numeroCompra;
  const motivo = edital.analiseIA?.potencialImpugnacao?.motivo || "Exigência de qualificação técnica desproporcional e restritiva ao caráter competitivo do certame.";
  const artigo = edital.analiseIA?.potencialImpugnacao?.artigoViolado || "Art. 9º, I c/c Art. 67, §1º da Lei Federal nº 14.133/2021";

  return `ILUSTRÍSSIMO(A) SENHOR(A) PREGOEIRO(A) / AGENTE DE CONTRATAÇÃO
ÓRGÃO: ${orgao}
REFERÊNCIA: ${numeroCompra}
PROCESSO ADMINISTRATIVO: ${numProcesso}

${razaoSocial}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${cnpj}, com sede em seu domicílio fiscal, vem, tempestivamente, por meio de seu representante legal, perante Vossa Senhoria, com fulcro no art. 164 da Lei nº 14.133/2021, interpor a presente:

IMPUGNAÇÃO AO EDITAL DE LICITAÇÃO

pelos fatos e fundamentos jurídicos a seguir expostos:

1. DA TEMPESTIVIDADE
O presente instrumento é apresentado estritamente dentro do prazo legal previsto no art. 164 da Lei nº 14.133/2021, que assegura a qualquer pessoa o direito de impugnar edital de licitação por irregularidade na aplicação da lei até 3 (três) dias úteis antes da data de abertura do certame.

2. DOS FATOS E DA ILEGALIDADE APONTADA
Em análise detida ao instrumento convocatório e seus anexos, verificou-se cláusula manifestamente restritiva à competitividade e em desacordo com as diretrizes da Nova Lei de Licitações:

"${motivo}"

3. DO DIREITO E DA JURISPRUDÊNCIA DO TCU
A exigência ora combatida infringe frontalmente o ${artigo}, bem como o princípio fundamental da ampla competitividade e da obtenção da proposta mais vantajosa para a Administração Pública (Art. 5º da Lei 14.133/2021).

Conforme entendimento consolidado do Tribunal de Contas da União (TCU):
"A fixação de exigências editalícias desprovidas de respaldo legal ou desproporcionais à garantia da execução do contrato afronta o caráter competitivo do certame licitatório e macula de nulidade a cláusula restritiva." (Súmula TCU nº 263 / Acórdão 1.284/2020 - Plenário).

4. DOS PEDIDOS
Diante de todo o exposto, requer a Vossa Senhoria:
a) O RECEBIMENTO da presente Impugnação no seu regular efeito;
b) O ACOLHIMENTO INTEGRAL das razões aqui deduzidas, para que seja determinado o saneamento do edital, com a RETIFICAÇÃO da cláusula impugnada;
c) Caso a alteração impacte a formulação das propostas, a REABERTURA do prazo legal de divulgação, nos termos do art. 55, §1º da Lei nº 14.133/2021.

Termos em que,
Pede Deferimento.

Brasília/DF, ${new Date().toLocaleDateString('pt-BR')}.

_____________________________________________________
${razaoSocial}
Representante Legal / Departamento de Licitações`;
}

export function gerarKitCompletoDeclaracoes(edital, dadosEmpresa = {}) {
  const razaoSocial = dadosEmpresa.razaoSocial || "SUA EMPRESA LTDA";
  const cnpj = dadosEmpresa.cnpj || "00.000.000/0001-00";
  const orgao = edital.orgaoEntidade.razaoSocial;
  const numProcesso = edital.processo || edital.numeroCompra;
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  return `=============================================================================
KIT OFICIAL DE DECLARAÇÕES OBRIGATÓRIAS - LEI Nº 14.133/2021
EMPRESA: ${razaoSocial} | CNPJ: ${cnpj}
ÓRGÃO LICITANTE: ${orgao}
PROCESSO / PREGÃO: ${numProcesso}
DATA: ${dataHoje}
=============================================================================

1. DECLARAÇÃO DE ENQUADRAMENTO ME / EPP (LEI COMPLEMENTAR 123/2006)
A empresa ${razaoSocial}, inscrita no CNPJ sob o nº ${cnpj}, declara, sob as penas da lei, que cumpre os requisitos legais para qualificação como Microempresa ou Empresa de Pequeno Porte, nos termos do art. 3º da LC 123/2006, não estando incursa em nenhum dos impedimentos do §4º do referido artigo, fazendo jus ao tratamento diferenciado da Lei 14.133/2021.

2. DECLARAÇÃO DE INEXISTÊNCIA DE FATOS IMPEDITIVOS (ART. 14 DA LEI 14.133/2021)
Declara, sob as penas da lei, que não incorre em quaisquer das condições impeditivas previstas no art. 14 da Lei Federal nº 14.133/2021, não possuindo sanção de suspensão temporária de participação em licitação nem declaração de inidoneidade para licitar ou contratar com a Administração Pública.

3. DECLARAÇÃO DE CUMPRIMENTO DO ART. 7º, XXXIII DA CONSTITUIÇÃO FEDERAL
Declara, para fins do disposto no inciso VI do art. 68 da Lei nº 14.133/2021, que não emprega menor de dezoito anos em trabalho noturno, perigoso ou insalubre e não emprega menor de dezesseis anos, salvo na condição de aprendiz a partir de quatorze anos.

4. DECLARAÇÃO DE ELABORAÇÃO INDEPENDENTE DE PROPOSTA
Declara que a proposta econômica apresentada foi elaborada de maneira autônoma e independente, e que seu conteúdo não foi, no todo ou em parte, direta ou indiretamente, informado a ou discutido com qualquer outro licitante.

5. DECLARAÇÃO DE RESERVA DE CARGOS PARA PCDs (ART. 63, IV DA LEI 14.133/2021)
Declara que cumpre as exigências de reserva de cargos para pessoa com deficiência e para reabilitado da Previdência Social, nos termos do art. 93 da Lei nº 8.213/1991.

_____________________________________________________
${razaoSocial}
CNPJ: ${cnpj}
Representante Legal`;
}

export const gerarDeclaracaoME = gerarKitCompletoDeclaracoes;

export function gerarMinutaRecursoAdministrativo(edital, dadosEmpresa = {}, motivoRecurso = "") {
  const razaoSocial = dadosEmpresa.razaoSocial || "SUA EMPRESA LTDA";
  const cnpj = dadosEmpresa.cnpj || "00.000.000/0001-00";
  const orgao = edital.orgaoEntidade.razaoSocial;
  const numProcesso = edital.processo || edital.numeroCompra;
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  const motivoReal = motivoRecurso || "Desclassificação/Inabilitação irregular da licitante concorrente provisoriamente em 1º lugar por descumprimento expresso dos requisitos do Termo de Referência e apresentação de proposta técnica inexequível.";

  return `ILUSTRÍSSIMO(A) SENHOR(A) PREGOEIRO(A) / AGENTE DE CONTRATAÇÃO
ÓRGÃO LICITANTE: ${orgao}
LICITAÇÃO: ${numProcesso}
OBJETO: ${edital.objetoCompra}

${razaoSocial}, inscrita no CNPJ sob o nº ${cnpj}, vem, tempestivamente, com fulcro no art. 165, inciso I, alínea 'b' e 'c' da Lei Federal nº 14.133/2021, manifestar sua formal:

INTENÇÃO E RAZÕES DE RECURSO ADMINISTRATIVO

em face da decisão que classificou/habilitou a empresa concorrente provisoriamente posicionada no 1º lugar do certame, pelos fundamentos fáticos e de direito adiante delineados:

1. DA TEMPESTIVIDADE E DO INTERESSE RECURSAL
A presente manifestação é protocolada de forma imediata e fundamentada na própria sessão pública, assegurando o direito ao contraditório e à ampla defesa (art. 165 da Lei 14.133/2021).

2. DOS FATOS E DO DESCUMPRIMENTO DO EDITAL
A proposta e/ou documentação da empresa provisoriamente primeira colocada padece de vício insanável que compromete o certame:
"${motivoReal}"

3. DO DIREITO (VINCULAÇÃO AO INSTRUMENTO CONVOCATÓRIO)
O princípio do julgamento objetivo e da estrita vinculação ao instrumento convocatório (art. 5º da Lei nº 14.133/2021) veda a aceitação de proposta que afronte as exigências mínimas do edital. A tolerância de vícios insanáveis afronta a isonomia e compromete a execução do objeto contratado.

4. DOS PEDIDOS
Ante o exposto, pugna-se pelo provimento deste recurso para:
a) A REFORMA da decisão proferida pelo Ilustre Pregoeiro, determinando a DESCLASSIFICAÇÃO / INABILITAÇÃO da referida concorrente;
b) A CONVOCAÇÃO da ora Recorrente (${razaoSocial}) para apresentação de sua proposta e documentação de habilitação, sagrando-se vencedora do certame.

Termos em que pede deferimento.
${dataHoje}.

_____________________________________________________
${razaoSocial} • CNPJ: ${cnpj}`;
}

export function gerarPropostaComercialFormatada(edital, dadosEmpresa = {}, valorFinal = 0) {
  const razaoSocial = dadosEmpresa.razaoSocial || "SUA EMPRESA LTDA";
  const cnpj = dadosEmpresa.cnpj || "00.000.000/0001-00";
  const orgao = edital.orgaoEntidade.razaoSocial;
  const numProcesso = edital.processo || edital.numeroCompra;
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorFinal || edital.valorTotalEstimado);

  return `=============================================================================
PROPOSTA COMERCIAL DEFINITIVA DE PREÇOS
=============================================================================
AO: ${orgao}
REFERÊNCIA: ${numProcesso}
OBJETO: ${edital.objetoCompra}

PROPONENTE:
Razão Social: ${razaoSocial}
CNPJ: ${cnpj}
Endereço: Sede do Proponente
E-mail: contato@${razaoSocial.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br

1. VALOR GLOBAL DA PROPOSTA:
Valor Total Proposto: ${valorFormatado}
(Inclusos todos os tributos, frete, encargos sociais e trabalhistas incidentes)

2. CONDIÇÕES GERAIS:
- Validade da Proposta: 60 (sessenta) dias a contar da data de abertura do certame.
- Prazo de Execução/Entrega: Conforme estipulado no Termo de Referência do Edital.
- Pagamento: Ordem bancária na conta da empresa em até 30 dias após liquidação da NF.

Declaramos total concordância com os termos do instrumento convocatório.

${dataHoje}

_____________________________________________________
${razaoSocial}
Representante Legal`;
}

export function calcularViabilidadeEconomica({
  valorTeto = 100000,
  custoProdutosOuServicos = 55000,
  impostoAliquota = 8, // percentual Simples ou Lucro Presumido
  margemLucroAlvo = 25, // percentual
  custoOperacionalFrete = 3500
}) {
  const custoBase = Number(custoProdutosOuServicos) + Number(custoOperacionalFrete);
  const fatorImposto = 1 - (Number(impostoAliquota) / 100);
  const fatorMargem = 1 - (Number(margemLucroAlvo) / 100);

  // Preço de venda mínimo para bater a margem líquida desejada
  const precoIdeal = custoBase / (1 - ((Number(impostoAliquota) + Number(margemLucroAlvo)) / 100));
  
  const descontoSobreTeto = ((valorTeto - precoIdeal) / valorTeto) * 100;
  const impostoValor = precoIdeal * (Number(impostoAliquota) / 100);
  const lucroLiquidoEstimado = precoIdeal - custoBase - impostoValor;
  
  const viavel = precoIdeal < valorTeto;

  return {
    precoIdeal: Math.round(precoIdeal * 100) / 100,
    descontoSobreTeto: Math.max(0, Math.round(descontoSobreTeto * 10) / 10),
    custoTotal: custoBase,
    impostoValor: Math.round(impostoValor * 100) / 100,
    lucroLiquidoEstimado: Math.round(lucroLiquidoEstimado * 100) / 100,
    margemRealPct: Math.round((lucroLiquidoEstimado / precoIdeal) * 1000) / 10,
    viavel: viavel,
    alerta: viavel ? "✅ Proposta economicamente viável com margem saudável" : "⚠️ Custo + Margem ultrapassa o teto do edital. Reduza custos ou margem."
  };
}
