import React, { useState, useEffect } from 'react';
import { Industry, AppView, WorkPathway, TopEmitterClient } from './types';
import { INITIAL_INDUSTRIES, INITIAL_TOP_EMITTERS } from './constants';
import PathwaySelection from './components/PathwaySelection';
import IndustryDashboard from './components/IndustryDashboard';
import TopEmittersView from './components/TopEmittersView';
import AdminView from './components/AdminView';
import Layout from './components/Layout';
import InstallPrompt from './components/InstallPrompt';
import AdminLoginModal from './components/AdminLoginModal';
import PdfExportFooter from './components/PdfExportFooter';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('ADVISOR');
  const [pathway, setPathway] = useState<WorkPathway>('LANDING');

  const [industries, setIndustries] = useState<Industry[]>(INITIAL_INDUSTRIES);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
  const [topEmitters, setTopEmitters] = useState<TopEmitterClient[]>(INITIAL_TOP_EMITTERS);

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state for Industries Grid
  const [searchTerm, setSearchTerm] = useState('');

  // Update & Save handler to server (/api/data)
  const handleSaveAllData = async (newIndustries?: Industry[], newEmitters?: TopEmitterClient[]) => {
    const indToSave = newIndustries || industries;
    const emiToSave = newEmitters || topEmitters;

    setIndustries(indToSave);
    setTopEmitters(emiToSave);

    const payload = {
      industries: indToSave,
      topEmitters: emiToSave
    };

    localStorage.setItem('carbonbiz_app_data', JSON.stringify(payload));

    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.error('Błąd zapisu do /api/data');
      }
    } catch (err) {
      console.error('Błąd sieci podczas zapisu do /api/data:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.json?t=' + Date.now(), { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            // Legacy array format
            setIndustries(data);
          } else if (data && typeof data === 'object') {
            if (Array.isArray(data.industries)) {
              setIndustries(data.industries);
            }
            if (Array.isArray(data.topEmitters) && data.topEmitters.length > 0) {
              setTopEmitters(data.topEmitters);
            }
          }
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Błąd ładowania data.json:', error);
      }

      // LocalStorage fallback
      const saved = localStorage.getItem('carbonbiz_app_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.industries) setIndustries(parsed.industries);
          if (parsed.topEmitters) setTopEmitters(parsed.topEmitters);
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoading(false);
    };

    loadData();

    if (localStorage.getItem('admin_unlocked') === 'true') {
      setIsAdminUnlocked(true);
    }
  }, []);

  const handleUnlockAdmin = () => {
    setIsAdminUnlocked(true);
    localStorage.setItem('admin_unlocked', 'true');
    setView('ADMIN');
    setIsLoginModalOpen(false);
  };

  // Filtered industries
  const filteredIndustries = industries.filter(
    (ind) =>
      ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.pkd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedIndustry = industries.find((i) => i.id === selectedIndustryId);

  return (
    <Layout
      currentView={view}
      setView={setView}
      isAdminUnlocked={isAdminUnlocked}
      onAdminRequest={() => setIsLoginModalOpen(true)}
      onHomeClick={() => {
        setView('ADVISOR');
        setPathway('LANDING');
        setSelectedIndustryId(null);
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00915a]"></div>
        </div>
      ) : view === 'ADMIN' ? (
        <AdminView
          industries={industries}
          setIndustries={(updated) => handleSaveAllData(updated, topEmitters)}
          topEmitters={topEmitters}
          setTopEmitters={(updated) => handleSaveAllData(industries, updated)}
          onSaveToServer={() => handleSaveAllData(industries, topEmitters)}
        />
      ) : (
        /* ADVISOR VIEW WITH 2 PATHWAYS */
        <div className="space-y-6">
          {pathway === 'LANDING' && (
            <PathwaySelection
              onSelectPathway={(p) => {
                setPathway(p);
                setSelectedIndustryId(null);
              }}
            />
          )}

          {pathway === 'TOP_EMITTERS' && (
            <TopEmittersView
              clients={topEmitters}
              onBackToSelection={() => setPathway('LANDING')}
            />
          )}

          {pathway === 'SECTORS' && (
            <div className="space-y-6">
              {/* Back to Pathway Choice & Sector Search Bar */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setPathway('LANDING');
                      setSelectedIndustryId(null);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                    title="Powrót do wyboru ścieżki"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Ścieżka Sektorowa (PKD)</h2>
                    <p className="text-xs text-gray-500">
                      Przeglądaj bazy branżowe, filary dekarbonizacji, ograniczenia ESG i checklisty
                    </p>
                  </div>
                </div>

                <div className="relative min-w-[280px]">
                  <input
                    type="text"
                    placeholder="Szukaj po PKD lub nazwie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00915a] font-medium"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* If an Industry is Selected -> Show Industry Dashboard */}
              {selectedIndustry ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedIndustryId(null)}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-[#00915a] hover:text-[#006646] bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Powrót do listy branż</span>
                  </button>

                  <IndustryDashboard industry={selectedIndustry} />
                </div>
              ) : (
                /* Grid of Industry Cards */
                <div id="sector-list-screen" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIndustries.map((ind) => {
                      const hasEsgLimits = ind.esgLimitations && ind.esgLimitations.length > 0;
                      return (
                        <div
                          key={ind.id}
                          onClick={() => setSelectedIndustryId(ind.id)}
                          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer group relative flex flex-col justify-between hover:border-[#00915a]"
                        >
                          <div>
                            {/* ESG Badge top right */}
                            <div className="flex justify-between items-start mb-3">
                              <span className="bg-emerald-50 text-[#00915a] border border-emerald-100 font-bold text-xs px-2.5 py-1 rounded-lg font-mono">
                                PKD {ind.pkd}
                              </span>

                              {hasEsgLimits ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center space-x-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                  <span>ESG</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  <span>ESG</span>
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#00915a] transition-colors mb-2 line-clamp-2">
                              {ind.name}
                            </h3>

                            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">
                              {ind.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-medium">
                              {ind.decarbonizationPillars?.length || 0} filary dekarbonizacji
                            </span>
                            <span className="text-[#00915a] font-bold group-hover:translate-x-1 transition-transform flex items-center">
                              Otwórz &rarr;
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* PDF Export Footer */}
                  <PdfExportFooter
                    elementId="sector-list-screen"
                    reportTitle="Katalog Bazy Sektorów PKD"
                    fileNamePrefix="Katalog_Sektorow_PKD"
                    subtitle="Pobierz pełne zestawienie dostępnych branż z kodami PKD i informacjami ESG w formacie PDF."
                  />
                </div>
              )}
            </div>
          )}
        </div>
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
