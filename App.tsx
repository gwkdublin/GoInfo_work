
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
  const [isLoading, setIsLoading] = useState(true);

  // Load data from public/data.json
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.json');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setIndustries(data);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Błąd podczas ładowania pliku data.json:', error);
      }
      
      // Fallback to local storage or initial data if fetch fails or file is empty
      const saved = localStorage.getItem('industry_insights_data');
      if (saved) {
        setIndustries(JSON.parse(saved));
      } else {
        setIndustries(INITIAL_INDUSTRIES);
        localStorage.setItem('industry_insights_data', JSON.stringify(INITIAL_INDUSTRIES));
      }
      setIsLoading(false);
    };

    loadData();

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
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00915a]"></div>
        </div>
      ) : view === 'ADVISOR' ? (
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
