import React from 'react';
import { Sparkles, Globe, Terminal, Award, Rocket } from 'lucide-react';

export function Navbar({ currentView, setView, onOpenCheckout, onOpenPaymentSettings, isSubscribed }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(7, 10, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Logo & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            onClick={() => setView('landing')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              textDecoration: 'none' 
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--primary-glow)'
            }}>
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                Licit<span className="gradient-text">AI</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                Autonomous Tender Intelligence
              </div>
            </div>
          </div>

          <div className="glass-pill" style={{ display: 'none', mdDisplay: 'inline-flex' }}>
            <span className="pulse-dot pulse-dot-green"></span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PNCP Ao Vivo (Lei 14.133/21)</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <button
            onClick={() => setView('landing')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: currentView === 'landing' ? 'var(--primary-gradient)' : 'transparent',
              color: currentView === 'landing' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Globe size={15} />
            Landing Page (Venda Virtual)
          </button>

          <button
            onClick={() => setView('studio')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: currentView === 'studio' ? 'var(--primary-gradient)' : 'transparent',
              color: currentView === 'studio' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Terminal size={15} />
            Plataforma SaaS (Studio)
          </button>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onOpenPaymentSettings && (
            <button
              onClick={onOpenPaymentSettings}
              className="btn btn-secondary btn-sm"
              title="Configurar onde o Pix e cartão caem"
              style={{ fontSize: '0.78rem', padding: '6px 10px' }}
            >
              ⚙️ Pix / Conta
            </button>
          )}

          {isSubscribed ? (
            <span className="badge badge-success" style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={14} /> Assinante Pro Ativo
            </span>
          ) : currentView === 'landing' ? (
            <>
              <button 
                onClick={() => setView('studio')}
                className="btn btn-secondary btn-sm"
              >
                Ver Demo
              </button>
              <button 
                onClick={() => onOpenCheckout({ nome: 'Plano Pro Copilot', preco: '32,90', ciclo: 'anual' })}
                className="btn btn-gold btn-sm"
              >
                <Rocket size={15} /> Assinar (R$ 32,90/mês)
              </button>
            </>
          ) : (
            <button 
              onClick={() => onOpenCheckout({ nome: 'Plano Pro Copilot', preco: '32,90', ciclo: 'anual' })}
              className="btn btn-gold btn-sm"
            >
              <Award size={15} /> Assinar Pro (R$ 32,90/mês)
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
