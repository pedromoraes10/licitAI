import React, { useState } from 'react';
import { 
  CheckCircle2, Download, ExternalLink, ShieldCheck, Zap, 
  Clock, ArrowRight, FileText, AlertTriangle, X, Copy, Check, Scale, DollarSign, Award
} from 'lucide-react';
import { 
  gerarKitCompletoDeclaracoes, 
  gerarMinutaImpugnacao, 
  gerarMinutaRecursoAdministrativo, 
  gerarPropostaComercialFormatada 
} from '../services/aiEngine';

export function GuiaExecucaoModal({ isOpen, onClose, edital, empresaAtiva, onSimularMargem, isSubscribed, onOpenCheckout }) {
  const [passoAtivo, setPassoAtivo] = useState(1);
  const [copiouUasg, setCopiouUasg] = useState(false);
  const [declaracaoBaixada, setDeclaracaoBaixada] = useState(false);
  const [propostaBaixada, setPropostaBaixada] = useState(false);
  const [minutaCopiada, setMinutaCopiada] = useState(false);
  const [recursoCopiado, setRecursoCopiado] = useState(false);

  // Margem e Preço customizado
  const [valorLanceCustom, setValorLanceCustom] = useState(edital?.analiseIA?.lanceSugerido || 0);

  if (!isOpen || !edital) return null;

  const razaoSocial = empresaAtiva?.razaoSocial || "SUA EMPRESA TECNOLOGIA E SERVIÇOS LTDA";
  const cnpj = empresaAtiva?.cnpj || "00.000.000/0001-00";

  const copiarDadosLicitacao = () => {
    const texto = `Órgão: ${edital.orgaoEntidade.razaoSocial}\nProcesso: ${edital.processo || edital.numeroCompra}\nPNCP: ${edital.numeroControlePNCP}\nObjeto: ${edital.objetoCompra}`;
    navigator.clipboard?.writeText(texto);
    setCopiouUasg(true);
    setTimeout(() => setCopiouUasg(false), 2500);
  };

  const baixarDeclaracoes = () => {
    const conteudo = gerarKitCompletoDeclaracoes(edital, { razaoSocial, cnpj });
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kit_Declaracoes_Lei14133_${cnpj.replace(/\D/g, '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDeclaracaoBaixada(true);
    setTimeout(() => setDeclaracaoBaixada(false), 3000);
  };

  const baixarPropostaComercial = () => {
    const conteudo = gerarPropostaComercialFormatada(edital, { razaoSocial, cnpj }, valorLanceCustom || edital.analiseIA?.lanceSugerido);
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposta_Comercial_${edital.numeroCompra.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setPropostaBaixada(true);
    setTimeout(() => setPropostaBaixada(false), 3000);
  };

  const copiarImpugnacao = () => {
    const minuta = gerarMinutaImpugnacao(edital, { razaoSocial, cnpj });
    navigator.clipboard?.writeText(minuta);
    setMinutaCopiada(true);
    setTimeout(() => setMinutaCopiada(false), 3000);
  };

  const copiarRecurso = () => {
    const recurso = gerarMinutaRecursoAdministrativo(edital, { razaoSocial, cnpj });
    navigator.clipboard?.writeText(recurso);
    setRecursoCopiado(true);
    setTimeout(() => setRecursoCopiado(false), 3000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 8, 16, 0.92)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '880px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9)',
        maxHeight: '94vh',
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

        {/* Header do Guia */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-success">
              <Zap size={13} /> Centro de Ações Integrado • Lei 14.133/21
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Empresa ativa: <strong>{razaoSocial}</strong> ({cnpj})
            </span>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            Central de Ações para Disputar: <span className="gradient-text">{edital.numeroCompra}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
            Todas as ferramentas necessárias para habilitar sua empresa, precificar, cadastrar e vencer a disputa.
          </p>

          {!isSubscribed && (
            <div style={{
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(99, 102, 241, 0.15))',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              marginTop: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '0.84rem', color: '#fff' }}>
                ⭐ <strong>Amostra Gratuita Liberada:</strong> Você pode testar e baixar os documentos desta licitação. Para gerar peças e propostas ilimitadas em todos os pregões do Brasil, assine o Pro.
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenCheckout) {
                    onOpenCheckout({ nome: 'Plano Pro Copilot', preco: '32,90', ciclo: 'anual' });
                  }
                }}
                className="btn btn-gold btn-sm"
                style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap', fontWeight: 700 }}
              >
                Assinar Pro (R$ 32,90/mês)
              </button>
            </div>
          )}
        </div>

        {/* 6 Ações Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '6px',
          marginBottom: '24px'
        }}>
          {[
            { num: 1, icone: ShieldCheck, titulo: '1. CNDs' },
            { num: 2, icone: FileText, titulo: '2. Declarações' },
            { num: 3, icone: Scale, titulo: '3. Impugnação' },
            { num: 4, icone: DollarSign, titulo: '4. Stop-Loss' },
            { num: 5, icone: ExternalLink, titulo: '5. Sala Oficial' },
            { num: 6, icone: Award, titulo: '6. Recurso' }
          ].map((p) => {
            const Icone = p.icone;
            return (
              <button
                key={p.num}
                onClick={() => setPassoAtivo(p.num)}
                style={{
                  padding: '10px 6px',
                  borderRadius: 'var(--radius-sm)',
                  border: passoAtivo === p.num ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                  background: passoAtivo === p.num ? 'rgba(14, 165, 233, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                  color: passoAtivo === p.num ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icone size={16} color={passoAtivo === p.num ? 'var(--primary-light)' : 'var(--text-muted)'} />
                <span>{p.titulo}</span>
              </button>
            );
          })}
        </div>

        {/* CONTEÚDO DE CADA AÇÃO */}

        {/* AÇÃO 1: CERTIDÕES FISCAIS GRATUITAS */}
        {passoAtivo === 1 && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="var(--success-light)" />
                Emissão Imediata das 4 Certidões Obrigatórias
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '16px' }}>
                Nenhuma empresa é habilitada sem estas 4 certidões. Todas são <strong>100% gratuitas</strong> e emitidas online em 30 segundos com seu CNPJ:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    nome: "CND Federal e Previdenciária Conjunta",
                    orgao: "Receita Federal do Brasil / PGFN",
                    link: "https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/pj/emitir"
                  },
                  {
                    nome: "Certificado de Regularidade do FGTS (CRF)",
                    orgao: "Caixa Econômica Federal",
                    link: "https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf"
                  },
                  {
                    nome: "Certidão Negativa de Débitos Trabalhistas (CNDT)",
                    orgao: "Tribunal Superior do Trabalho (TST)",
                    link: "https://cndt-certidao.tst.jus.br/gerarCertidao.faces"
                  },
                  {
                    nome: "Certidão Negativa de Falência e Recuperação Judicial",
                    orgao: "Tribunal de Justiça do seu Estado",
                    link: "https://www.tjsp.jus.br/Certidoes/Certidoes/PrimeiraInstancia"
                  }
                ].map((cnd, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>{cnd.nome}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cnd.orgao}</div>
                    </div>

                    <a
                      href={cnd.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ textDecoration: 'none' }}
                    >
                      Emitir Grátis <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setPassoAtivo(2)} className="btn btn-primary">
                Avançar: Gerar Declarações Obrigatórias <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* AÇÃO 2: KIT DE DECLARAÇÕES OBRIGATÓRIAS */}
        {passoAtivo === 2 && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--primary-light)" />
                Kit Oficial de Declarações Obrigatórias (1-Clique)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '16px' }}>
                O LicitAI consolidou as 5 declarações exigidas pela Lei 14.133/2021 preenchidas com seus dados:
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                <div>✅ <strong>1. Declaração ME/EPP:</strong> Garante prioridade de contratação e empate ficto (LC 123/06).</div>
                <div>✅ <strong>2. Declaração de Fato Impeditivo:</strong> Exigida pelo art. 14 da Lei 14.133/21.</div>
                <div>✅ <strong>3. Declaração do Menor (CF Art. 7º, XXXIII):</strong> Obrigatória em 100% dos editais.</div>
                <div>✅ <strong>4. Elaboração Independente de Proposta:</strong> Certifica inexistência de conluio.</div>
                <div>✅ <strong>5. Reserva de Cargos para PCDs:</strong> Art. 63, IV da Lei 14.133/21.</div>
              </div>

              <button
                onClick={baixarDeclaracoes}
                className="btn btn-gold"
                style={{ width: '100%', padding: '14px' }}
              >
                {declaracaoBaixada ? (
                  <>
                    <CheckCircle2 size={18} /> Arquivo Baixado (.TXT / Pronto para Assinar via Gov.br)!
                  </>
                ) : (
                  <>
                    <Download size={18} /> Baixar Kit Completo com as 5 Declarações Preenchidas
                  </>
                )}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setPassoAtivo(1)} className="btn btn-secondary">
                Voltar
              </button>
              <button onClick={() => setPassoAtivo(3)} className="btn btn-primary">
                Avançar: Impugnação / Esclarecimento <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* AÇÃO 3: IMPUGNAÇÃO DO EDITAL & ESCLARECIMENTO */}
        {passoAtivo === 3 && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} color="var(--accent-gold-light)" />
                Impugnação ao Edital Fundamentada (Art. 164, Lei 14.133/21)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '16px' }}>
                Se o edital tiver exigências ilegais, marcas fechadas ou prazos abusivos, protocole a petição gerada abaixo até <strong>3 dias úteis antes</strong> da sessão para obrigar a prefeitura/órgão a retificar o edital:
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)',
                maxHeight: '180px',
                overflowY: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-line'
              }}>
                {gerarMinutaImpugnacao(edital, { razaoSocial, cnpj })}
              </div>

              <button
                onClick={copiarImpugnacao}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {minutaCopiada ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {minutaCopiada ? 'Minuta Copiada para a Área de Transferência!' : 'Copiar Petição Completa de Impugnação'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setPassoAtivo(2)} className="btn btn-secondary">
                Voltar
              </button>
              <button onClick={() => setPassoAtivo(4)} className="btn btn-primary">
                Avançar: Precificação e Stop-Loss <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* AÇÃO 4: PRECIFICAÇÃO, BDI & STOP-LOSS */}
        {passoAtivo === 4 && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={20} color="var(--success-light)" />
                Cálculo de Margem & Trava Stop-Loss
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '16px' }}>
                Defina o valor mínimo que sua empresa pode ofertar sem operar no prejuízo durante a fase de lances:
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>VALOR ESTIMADO DO EDITAL (TETO)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(edital.valorTotalEstimado)}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>LANCE MÍNIMO SEGURO (STOP-LOSS)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-light)' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(edital.analiseIA.lanceSugerido)}
                  </div>
                </div>
              </div>

              <button
                onClick={baixarPropostaComercial}
                className="btn btn-gold"
                style={{ width: '100%', padding: '12px' }}
              >
                {propostaBaixada ? (
                  <>
                    <CheckCircle2 size={16} /> Proposta Comercial Baixada (.TXT)!
                  </>
                ) : (
                  <>
                    <Download size={16} /> Baixar Proposta Comercial Oficial Preenchida
                  </>
                )}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setPassoAtivo(3)} className="btn btn-secondary">
                Voltar
              </button>
              <button onClick={() => setPassoAtivo(5)} className="btn btn-primary">
                Avançar: Sala Oficial do Pregão <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* AÇÃO 5: SALA OFICIAL DO PREGÃO (ENVIAR PROPOSTA) */}
        {passoAtivo === 5 && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={20} color="var(--primary-light)" />
                Cadastrar Proposta no Portal Oficial
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '16px' }}>
                A disputa oficial acontece no portal governamental indicado abaixo. Copie as credenciais da licitação e envie seus arquivos:
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PORTAL DE DISPUTA</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                    {edital.linkSistemaOrigem?.includes('bec') ? 'BEC-SP (Bolsa Eletrônica de SP)' : 'Compras.gov.br (Antigo Comprasnet)'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Processo: <strong>{edital.numeroCompra}</strong> • PNCP: {edital.numeroControlePNCP}
                  </div>
                </div>

                <button onClick={copiarDadosLicitacao} className="btn btn-secondary btn-sm">
                  {copiouUasg ? <Check size={14} color="var(--success-light)" /> : <Copy size={14} />}
                  {copiouUasg ? 'Copiado!' : 'Copiar Dados'}
                </button>
              </div>

              <a
                href={edital.linkSistemaOrigem || "https://comprasnet.gov.br"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <ExternalLink size={18} /> Entrar na Sala Oficial do Pregão no Governo
              </a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setPassoAtivo(4)} className="btn btn-secondary">
                Voltar
              </button>
              <button onClick={() => setPassoAtivo(6)} className="btn btn-primary">
                Avançar: Recurso Contra Concorrente <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* AÇÃO 6: RECURSO ADMINISTRATIVO CONTRA CONCORRENTE */}
        {passoAtivo === 6 && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--accent-gold-light)" />
                Pós-Disputa: Recurso para Desclassificar Rival (Art. 165)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '16px' }}>
                Se você ficou em 2º ou 3º lugar e o concorrente em 1º não entregou certidão válida, descumpriu a marca ou ofertou preço inexequível, registre sua intenção de recurso para desclassificá-lo e assumir a vitória:
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)',
                maxHeight: '170px',
                overflowY: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-line'
              }}>
                {gerarMinutaRecursoAdministrativo(edital, { razaoSocial, cnpj })}
              </div>

              <button
                onClick={copiarRecurso}
                className="btn btn-gold"
                style={{ width: '100%', padding: '12px' }}
              >
                {recursoCopiado ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {recursoCopiado ? 'Minuta de Recurso Copiada!' : 'Copiar Minuta de Recurso Administrativo'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setPassoAtivo(5)} className="btn btn-secondary">
                Voltar
              </button>
              <button onClick={onClose} className="btn btn-primary">
                <CheckCircle2 size={16} /> Fechar Central de Ações
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
