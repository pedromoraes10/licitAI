import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Zap, CreditCard, Building, Key, CheckCircle2, 
  HelpCircle, ExternalLink, RefreshCw, Smartphone, QrCode, Lock
} from 'lucide-react';
import { carregarConfiguracoesPagamento, salvarConfiguracoesPagamento } from '../services/paymentConfig';
import { gerarPixCopiaECola } from '../services/pixGenerator';

export function PaymentSettingsModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(carregarConfiguracoesPagamento());
  const [salvoComSucesso, setSalvoComSucesso] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('pix'); // 'pix' ou 'cartao'

  useEffect(() => {
    if (isOpen) {
      setConfig(carregarConfiguracoesPagamento());
      setSalvoComSucesso(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSalvar = (e) => {
    e.preventDefault();
    salvarConfiguracoesPagamento(config);
    setSalvoComSucesso(true);
    setTimeout(() => {
      setSalvoComSucesso(false);
      onClose();
    }, 1500);
  };

  const pixTeste = gerarPixCopiaECola({
    chavePix: config.chavePix || 'financeiro@licitai.com.br',
    nomeBeneficiario: config.nomeBeneficiario || 'LICITAI SAAS',
    cidade: config.cidadeBeneficiario || 'SAO PAULO',
    valor: 49.90,
    txid: 'TESTELICITAI'
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 8, 16, 0.92)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '740px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9)',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        {/* Fechar */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px'
          }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-success">
              <Building size={13} /> Configuração de Recebimentos
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              100% do dinheiro vai direto para você
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            Como os Pagamentos Caem na Sua Conta
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Configure onde receber o <strong>Pix instantâneo</strong> e a chave do gateway de <strong>Cartão de Crédito</strong>.
          </p>
        </div>

        {/* Abas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => setAbaAtiva('pix')}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: abaAtiva === 'pix' ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
              background: abaAtiva === 'pix' ? 'rgba(14, 165, 233, 0.18)' : 'rgba(255, 255, 255, 0.02)',
              color: abaAtiva === 'pix' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Zap size={18} color={abaAtiva === 'pix' ? 'var(--primary-light)' : 'var(--text-muted)'} />
            1. Pix Direto na Conta (Sem Taxa)
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('cartao')}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: abaAtiva === 'cartao' ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
              background: abaAtiva === 'cartao' ? 'rgba(14, 165, 233, 0.18)' : 'rgba(255, 255, 255, 0.02)',
              color: abaAtiva === 'cartao' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <CreditCard size={18} color={abaAtiva === 'cartao' ? 'var(--primary-light)' : 'var(--text-muted)'} />
            2. Cartão de Crédito (Gateway Asaas)
          </button>
        </div>

        <form onSubmit={handleSalvar}>
          {/* ABA PIX */}
          {abaAtiva === 'pix' && (
            <div>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '0.86rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}>
                <strong style={{ color: 'var(--success-light)', display: 'block', marginBottom: '4px' }}>
                  ⚡ Como funciona o Pix Direto:
                </strong>
                Ao cadastrar sua Chave Pix abaixo, o sistema gera o QR Code padrão do Banco Central brasileiro (EMVCo BR Code). Quando o assinante pagar pelo app de qualquer banco (Nubank, Itaú, Bradesco, Inter, BB), <strong>o dinheiro cai imediatamente no seu saldo bancário</strong>, sem intermediários e sem taxas de cartão!
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Sua Chave Pix (CPF, CNPJ, E-mail, Celular ou Aleatória)
                  </label>
                  <input
                    type="text"
                    value={config.chavePix}
                    onChange={(e) => setConfig({ ...config, chavePix: e.target.value })}
                    placeholder="Ex: seu-cnpj@empresa.com.br ou 00.000.000/0001-00"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Tipo da Chave
                  </label>
                  <select
                    value={config.tipoChavePix}
                    onChange={(e) => setConfig({ ...config, tipoChavePix: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="cnpj" style={{ background: '#0a101e' }}>CNPJ</option>
                    <option value="cpf" style={{ background: '#0a101e' }}>CPF</option>
                    <option value="email" style={{ background: '#0a101e' }}>E-mail</option>
                    <option value="telefone" style={{ background: '#0a101e' }}>Telefone</option>
                    <option value="aleatoria" style={{ background: '#0a101e' }}>Chave Aleatória (EVP)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Nome do Titular da Conta Bancária (Até 25 letras)
                  </label>
                  <input
                    type="text"
                    value={config.nomeBeneficiario}
                    onChange={(e) => setConfig({ ...config, nomeBeneficiario: e.target.value.toUpperCase() })}
                    placeholder="EX: SEU NOME OU SUA EMPRESA"
                    maxLength={25}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Cidade do Titular
                  </label>
                  <input
                    type="text"
                    value={config.cidadeBeneficiario}
                    onChange={(e) => setConfig({ ...config, cidadeBeneficiario: e.target.value.toUpperCase() })}
                    placeholder="SAO PAULO"
                    maxLength={15}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Opções de QR Code: Automático por CNPJ ou Imagem do Banco */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                    📱 QR Code Pix do Seu CNPJ (Escaneável em Tempo Real)
                  </div>
                  <div className="badge badge-success">
                    Padrão Banco Central do Brasil
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  gap: '20px',
                  alignItems: 'center'
                }}>
                  {/* Imagem Real do QR Code */}
                  <div style={{
                    background: '#ffffff',
                    padding: '10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}>
                    {config.qrCodeImagemUrl ? (
                      <img 
                        src={config.qrCodeImagemUrl} 
                        alt="QR Code Pix do Banco" 
                        style={{ width: '160px', height: '160px', objectFit: 'contain' }}
                      />
                    ) : (
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(pixTeste)}`} 
                        alt="QR Code Pix Dinâmico" 
                        style={{ width: '160px', height: '160px', display: 'block' }}
                      />
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      👉 <strong>Faça o teste agora:</strong> Aponte a câmera do seu celular para este QR Code na tela. O app do seu banco reconhecerá a chave <strong>{config.chavePix}</strong> em nome de <strong>{config.nomeBeneficiario || 'SUA EMPRESA'}</strong>!
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      O sistema embute o valor da assinatura automaticamente em cada QR Code (R$ 32,90 ou R$ 49,90).
                    </div>

                    {/* Upload Opcional de Imagem */}
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Deseja subir a imagem do QR Code gerado no app do seu banco? (Opcional)
                      </label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setConfig({ ...config, qrCodeImagemUrl: event.target.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}
                      />
                      {config.qrCodeImagemUrl && (
                        <button
                          type="button"
                          onClick={() => setConfig({ ...config, qrCodeImagemUrl: '' })}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--danger-light)',
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            marginTop: '4px',
                            display: 'block'
                          }}
                        >
                          Remover imagem personalizada (usar gerador automático BACEN)
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Código Copia e Cola */}
                <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    CÓDIGO PIX COPIA E COLA OFICIAL (EMVCo BR CODE):
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: 'var(--primary-light)',
                    wordBreak: 'break-all'
                  }}>
                    {pixTeste}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA CARTÃO DE CRÉDITO */}
          {abaAtiva === 'cartao' && (
            <div>
              <div style={{
                background: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.25)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                fontSize: '0.86rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}>
                <strong style={{ color: 'var(--primary-light)', display: 'block', marginBottom: '4px' }}>
                  💳 Como funciona o Cartão de Crédito Recorrente (Asaas / Mercado Pago):
                </strong>
                Para cobrar cartão de crédito no modelo SaaS (mensalidades recorrentes e parcelamento em 12x), utiliza-se um gateway regulamentado. O <strong>Asaas</strong> é a ferramenta nº 1 do Brasil para micro-SaaS:
                <ul style={{ marginLeft: '18px', marginTop: '6px' }}>
                  <li>Cria a cobrança e cobra o cartão do cliente todo mês automaticamente;</li>
                  <li>Faz a transferência automática para sua conta corrente (TED/Pix diário);</li>
                  <li>Possui taxa reduzida (~1,99% + R$ 0,49 por transação).</li>
                </ul>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Selecione o Gateway de Pagamento
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'asaas', nome: 'Asaas (Recomendado)', url: 'https://asaas.com' },
                    { id: 'mercadopago', nome: 'Mercado Pago', url: 'https://mercadopago.com.br' },
                    { id: 'stripe', nome: 'Stripe Brasil', url: 'https://stripe.com/br' }
                  ].map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setConfig({ ...config, gatewayAtivo: g.id })}
                      style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: config.gatewayAtivo === g.id ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                        background: config.gatewayAtivo === g.id ? 'rgba(14, 165, 233, 0.2)' : 'rgba(0,0,0,0.3)',
                        color: config.gatewayAtivo === g.id ? '#fff' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {g.nome}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chave de API Asaas */}
              {config.gatewayAtivo === 'asaas' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Chave de API do Asaas (API Key)
                    </label>
                    <a 
                      href="https://www.asaas.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: 'var(--primary-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Criar conta no Asaas <ExternalLink size={12} />
                    </a>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      value={config.asaasApiKey}
                      onChange={(e) => setConfig({ ...config, asaasApiKey: e.target.value })}
                      placeholder="$aact_YTU5YTE0M2M6N2Zl..."
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.86rem'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    No painel do Asaas: acesse <em>Configurações da Conta &gt; Integrações &gt; Gerar Chave de API</em>.
                  </div>
                </div>
              )}

              {/* Chave Mercado Pago */}
              {config.gatewayAtivo === 'mercadopago' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Access Token de Produção do Mercado Pago
                  </label>
                  <input
                    type="password"
                    value={config.mercadoPagoAccessToken}
                    onChange={(e) => setConfig({ ...config, mercadoPagoAccessToken: e.target.value })}
                    placeholder="APP_USR-..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              )}

              {/* Webhook URL */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '14px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  URL DO WEBHOOK DE ATIVAÇÃO AUTOMÁTICA (COLE NO SEU GATEWAY):
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--accent-gold-light)',
                  wordBreak: 'break-all'
                }}>
                  https://licitai.com.br/api/v1/webhooks/payment
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Quando o cliente paga, o webhook avisa o sistema e ativa a conta no mesmo segundo.
                </div>
              </div>
            </div>
          )}

          {/* Botões do Rodapé */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            {salvoComSucesso ? (
              <span style={{ color: 'var(--success-light)', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Configurações Salvas com Sucesso!
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                Valores salvos com segurança no seu ambiente
              </span>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-gold">
                Salvar Minha Conta & Chaves
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
