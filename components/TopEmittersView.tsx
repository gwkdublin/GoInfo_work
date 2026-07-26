import React, { useState } from 'react';
import { TopEmitterClient } from '../types';
import PdfExportFooter from './PdfExportFooter';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface TopEmittersViewProps {
  clients: TopEmitterClient[];
  onBackToSelection?: () => void;
}

const SCOPE_COLORS = ['#0284c7', '#10b981', '#f59e0b']; // Scope 1: Sky, Scope 2: Emerald, Scope 3: Amber

const TopEmittersView: React.FC<TopEmittersViewProps> = ({ clients, onBackToSelection }) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    clients.length > 0 ? clients[0].id : ''
  );

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  if (!selectedClient) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">Brak zdefiniowanych klientów w bazie Top Emiterów.</p>
        <p className="text-xs text-gray-400 mt-2">Dodaj pierwszego klienta w Panelu Zarządzania.</p>
      </div>
    );
  }

  // Data for Scope Emissions Pie Chart
  const scopeData = [
    { name: 'Scope 1 (Emisje bezpośrednie)', value: selectedClient.scopeEmissions.scope1 },
    { name: 'Scope 2 (Energia i ciepło)', value: selectedClient.scopeEmissions.scope2 },
    { name: 'Scope 3 (Łańcuch wartości)', value: selectedClient.scopeEmissions.scope3 },
  ];

  const totalEmissions =
    selectedClient.scopeEmissions.scope1 +
    selectedClient.scopeEmissions.scope2 +
    selectedClient.scopeEmissions.scope3;

  return (
    <div id="top-emitters-screen" className="space-y-8 animate-fadeIn pb-12">
      {/* Top Bar Navigation & Client Selector */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          {onBackToSelection && (
            <button
              onClick={onBackToSelection}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              title="Powrót do wyboru ścieżek"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Top Emiterów</h1>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Analiza dekarbonizacyjna i audyt emisyjny kluczowych klientów biznesowych
            </p>
          </div>
        </div>

        {/* Client Selector Dropdown */}
        <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
          <label className="text-xs font-bold text-gray-600 pl-2">Wybierz klienta:</label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="px-3 py-2 bg-white font-bold text-gray-800 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.sectorName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Client Overview Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Sektor: {selectedClient.sectorName}
              </span>
              {selectedClient.pkd && (
                <span className="bg-white/10 text-gray-300 text-xs font-mono px-2.5 py-1 rounded-full">
                  PKD {selectedClient.pkd}
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{selectedClient.name}</h2>
            <p className="text-sky-200 text-sm max-w-2xl">
              Całkowity zarejestrowany ślad węglowy: <strong className="text-white font-mono text-base">{totalEmissions.toLocaleString('pl-PL')} tCO₂e</strong>
            </p>
          </div>

          {/* CSRD Flag Badge Component */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-200 uppercase tracking-widest">Flaga CSRD</span>
              <svg className="w-5 h-5 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>

            <div className="flex items-center space-x-3 mb-2">
              <span
                className={`text-2xl font-extrabold px-4 py-1 rounded-xl shadow-inner ${
                  selectedClient.csrdFlag.applies
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {selectedClient.csrdFlag.applies ? 'TAK' : 'NIE'}
              </span>
              <span className="text-xs text-gray-200 leading-tight">
                {selectedClient.csrdFlag.applies
                  ? 'Podlega obowiązkowi dyrektywy CSRD'
                  : 'Brak bezpośredniego obowiązku CSRD'}
              </span>
            </div>

            {selectedClient.csrdFlag.effectiveYear && (
              <p className="text-[11px] text-emerald-300 font-semibold mt-1">
                {selectedClient.csrdFlag.effectiveYear}
              </p>
            )}
            {selectedClient.csrdFlag.reason && (
              <p className="text-[10px] text-gray-300 mt-1 line-clamp-2">
                {selectedClient.csrdFlag.reason}
              </p>
            )}
          </div>
        </div>

        {/* Background glow circle */}
        <div className="absolute right-[-5%] bottom-[-20%] w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Grid: Client Decarbonization Analysis & Scope Emissions Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card 1: Analiza dekarbonizacji Klienta (Text Analysis) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
            <span className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <h3 className="text-xl font-bold text-gray-900">Analiza dekarbonizacji Klienta</h3>
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/60 p-6 rounded-xl border border-gray-100">
            {selectedClient.decarbonizationAnalysis || 'Brak wprowadzonych danych analitycznych.'}
          </div>
        </div>

        {/* Card 2: Emisje klienta w Scope 1, Scope 2 i Scope 3 (Pie Chart) */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-4">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </span>
              <h3 className="text-lg font-bold text-gray-900">Emisje w Scope 1, 2 i 3</h3>
            </div>

            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scopeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {scopeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SCOPE_COLORS[index % SCOPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString('pl-PL')} tCO₂e`, 'Emisja']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Total overlay in donut center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-semibold text-gray-400">Łącznie</span>
                <span className="text-sm font-extrabold text-gray-900">{totalEmissions.toLocaleString('pl-PL')}</span>
                <span className="text-[10px] text-gray-400">tCO₂e</span>
              </div>
            </div>
          </div>

          {/* Scope Legend Items */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {scopeData.map((s, idx) => {
              const pct = totalEmissions > 0 ? ((s.value / totalEmissions) * 100).toFixed(1) : 0;
              return (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: SCOPE_COLORS[idx] }}
                    ></span>
                    <span className="text-gray-700 font-medium">{s.name}</span>
                  </div>
                  <div className="font-bold text-gray-900 font-mono">
                    {s.value.toLocaleString('pl-PL')} tCO₂e ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card 3: Szacowane emisje i ścieżki sektorowe (Line Chart) */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </span>
              <h3 className="text-xl font-bold text-gray-900">Szacowane emisje i ścieżki sektorowe</h3>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Projekcja emisyjności klienta na tle referencyjnych trajektorii redukcji dla sektora ({selectedClient.sectorName})
            </p>
          </div>

          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            Horyzont 2020 - 2040
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={selectedClient.trajectory}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} unit=" t" />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString('pl-PL')} tCO₂e`, '']}
                labelFormatter={(label) => `Rok ${label}`}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
              <Line
                type="monotone"
                dataKey="clientEmissions"
                name="Emisje Klienta (tCO₂e)"
                stroke="#0284c7"
                strokeWidth={3.5}
                dot={{ r: 5, fill: '#0284c7' }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="sectorTarget15C"
                name="Ścieżka sektorowa 1.5°C"
                stroke="#10b981"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="sectorTarget20C"
                name="Ścieżka sektorowa 2.0°C / NZE"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeDasharray="3 3"
                dot={{ r: 4, fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PDF Export Footer */}
      <PdfExportFooter
        elementId="top-emitters-screen"
        reportTitle={`Klient: ${selectedClient.name} (${selectedClient.sectorName})`}
        fileNamePrefix="Raport_TopEmiter"
        subtitle="Wygeneruj i pobierz raport audytu emisyjnego klienta (z podziałem na Scope 1, 2, 3, flagą CSRD oraz trajektorią emisyjną do 2040) w formacie PDF."
      />
    </div>
  );
};

export default TopEmittersView;
