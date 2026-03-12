
import React, { useState } from 'react';
import { Industry } from '../types';
import IndustryDashboard from './IndustryDashboard';

interface AdvisorViewProps {
  industries: Industry[];
}

const AdvisorView: React.FC<AdvisorViewProps> = ({ industries }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);

  const filteredIndustries = industries.filter(
    (ind) => 
      ind.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ind.pkd.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedIndustry = industries.find(ind => ind.id === selectedIndustryId);

  if (selectedIndustry) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setSelectedIndustryId(null)}
          className="flex items-center text-[#00915a] hover:underline font-medium"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Powrót do wyszukiwania
        </button>
        <IndustryDashboard industry={selectedIndustry} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-[#00915a] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">Znajdź branżę klienta</h2>
          <p className="text-emerald-100 mb-6">Przeszukaj bazę wiedzy według nazwy branży lub kodu PKD, aby lepiej przygotować się do spotkania.</p>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Wyszukaj np. Przetwórstwo, 62.01..."
              className="w-full px-5 py-4 pl-12 rounded-xl text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute right-[-5%] top-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIndustries.length > 0 ? (
          filteredIndustries.map((ind) => (
            <div 
              key={ind.id} 
              onClick={() => setSelectedIndustryId(ind.id)}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#00915a]/50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#00915a] uppercase tracking-wide">
                  PKD {ind.pkd}
                </span>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-[#00915a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{ind.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{ind.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400 font-medium">
                 <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Dostępna checklista pytań
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
             <p className="text-gray-400">Nie znaleziono branży spełniającej kryteria wyszukiwania.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisorView;
