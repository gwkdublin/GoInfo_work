
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  isAdminUnlocked: boolean;
  onAdminRequest: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, isAdminUnlocked, onAdminRequest }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-white border-2 border-[#00915a] w-10 h-10 flex items-center justify-center rounded shadow-sm">
                 <span className="text-[#00915a] font-bold text-xl tracking-tighter">CB</span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 leading-tight">CarbonBiz</h1>
                <p className="text-[10px] text-[#00915a] font-bold tracking-[0.2em] uppercase">Business & Decarbonization</p>
              </div>
            </div>
            
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setView('ADVISOR')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'ADVISOR' 
                    ? 'bg-white text-[#00915a] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Doradca
              </button>
              
              {isAdminUnlocked && (
                <button
                  onClick={() => setView('ADMIN')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'ADMIN' 
                      ? 'bg-white text-[#00915a] shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                }`}
                >
                  Panel Zarządzania
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-400">© 2025 CarbonBiz - System Analizy Branżowej. Materiały wewnętrzne.</p>
          <div className="flex space-x-4 items-center">
             <span className="text-xs text-gray-400 uppercase font-medium hidden sm:inline">Innowacje</span>
             {!isAdminUnlocked && (
               <button 
                 onClick={onAdminRequest}
                 className="text-xs text-gray-300 hover:text-gray-500 font-medium uppercase tracking-tighter"
               >
                 Zarządzanie
               </button>
             )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
