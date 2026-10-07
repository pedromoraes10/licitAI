import React, { useState } from 'react';
import { 
  MessageSquare, Send, CheckCheck, Bot, Sparkles, Phone, Video, 
  MoreVertical, Paperclip, Smile, ArrowRight, Shield, Zap, Calculator 
} from 'lucide-react';
import { gerarRespostaCopilot } from '../services/aiEngine';

export function WhatsAppHub({ selectedTender, onNavigateTab, onOpenCheckout }) {
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      remetente: 'bot',
      texto: `🚨 *LicitAI • Oportunidade Matinal (08h00)*\n\nIdentificamos edital com *Score de 96%* para sua empresa:\n\n🏛️ *Órgão:* ${selectedTender?.orgaoEntidade.razaoSocial || "MINISTÉRIO DA SAÚDE"}\n📋 *Objeto:* ${selectedTender?.objetoCompra.slice(0, 110) || "Contratação de Cloud Computing"}...\n💰 *Valor Estimado:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedTender?.valorTotalEstimado || 4850000)}\n\n⚠️ *Atenção:* Cláusula 14 possui pegadinha de SLA com multa agressiva de 2% ao dia.\n\n_Você pode me fazer perguntas sobre este edital aqui mesmo no WhatsApp!_`,
      hora: '08:00',
      lido: true
    }
  ]);
  const [inputZap, setInputZap] = useState('');
  const [digitando, setDigitando] = useState(false);
  const [telefone, setTelefone] = useState('(81) 99919-7693');
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  const enviarMensagemZap = (textoCustomizado) => {
    const texto = textoCustomizado || inputZap;
    if (!texto.trim() || !selectedTender) return;

    const novaUser = {
      id: Date.now(),
      remetente: 'user',
      texto: texto,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lido: true
    };

    setMensagens(prev => [...prev, novaUser]);
    setInputZap('');
    setDigitando(true);

    setTimeout(() => {
      const resp = gerarRespostaCopilot(selectedTender, texto);
      const novaBot = {
        id: Date.now() + 1,
        remetente: 'bot',
        texto: resp.texto.replace(/\*\*/g, '*'), // Formatação WhatsApp
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        lido: true,
        botoesAcao: [
          { label: '📊 Simular Preço & Margem', tab: 'calculadora' },
          { label: '⚖️ Ver Impugnação na Lei 14.133', tab: 'impugnacao' }
        ]
      };
      setMensagens(prev => [...prev, novaBot]);
      setDigitando(false);
    }, 800);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Banner de Diferenciação vs Concorrentes */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        marginBottom: '20px',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
          }}>
            <MessageSquare size={24} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              WhatsApp 2-Way Autônomo com IA
              <span className="badge badge-success">Meta Cloud API Oficial</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
              Enquanto os concorrentes só cospem links que ninguém lê, o LicitAI responde suas dúvidas sobre o edital por áudio ou texto direto no WhatsApp.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.85rem',
              width: '160px'
            }}
          />
          <a
            href="https://wa.me/5581999197693?text=Olá!%20Gostaria%20de%20ativar%20meus%20alertas%20de%20licitações%20do%20LicitAI"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold btn-sm"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Smartphone size={14} /> Abrir no Celular (+55 81 99919-7693)
          </a>
          <button 
            onClick={() => setNotificacoesAtivas(!notificacoesAtivas)}
            className={`btn ${notificacoesAtivas ? 'btn-secondary' : 'btn-secondary'} btn-sm`}
          >
            {notificacoesAtivas ? '🟢 Notificações Ativas' : 'Ativar WhatsApp'}
          </button>
        </div>
      </div>

      {/* SIMULADOR DE CELULAR / WHATSAPP REALISTA */}
      <div style={{
        background: '#0b141a',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        height: '650px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Barra Superior do WhatsApp */}
        <div style={{
          background: '#202c33',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#e9edef',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Bot size={22} color="#fff" />
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #202c33'
              }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                LicitAI Copilot Bot
                <span style={{ fontSize: '0.68rem', background: '#00a884', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>Oficial</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8696a0' }}>
                {digitando ? 'digitando resposta...' : 'online agora (Meta Verified)'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#aebac1' }}>
            <Phone size={18} style={{ cursor: 'pointer' }} />
            <Video size={18} style={{ cursor: 'pointer' }} />
            <MoreVertical size={18} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Fundo de Conversa do WhatsApp */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 100%)'
        }}>
          {mensagens.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.remetente === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '78%',
                background: msg.remetente === 'user' ? '#005c4b' : '#202c33',
                color: '#e9edef',
                padding: '10px 14px',
                borderRadius: msg.remetente === 'user' ? '12px 0 12px 12px' : '0 12px 12px 12px',
                fontSize: '0.88rem',
                lineHeight: 1.45,
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                position: 'relative'
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.texto}</div>

                {/* Botões de Ação Interativa no WhatsApp */}
                {msg.botoesAcao && (
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '8px'
                  }}>
                    {msg.botoesAcao.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateTab(btn.tab)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#53bdeb',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{btn.label}</span>
                        <ArrowRight size={14} />
                      </button>
                    ))}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '4px',
                  fontSize: '0.68rem',
                  color: '#8696a0',
                  marginTop: '4px'
                }}>
                  <span>{msg.hora}</span>
                  {msg.remetente === 'user' && (
                    <CheckCheck size={14} color="#53bdeb" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {digitando && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8696a0', fontSize: '0.8rem' }}>
              <span className="pulse-dot pulse-dot-green"></span>
              Consultando Cláusulas do Edital no PNCP...
            </div>
          )}
        </div>

        {/* Sugestões de Perguntas Rápidas */}
        <div style={{
          background: '#111b21',
          padding: '8px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {[
            "Exige garantia prévia?",
            "Qual o prazo de entrega?",
            "Esse órgão atrasa pagamento?",
            "Posso impugnar esse edital?"
          ].map((sug, i) => (
            <button
              key={i}
              onClick={() => enviarMensagemZap(sug)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                color: '#8696a0',
                fontSize: '0.76rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Campo de Digitação do WhatsApp */}
        <div style={{
          background: '#202c33',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Smile size={22} color="#8696a0" style={{ cursor: 'pointer' }} />
          <Paperclip size={22} color="#8696a0" style={{ cursor: 'pointer' }} />

          <input
            type="text"
            placeholder="Mensagem para o edital..."
            value={inputZap}
            onChange={(e) => setInputZap(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensagemZap()}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#2a3942',
              border: 'none',
              color: '#e9edef',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />

          <button
            onClick={() => enviarMensagemZap()}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#00a884',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
