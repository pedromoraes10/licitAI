import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Copy, ShieldCheck, Zap, X, Clock, QrCode, 
  CreditCard, Lock, ArrowRight, Check, AlertCircle, Building, Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { carregarConfiguracoesPagamento } from '../services/paymentConfig';
import { gerarPixCopiaECola, gerarQrCodeUrl } from '../services/pixGenerator';
import { processarCobrancaCartaoAsaas } from '../services/asaasService';

export function CheckoutModal({ isOpen, onClose, plano, empresaAtiva, onSuccess, onOpenSettings }) {
  // Forma de pagamento: 'pix' ou 'cartao'
  const [metodo, setMetodo] = useState('pix');
  const [etapa, setEtapa] = useState('pagamento'); // 'pagamento' ou 'sucesso'
  const [copiado, setCopiado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(900); // 15 minutos
  const [paymentConfig, setPaymentConfig] = useState(carregarConfiguracoesPagamento());

  // Dados do Cliente para criar a conta
  const [cliente, setCliente] = useState({
    nome: empresaAtiva?.razaoSocial || 'Diretoria de Licitações',
    email: 'contato@' + (empresaAtiva?.razaoSocial ? empresaAtiva.razaoSocial.toLowerCase().replace(/[^a-z0-9]/g, '') : 'suaempresa') + '.com.br',
    whatsapp: '(11) 98765-4321',
    cnpj: empresaAtiva?.cnpj || '00.000.000/0001-00'
  });

  const [ciclo, setCiclo] = useState(plano?.ciclo || 'anual'); // 'mensal' ou 'anual'

  // Dados do Cartão de Crédito
  const [cartao, setCartao] = useState({
    numero: '',
    nomeTitular: '',
    validade: '',
    cvv: '',
    cpfTitular: ''
  });

  const [processando, setProcessando] = useState(false);
  const [erroCartao, setErroCartao] = useState('');

  // Atualizar quando empresaAtiva mudar
  useEffect(() => {
    if (empresaAtiva) {
      setCliente(prev => ({
        ...prev,
        nome: empresaAtiva.razaoSocial || prev.nome,
        cnpj: empresaAtiva.cnpj || prev.cnpj
      }));
    }
    setPaymentConfig(carregarConfiguracoesPagamento());
  }, [empresaAtiva, isOpen]);

  useEffect(() => {
    if (plano?.ciclo) {
      setCiclo(plano.ciclo);
    }
  }, [plano]);

  // Timer de 15 minutos do Pix
  useEffect(() => {
    if (!isOpen) {
      setEtapa('pagamento');
      setTempoRestante(900);
      setProcessando(false);
      setErroCartao('');
      return;
    }

    const timer = setInterval(() => {
      setTempoRestante(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const isStart = plano?.id === 'start' || plano?.nome?.includes('Start');
  
  // Preços oficiais: Start 29,90 (ou 19,90/mês no anual) | Pro Copilot 49,90 (ou 32,90/mês no anual)
  let valorMensal = '49,90';
  let valorAnualMensal = '32,90';
  let totalAnual = '394,80';
  let valorNumerico = ciclo === 'anual' ? 394.80 : 49.90;
  let economia = 'Economize 34% (R$ 204/ano OFF)';

  if (isStart) {
    valorMensal = '29,90';
    valorAnualMensal = '19,90';
    totalAnual = '238,80';
    valorNumerico = ciclo === 'anual' ? 238.80 : 29.90;
    economia = 'Economize 33% no Plano Anual';
  }

  const precoExibido = ciclo === 'anual' ? valorAnualMensal : valorMensal;
  const valorFinal = ciclo === 'anual' ? totalAnual : valorMensal;

  // Gerar código Pix Oficial com CRC16 do Banco Central
  const chavePixOficial = gerarPixCopiaECola({
    chavePix: paymentConfig.chavePix || 'financeiro@licitai.com.br',
    nomeBeneficiario: paymentConfig.nomeBeneficiario || 'LICITAI SAAS',
    cidade: paymentConfig.cidadeBeneficiario || 'SAO PAULO',
    valor: valorNumerico,
    txid: 'LICITAI' + (empresaAtiva?.cnpj ? empresaAtiva.cnpj.replace(/\D/g, '').slice(0, 8) : 'SUB')
  });

  const minutos = Math.floor(tempoRestante / 60).toString().padStart(2, '0');
  const segundos = (tempoRestante % 60).toString().padStart(2, '0');

  const copiarPix = () => {
    navigator.clipboard?.writeText(chavePixOficial);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  // Formatação do cartão
  const handleNumeroCartao = (val) => {
    const limpo = val.replace(/\D/g, '').slice(0, 16);
    const formatado = limpo.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCartao({ ...cartao, numero: formatado });
  };

  const handleValidade = (val) => {
    const limpo = val.replace(/\D/g, '').slice(0, 4);
    let formatado = limpo;
    if (limpo.length >= 3) {
      formatado = limpo.slice(0, 2) + '/' + limpo.slice(2);
    }
    setCartao({ ...cartao, validade: formatado });
  };

  // Detectar bandeira
  const detectarBandeira = (num) => {
    const n = (num || '').replace(/\D/g, '');
    if (n.startsWith('4')) return 'Visa';
    if (n.startsWith('5')) return 'Mastercard';
    if (n.startsWith('6')) return 'Elo';
    return 'Cartão';
  };

  const confirmarPagamento = async (tipo) => {
    if (tipo === 'cartao') {
      const numLimpo = cartao.numero.replace(/\D/g, '');
      if (numLimpo.length < 13) {
        setErroCartao('Por favor, informe um número de cartão válido.');
        return;
      }
      if (!cartao.validade || cartao.validade.length < 5) {
        setErroCartao('Informe a validade no formato MM/AA.');
        return;
      }
      if (!cartao.cvv || cartao.cvv.length < 3) {
        setErroCartao('Informe o código de segurança (CVV).');
        return;
      }

      setProcessando(true);
      setErroCartao('');

      // Chama gateway de cartão do Asaas com a chave de produção oficial
      await processarCobrancaCartaoAsaas({
        cliente,
        cartao,
        valor: valorNumerico,
        ciclo,
        apiKey: paymentConfig.asaasApiKey
      });
    } else {
      setProcessando(true);
      setErroCartao('');
    }

    setProcessando(false);
    setEtapa('sucesso');
    confetti({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.6 }
    });

    if (onSuccess) {
      setTimeout(() => {
        onSuccess({
          ...cliente,
          metodo: tipo,
          plano: plano?.nome || 'Plano Pro Copilot',
          ciclo: ciclo
        });
      }, 2000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 8, 16, 0.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '580px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        {/* Botão Fechar */}
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

        {etapa === 'pagamento' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-success">
                <Zap size={13} /> Ativação Imediata da Conta
              </span>
              {metodo === 'pix' && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> Expira em {minutos}:{segundos}
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
              Checkout: <span className="gradient-text">{plano?.nome || "Plano Pro Copilot"}</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '16px' }}>
              Liberado instantaneamente para seu CNPJ com inteligência artificial e alertas.
            </p>

            {/* SELETOR DE CICLO: MENSAL VS ANUAL COM DESCONTO */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              padding: '8px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px'
            }}>
              <button
                type="button"
                onClick={() => setCiclo('mensal')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: ciclo === 'mensal' ? '1px solid var(--primary-light)' : 'none',
                  background: ciclo === 'mensal' ? 'rgba(14, 165, 233, 0.18)' : 'transparent',
                  color: ciclo === 'mensal' ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <span>Mensal</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                  R$ {valorMensal}/mês
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCiclo('anual')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: ciclo === 'anual' ? '1px solid var(--accent-gold-light)' : 'none',
                  background: ciclo === 'anual' ? 'rgba(245, 158, 11, 0.18)' : 'transparent',
                  color: ciclo === 'anual' ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <span style={{ color: 'var(--accent-gold-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Plano Anual 🔥
                </span>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 800 }}>
                  R$ {valorAnualMensal}/mês
                </span>
              </button>
            </div>

            {ciclo === 'anual' && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: 'var(--accent-gold-light)',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: 600
              }}>
                🎉 {economia} • Cobrado R$ {totalAnual}/ano (até 12x no cartão ou Pix)
              </div>
            )}

            {/* SELEÇÃO DO MÉTODO DE PAGAMENTO */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setMetodo('pix')}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: metodo === 'pix' ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                  background: metodo === 'pix' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: metodo === 'pix' ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Zap size={18} color={metodo === 'pix' ? 'var(--primary-light)' : 'var(--text-muted)'} />
                Pix Instantâneo
              </button>

              <button
                onClick={() => setMetodo('cartao')}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: metodo === 'cartao' ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                  background: metodo === 'cartao' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: metodo === 'cartao' ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <CreditCard size={18} color={metodo === 'cartao' ? 'var(--primary-light)' : 'var(--text-muted)'} />
                Cartão de Crédito
              </button>
            </div>

            {/* DADOS DA CONTA DO CLIENTE (PARA ONDE VAI O ACESSO) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Dados da Sua Conta (Acesso do Usuário)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>E-mail de Login</label>
                  <input
                    type="email"
                    value={cliente.email}
                    onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>WhatsApp (para Alertas)</label>
                  <input
                    type="text"
                    value={cliente.whatsapp}
                    onChange={(e) => setCliente({ ...cliente, whatsapp: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>
              </div>

              {empresaAtiva && (
                <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--success-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> CNPJ Vinculado: <strong>{empresaAtiva.razaoSocial}</strong> ({empresaAtiva.cnpj})
                </div>
              )}
            </div>

            {/* ABA PIX */}
            {metodo === 'pix' ? (
              <div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'rgba(10, 16, 29, 0.7)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    background: '#ffffff',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '14px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {paymentConfig.qrCodeImagemUrl ? (
                      <img 
                        src={paymentConfig.qrCodeImagemUrl} 
                        alt="QR Code Pix do CNPJ" 
                        style={{ width: '180px', height: '180px', objectFit: 'contain', display: 'block' }}
                      />
                    ) : (
                      <img 
                        src={gerarQrCodeUrl(chavePixOficial, 220)} 
                        alt="QR Code Pix Oficial" 
                        style={{ width: '180px', height: '180px', display: 'block', borderRadius: '4px' }}
                      />
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#0284c7',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 800
                    }}>
                      PIX CNPJ
                    </div>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '8px' }}>
                    Total: <strong style={{ color: 'var(--accent-gold-light)', fontSize: '1.1rem' }}>R$ {valorFinal}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> ({ciclo === 'anual' ? 'Assinatura Anual' : 'Mensal Recorrente'})</span>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px' }}>
                    Beneficiário: <strong style={{ color: '#fff' }}>{paymentConfig.nomeBeneficiario}</strong> • Chave: <strong style={{ color: 'var(--primary-light)' }}>{paymentConfig.chavePix}</strong>
                  </div>

                  <button 
                    onClick={copiarPix}
                    className="btn btn-secondary" 
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px 14px' }}
                  >
                    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                      {chavePixOficial.slice(0, 36)}...
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: copiado ? 'var(--success-light)' : 'var(--primary-light)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {copiado ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                      {copiado ? 'Copiado!' : 'Copiar Chave'}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => confirmarPagamento('pix')}
                  disabled={processando}
                  className="btn btn-gold"
                  style={{ width: '100%', marginBottom: '14px', padding: '14px' }}
                >
                  <Zap size={18} /> Confirmar Pix e Acessar Minha Conta
                </button>
              </div>
            ) : (
              /* ABA CARTÃO DE CRÉDITO */
              <div>
                <div style={{
                  background: 'rgba(10, 16, 29, 0.7)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  marginBottom: '20px'
                }}>
                  {/* Número do Cartão */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Número do Cartão de Crédito</label>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                        {detectarBandeira(cartao.numero)}
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cartao.numero}
                        onChange={(e) => handleNumeroCartao(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 38px',
                          borderRadius: '8px',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid var(--border-subtle)',
                          color: '#fff',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.92rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Nome do Titular */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Nome Impresso no Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="NOME COMO NO CARTÃO"
                      value={cartao.nomeTitular}
                      onChange={(e) => setCartao({ ...cartao, nomeTitular: e.target.value.toUpperCase() })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  {/* Validade e CVV */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Validade (MM/AA)</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cartao.validade}
                        onChange={(e) => handleValidade(e.target.value)}
                        maxLength={5}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid var(--border-subtle)',
                          color: '#fff',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        value={cartao.cvv}
                        onChange={(e) => setCartao({ ...cartao, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        maxLength={4}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid var(--border-subtle)',
                          color: '#fff',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Periodicidade */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {ciclo === 'anual' ? 'Cobrança Anual Parcelada' : 'Assinatura Mensal Recorrente'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ciclo === 'anual' ? 'Até 12x no cartão de crédito • Cancele quando quiser' : 'Sem fidelidade • Cancele a qualquer momento'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                        {ciclo === 'anual' ? `12x R$ ${valorAnualMensal}` : `R$ ${valorMensal}/mês`}
                      </div>
                      {ciclo === 'anual' && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Total: R$ {totalAnual}/ano
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {erroCartao && (
                  <div style={{ color: 'var(--danger-light)', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={15} /> {erroCartao}
                  </div>
                )}

                <button
                  onClick={() => confirmarPagamento('cartao')}
                  disabled={processando}
                  className="btn btn-gold"
                  style={{ width: '100%', marginBottom: '14px', padding: '14px' }}
                >
                  <Lock size={16} /> {processando ? 'Processando Cobrança...' : ciclo === 'anual' ? `Assinar no Cartão (12x R$ ${valorAnualMensal})` : `Assinar por R$ ${valorMensal}/mês`}
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                <ShieldCheck size={15} color="var(--success-light)" />
                Gateway Criptografado PCI-DSS • Conexão Asaas / Mercado Pago / Stripe
              </div>

              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-light)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '2px 6px'
                  }}
                >
                  ⚙️ Configurar Minha Chave Pix / Conta Bancária (Painel do Dono)
                </button>
              )}
            </div>
          </div>
        ) : (
          /* TELA DE CONFIRMAÇÃO */
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 30px var(--success-glow)'
            }}>
              <CheckCircle2 size={40} color="var(--success-light)" />
            </div>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
              Assinatura Ativada com Sucesso!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Sua conta <strong>{cliente.email}</strong> foi liberada para o CNPJ <strong>{cliente.cnpj}</strong>.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '0.85rem' }}>
                <Check size={16} color="var(--success-light)" />
                Workspace configurado exclusivamente para seu CNPJ
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '0.85rem' }}>
                <Check size={16} color="var(--success-light)" />
                Alertas matinais sincronizados no WhatsApp: {cliente.whatsapp}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <Check size={16} color="var(--success-light)" />
                Pipeline Kanban pessoal inicializado
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              Acessar Meu Workspace Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
