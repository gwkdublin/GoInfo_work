import React, { useState } from 'react';
import { SustainableFinanceConfig, Analyst } from '../types';
import { DEFAULT_SUSTAINABLE_POTENTIALS, DEFAULT_SUSTAINABLE_EXPERT } from '../constants';

interface SustainableFinanceSectionProps {
  config?: SustainableFinanceConfig;
  industryName: string;
}

const SustainableFinanceSection: React.FC<SustainableFinanceSectionProps> = ({ config, industryName }) => {
  const [revenue, setRevenue] = useState<number>(45); // default 45 mln PLN

  const expert: Analyst = (config?.expert && config.expert.name) 
    ? config.expert 
    : DEFAULT_SUSTAINABLE_EXPERT;

  const potentials = (config?.potentials && config.potentials.length > 0)
    ? config.potentials
    : DEFAULT_SUSTAINABLE_POTENTIALS;

  return (
    <div id="zrownowazone-finansowanie" className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-100 text-[#00915a] rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h2 className="text-2xl font-bold text-gray-900">Zrównoważone finansowanie</h2>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Dedykowane produkty finansowe, potencjały transformacyjne oraz doradztwo dla branży: <strong className="text-gray-800">{industryName}</strong>
          </p>
        </div>

        <span className="self-start md:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#00915a] border border-emerald-200">
          ESG & Green Banking
        </span>
      </div>

      {/* Revenue Selector Slider */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/30 p-6 rounded-2xl border border-emerald-100/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>Wielkość przychodów rozpatrywanego klienta</span>
              <span className="text-xs font-normal text-gray-500">(wartość wpływa na kwalifikowalność)</span>
            </label>
            <p className="text-xs text-gray-600 mt-0.5">Wprowadź przychody roczne klienta w milionach PLN:</p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="2000"
              value={revenue}
              onChange={(e) => setRevenue(Math.max(0, Number(e.target.value)))}
              className="w-28 px-3 py-2 bg-white font-extrabold text-lg text-[#00915a] border-2 border-[#00915a]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00915a] text-center shadow-inner"
            />
            <span className="font-bold text-gray-700 text-sm">mln PLN</span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="300"
            step="5"
            value={revenue > 300 ? 300 : revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="w-full accent-[#00915a] h-2 bg-emerald-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-semibold text-gray-400">
            <span>0 mln PLN</span>
            <span>50 mln PLN</span>
            <span>100 mln PLN</span>
            <span>200 mln PLN</span>
            <span>300+ mln PLN</span>
          </div>
        </div>
      </div>

      {/* Potentials Matrix Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">
          Potencjalne produkty dla klienta
        </h3>

        {potentials.length === 0 ? (
          <div className="p-6 text-center bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-sm">
            Brak skonsolidowanych informacji o potencjałach dla tej branży.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {potentials.map((pot) => {
              const meetsMinRevenue = !pot.minRevenueMlnPLN || revenue >= pot.minRevenueMlnPLN;
              const isQualified = pot.isAvailable && meetsMinRevenue;

              return (
                <div
                  key={pot.id}
                  className={`p-5 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    isQualified
                      ? 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-300 shadow-2xs'
                      : 'bg-red-50/40 border-red-100 hover:border-red-200'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-gray-900 text-base">{pot.name}</h4>
                    </div>

                    {pot.description && (
                      <p className="text-xs text-gray-600 leading-relaxed">{pot.description}</p>
                    )}

                    {pot.minRevenueMlnPLN && pot.minRevenueMlnPLN > 0 && (
                      <div className="pt-1">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          meetsMinRevenue
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          Sugerowany próg: min. {pot.minRevenueMlnPLN} mln PLN
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tick / Cross Icon Badge */}
                  <div className="shrink-0 pt-0.5">
                    {isQualified ? (
                      <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md" title="Potencjał Dostępny / Spełnia Kryteria">
                        <svg className="w-5 h-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 border border-red-200 flex items-center justify-center" title="Niedostępny / Wymaga większych przychodów">
                        <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sustainable Finance Expert Contact Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-[#005734] to-[#003d24] text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex justify-between items-center border-b border-emerald-700/60 pb-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="font-bold text-sm tracking-wider uppercase text-emerald-100">
              Kontakt do Eksperta ds. Finansowania Zrównoważonego
            </h3>
          </div>
          <span className="text-[10px] uppercase tracking-widest bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-700">
            Dedykowany Ekspert
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-bold text-white">{expert.name || 'Brak danych'}</h4>
            <p className="text-xs text-emerald-200 font-medium mt-0.5">{expert.role || 'Ekspert ds. Finansowania Zrównoważonego'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {expert.phone && (
              <a
                href={`tel:${expert.phone}`}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors border border-white/10"
              >
                <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{expert.phone}</span>
              </a>
            )}

            {expert.email && (
              <a
                href={`mailto:${expert.email}`}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors border border-white/10"
              >
                <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </a>
            )}

            {expert.teamsLink && (
              <a
                href={expert.teamsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.5 13H8v-5.5H6.5V9h5v7zm6 0h-2.25v-3.5h-1.5V16H11V9h4.25c1.24 0 2.25 1.01 2.25 2.25v4.75z"/>
                </svg>
                <span>Napisz na Teams</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainableFinanceSection;
