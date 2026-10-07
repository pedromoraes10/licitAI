import React, { useState } from 'react';
import { 
  Sparkles, Zap, Shield, TrendingUp, CheckCircle2, ArrowRight, 
  Search, AlertTriangle, FileText, Bot, DollarSign, Clock, MessageSquare, 
  HelpCircle, ChevronDown, Check, X, ShieldAlert, Award, ShieldCheck
} from 'lucide-react';
import { FEATURED_TENDERS } from '../services/mockTenders';
import { CnpjScanner } from './CnpjScanner';

export function LandingPage({ 
  onSelectTender, 
  onOpenCheckout, 
  onExploreStudio,
  onCompanyScanned,
  onEnterWorkspaceWithCompany,
  onOpenPaymentSettings
}) {

  const [categoriaAtiva, setCategoriaAtiva] = useState("Tecnologia & TI");
  const [isScanning, setIsScanning] = useState(false);
  const [faqAberto, setFaqAberto] = useState(null);

  // Encontrar o edital de demonstração para a categoria ativa
  const editalDemo = FEATURED_TENDERS.find(t => t.categoria === categoriaAtiva) || FEATURED_TENDERS[0];

  const trocarCategoria = (cat) => {
    setIsScanning(true);
    setCategoriaAtiva(cat);
    setTimeout(() => {
      setIsScanning(false);
    }, 700);
  };

  const [cicloFaturamento, setCicloFaturamento] = useState('anual'); // 'mensal' ou 'anual'

  const planos = [
    {
      id: 'start',
      nome: 'Start (Dispensas • MEI, ME & EPP)',
      precoMensal: '29,90',
      precoAnual: '19,90',
      totalAnual: '238,80',
      economia: 'Economize 33% no plano anual (R$ 120/ano OFF)',
      periodo: '/mês',
      descricao: 'Perfeito para MEI, ME e EPP que querem aproveitar seu tratamento diferenciado em relação a grandes empresas e começar a contratar com o governo em compras diretas rápidas de até R$ 120 mil.',
      destaque: false,
      recursos: [
        'Como critério de desempate, MEI, ME e EPP têm preferência legal na contratação',
        'Monitoramento de Dispensas Eletrônicas em todo o Brasil (até R$ 120 mil)',
        'Cota Reservada & Exclusiva de itens para MEI, ME e EPP (LC 123/06)',
        '1 nicho de atuação e palavras-chave configuradas',
        'Raio-X de editais com semáforo de habilitação',
        'Alertas diários matinais no WhatsApp e e-mail',
        'Central de Emissão das 4 certidões gratuitas com links diretos',
        'Gerador de Kit de Declarações Obrigatórias com 1 clique'
      ]
    },
    {
      id: 'pro',
      nome: 'Pro (Licitações & Pregões)',
      precoMensal: '49,90',
      precoAnual: '32,90',
      totalAnual: '394,80',
      economia: 'Economize 34% no plano anual (R$ 204/ano OFF)',
      periodo: '/mês',
      descricao: 'A solução completa para empresas disputarem pregões e concorrências de qualquer porte com auditoria jurídica avançada e alertas diários.',
      destaque: true,
      badge: 'MAIS ESCOLHIDO • 34% OFF NO ANUAL',
      recursos: [
        'Acesso irrestrito a TODOS os Pregões e Concorrências do PNCP',
        'Até 5 nichos de mercado e palavras-chave simultâneas',
        'Auditoria e Análise Técnica Ilimitada de Editais',
        'Auditor de Pegadinhas e Cláusulas Abusivas no Edital',
        'Assistente de Dúvidas "Pergunte ao Edital" em tempo real',
        'Gerador de Petições de Impugnação (Lei 14.133/21) com 1 clique',
        'Gerador de Minutas de Recurso Administrativo pós-disputa',
        'Simulador de Margem Líquida & Trava de Stop-Loss',
        'Alertas matinais diários das melhores oportunidades no WhatsApp'
      ]
    }
  ];


  const faqs = [
    {
      q: "Como funciona a preferência legal e o tratamento diferenciado para MEI, ME e EPP?",
      a: "Pela Lei Complementar nº 123/2006 e pela Nova Lei nº 14.133/2021, o governo é obrigado a dar tratamento favorecido para MEI, Microempresa (ME) e Empresa de Pequeno Porte (EPP). Isso inclui: (1) Preferência legal de contratação em caso de empate ficto com grandes empresas (oferta de lance final para cobrir a grande empresa); (2) Licitações de até R$ 80.000 exclusivas para ME/EPP; (3) Compras diretas e dispensas eletrônicas rápidas de até R$ 120.000; e (4) Prazo de 5 dias úteis para sanar pendências fiscais após vencer. O LicitAI destaca e filtra essas oportunidades exclusivas automaticamente!"
    },
    {
      q: "Preciso ter conhecimento jurídico para usar o LicitAI?",
      a: "Não! Esse é exatamente o maior diferencial do LicitAI. A inteligência artificial traduz o 'juridiquês' dos editais para uma linguagem empresarial simples e direta. Ela mostra exatamente quais certidões você precisa emitir, se há risco de multa abusiva e se a licitação vale a pena financeiramente para o seu porte."
    },
    {
      q: "De onde vêm os editais e como funciona a atualização?",
      a: "O LicitAI consome diretamente os dados oficiais do PNCP (Portal Nacional de Contratações Públicas), regulamentado pela Nova Lei de Licitações (Lei nº 14.133/2021), além de comprasnet, BEC e portais estaduais. As oportunidades são indexadas e enriquecidas em tempo real."
    },
    {
      q: "O que é o 'Auditor de Pegadinhas'?",
      a: "Muitos editais escondem cláusulas traiçoeiras em anexos técnicos de 150 páginas — como exigência de atestados desproporcionais, garantias financeiras em 48 horas ou multas por atraso que quebram uma empresa. Nosso motor de IA analisa minuciosamente cada parágrafo e acende um sinal vermelho com recomendações estratégicas antes que você gaste tempo montando a proposta."
    },
    {
      q: "Como funciona o cancelamento?",
      a: "O cancelamento é 100% virtual, sem pegadinhas ou fidelidade obrigatória. Você pode pausar ou cancelar sua assinatura com apenas um clique diretamente no painel do usuário a qualquer momento."
    }
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* HERO SECTION */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '80px 24px 60px',
        textAlign: 'center'
      }}>
        {/* Pill Badge */}
        <div style={{ display: 'inline-flex', marginBottom: '24px' }}>
          <div className="glass-pill" style={{ padding: '6px 16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <span className="pulse-dot pulse-dot-green"></span>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              Nova Lei 14.133/21 • Inteligência em Contratações Públicas para MEI, ME e EPP
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
          lineHeight: 1.12,
          fontWeight: 800,
          maxWidth: '1050px',
          margin: '0 auto 24px',
          letterSpacing: '-0.03em'
        }}>
          Encontre licitações lucrativas, audite riscos do edital e <span className="gradient-text">venda para o governo</span> com segurança.
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
          color: 'var(--text-secondary)',
          maxWidth: '820px',
          margin: '0 auto 40px',
          lineHeight: 1.6
        }}>
          Elimine a burocracia de editais de 150 páginas. O <strong style={{ color: '#fff' }}>LicitAI</strong> verifica requisitos de habilitação, audita pegadinhas e cláusulas abusivas, calcula sua margem real e notifica oportunidades do seu nicho no WhatsApp.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '48px'
        }}>
          <button 
            onClick={() => onOpenCheckout(planos[1])}
            className="btn btn-gold btn-lg"
            style={{ fontSize: '1.08rem', padding: '16px 36px' }}
          >
            <Zap size={20} /> Conhecer Planos a partir de R$ 29,90
          </button>

          <button 
            onClick={onExploreStudio}
            className="btn btn-secondary btn-lg"
            style={{ fontSize: '1.08rem', padding: '16px 32px' }}
          >
            <Search size={18} /> Explorar Radar de Licitações <ArrowRight size={18} />
          </button>
        </div>

        {/* Quick Social Proof */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          color: 'var(--text-muted)',
          fontSize: '0.86rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--success-light)" />
            <span>Sem fidelidade ou carência</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--success-light)" />
            <span>Base Oficial PNCP (Dados em Aberto)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--success-light)" />
            <span>Configuração em menos de 2 minutos</span>
          </div>
        </div>
      </section>

      {/* ONBOARDING NEURAL: SCANNER POR CNPJ (VALOR IMEDIATO) */}
      <section style={{ padding: '0 24px' }}>
        <CnpjScanner 
          onSelectTender={onSelectTender} 
          onOpenCheckout={onOpenCheckout} 
          onCompanyScanned={onCompanyScanned}
          onEnterWorkspaceWithCompany={onEnterWorkspaceWithCompany}
        />
      </section>


      {/* LIVE INTERACTIVE SCANNER (O TEST-DRIVE INSTANTÂNEO) */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto 100px',
        padding: '0 24px'
      }}>
        <div className="glass-panel" style={{
          padding: '36px',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Header do Scanner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-primary">
                  <FileText size={13} /> Demonstração da Auditoria de Edital
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Selecione seu segmento e veja a análise técnica:
                </span>
              </div>
              <h2 style={{ fontSize: '1.6rem' }}>
                Auditoria de Edital & Conformidade Legal (Lei 14.133/21)
              </h2>
            </div>

            <button 
              onClick={() => onSelectTender(editalDemo)}
              className="btn btn-outline-primary btn-sm"
            >
              Abrir Edital no Radar Completo <ArrowRight size={15} />
            </button>
          </div>

          {/* Categorias Interativas */}
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '24px'
          }}>
            {[
              { id: "Tecnologia & TI", icon: "💻", label: "Tecnologia & TI" },
              { id: "Alimentos & Merenda", icon: "🍎", label: "Alimentos & PNAE" },
              { id: "Engenharia & Obras", icon: "🏗️", label: "Engenharia & Obras" },
              { id: "Equipamentos & Suprimentos", icon: "📦", label: "Equipamentos (Dispensa)" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => trocarCategoria(cat.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: categoriaAtiva === cat.id ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                  background: categoriaAtiva === cat.id ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: categoriaAtiva === cat.id ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Card do Edital Dissecado */}
          {isScanning ? (
            <div style={{
              minHeight: '360px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '3px solid rgba(56, 189, 248, 0.2)',
                borderTopColor: 'var(--primary-light)',
                animation: 'spin 0.8s linear infinite'
              }} />
              <div style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '1rem' }}>
                Escaneando Termo de Referência e Anexos (PNCP)...
              </div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              alignItems: 'start'
            }}>
              {/* Coluna Esquerda: Informações Gerais & Score */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="badge badge-purple">{editalDemo.modalidadeNome}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{editalDemo.numeroCompra}</span>
                </div>

                <h3 style={{ fontSize: '1.18rem', marginBottom: '10px', lineHeight: 1.4 }}>
                  {editalDemo.objetoCompra}
                </h3>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                  🏛️ <strong>Órgão:</strong> {editalDemo.orgaoEntidade.razaoSocial} ({editalDemo.unidadeOrgao.ufSigla})
                </div>

                {/* Métricas do Edital */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Valor Estimado</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(editalDemo.valorTotalEstimado)}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score de Aderência</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={18} /> {editalDemo.scoreAderencia}%
                    </div>
                  </div>
                </div>

                {/* Resumo Executivo da IA */}
                <div style={{
                  background: 'rgba(14, 165, 233, 0.08)',
                  borderLeft: '3px solid var(--primary-light)',
                  padding: '12px 14px',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '0.88rem',
                  color: 'var(--text-primary)'
                }}>
                  <strong style={{ color: 'var(--primary-light)', display: 'block', marginBottom: '4px' }}>
                    💡 Síntese Estratégica da IA:
                  </strong>
                  {editalDemo.analiseIA.resumoExecutivo}
                </div>
              </div>

              {/* Coluna Direita: Auditoria de Pegadinhas e Semáforo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Semáforo de Habilitação */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={18} color="var(--primary-light)" />
                    Semáforo de Habilitação Prévia (Lei 14.133/21)
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.84rem' }}>Regularidade Fiscal & Trabalhista (CNDs)</span>
                      <span className="badge badge-success">🟢 Aprovado</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.84rem' }}>Qualificação Técnica (Atestados)</span>
                      <span className="badge badge-warning">🟡 Exige Atestado</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.84rem' }}>Enquadramento ME/EPP ou Porte Geral</span>
                      <span className="badge badge-success">
                        {editalDemo.exclusivoMeEpp ? '🟢 100% Exclusivo ME/EPP' : '🟢 Ampla Disputa'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pegadinhas Detectadas */}
                <div style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  border: '1px solid rgba(239, 68, 68, 0.25)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px', color: 'var(--danger-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={18} />
                    Auditoria de Pegadinhas no Edital
                  </div>

                  {editalDemo.analiseIA.pegadinhasERiscos.slice(0, 1).map((peg, idx) => (
                    <div key={idx} style={{ fontSize: '0.86rem' }}>
                      <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>
                        {peg.titulo}
                      </strong>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {peg.descricao}
                      </p>
                      <div style={{ color: 'var(--accent-gold-light)', fontSize: '0.8rem', fontWeight: 600 }}>
                        🛡️ Recomendação LicitAI: {peg.recomendacao}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botão de Test-Drive Direto */}
                <button
                  onClick={() => onSelectTender(editalDemo)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px' }}
                >
                  <FileText size={18} /> Abrir Análise Completa no Radar
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* COMPARAÇÃO: MERCADO ANTIGO VS LICITAI */}
      <section style={{
        maxWidth: '1100px',
        margin: '0 auto 100px',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-warning" style={{ marginBottom: '12px' }}>
            A Diferença é Brutal
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
            Por que as ferramentas antigas fazem sua empresa perder dinheiro?
          </h2>
        </div>

        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(0,0,0,0.3)',
            padding: '18px 24px',
            fontWeight: 700,
            fontSize: '0.92rem'
          }}>
            <div>Recurso ou Capacidade</div>
            <div style={{ color: 'var(--text-muted)' }}>Plataformas Tradicionais</div>
            <div style={{ color: 'var(--primary-light)' }}>LicitAI (Plataforma Especializada)</div>
          </div>

          {[
            {
              item: "Análise do PDF do Edital",
              velho: "Manda 1 link e você lê 150 páginas sozinho",
              licitai: "Dossiê Executivo estruturado com semáforo de habilitação"
            },
            {
              item: "Detecção de Pegadinhas e Riscos",
              velho: "Zero. Você descobre na hora da inabilitação",
              licitai: "Auditoria automática de multas e cláusulas ilegais"
            },
            {
              item: "Tira-Dúvidas sobre o Edital",
              velho: "Contratar advogado ou esperar pedido de esclarecimento",
              licitai: "Assistente de Dúvidas: localize exigências com a página exata"
            },
            {
              item: "Impugnação de Edital Restritivo",
              velho: "Pagar R$ 1.500 a R$ 4.000 para redigir petição",
              licitai: "Gera minuta pronta embasada na Lei 14.133 em 1 clique"
            },
            {
              item: "Cálculo de Margem & BDI",
              velho: "Planilhas de Excel quebradas e risco de prejuízo",
              licitai: "Simulador com lance ideal e lucro líquido em tempo real"
            }
          ].map((row, idx) => (
            <div 
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                padding: '18px 24px',
                borderBottom: idx < 4 ? '1px solid var(--border-subtle)' : 'none',
                alignItems: 'center',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ fontWeight: 600 }}>{row.item}</div>
              <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <X size={16} /> {row.velho}
              </div>
              <div style={{ color: 'var(--success-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> {row.licitai}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLANOS E PREÇOS (CHECKOUT 100% VIRTUAL) */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto 100px',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge badge-success" style={{ marginBottom: '12px' }}>
            Planos & Preços Transparentes
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
            Investimento que se paga com <span className="gradient-text">1 único contrato</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
            Economize dezenas de horas da sua equipe e dispute apenas licitações lucrativas e com alta probabilidade de vitória.
          </p>
        </div>

        {/* Toggle Mensal x Anual */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '48px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setCicloFaturamento('mensal')}
            style={{
              padding: '10px 22px',
              borderRadius: 'var(--radius-full)',
              border: cicloFaturamento === 'mensal' ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
              background: cicloFaturamento === 'mensal' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: cicloFaturamento === 'mensal' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Cobrança Mensal
          </button>

          <button
            onClick={() => setCicloFaturamento('anual')}
            style={{
              padding: '10px 22px',
              borderRadius: 'var(--radius-full)',
              border: cicloFaturamento === 'anual' ? '1px solid var(--accent-gold-light)' : '1px solid var(--border-subtle)',
              background: cicloFaturamento === 'anual' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: cicloFaturamento === 'anual' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Plano Anual</span>
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              color: '#000',
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)'
            }}>
              2 MESES GRÁTIS 🔥
            </span>
          </button>
        </div>

        {/* Banner de Destaque Estratégico: MEI, ME e EPP */}
        <div style={{
          maxWidth: '860px',
          margin: '0 auto 36px',
          padding: '16px 22px',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'left'
        }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            padding: '10px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#fff', marginBottom: '2px' }}>
              Vantagem Legal Obrigatória (LC 123/06 & Lei 14.133/21)
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              <strong>Como critério de desempate, MEI, ME e EPP têm preferência por lei na contratação</strong> frente a grandes corporações, além de disputas exclusivas de até R$ 80 mil e compras diretas de até R$ 120 mil. O LicitAI foi desenhado para você explorar essa vantagem ao máximo!
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          maxWidth: '860px',
          margin: '0 auto',
          alignItems: 'stretch'
        }}>
          {planos.map((plano) => {
            const precoExibido = cicloFaturamento === 'anual' ? plano.precoAnual : plano.precoMensal;
            return (
              <div
                key={plano.id}
                className="glass-panel"
                style={{
                  padding: '36px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  border: plano.destaque ? '2px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                  boxShadow: plano.destaque ? '0 15px 40px var(--primary-glow)' : 'var(--shadow-md)',
                  transform: plano.destaque ? 'scale(1.02)' : 'none'
                }}
              >
                {plano.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--primary-gradient)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    letterSpacing: '0.05em',
                    padding: '4px 16px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 4px 12px var(--primary-glow)',
                    whiteSpace: 'nowrap'
                  }}>
                    {plano.badge}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{plano.nome}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', minHeight: '44px', marginBottom: '24px' }}>
                    {plano.descricao}
                  </p>

                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>R$ </span>
                    <span style={{ fontSize: '3.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
                      {precoExibido}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/mês</span>

                    {cicloFaturamento === 'anual' && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--success-light)', fontWeight: 600, marginTop: '4px' }}>
                        Cobrado R$ {plano.totalAnual}/ano • {plano.economia}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {plano.recursos.map((rec, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem' }}>
                        <CheckCircle2 size={16} color="var(--success-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: 'var(--text-primary)' }}>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onOpenCheckout({
                    ...plano,
                    preco: precoExibido,
                    ciclo: cicloFaturamento,
                    totalAnual: plano.totalAnual
                  })}
                  className={`btn ${plano.destaque ? 'btn-gold' : 'btn-secondary'} btn-lg`}
                  style={{ width: '100%' }}
                >
                  {plano.destaque ? <Zap size={18} /> : null} Assinar {plano.nome.split(' ')[0]} {cicloFaturamento === 'anual' ? '(Anual)' : ''}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Perguntas Frequentes</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Tire todas as dúvidas sobre o modelo 100% digital do LicitAI.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="glass-panel"
              style={{
                padding: '20px 24px',
                cursor: 'pointer'
              }}
              onClick={() => setFaqAberto(faqAberto === idx ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{faq.q}</span>
                <ChevronDown 
                  size={18} 
                  style={{ 
                    transform: faqAberto === idx ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                    color: 'var(--primary-light)'
                  }} 
                />
              </div>

              {faqAberto === idx && (
                <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
