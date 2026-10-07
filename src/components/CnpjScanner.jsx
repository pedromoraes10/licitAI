import React, { useState } from 'react';
import { 
  Building2, Search, Sparkles, CheckCircle2, Shield, ArrowRight, 
  Zap, AlertCircle, Clock, DollarSign, Award, RefreshCw 
} from 'lucide-react';
import { consultarCNPJ, formatarCNPJ, EXEMPLOS_CNPJ } from '../services/cnpjService';

export function CnpjScanner({ onSelectTender, onOpenCheckout, onCompanyScanned, onEnterWorkspaceWithCompany }) {
  const [cnpjInput, setCnpjInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);

  const handleInputChange = (e) => {
    const formatado = formatarCNPJ(e.target.value);
    setCnpjInput(formatado);
    setErro(null);
  };

  const executarConsulta = async (cnpjParaBuscar) => {
    const alvo = cnpjParaBuscar || cnpjInput;
    if (!alvo || alvo.replace(/\D/g, '').length !== 14) {
      setErro('Por favor, informe os 14 dígitos do CNPJ.');
      return;
    }

    setLoading(true);
    setErro(null);
    try {
      const dados = await consultarCNPJ(alvo);
      setResultado(dados);
      if (onCompanyScanned) {
        onCompanyScanned(dados);
      }
    } catch (e) {
      setErro(e.message || 'Erro ao consultar CNPJ. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  const selecionarExemplo = (exemplo) => {
    setCnpjInput(exemplo.cnpj);
    executarConsulta(exemplo.cnpj);
  };

  return (
    <div className="glass-panel" style={{
      maxWidth: '1100px',
      margin: '0 auto 60px',
      padding: '36px',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      position: 'relative'
    }}>
      {/* Header do Scanner de CNPJ */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', marginBottom: '10px' }}>
          <span className="badge badge-primary">
            <Search size={13} /> Consulta Oficial por CNPJ (Receita & PNCP)
          </span>
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '8px' }}>
          Descubra quanto o Governo tem para comprar de <span className="gradient-text">sua empresa</span> hoje
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto' }}>
          Digite o CNPJ da sua empresa. O sistema consulta suas atividades registradas na Receita Federal e cruza em tempo real com editais e compras diretas abertos no PNCP.
        </p>
      </div>

      {/* Input de Busca */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto 16px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Building2 size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="00.000.000/0000-00"
            value={cnpjInput}
            onChange={handleInputChange}
            maxLength={18}
            onKeyDown={(e) => e.key === 'Enter' && executarConsulta()}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid var(--border-light)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              outline: 'none'
            }}
          />
        </div>

        <button
          onClick={() => executarConsulta()}
          disabled={loading}
          className="btn btn-gold"
          style={{ padding: '16px 28px', fontSize: '1rem' }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
              Consultando Receita & PNCP...
            </>
          ) : (
            <>
              <Search size={18} /> Consultar Oportunidades
            </>
          )}
        </button>
      </div>

      {/* Exemplos Rápidos */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '28px'
      }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Exemplos prontos para testar:</span>
        {EXEMPLOS_CNPJ.map((ex, i) => (
          <button
            key={i}
            onClick={() => selecionarExemplo(ex)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Erro */}
      {erro && (
        <div style={{
          maxWidth: '720px',
          margin: '0 auto 20px',
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--danger-light)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--danger-light)',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} /> {erro}
        </div>
      )}

      {/* CARD DE RESULTADO ENRIQUECIDO POR IA */}
      {resultado && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          padding: '28px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Header da Empresa */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-success">
                  <CheckCircle2 size={12} /> CNPJ Ativo na Receita Federal
                </span>
                <span className="badge badge-purple">{resultado.porte}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {resultado.cnpj}
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{resultado.razaoSocial}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                📍 {resultado.municipio}/{resultado.uf} • 📋 Atividade Principal: <i>{resultado.cnaePrincipal}</i>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (onEnterWorkspaceWithCompany) {
                    onEnterWorkspaceWithCompany(resultado, resultado.editaisCompativeis[0]);
                  } else {
                    onSelectTender(resultado.editaisCompativeis[0]);
                  }
                }}
                className="btn btn-primary"
              >
                <ArrowRight size={16} /> Abrir Workspace com este CNPJ ({resultado.editaisCompativeis.length})
              </button>

              <button
                onClick={() => onOpenCheckout({ nome: 'Pro (Licitações & Pregões)', preco: '32,90', ciclo: 'anual' })}
                className="btn btn-gold"
              >
                <Zap size={16} /> Ativar Alertas no WhatsApp
              </button>
            </div>
          </div>


          {/* 3 Métricas de Impacto */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}>
            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volume Aberto em Contratos</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold-light)', margin: '4px 0' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.volumeTotal)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Em editais ativos no seu nicho</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Editais com Cota Reservada</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success-light)', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={22} /> {resultado.cotasExclusivas} Oportunidades
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Grandes empresas proibidas de disputar</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.35)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aderência da Habilitação</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-light)', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={22} /> 96% Match
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>CNDs compatíveis com os editais</div>
            </div>
          </div>

          {/* Editais Recomendados para este CNPJ */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
              Top Editais em Aberto com Alta Chance de Vitória para seu CNPJ:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {resultado.editaisCompativeis.slice(0, 2).map((tender) => (
                <div
                  key={tender.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-purple">{tender.modalidadeNome}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tender.numeroCompra}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', lineHeight: 1.35 }}>
                      {tender.objetoCompra.slice(0, 95)}...
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      🏛️ {tender.orgaoEntidade.razaoSocial} ({tender.unidadeOrgao.ufSigla})
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>VALOR ESTIMADO</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tender.valorTotalEstimado)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onEnterWorkspaceWithCompany) {
                          onEnterWorkspaceWithCompany(resultado, tender);
                        } else {
                          onSelectTender(tender);
                        }
                      }}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Ver Raio-X <ArrowRight size={13} />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
