import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Sparkles, Shield, AlertTriangle, ArrowRight, 
  Send, Bot, FileText, CheckCircle2, DollarSign, Calculator, 
  Layers, MessageSquare, Download, Copy, ExternalLink, Zap, 
  Clock, MapPin, Building, ChevronRight, RefreshCw, X, Award, Server, Lock
} from 'lucide-react';

import confetti from 'canvas-confetti';
import { CATEGORIAS_LICITACOES, UFS_BRASIL, MODALIDADES_PNCP } from '../services/mockTenders';
import { fetchLiveTenders } from '../services/pncpService';
import { 
  gerarRespostaCopilot, 
  gerarMinutaImpugnacao, 
  gerarDeclaracaoME, 
  calcularViabilidadeEconomica 
} from '../services/aiEngine';
import { WhatsAppHub } from './WhatsAppHub';
import { WatchdogOps } from './WatchdogOps';
import { GuiaExecucaoModal } from './GuiaExecucaoModal';

function ProPaywallGate({ titulo, descricao, onOpenCheckout }) {
  return (
    <div className="glass-panel" style={{
      padding: '50px 30px',
      textAlign: 'center',
      maxWidth: '680px',
      margin: '40px auto',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      boxShadow: '0 0 40px rgba(245, 158, 11, 0.08)'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(245, 158, 11, 0.15)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-gold-light)',
        marginBottom: '20px'
      }}>
        <Lock size={30} />
      </div>

      <div style={{ marginBottom: '14px' }}>
        <span className="badge badge-purple" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
          🔒 Recurso Exclusivo Plano Pro
        </span>
      </div>

      <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.3 }}>
        {titulo}
      </h2>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '28px', maxWidth: '580px', margin: '0 auto 28px' }}>
        {descricao}
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '32px',
        fontSize: '0.86rem',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} color="var(--success-light)" /> Sem fidelidade
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} color="var(--success-light)" /> Pix com ativação imediata
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} color="var(--success-light)" /> Cartão em até 12x
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onOpenCheckout({ nome: 'Plano Pro Copilot', preco: '32,90', ciclo: 'anual' })}
          className="btn btn-gold btn-lg"
          style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 800 }}
        >
          <Award size={18} /> Desbloquear Acesso por R$ 32,90/mês
        </button>

        <button
          onClick={() => onOpenCheckout({ nome: 'Plano Mensal', preco: '49,90', ciclo: 'mensal' })}
          className="btn btn-secondary btn-lg"
          style={{ padding: '14px 22px', fontSize: '0.92rem' }}
        >
          Plano Mensal (R$ 49,90/mês)
        </button>
      </div>
    </div>
  );
}

export function StudioApp({ initialTender, empresaAtiva, onTrocarEmpresa, onOpenCheckout, isSubscribed }) {


  // Aba ativa: 'radar', 'raio-x', 'copilot', 'impugnacao', 'calculadora', 'kanban', 'whatsapp', 'watchdog'
  const [activeTab, setActiveTab] = useState('radar');
  
  // Modo de exibição do radar: 'meu_cnpj' ou 'todos'
  const [modoRadar, setModoRadar] = useState(empresaAtiva ? 'meu_cnpj' : 'todos');

  // Lista de editais
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState(initialTender);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [busca, setBusca] = useState('');
  const [ufFiltro, setUfFiltro] = useState('Todos os Estados');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas as Categorias');
  const [apenasMeEpp, setApenasMeEpp] = useState(false);

  // Estado do Copilot Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [guiaModalAberto, setGuiaModalAberto] = useState(false);


  // Estado do Gerador de Impugnações
  const [minutaGerada, setMinutaGerada] = useState('');
  const [copiouMinuta, setCopiouMinuta] = useState(false);

  // Estado da Calculadora de BDI
  const [calcParams, setCalcParams] = useState({
    valorTeto: 250000,
    custoProdutosOuServicos: 140000,
    custoOperacionalFrete: 8000,
    impostoAliquota: 8,
    margemLucroAlvo: 25
  });
  const [resultadoCalc, setResultadoCalc] = useState(null);

  // Estado do Kanban Pipeline
  const [kanbanItems, setKanbanItems] = useState({
    radar: empresaAtiva?.editaisCompativeis?.length > 0 ? empresaAtiva.editaisCompativeis : [],
    analise: [],
    habilitado: [],
    proposta: [],
    vencido: []
  });

  // Sincronizar Kanban imediatamente quando empresaAtiva mudar
  useEffect(() => {
    if (empresaAtiva && empresaAtiva.editaisCompativeis && empresaAtiva.editaisCompativeis.length > 0) {
      setKanbanItems({
        radar: empresaAtiva.editaisCompativeis,
        analise: [],
        habilitado: [],
        proposta: [],
        vencido: []
      });
      setSelectedTender(empresaAtiva.editaisCompativeis[0]);
      setModoRadar('meu_cnpj');
    }
  }, [empresaAtiva]);

  // Carregar editais
  useEffect(() => {
    async function carregar() {
      setIsLoading(true);
      const dados = await fetchLiveTenders({
        termo: busca,
        uf: ufFiltro,
        categoria: categoriaFiltro,
        apenasMeEpp: apenasMeEpp
      });
      setTenders(dados);
      
      if (!selectedTender && dados.length > 0) {
        setSelectedTender(dados[0]);
      }
      
      // Se não houver empresa ativa com editais próprios, inicializa o kanban geral
      if (!empresaAtiva || !empresaAtiva.editaisCompativeis || empresaAtiva.editaisCompativeis.length === 0) {
        setKanbanItems({
          radar: dados.slice(0, 2),
          analise: dados.slice(2, 3),
          habilitado: [],
          proposta: [],
          vencido: []
        });
      }

      setIsLoading(false);
    }
    carregar();
  }, [busca, ufFiltro, categoriaFiltro, apenasMeEpp, empresaAtiva]);


  // Atualizar quando selectedTender mudar
  useEffect(() => {
    if (selectedTender) {
      // Resetar mensagens do Copilot
      setChatMessages([
        {
          id: 'welcome',
          sender: 'ai',
          texto: `Olá! Sou o **Copilot LicitAI**. Li integralmente o edital **${selectedTender.numeroCompra}** da **${selectedTender.orgaoEntidade.razaoSocial}** (${selectedTender.objetoCompra.slice(0, 80)}...).\n\nVocê pode me fazer qualquer pergunta sobre exigências técnicas, prazos de entrega, pegadinhas ocultas ou risco de calote.`,
          fonte: 'Termo de Referência • Base PNCP',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Atualizar valores padrão da calculadora com base no edital
      setCalcParams(prev => ({
        ...prev,
        valorTeto: selectedTender.valorTotalEstimado || 250000,
        custoProdutosOuServicos: Math.round((selectedTender.valorTotalEstimado || 250000) * 0.55),
        custoOperacionalFrete: Math.round((selectedTender.valorTotalEstimado || 250000) * 0.04)
      }));

      // Gerar minuta de impugnação prévia
      setMinutaGerada(gerarMinutaImpugnacao(selectedTender));
    }
  }, [selectedTender]);

  // Recalcular sempre que os parâmetros mudarem
  useEffect(() => {
    const res = calcularViabilidadeEconomica(calcParams);
    setResultadoCalc(res);
  }, [calcParams]);

  // Enviar mensagem no Copilot
  const handleSendMessage = (msg) => {
    const textoMensagem = msg || chatInput;
    if (!textoMensagem.trim() || !selectedTender) return;

    const novaMsgUsuario = {
      id: Date.now(),
      sender: 'user',
      texto: textoMensagem,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, novaMsgUsuario]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = gerarRespostaCopilot(selectedTender, textoMensagem);
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          texto: resp.texto,
          fonte: resp.fonte,
          nivel: resp.nivel,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const moverKanban = (tender, de, para) => {
    setKanbanItems(prev => {
      const novoDe = prev[de].filter(item => item.id !== tender.id);
      const novoPara = [...prev[para], tender];
      return { ...prev, [de]: novoDe, [para]: novoPara };
    });

    if (para === 'vencido') {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  const copiarTextoMinuta = () => {
    navigator.clipboard?.writeText(minutaGerada);
    setCopiouMinuta(true);
    setTimeout(() => setCopiouMinuta(false), 3000);
  };

  const baixarTxtMinuta = () => {
    const blob = new Blob([minutaGerada], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Impugnacao_${selectedTender?.numeroCompra.replace(/[^a-zA-Z0-9]/g, '_') || 'Edital'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '24px',
      minHeight: 'calc(100vh - 80px)'
    }}>
      {/* BARRA SUPERIOR DE CONTEXTO E KPI */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        border: '1px solid rgba(56, 189, 248, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              LicitAI Studio Pro
              <span className="badge badge-success">Sessão Ativa</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Monitorando 1.482 novos editais no PNCP nas últimas 24h
            </div>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volume no Radar</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
              {empresaAtiva ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(empresaAtiva.volumeTotal) : 'R$ 16.627.500,00'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Editais Filtrados</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              {empresaAtiva?.editaisCompativeis ? `${empresaAtiva.editaisCompativeis.length} no seu Perfil` : `${tenders.length} Oportunidades`}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cota Exclusiva ME/EPP</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--success-light)' }}>
              {empresaAtiva?.cotasExclusivas !== undefined ? `${empresaAtiva.cotasExclusivas} Editais` : `${tenders.filter(t => t.exclusivoMeEpp).length} Editais`}
            </div>
          </div>
        </div>
      </div>

      {/* BANNER DE WORKSPACE DO CLIENTE */}
      {empresaAtiva ? (
        <div style={{
          background: 'rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 18px rgba(14, 165, 233, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building size={22} color="var(--primary-light)" />
            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏢 Workspace do Cliente: <span style={{ color: '#fff' }}>{empresaAtiva.razaoSocial}</span>
                <span className="badge badge-success">{empresaAtiva.porte}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                CNPJ: <strong>{empresaAtiva.cnpj}</strong> • CNAE: <i>{empresaAtiva.cnaePrincipal}</i> • {empresaAtiva.editaisCompativeis.length} {empresaAtiva.editaisCompativeis.length === 1 ? 'licitação compatível no radar' : 'licitações compatíveis no radar'}
              </div>
            </div>
          </div>

          <button
            onClick={onTrocarEmpresa}
            className="btn btn-secondary btn-sm"
          >
            Trocar CNPJ / Empresa
          </button>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 18px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            💡 Você está visualizando o banco geral de editais do PNCP. Vincule seu CNPJ para sincronizar com seu ramo.
          </span>
          <button
            onClick={onTrocarEmpresa}
            className="btn btn-outline-primary btn-sm"
          >
            Vincular meu CNPJ
          </button>
        </div>
      )}


      {/* TABS DE NAVEGAÇÃO DA PLATAFORMA */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '20px'
      }}>
        {[
          { id: 'radar', icon: <Search size={16} />, label: 'Radar PNCP (Ao Vivo)' },
          { id: 'raio-x', icon: <Zap size={16} />, label: 'Raio-X 3.0 do Edital' },
          { id: 'copilot', icon: <Bot size={16} />, label: 'Copilot "Pergunte ao Edital"' },
          { id: 'impugnacao', icon: <Shield size={16} />, label: 'Gerador de Impugnações', proOnly: true },
          { id: 'calculadora', icon: <Calculator size={16} />, label: 'Simulador de Margem & BDI' },
          { id: 'kanban', icon: <Layers size={16} />, label: 'Pipeline de Licitações', proOnly: true },
          { id: 'whatsapp', icon: <MessageSquare size={16} />, label: 'WhatsApp 2-Way (IA)', proOnly: true },
          { id: 'watchdog', icon: <Server size={16} />, label: 'Watchdogs & Cloud Ops', proOnly: true }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === tab.id ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
              background: activeTab === tab.id ? 'var(--bg-glass-elevated)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === tab.id ? 'var(--primary-light)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 0 15px var(--primary-glow)' : 'none'
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.proOnly && !isSubscribed && (
              <span style={{
                fontSize: '0.65rem',
                padding: '2px 6px',
                background: 'rgba(245, 158, 11, 0.18)',
                color: 'var(--accent-gold-light)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '4px',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}>
                PRO 🔒
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTEÚDO PRINCIPAL BASEADO NA ABA ATIVA */}

      {/* 1. ABA RADAR PNCP (BUSCA E FEED AO VIVO) */}
      {activeTab === 'radar' && (
        <div>
          {/* Banner de Demonstração (Não Pagante) */}
          {!isSubscribed && (
            <div style={{
              background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.12))',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 22px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold-light)',
                  flexShrink: 0
                }}>
                  <Lock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Radar PNCP em Modo Demonstração (1 Edital Liberado para Teste)</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>Freemium</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    O feed em tempo real de 400+ editais diários do PNCP, inteligência preditiva, kit de CNDs e alertas WhatsApp é restrito a assinantes.
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenCheckout({ nome: 'Plano Pro Copilot', preco: '32,90', ciclo: 'anual' })}
                className="btn btn-gold btn-sm"
                style={{ padding: '10px 18px', fontWeight: 800, whiteSpace: 'nowrap' }}
              >
                <Award size={15} /> Desbloquear Radar Completo (R$ 32,90/mês)
              </button>
            </div>
          )}

          {/* Barra de Filtros */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              alignItems: 'center'
            }}>
              {/* Campo de Busca */}
              <div style={{ position: 'relative', gridColumn: 'span 2' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Pesquisar por objeto (ex: nuvem, carne, manutenção, viaturas)..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)'
                  }}
                />
              </div>

              {/* Filtro UF */}
              <select
                value={ufFiltro}
                onChange={(e) => setUfFiltro(e.target.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {UFS_BRASIL.map(uf => (
                  <option key={uf} value={uf} style={{ background: '#090d16' }}>{uf}</option>
                ))}
              </select>

              {/* Filtro Categoria */}
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {CATEGORIAS_LICITACOES.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#090d16' }}>{cat}</option>
                ))}
              </select>

              {/* Toggle ME/EPP */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: apenasMeEpp ? 'var(--success-light)' : 'var(--text-secondary)'
              }}>
                <input
                  type="checkbox"
                  checked={apenasMeEpp}
                  onChange={(e) => setApenasMeEpp(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--success-light)' }}
                />
                Apenas Exclusivas ME/EPP
              </label>
            </div>
          </div>

          {/* Seletor do Radar: Meu CNPJ x Todos */}
          {empresaAtiva && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Filtro de Exibição: <strong style={{ color: '#fff' }}>{modoRadar === 'meu_cnpj' ? `Apenas editais para ${empresaAtiva.razaoSocial}` : 'Explorando Todo o PNCP'}</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setModoRadar('meu_cnpj')}
                  className={`btn btn-sm ${modoRadar === 'meu_cnpj' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  🎯 Apenas do Meu CNPJ ({empresaAtiva.editaisCompativeis?.length || 0})
                </button>
                <button
                  onClick={() => setModoRadar('todos')}
                  className={`btn btn-sm ${modoRadar === 'todos' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  🌐 Ver Todos do PNCP ({tenders.length})
                </button>
              </div>
            </div>
          )}

          {/* Lista de Editais */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--primary-light)' }}>
              <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
              <div>Sincronizando com o PNCP...</div>
            </div>
          ) : tenders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <AlertTriangle size={36} color="var(--accent-gold-light)" style={{ marginBottom: '12px' }} />
              <h3>Nenhum edital encontrado com estes filtros</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
                Tente limpar os filtros de Estado ou usar palavras-chave mais amplas.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
              {((modoRadar === 'meu_cnpj' && empresaAtiva?.editaisCompativeis && empresaAtiva.editaisCompativeis.length > 0)
                ? empresaAtiva.editaisCompativeis
                : tenders).map((tender, index) => {
                const isSelected = selectedTender?.id === tender.id;
                const isLocked = !isSubscribed && index > 0;

                if (isLocked) {
                  return (
                    <div
                      key={tender.id}
                      className="glass-panel"
                      onClick={() => onOpenCheckout({ nome: 'Plano Pro Copilot', preco: '32,90', ciclo: 'anual' })}
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        minHeight: '360px'
                      }}
                    >
                      {/* Conteúdo Desfocado no Fundo */}
                      <div style={{
                        filter: 'blur(5px)',
                        opacity: 0.28,
                        userSelect: 'none',
                        pointerEvents: 'none'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span className="badge badge-purple">{tender.modalidadeNome}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tender.numeroCompra}</span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', lineHeight: 1.4, marginBottom: '12px' }}>
                          {tender.objetoCompra.length > 120 ? tender.objetoCompra.slice(0, 120) + '...' : tender.objetoCompra}
                        </h4>

                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                          {tender.orgaoEntidade.razaoSocial} ({tender.unidadeOrgao.ufSigla})
                        </div>

                        <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VALOR ESTIMADO</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tender.valorTotalEstimado)}
                          </div>
                        </div>
                      </div>

                      {/* Paywall Overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(7, 10, 18, 0.88)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        textAlign: 'center',
                        zIndex: 10
                      }}>
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-gold-light)',
                          marginBottom: '12px'
                        }}>
                          <Lock size={22} />
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                          Edital Exclusivo Pro
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', maxWidth: '270px', lineHeight: 1.4 }}>
                          Desbloqueie a análise de IA, kit de CNDs e impugnações em tempo real.
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCheckout({ nome: 'Plano Pro Copilot', preco: '32,90', ciclo: 'anual' });
                          }}
                          className="btn btn-gold btn-sm"
                          style={{ width: '100%', maxWidth: '240px', justifyContent: 'center', fontWeight: 700, padding: '10px 14px' }}
                        >
                          🔓 Desbloquear por R$ 32,90/mês
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={tender.id}
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: isSelected ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                      boxShadow: isSelected ? '0 0 20px var(--primary-glow)' : 'var(--shadow-sm)',
                      position: 'relative'
                    }}
                  >
                    {/* Header do Card */}
                    <div>
                      {!isSubscribed && index === 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <span className="badge badge-success" style={{ fontSize: '0.74rem', padding: '4px 8px' }}>
                            ✨ Amostra Gratuita Liberada (Teste todas as ações)
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span className="badge badge-purple">{tender.modalidadeNome}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {tender.numeroCompra}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', lineHeight: 1.4, marginBottom: '12px' }}>
                        {tender.objetoCompra.length > 130 ? tender.objetoCompra.slice(0, 130) + '...' : tender.objetoCompra}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        <Building size={14} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tender.orgaoEntidade.razaoSocial} ({tender.unidadeOrgao.ufSigla})
                        </span>
                      </div>

                      {/* Dados Financeiros e Prazos */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VALOR ESTIMADO</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tender.valorTotalEstimado)}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CHANCE DE VITÓRIA</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--success-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={14} /> {tender.chanceVitoria} ({tender.scoreAderencia}%)
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {tender.exclusivoMeEpp && (
                          <span className="badge badge-success">Exclusivo ME/EPP</span>
                        )}
                        <span className="badge badge-primary">
                          <Clock size={12} /> {tender.diasRestantes} dias restantes
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setSelectedTender(tender);
                          setGuiaModalAberto(true);
                        }}
                        className="btn btn-gold btn-sm"
                        style={{ padding: '8px 10px', fontSize: '0.78rem' }}
                      >
                        <Zap size={13} /> Todas as Ações
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTender(tender);
                          setActiveTab('raio-x');
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '8px 10px', fontSize: '0.78rem' }}
                      >
                        <FileText size={13} /> Raio-X IA
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTender(tender);
                          setActiveTab('copilot');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '8px 10px', fontSize: '0.78rem' }}
                      >
                        <Bot size={13} /> Copilot
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. ABA RAIO-X 3.0 DO EDITAL (DOSSIÊ PROFUNDO) */}
      {activeTab === 'raio-x' && selectedTender && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Coluna da Esquerda: Resumo Executivo & Identificação */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge badge-purple">{selectedTender.modalidadeNome}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Controle PNCP: {selectedTender.numeroControlePNCP}
                </span>
              </div>

              <h2 style={{ fontSize: '1.4rem', lineHeight: 1.35, marginBottom: '14px' }}>
                {selectedTender.objetoCompra}
              </h2>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                🏛️ <strong>Órgão Contratante:</strong> {selectedTender.orgaoEntidade.razaoSocial}<br />
                📍 <strong>Local de Entrega:</strong> {selectedTender.unidadeOrgao.municipioNome}/{selectedTender.unidadeOrgao.ufSigla}<br />
                ⚖️ <strong>Regime Legal:</strong> {selectedTender.amparoLegal}
              </div>

              {/* Indicadores Chave */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>VALOR ESTIMADO TETO</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedTender.valorTotalEstimado)}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>LANCE RECOMENDADO IA</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success-light)' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedTender.analiseIA.lanceSugerido)}
                  </div>
                </div>
              </div>

              {/* Resumo Executivo em Linguagem Direta */}
              <div style={{
                background: 'rgba(14, 165, 233, 0.08)',
                borderLeft: '4px solid var(--primary-light)',
                padding: '16px',
                borderRadius: '0 8px 8px 0',
                marginBottom: '24px'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--primary-light)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} /> Síntese Estratégica da IA
                </div>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
                  {selectedTender.analiseIA.resumoExecutivo}
                </p>
              </div>

              {/* Botão de Destaque: Como Disputar este Edital */}
              <button 
                onClick={() => setGuiaModalAberto(true)}
                className="btn btn-gold" 
                style={{ width: '100%', marginBottom: '12px', padding: '14px', fontSize: '0.95rem' }}
              >
                <Zap size={18} /> Como Disputar este Edital (Guia Passo a Passo)
              </button>

              {/* Botões Rápidos */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setActiveTab('copilot')}
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  <Bot size={16} /> Abrir Chat do Edital
                </button>
                <button 
                  onClick={() => setActiveTab('calculadora')}
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                >
                  <Calculator size={16} /> Simular Margem
                </button>
              </div>
            </div>
          </div>


          {/* Coluna da Direita: Semáforo de Habilitação & Auditoria de Pegadinhas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Semáforo de Habilitação */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="var(--primary-light)" />
                Semáforo de Habilitação Prévia (Documentos Exigidos)
              </div>

              {/* Habilitação Fiscal e Trabalhista */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Regularidade Fiscal & Previdenciária
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedTender.analiseIA.habilitacao.fiscal.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.84rem' }}>{h.item}</span>
                      <span className="badge badge-success">🟢 Válido</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualificação Técnica */}
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Qualificação Técnica & Operacional
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedTender.analiseIA.habilitacao.tecnica.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{h.item}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{h.detalhe}</div>
                      </div>
                      <span className="badge badge-warning">🟡 Exige Atestado</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Auditoria de Pegadinhas e Riscos Críticos */}
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '14px', color: 'var(--danger-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} />
                Auditoria de Riscos & Pegadinhas no Edital
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedTender.analiseIA.pegadinhasERiscos.map((peg, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem', marginBottom: '4px' }}>
                      {peg.titulo}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {peg.descricao}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)', fontWeight: 600 }}>
                      💡 Recomendação: {peg.recomendacao}
                    </div>
                  </div>
                ))}
              </div>

              {selectedTender.analiseIA.potencialImpugnacao?.cabivel && (
                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-gold-light)' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '4px' }}>
                    🚨 Cláusula Passível de Impugnação Imediata
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Detectamos violação da Lei 14.133/2021. Você pode gerar a peça jurídica em 1 clique.
                  </div>
                  <button 
                    onClick={() => setActiveTab('impugnacao')}
                    className="btn btn-gold btn-sm"
                    style={{ width: '100%' }}
                  >
                    Gerar Minuta de Impugnação Agora
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. ABA COPILOT "PERGUNTE AO EDITAL" */}
      {activeTab === 'copilot' && selectedTender && (
        <div className="glass-panel" style={{ height: '700px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header do Chat */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>
                  Copilot Neural: {selectedTender.numeroCompra}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {selectedTender.orgaoEntidade.razaoSocial}
                </div>
              </div>
            </div>

            <span className="badge badge-success">
              <span className="pulse-dot pulse-dot-green"></span>
              Edital Processado (100% Indexado)
            </span>
          </div>

          {/* Área de Mensagens */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '75%',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.04)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.texto}</div>

                  {msg.fonte && (
                    <div style={{
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '0.74rem',
                      color: 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Shield size={12} /> Fonte: {msg.fonte}
                    </div>
                  )}

                  <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontSize: '0.85rem' }}>
                <Bot size={16} /> Consultando artigos do edital e jurisprudência...
              </div>
            )}
          </div>

          {/* Sugestões de Perguntas Rápidas */}
          <div style={{
            padding: '8px 24px',
            background: 'rgba(0,0,0,0.15)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }}>
            {[
              "Exige garantia de proposta prévia?",
              "Qual o prazo de entrega dos produtos?",
              "O órgão tem histórico de pagamento pontual?",
              "Há exigência de amostras antes da vitória?",
              "Existe alguma cláusula abusiva ou impugnável?"
            ].map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Campo de Input */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '12px',
            background: 'rgba(0,0,0,0.3)'
          }}>
            <input
              type="text"
              placeholder="Pergunte qualquer coisa sobre este edital (ex: atestados, penalidades, frete)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              className="btn btn-primary"
            >
              <Send size={16} /> Enviar
            </button>
          </div>
        </div>
      )}

      {/* 4. ABA GERADOR DE IMPUGNAÇÕES E DECLARAÇÕES */}
      {activeTab === 'impugnacao' && (
        !isSubscribed ? (
          <ProPaywallGate
            titulo="Gerador Autônomo de Impugnações (Lei 14.133/21)"
            descricao="Elabore peças jurídicas fundamentadas no Art. 164 da Nova Lei de Licitações e súmulas do TCU em menos de 10 segundos para derrubar exigências abusivas e cláusulas ilegais."
            onOpenCheckout={onOpenCheckout}
          />
        ) : selectedTender ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Painel Esquerdo: Diagnóstico Jurídico */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="var(--accent-gold-light)" />
              Diagnóstico de Ilegalidade (Lei 14.133/2021)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
              A IA audita se o edital contém restrições ilegais à concorrência e redige a peça nos padrões do TCU.
            </p>

            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-gold-light)', fontSize: '0.92rem', marginBottom: '6px' }}>
                {selectedTender.analiseIA.potencialImpugnacao?.cabivel ? '⚠️ Violação Detectada no Edital' : '✅ Conformidade Legal Padrão'}
              </div>
              <p style={{ fontSize: '0.86rem', color: '#fff', lineHeight: 1.5 }}>
                {selectedTender.analiseIA.potencialImpugnacao?.motivo}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setMinutaGerada(gerarMinutaImpugnacao(selectedTender))}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <FileText size={16} /> Minuta de Impugnação ao Edital (Art. 164)
              </button>

              <button
                onClick={() => setMinutaGerada(gerarDeclaracaoME(selectedTender))}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <FileText size={16} /> Declaração de Enquadramento ME/EPP (LC 123)
              </button>
            </div>
          </div>

          {/* Painel Direito: Editor da Peça Jurídica */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Minuta Pronta para Protocolo</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={copiarTextoMinuta} className="btn btn-secondary btn-sm">
                  {copiouMinuta ? <CheckCircle2 size={14} color="var(--success-light)" /> : <Copy size={14} />}
                  {copiouMinuta ? 'Copiado!' : 'Copiar'}
                </button>
                <button onClick={baixarTxtMinuta} className="btn btn-primary btn-sm">
                  <Download size={14} /> Baixar TXT
                </button>
              </div>
            </div>

            <textarea
              value={minutaGerada}
              onChange={(e) => setMinutaGerada(e.target.value)}
              rows={18}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>
        </div>
      ) : null
    )}

      {/* 5. ABA SIMULADOR DE MARGEM & BDI */}
      {activeTab === 'calculadora' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Inputs de Custos */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={20} color="var(--primary-light)" />
              Calculadora de Viabilidade Financeira & Lance Ideal
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Descubra até onde você pode descer o preço na disputa sem tomar prejuízo ou queimar caixa.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Valor Teto Estimado pelo Órgão (R$)
                </label>
                <input
                  type="number"
                  value={calcParams.valorTeto}
                  onChange={(e) => setCalcParams({ ...calcParams, valorTeto: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Custo Total de Aquisição / Matéria-Prima / Equipe (R$)
                </label>
                <input
                  type="number"
                  value={calcParams.custoProdutosOuServicos}
                  onChange={(e) => setCalcParams({ ...calcParams, custoProdutosOuServicos: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Frete e Custos Operacionais Extras (R$)
                </label>
                <input
                  type="number"
                  value={calcParams.custoOperacionalFrete}
                  onChange={(e) => setCalcParams({ ...calcParams, custoOperacionalFrete: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Alíquota Tributária (%)
                  </label>
                  <input
                    type="number"
                    value={calcParams.impostoAliquota}
                    onChange={(e) => setCalcParams({ ...calcParams, impostoAliquota: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Margem Líquida Alvo (%)
                  </label>
                  <input
                    type="number"
                    value={calcParams.margemLucroAlvo}
                    onChange={(e) => setCalcParams({ ...calcParams, margemLucroAlvo: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resultados Econômicos */}
          {resultadoCalc && (
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Análise de Rentabilidade</h3>

                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lance Recomendado (Preço de Venda)</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-light)', letterSpacing: '-0.02em' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultadoCalc.precoIdeal)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Desconto de <strong>{resultadoCalc.descontoSobreTeto}%</strong> sobre o teto do governo
                  </div>
                </div>

                {/* Decomposição do Faturamento */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>(-) Custo dos Insumos + Frete:</span>
                    <span style={{ fontWeight: 600 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultadoCalc.custoTotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>(-) Impostos Estimados:</span>
                    <span style={{ fontWeight: 600 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultadoCalc.impostoValor)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--success-light)' }}>Lucro Líquido no Bolso:</span>
                    <span style={{ fontWeight: 800, color: 'var(--success-light)' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultadoCalc.lucroLiquidoEstimado)} ({resultadoCalc.margemRealPct}%)
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                background: resultadoCalc.viavel ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: resultadoCalc.viavel ? '1px solid var(--success-light)' : '1px solid var(--danger-light)',
                fontSize: '0.88rem',
                fontWeight: 600
              }}>
                {resultadoCalc.alerta}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. ABA PIPELINE DE LICITAÇÕES (KANBAN) */}
      {activeTab === 'kanban' && (
        !isSubscribed ? (
          <ProPaywallGate
            titulo="Pipeline Kanban de Licitações Inteligente"
            descricao="Gerencie todas as suas oportunidades desde a descoberta até a homologação com alertas de prazos fatais, controle de certidões e histórico de lances."
            onOpenCheckout={onOpenCheckout}
          />
        ) : (
          <div>
          {empresaAtiva && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              padding: '12px 18px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                  🎯 Pipeline Sincronizado: <span style={{ color: '#fff' }}>{empresaAtiva.razaoSocial}</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '10px' }}>
                  Monitorando {kanbanItems.radar.length + kanbanItems.analise.length + kanbanItems.habilitado.length + kanbanItems.proposta.length + kanbanItems.vencido.length} {kanbanItems.radar.length + kanbanItems.analise.length + kanbanItems.habilitado.length + kanbanItems.proposta.length + kanbanItems.vencido.length === 1 ? 'edital do seu nicho' : 'editais do seu nicho'}
                </span>
              </div>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            alignItems: 'start'
          }}>
            {[
              { id: 'radar', title: '1. Radar (Descobertos)', cor: 'var(--primary-light)', items: kanbanItems.radar },
              { id: 'analise', title: '2. Em Análise de IA', cor: 'var(--accent-gold-light)', items: kanbanItems.analise },
              { id: 'habilitado', title: '3. Habilitação Validada', cor: '#818cf8', items: kanbanItems.habilitado },
              { id: 'proposta', title: '4. Proposta Enviada', cor: '#38bdf8', items: kanbanItems.proposta },
              { id: 'vencido', title: '5. Homologado & Vencido 🏆', cor: 'var(--success-light)', items: kanbanItems.vencido }
            ].map(col => (
              <div
                key={col.id}
                className="glass-panel"
                style={{
                  padding: '16px',
                  minHeight: '480px',
                  background: 'rgba(10, 16, 30, 0.6)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: col.cor }}>{col.title}</div>
                  <span className="badge badge-primary">{col.items.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {col.items.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '36px 10px',
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                      border: '1px dashed var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      Nenhum edital nesta fase
                    </div>
                  ) : (
                    col.items.map(tender => (
                      <div
                        key={tender.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '12px'
                        }}
                      >
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{tender.numeroCompra}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, margin: '4px 0 8px', lineHeight: 1.3 }}>
                          {tender.objetoCompra.slice(0, 60)}...
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-gold-light)', marginBottom: '8px' }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tender.valorTotalEstimado)}
                        </div>

                        {/* Botões de Ação Direta no Card */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                          <button
                            onClick={() => {
                              setSelectedTender(tender);
                              setGuiaModalAberto(true);
                            }}
                            className="btn btn-gold btn-sm"
                            style={{ flex: 1, fontSize: '0.72rem', padding: '4px 6px' }}
                          >
                            <Zap size={11} /> Ações
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTender(tender);
                              setActiveTab('raio-x');
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1, fontSize: '0.72rem', padding: '4px 6px' }}
                          >
                            <FileText size={11} /> Raio-X
                          </button>
                        </div>

                        {/* Mover para próxima coluna */}
                        {col.id !== 'vencido' && (
                          <button
                            onClick={() => {
                              const ordem = ['radar', 'analise', 'habilitado', 'proposta', 'vencido'];
                              const proxIdx = ordem.indexOf(col.id) + 1;
                              moverKanban(tender, col.id, ordem[proxIdx]);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            Avançar Etapa <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    )}


      {/* 7. ABA WHATSAPP 2-WAY AUTÔNOMO */}
      {activeTab === 'whatsapp' && (
        <WhatsAppHub
          selectedTender={selectedTender}
          onNavigateTab={setActiveTab}
          onOpenCheckout={onOpenCheckout}
        />
      )}

      {/* 8. ABA WATCHDOGS & CLOUD OPS */}
      {activeTab === 'watchdog' && (
        !isSubscribed ? (
          <ProPaywallGate
            titulo="Watchdogs & Cloud Ops em Tempo Real"
            descricao="Monitore robôs de varredura contínua do PNCP, consumo de APIs governamentais e alertas de integridade em servidores dedicados."
            onOpenCheckout={onOpenCheckout}
          />
        ) : (
          <WatchdogOps />
        )
      )}

      {/* MODAL GUIA PASSO A PASSO DE EXECUÇÃO */}
      <GuiaExecucaoModal
        isOpen={guiaModalAberto}
        onClose={() => setGuiaModalAberto(false)}
        edital={selectedTender}
        empresaAtiva={empresaAtiva}
        isSubscribed={isSubscribed}
        onOpenCheckout={onOpenCheckout}
        onSimularMargem={() => {
          setGuiaModalAberto(false);
          setActiveTab('calculadora');
        }}
      />
    </div>
  );
}


