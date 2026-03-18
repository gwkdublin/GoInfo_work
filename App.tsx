
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

  const handleUpdateIndustries = async (updated: Industry[]) => {
    setIndustries(updated);
    localStorage.setItem('industry_insights_data', JSON.stringify(updated));

    // Zapisz do pliku data.json na serwerze
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated),
      });
      
      if (!response.ok) {
        console.error('Nie udało się zapisać zmian do pliku data.json');
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania do pliku data.json:', error);
    }
  };

  // Load data from public/data.json
  useEffect(() => {
    const loadData = async () => {
      try {
        // Dodajemy timestamp, aby uniknąć cache'owania starego pliku przez przeglądarkę
        const response = await fetch('/data.json?t=' + new Date().getTime(), { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setIndustries(data);
            setIsLoading(false);
            return;
          }
        } else {
          console.warn('Nie znaleziono pliku data.json na serwerze lub wystąpił błąd (status: ' + response.status + ').');
        }
      } catch (error) {
        console.error('Błąd podczas ładowania pliku data.json:', error);
      }
      
      // Fallback to local storage or initial data if fetch fails or file is empty
      const saved = localStorage.getItem('industry_insights_data');
      if (saved) {
        handleUpdateIndustries(JSON.parse(saved));
      } else {
        handleUpdateIndustries(INITIAL_INDUSTRIES);
      }
      setIsLoading(false);
    };

    loadData();

    const auth = localStorage.getItem('admin_unlocked');
    if (auth === 'true') {
      setIsAdminUnlocked(true);
    }
  }, []);

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
