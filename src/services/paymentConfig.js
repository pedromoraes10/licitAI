// Configurações de Recebimento da Plataforma (Pix Direto na Conta & Gateways)

const STORAGE_KEY = 'licitai_payment_settings';

export const CONFIG_PADRAO = {
  // WhatsApp Oficial da Plataforma
  whatsappOficial: '+55 81 99919-7693',
  whatsappRaw: '5581999197693',

  // Pix Direto na Conta Bancária Oficial (Pedro Henrique de Almeida Moraes)
  chavePix: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PIX_CHAVE) || '49.386.560/0001-15',
  tipoChavePix: 'cnpj',
  nomeBeneficiario: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PIX_TITULAR) || 'PEDRO HENRIQUE DE ALMEIDA MORAES',
  cidadeBeneficiario: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PIX_CIDADE) || 'RECIFE',

  // Gateway para Cartão de Crédito e Conciliação
  gatewayAtivo: 'asaas', // 'asaas', 'mercadopago', 'stripe'
  
  // Chaves de API (guardadas com segurança no cliente/backend)
  asaasApiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ASAAS_API_KEY) || '',
  asaasAmbiente: 'producao', // 'producao' ou 'sandbox'

  mercadoPagoAccessToken: '',
  mercadoPagoPublicKey: '',

  stripeSecretKey: '',
  stripePublishableKey: ''
};

export function carregarConfiguracoesPagamento() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      return { ...CONFIG_PADRAO, ...JSON.parse(salvo) };
    }
  } catch (e) {
    console.error('Erro ao ler configurações de pagamento:', e);
  }
  return CONFIG_PADRAO;
}

export function salvarConfiguracoesPagamento(novasConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novasConfig));
    return true;
  } catch (e) {
    console.error('Erro ao salvar configurações de pagamento:', e);
    return false;
  }
}
