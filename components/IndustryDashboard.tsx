
import React, { useState } from 'react';
import { Industry } from '../types';

interface IndustryDashboardProps {
  industry: Industry;
}

const IndustryDashboard: React.FC<IndustryDashboardProps> = ({ industry }) => {
  const [checklist, setChecklist] = useState(industry.checklist);
  const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, isDone: !item.isDone } : item
    ));
  };

  const togglePillar = (id: string) => {
    setExpandedPillars(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToChecklist = () => {
    const element = document.getElementById('checklist-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToDecarbonization = () => {
    const element = document.getElementById('decarbonization-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToEsg = () => {
    const element = document.getElementById('esg-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const progress = Math.round((checklist.filter(i => i.isDone).length / checklist.length) * 100) || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Left Column: Knowledge Base */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-[#00915a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{industry.name}</h2>
                <p className="text-[#00915a] font-semibold text-sm">PKD {industry.pkd}</p>
              </div>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              {industry.decarbonizationPillars && industry.decarbonizationPillars.length > 0 && (
                <button 
                  onClick={scrollToDecarbonization}
                  className="flex items-center justify-center space-x-2 bg-emerald-50 text-[#00915a] px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm border border-emerald-100 hover:bg-emerald-100 active:scale-95 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Filary dekarbonizacji</span>
                </button>
              )}
              {industry.esgLimitations && industry.esgLimitations.length > 0 && (
                <button 
                  onClick={scrollToEsg}
                  className="flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm border border-red-100 hover:bg-red-100 active:scale-95 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Ograniczenia ESG</span>
                </button>
              )}
              <button 
                onClick={scrollToChecklist}
                className="flex items-center justify-center space-x-2 bg-[#00915a] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#006646] active:scale-95 transition-all animate-pulse-subtle"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Lista pytań</span>
              </button>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 mb-8">
            <h4 className="text-gray-900 font-bold uppercase text-xs tracking-widest mb-2">Charakterystyka biznesu</h4>
            <p className="text-base leading-relaxed">{industry.description}</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4 italic">
              {industry.businessModel}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h4 className="flex items-center text-red-600 font-bold text-sm mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                Główne czynniki kosztowe
              </h4>
              <ul className="space-y-2">
                {industry.costDrivers.map((c, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-2 flex-shrink-0"></span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center text-emerald-600 font-bold text-sm mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Główne czynniki przychodowe
              </h4>
              <ul className="space-y-2">
                {industry.revenueDrivers.map((r, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2 flex-shrink-0"></span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-gray-900 font-bold text-sm mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Kluczowe KPI
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {industry.keyKPIs.map((kpi, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="text-sm font-semibold text-blue-900">{kpi.label}</span>
                  <span className="text-xs font-bold text-blue-700 bg-white px-2 py-1 rounded shadow-sm">{kpi.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-gray-900 font-bold text-sm mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Ciekawostki o branży
            </h4>
            <div className="space-y-3">
              {industry.funFacts.map((fact, idx) => (
                <div key={idx} className="text-sm text-gray-600 bg-yellow-50/50 p-3 rounded-lg border border-yellow-100/50 relative overflow-hidden">
                   <span className="relative z-10">{fact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analyst Contact Card */}
        {industry.analyst && industry.analyst.name && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#00915a] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {industry.analyst.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-gray-900 font-bold leading-tight">{industry.analyst.name}</h4>
                <p className="text-xs text-gray-500">{industry.analyst.role || 'Analityk'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {industry.analyst.phone && (
                <a 
                  href={`tel:${industry.analyst.phone}`}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-600 hover:text-[#00915a] transition-colors shadow-sm border border-gray-100"
                  title="Zadzwoń"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </a>
              )}
              {industry.analyst.email && (
                <a 
                  href={`mailto:${industry.analyst.email}`}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-600 hover:text-[#00915a] transition-colors shadow-sm border border-gray-100"
                  title="Wyślij email"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </a>
              )}
              {industry.analyst.teamsLink && (
                <a 
                  href={industry.analyst.teamsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors shadow-sm border border-gray-100"
                  title="Rozpocznij czat Teams"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.5 13.5h.44a.43.43 0 0 0 .44-.43v-.44a.43.43 0 0 0-.44-.43h-.44a.43.43 0 0 0-.44.43v.44a.43.43 0 0 0 .44.43zM10.5 8h-.44a.43.43 0 0 0-.44.43v.44c0 .24.2.43.44.43h.44a.43.43 0 0 0 .44-.43v-.44c0-.24-.2-.43-.44-.43zM21 7.23V17c0 1.1-.9 2-2 2H7l-4 4V5c0-1.1.9-2 2-2h9.23c-.14.31-.23.65-.23 1 0 1.1.9 2 2 2 .35 0 .69-.09 1-.23.14.31.23.65.23 1 0 1.1.9 2 2 2 .35 0 .69-.09 1-.23zM9.5 11.5v-3C9.5 7.67 8.83 7 8 7H6c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5zm6.5 2v-3c0-.83-.67-1.5-1.5-1.5h-2c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5z"/></svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* ESG Expert Contact Card */}
        {industry.esgExpert && industry.esgExpert.name && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 mt-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg">
                {industry.esgExpert.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-gray-900 font-bold leading-tight">{industry.esgExpert.name}</h4>
                <p className="text-xs text-gray-500">{industry.esgExpert.role || 'Ekspert ESG'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {industry.esgExpert.phone && (
                <a 
                  href={`tel:${industry.esgExpert.phone}`}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-600 hover:text-[#00915a] transition-colors shadow-sm border border-gray-100"
                  title="Zadzwoń"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </a>
              )}
              {industry.esgExpert.email && (
                <a 
                  href={`mailto:${industry.esgExpert.email}`}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-600 hover:text-[#00915a] transition-colors shadow-sm border border-gray-100"
                  title="Wyślij email"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </a>
              )}
              {industry.esgExpert.teamsLink && (
                <a 
                  href={industry.esgExpert.teamsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors shadow-sm border border-gray-100"
                  title="Rozpocznij czat Teams"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.5 13.5h.44a.43.43 0 0 0 .44-.43v-.44a.43.43 0 0 0-.44-.43h-.44a.43.43 0 0 0-.44.43v.44a.43.43 0 0 0 .44.43zM10.5 8h-.44a.43.43 0 0 0-.44.43v.44c0 .24.2.43.44.43h.44a.43.43 0 0 0 .44-.43v-.44c0-.24-.2-.43-.44-.43zM21 7.23V17c0 1.1-.9 2-2 2H7l-4 4V5c0-1.1.9-2 2-2h9.23c-.14.31-.23.65-.23 1 0 1.1.9 2 2 2 .35 0 .69-.09 1-.23.14.31.23.65.23 1 0 1.1.9 2 2 2 .35 0 .69-.09 1-.23zM9.5 11.5v-3C9.5 7.67 8.83 7 8 7H6c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5zm6.5 2v-3c0-.83-.67-1.5-1.5-1.5h-2c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5z"/></svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Decarbonization Pillars Section */}
        {industry.decarbonizationPillars && industry.decarbonizationPillars.length > 0 && (
          <div id="decarbonization-section" className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm relative overflow-hidden mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-[#00915a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Filary dekarbonizacji</h2>
                <p className="text-[#00915a] font-semibold text-sm">Działania prowadzące do zrównoważonego rozwoju</p>
              </div>
            </div>

            <div className="space-y-4">
              {industry.decarbonizationPillars.map((pillar) => {
                const isExpanded = expandedPillars[pillar.id];
                return (
                  <div key={pillar.id} className="border border-gray-100 rounded-xl bg-gray-50/50 overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => togglePillar(pillar.id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-100/50 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-gray-900">{pillar.name}</h3>
                      <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'bg-emerald-100 text-[#00915a] rotate-180' : 'bg-white border border-gray-200 text-gray-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <div className="p-5 pt-0 border-t border-gray-100/50">
                        <p className="text-gray-600 text-sm mb-6 mt-4">{pillar.description}</p>
                        
                        <div className="bg-white rounded-lg p-5 border border-emerald-100 shadow-sm">
                          <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Co możemy oznaczyć jako zrównoważone?
                          </h4>
                          
                          <ul className="space-y-4">
                            {pillar.sustainablePoints.map((point) => (
                              <li key={point.id} className="text-sm text-gray-800">
                                <div className="font-semibold flex items-start">
                                  <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                                  {point.text}
                                </div>
                                {point.subpoints && point.subpoints.filter(s => s.trim() !== '').length > 0 && (
                                  <ul className="mt-2 ml-6 space-y-1.5">
                                    {point.subpoints.filter(s => s.trim() !== '').map((subpoint, idx) => (
                                      <li key={idx} className="text-gray-600 flex items-start text-xs">
                                        <span className="text-gray-400 mr-2">-</span>
                                        {subpoint}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ESG Limitations Section */}
        {industry.esgLimitations && industry.esgLimitations.length > 0 && (
          <div id="esg-section" className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm relative overflow-hidden mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Ograniczenia ESG</h2>
                <p className="text-red-600 font-semibold text-sm">Bariery i wyzwania w zrównoważonym rozwoju</p>
              </div>
            </div>

            <div className="space-y-4">
              {industry.esgLimitations.map((limitation) => {
                const isExpanded = expandedPillars[limitation.id];
                return (
                  <div key={limitation.id} className="border border-gray-100 rounded-xl bg-gray-50/50 overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => togglePillar(limitation.id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-100/50 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-gray-900">{limitation.name}</h3>
                      <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'bg-red-100 text-red-600 rotate-180' : 'bg-white border border-gray-200 text-gray-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <div className="p-5 pt-0 border-t border-gray-100/50">
                        <p className="text-gray-600 text-sm mb-6 mt-4">{limitation.description}</p>
                        
                        <div className="bg-white rounded-lg p-5 border border-red-100 shadow-sm">
                          <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-4 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Główne wyzwania
                          </h4>
                          
                          <ul className="space-y-4">
                            {limitation.points.map((point) => (
                              <li key={point.id} className="text-sm text-gray-800">
                                <div className="font-semibold flex items-start">
                                  <span className="text-red-500 mr-2 mt-0.5">•</span>
                                  {point.text}
                                </div>
                                {point.subpoints && point.subpoints.filter(s => s.trim() !== '').length > 0 && (
                                  <ul className="mt-2 ml-6 space-y-1.5">
                                    {point.subpoints.filter(s => s.trim() !== '').map((subpoint, idx) => (
                                      <li key={idx} className="text-gray-600 flex items-start text-xs">
                                        <span className="text-gray-400 mr-2">-</span>
                                        {subpoint}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Interactive Checklist */}
      <div className="lg:col-span-1">
        <div id="checklist-section" className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden lg:sticky lg:top-24 transition-all duration-500">
          <div className="bg-[#00915a] p-6 text-white">
            <h3 className="text-lg font-bold mb-1">Checklista Spotkania</h3>
            <p className="text-emerald-100 text-xs">Pytania pomocnicze do zadania klientowi</p>
            
            <div className="mt-6">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-xs font-semibold">Postęp pytań</span>
                 <span className="text-xl font-bold">{progress}%</span>
               </div>
               <div className="w-full bg-emerald-800 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
            {checklist.length > 0 ? (
              <>
                {/* Biznes Section */}
                {checklist.filter(i => (i.category || 'Biznes') === 'Biznes').length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2 px-1">Biznes</h4>
                    {checklist.filter(i => (i.category || 'Biznes') === 'Biznes').map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          item.isDone 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                            : 'bg-white border-gray-50 text-gray-700 hover:border-gray-200'
                        }`}
                      >
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.isDone ? 'bg-[#00915a] border-[#00915a]' : 'bg-white border-gray-300'
                        }`}>
                          {item.isDone && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`ml-3 text-sm font-medium leading-tight ${item.isDone ? 'line-through opacity-70' : ''}`}>
                          {item.question}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* ESG Section */}
                {checklist.filter(i => i.category === 'ESG').length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2 px-1">ESG</h4>
                    {checklist.filter(i => i.category === 'ESG').map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          item.isDone 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                            : 'bg-white border-gray-50 text-gray-700 hover:border-gray-200'
                        }`}
                      >
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.isDone ? 'bg-[#00915a] border-[#00915a]' : 'bg-white border-gray-300'
                        }`}>
                          {item.isDone && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`ml-3 text-sm font-medium leading-tight ${item.isDone ? 'line-through opacity-70' : ''}`}>
                          {item.question}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-400 py-8 italic">Brak pytań specyficznych dla tej branży.</p>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
             <button 
               onClick={() => setChecklist(checklist.map(i => ({...i, isDone: false})))}
               className="w-full text-center text-xs text-gray-400 font-bold hover:text-gray-600 transition-colors uppercase tracking-widest"
             >
               Zresetuj listę
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryDashboard;
