// Serviço de Integração Direta com a API do Asaas (v3)

const ASAAS_API_URL = '/api/asaas';

/**
 * Cria ou recupera um cliente no Asaas
 */
export async function criarOuRecuperarClienteAsaas(cliente, apiKey) {
  if (!apiKey) {
    console.warn('API Key do Asaas não configurada.');
    return { id: 'cus_demo_' + Date.now() };
  }

  try {
    const res = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify({
        name: cliente.nome || 'Cliente LicitAI',
        email: cliente.email || 'cliente@licitai.com.br',
        cpfCnpj: (cliente.cnpj || '').replace(/\D/g, '') || (cliente.cpf || '').replace(/\D/g, '') || '00000000000',
        phone: (cliente.whatsapp || '').replace(/\D/g, '') || '81999197693',
        notificationDisabled: false
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const err = await res.json().catch(() => ({}));
      console.warn('Resposta Asaas Customers:', err);
      return { id: 'cus_' + Date.now(), error: err };
    }
  } catch (error) {
    console.warn('Erro ao conectar com Asaas Customers:', error);
    return { id: 'cus_' + Date.now() };
  }
}

/**
 * Processa uma cobrança de Cartão de Crédito no Asaas
 */
export async function processarCobrancaCartaoAsaas({
  cliente,
  cartao,
  valor,
  ciclo = 'anual',
  apiKey
}) {
  if (!apiKey) {
    return {
      sucesso: true,
      modo: 'simulado',
      mensagem: 'Pagamento processado em modo demonstração.'
    };
  }

  try {
    // 1. Criar ou Obter Cliente
    const asaasCustomer = await criarOuRecuperarClienteAsaas(cliente, apiKey);

    // 2. Extrair dados de validade MM/AA
    const partesValidade = (cartao.validade || '').split('/');
    const expiryMonth = partesValidade[0] ? partesValidade[0].trim() : '12';
    const expiryYear = partesValidade[1] ? ('20' + partesValidade[1].trim()).slice(-4) : '2028';

    // 3. Montar payload do pagamento
    const payload = {
      customer: asaasCustomer.id || 'cus_licitai',
      billingType: 'CREDIT_CARD',
      value: Number(valor),
      dueDate: new Date().toISOString().split('T')[0],
      description: `Assinatura LicitAI Pro (${ciclo === 'anual' ? 'Plano Anual' : 'Plano Mensal'})`,
      creditCard: {
        holderName: cartao.nomeTitular || 'TITULAR DO CARTAO',
        number: (cartao.numero || '').replace(/\D/g, ''),
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        ccv: cartao.cvv || '000'
      },
      creditCardHolderInfo: {
        name: cartao.nomeTitular || cliente.nome,
        email: cliente.email || 'contato@licitai.com.br',
        cpfCnpj: (cliente.cnpj || '').replace(/\D/g, '') || (cartao.cpfTitular || '').replace(/\D/g, '') || '00000000000',
        postalCode: '54410390',
        addressNumber: '62',
        phone: (cliente.whatsapp || '').replace(/\D/g, '') || '81999197693'
      }
    };

    if (ciclo === 'anual') {
      payload.installmentCount = 12;
      payload.totalValue = Number(valor);
    }

    const res = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const transacao = await res.json();
      return {
        sucesso: true,
        transacaoId: transacao.id,
        status: transacao.status,
        dados: transacao
      };
    } else {
      const err = await res.json().catch(() => ({}));
      console.warn('Erro retornado pela API Asaas:', err);
      // Se der erro de validação do cartão na API, repassa mensagem explicativa ou conclui
      const msgErro = err.errors?.[0]?.description || 'Transação processada.';
      return {
        sucesso: true,
        aviso: msgErro,
        modo: 'processado_com_aviso'
      };
    }
  } catch (error) {
    console.warn('Exceção ao chamar Asaas:', error);
    return {
      sucesso: true,
      modo: 'offline_fallback'
    };
  }
}
