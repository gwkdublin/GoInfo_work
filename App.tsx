
import React, { useState, useEffect } from 'react';
import { Industry, AppView } from './types';
import { INITIAL_INDUSTRIES } from './constants';
import AdvisorView from './components/AdvisorView';
import AdminView from './components/AdminView';
import Layout from './components/Layout';
import InstallPrompt from './components/InstallPrompt';
import AdminLoginModal from './components/AdminLoginModal';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('ADVISOR');
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Load data and auth state from local storage
  useEffect(() => {
    const saved = localStorage.getItem('industry_insights_data');
    if (saved) {
      setIndustries(JSON.parse(saved));
    } else {
      setIndustries(INITIAL_INDUSTRIES);
      localStorage.setItem('industry_insights_data', JSON.stringify(INITIAL_INDUSTRIES));
    }

    const auth = localStorage.getItem('admin_unlocked');
    if (auth === 'true') {
      setIsAdminUnlocked(true);
    }
  }, []);

  const handleUpdateIndustries = (updated: Industry[]) => {
    setIndustries(updated);
    localStorage.setItem('industry_insights_data', JSON.stringify(updated));
  };

  const handleUnlockAdmin = () => {
    setIsAdminUnlocked(true);
    localStorage.setItem('admin_unlocked', 'true');
    setView('ADMIN');
    setIsLoginModalOpen(false);
  };

  return (
    <Layout 
      currentView={view} 
      setView={setView} 
      isAdminUnlocked={isAdminUnlocked}
      onAdminRequest={() => setIsLoginModalOpen(true)}
    >
      {view === 'ADVISOR' ? (
        <AdvisorView industries={industries} />
      ) : (
        <AdminView industries={industries} setIndustries={handleUpdateIndustries} />
      )}
      
      <InstallPrompt />
      
      <AdminLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={handleUnlockAdmin}
      />
    </Layout>
  );
};

export default App;
