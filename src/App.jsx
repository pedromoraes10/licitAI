import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudioApp } from './components/StudioApp';
import { CheckoutModal } from './components/CheckoutModal';
import { PaymentSettingsModal } from './components/PaymentSettingsModal';
import { FEATURED_TENDERS } from './services/mockTenders';

export function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'studio'
  const [selectedTender, setSelectedTender] = useState(FEATURED_TENDERS[0]);
  const [empresaAtiva, setEmpresaAtiva] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentSettingsModalOpen, setPaymentSettingsModalOpen] = useState(false);
  const [planoCheckout, setPlanoCheckout] = useState(null);

  const handleOpenCheckout = (plano) => {
    setPlanoCheckout(plano || { nome: 'Plano Pro Copilot', preco: '49,90', ciclo: 'anual' });
    setCheckoutModalOpen(true);
  };

  const handleSelectTenderFromLanding = (tender) => {
    setSelectedTender(tender);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterWorkspaceWithCompany = (empresa, tender) => {
    setEmpresaAtiva(empresa);
    if (tender) {
      setSelectedTender(tender);
    } else if (empresa.editaisCompativeis && empresa.editaisCompativeis[0]) {
      setSelectedTender(empresa.editaisCompativeis[0]);
    }
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompanyScanned = (empresa) => {
    setEmpresaAtiva(empresa);
  };

  const handleTrocarEmpresa = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCheckoutSuccess = (dadosCliente) => {
    setCheckoutModalOpen(false);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra de Navegação Global */}
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        onOpenCheckout={handleOpenCheckout}
        onOpenPaymentSettings={() => setPaymentSettingsModalOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' ? (
          <LandingPage
            onSelectTender={handleSelectTenderFromLanding}
            onOpenCheckout={handleOpenCheckout}
            onExploreStudio={() => setCurrentView('studio')}
            onCompanyScanned={handleCompanyScanned}
            onEnterWorkspaceWithCompany={handleEnterWorkspaceWithCompany}
            onOpenPaymentSettings={() => setPaymentSettingsModalOpen(true)}
          />
        ) : (
          <StudioApp
            initialTender={selectedTender}
            empresaAtiva={empresaAtiva}
            onTrocarEmpresa={handleTrocarEmpresa}
            onOpenCheckout={handleOpenCheckout}
          />
        )}
      </main>


      {/* Rodapé Executivo */}
      <footer style={{
        backgroundColor: 'rgba(5, 8, 16, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '40px 24px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
              Licit<span className="gradient-text">AI</span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Inteligência Artificial e Automação de Licitações Públicas (Lei nº 14.133/2021)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.86rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('landing')}>Início</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('studio')}>Plataforma Studio</span>
            <span style={{ cursor: 'pointer' }} onClick={() => handleOpenCheckout()}>Planos e Preços</span>
            <span 
              style={{ cursor: 'pointer', color: 'var(--accent-gold-light)', fontWeight: 600 }} 
              onClick={() => setPaymentSettingsModalOpen(true)}
            >
              ⚙️ Onde Cai o Dinheiro (Pix & Cartão)
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} LicitAI Tecnologia Ltda. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Modal de Pagamento Pix / Cartão 100% Virtual */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        plano={planoCheckout}
        empresaAtiva={empresaAtiva}
        onSuccess={handleCheckoutSuccess}
        onOpenSettings={() => {
          setCheckoutModalOpen(false);
          setPaymentSettingsModalOpen(true);
        }}
      />

      {/* Modal de Configuração do Dono da Plataforma (Onde o Dinheiro Cai) */}
      <PaymentSettingsModal
        isOpen={paymentSettingsModalOpen}
        onClose={() => setPaymentSettingsModalOpen(false)}
      />

      {/* Botão Flutuante de WhatsApp Oficial */}
      <a
        href="https://wa.me/5581999197693?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20plataforma%20LicitAI"
        target="_blank"
        rel="noopener noreferrer"
        title="Falar no WhatsApp Oficial"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#25D366',
          color: '#ffffff',
          borderRadius: '50px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '0.88rem',
          boxShadow: '0 8px 30px rgba(37, 211, 102, 0.45)',
          zIndex: 9990,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          border: '2px solid rgba(255, 255, 255, 0.25)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span className="pulse-dot pulse-dot-green" style={{ width: '10px', height: '10px', background: '#fff' }}></span>
        <span>WhatsApp: (81) 99919-7693</span>
      </a>

    </div>
  );
}

export default App;
