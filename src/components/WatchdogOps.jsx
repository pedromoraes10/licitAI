import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, RefreshCw, Cpu, Activity, Server, 
  Terminal, CheckCircle2, Zap, Radio, BellRing, Play, Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function WatchdogOps() {
  const [heartbeatTime, setHeartbeatTime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [simulandoFalha, setSimulandoFalha] = useState(false);
  const [logSentinela, setLogSentinela] = useState([
    { id: 1, hora: '07:10:02', evento: 'Heartbeat OK: Todos os 5 micro-serviços responderam em <120ms.', status: 'ok' },
    { id: 2, hora: '07:15:30', evento: 'Radar PNCP: 38 novos pregões minerados e enriquecidos com IA.', status: 'info' },
    { id: 3, hora: '07:18:14', evento: 'WhatsApp Bot: 142 mensagens de briefing entregues com 100% de leitura.', status: 'ok' },
    { id: 4, hora: '07:20:00', evento: 'Cobrador Pix: 4 faturas conciliadas automaticamente no Asaas.', status: 'ok' }
  ]);

  const [statusRobos, setStatusRobos] = useState({
    radar: { nome: 'Robô 01: Radar PNCP Oficial (Lei 14.133)', status: 'online', uptime: '99.98%', tarefasHoje: 1482, latencia: '180ms' },
    ia: { nome: 'Robô 02: Analista Jurídico de IA (Gemini 3.8)', status: 'online', uptime: '100%', tarefasHoje: 894, latencia: '1.2s' },
    whatsapp: { nome: 'Robô 03: WhatsApp 2-Way (Meta Cloud API)', status: 'online', uptime: '99.95%', tarefasHoje: 320, latencia: '350ms' },
    financeiro: { nome: 'Robô 04: Cobrador & Reativação Pix', status: 'online', uptime: '100%', tarefasHoje: 45, latencia: '95ms' },
    sentinela: { nome: 'Robô 05: Fiscal de Checkout & Cadastro', status: 'online', uptime: '100%', tarefasHoje: 288, latencia: '60ms' }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setHeartbeatTime(new Date().toLocaleTimeString('pt-BR'));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const dispararTesteAutoHealing = () => {
    if (simulandoFalha) return;
    setSimulandoFalha(true);

    // 1. Simula queda do Robô 1 (como o PC de Eunápolis)
    setStatusRobos(prev => ({
      ...prev,
      radar: { ...prev.radar, status: 'falha' }
    }));

    setLogSentinela(prev => [
      { id: Date.now(), hora: new Date().toLocaleTimeString('pt-BR'), evento: '🚨 ALERTA WATCHDOG: Robô 01 (Radar) não respondeu ao ping de 30s!', status: 'danger' },
      ...prev
    ]);

    // 2. Sentinela age e reinicia o contêiner em nuvem automaticamente
    setTimeout(() => {
      setLogSentinela(prev => [
        { id: Date.now() + 1, hora: new Date().toLocaleTimeString('pt-BR'), evento: '🛡️ AUTO-HEALING: Watchdog acionou cluster Docker Cloud. Novo contêiner provisionado em 850ms!', status: 'warning' },
        ...prev
      ]);
    }, 1500);

    // 3. Restabelecimento completo
    setTimeout(() => {
      setStatusRobos(prev => ({
        ...prev,
        radar: { ...prev.radar, status: 'online' }
      }));
      setLogSentinela(prev => [
        { id: Date.now() + 2, hora: new Date().toLocaleTimeString('pt-BR'), evento: '✅ SUCESSO: Robô 01 restabelecido com saúde 100%. Nenhuma mensagem perdida.', status: 'ok' },
        ...prev
      ]);
      setSimulandoFalha(false);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 3200);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner Principal com Referência Estratégica */}
      <div className="glass-panel" style={{
        padding: '28px',
        marginBottom: '24px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-success">
                <ShieldCheck size={14} /> Cloud-Native Architecture
              </span>
              <span className="badge badge-purple">Zero Ponto Único de Falha</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              Fábrica de Robôs Autônomos & Sentinela Watchdog
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '6px' }}>
              Ao contrário do computador local em Eunápolis que desmaia com queda de luz, nossa infraestrutura roda em 
              <strong> cluster de nuvem redundante</strong>. Cada robô possui outro vigiando sua saúde com auto-healing automático.
            </p>
          </div>

          <button
            onClick={dispararTesteAutoHealing}
            disabled={simulandoFalha}
            className="btn btn-gold"
          >
            {simulandoFalha ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Testando Auto-Healing do Watchdog...
              </>
            ) : (
              <>
                <Zap size={16} /> Simular Queda e Testar Auto-Healing
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid de 3 Cards de Indicadores de Infraestrutura */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Uptime Global em Nuvem</span>
            <Server size={18} color="var(--success-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success-light)' }}>99.98%</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Últimos 30 dias sem interrupções
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sentinela Watchdog Ping</span>
            <Activity size={18} color="var(--primary-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-light)' }}>A cada 30s</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Último check: <strong>{heartbeatTime}</strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Editais Auditados Hoje</span>
            <Cpu size={18} color="var(--accent-gold-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold-light)' }}>1.482 Editais</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Lei 14.133/2021 em tempo real
          </div>
        </div>
      </div>

      {/* Grid de 2 Colunas: Status dos Robôs x Console de Logs do Sentinela */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Coluna 1: Lista de Robôs */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="var(--primary-light)" />
            Equipe Autônoma de Robôs Especializados
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.values(statusRobos).map((robo, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: robo.status === 'online' ? '1px solid var(--border-subtle)' : '1px solid var(--danger-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff', marginBottom: '4px' }}>
                    {robo.nome}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Uptime: <strong>{robo.uptime}</strong> • Latência: <strong>{robo.latencia}</strong> • Execuções: <strong>{robo.tarefasHoje}</strong>
                  </div>
                </div>

                <div>
                  {robo.status === 'online' ? (
                    <span className="badge badge-success">
                      <span className="pulse-dot pulse-dot-green"></span> Ativo
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      <span className="pulse-dot pulse-dot-amber"></span> Reiniciando...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 2: Terminal de Logs do Watchdog */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} color="var(--accent-gold-light)" />
              Terminal do Sentinela Watchdog
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              LIVE MONITOR
            </span>
          </div>

          <div style={{
            flex: 1,
            background: '#04070d',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            lineHeight: 1.6,
            minHeight: '260px',
            maxHeight: '340px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {logSentinela.map((log) => (
              <div key={log.id} style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>[{log.hora}]</span>
                <span style={{
                  color: log.status === 'ok' ? 'var(--success-light)' :
                         log.status === 'danger' ? 'var(--danger-light)' :
                         log.status === 'warning' ? 'var(--accent-gold-light)' : 'var(--primary-light)'
                }}>
                  {log.evento}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="var(--success-light)" />
            Regra Fundamental: <i>"Todo robô precisa de outro vigiando ele. Robô parado não avisa que parou."</i>
          </div>
        </div>
      </div>
    </div>
  );
}
