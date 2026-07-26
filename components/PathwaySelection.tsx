import React from 'react';
import { WorkPathway } from '../types';
import PdfExportFooter from './PdfExportFooter';

interface PathwaySelectionProps {
  onSelectPathway: (pathway: WorkPathway) => void;
}

const PathwaySelection: React.FC<PathwaySelectionProps> = ({ onSelectPathway }) => {
  return (
    <div id="pathway-selection-screen" className="max-w-5xl mx-auto space-y-10 animate-fadeIn py-4 pb-12">
      {/* Hero Banner */}
      <div className="text-center space-y-4">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-100 text-[#00915a] border border-emerald-200 shadow-xs">
          CB CarbonBiz Business & Decarbonization
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Wybierz tryb pracy aplikacji
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          Wybierz obszar, w którym chcesz przeprowadzić analizę: przeszukuj bazę wiedzy sektorowej według kodów PKD lub przejdź do dedykowanego dashboardu Top Emiterów.
        </p>
      </div>

      {/* Main Pathway Choice Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pathway 1: Sektory (PKD) */}
        <button
          onClick={() => onSelectPathway('SECTORS')}
          className="group text-left bg-gradient-to-br from-[#00915a] via-[#007849] to-[#005734] text-white p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-emerald-400"
        >
          {/* Subtle background glow circle */}
          <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>

          <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7m4 0v10" />
                </svg>
              </div>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-white/30">
                Ścieżka Sektorowa
              </span>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-emerald-100 transition-colors">
                Sektory (PKD)
              </h2>
              <p className="text-emerald-100 text-sm md:text-base leading-relaxed mb-6">
                Baza wiedzy dla doradców: analiza modeli biznesowych, czynników kosztowych i przychodowych, filarów dekarbonizacji, ograniczeń ESG, listy pytań oraz zrównoważonego finansowania.
              </p>
              
              <div className="flex items-center text-sm font-bold text-white group-hover:translate-x-2 transition-transform">
                <span>Przejdź do bazy sektorów PKD</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </button>

        {/* Pathway 2: Top Emiterzy */}
        <button
          onClick={() => onSelectPathway('TOP_EMITTERS')}
          className="group text-left bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#0f172a] text-white p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-sky-400"
        >
          {/* Subtle background glow circle */}
          <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>

          <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-white/30">
                Dashboard Klienta
              </span>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-cyan-200 transition-colors">
                Top Emiterzy
              </h2>
              <p className="text-cyan-100 text-sm md:text-base leading-relaxed mb-6">
                Dedykowany dashboard dla kluczowych klientów: analiza dekarbonizacji, szacowane emisje i trajektorie sektorowe (wykres liniowy), rozkład emisji w Scope 1, 2, 3 (wykres kołowy) oraz status CSRD.
              </p>

              <div className="flex items-center text-sm font-bold text-white group-hover:translate-x-2 transition-transform">
                <span>Otwórz Dashboard Top Emiterów</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Quick Info Box */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-[#00915a] rounded-xl font-bold">
            💡
          </div>
          <div>
            <span className="font-bold text-gray-900 block">Ważna wskazówka</span>
            Możesz w każdej chwili zmienić ścieżkę klikając w logo <strong className="text-[#00915a]">CB CarbonBiz</strong> w górnym pasku nawigacji.
          </div>
        </div>
      </div>

      {/* PDF Export Footer */}
      <PdfExportFooter
        elementId="pathway-selection-screen"
        reportTitle="Ekran Wyboru Ścieżki Doradczej CarbonBiz"
        fileNamePrefix="CarbonBiz_Wybór_Ścieżki"
        subtitle="Wygeneruj i pobierz raport podsumowujący opcje pracy doradczej w formacie PDF."
      />
    </div>
  );
};

export default PathwaySelection;
