import React, { useState } from 'react';
import {
  Industry,
  TopEmitterClient,
} from '../types';
import { generateIndustryDraft } from '../geminiService';
import { DEFAULT_SUSTAINABLE_POTENTIALS, DEFAULT_SUSTAINABLE_EXPERT } from '../constants';
import * as XLSX from 'xlsx';
import PdfExportFooter from './PdfExportFooter';

interface AdminViewProps {
  industries: Industry[];
  setIndustries: (updated: Industry[]) => void;
  topEmitters: TopEmitterClient[];
  setTopEmitters: (updated: TopEmitterClient[]) => void;
  onSaveToServer: () => Promise<void>;
}

const AdminView: React.FC<AdminViewProps> = ({
  industries,
  setIndustries,
  topEmitters,
  setTopEmitters,
  onSaveToServer
}) => {
  const [mainAdminTab, setMainAdminTab] = useState<'SECTORS' | 'TOP_EMITTERS'>('SECTORS');

  // Industry editing state
  const [editingIndustryId, setEditingIndustryId] = useState<string | null>(null);
  const [activeIndustryTab, setActiveIndustryTab] = useState<
    'general' | 'decarbonization' | 'esgLimitations' | 'checklist' | 'sustainableFinance'
  >('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);

  const [industryFormData, setIndustryFormData] = useState<Partial<Industry>>({
    pkd: '',
    name: '',
    description: '',
    businessModel: '',
    costDrivers: [],
    revenueDrivers: [],
    keyKPIs: [],
    funFacts: [],
    checklist: [],
    analyst: { name: '', role: '', phone: '', email: '', teamsLink: '' },
    esgExpert: { name: '', role: '', phone: '', email: '', teamsLink: '' },
    decarbonizationPillars: [],
    esgLimitations: [],
    sustainableFinance: {
      expert: DEFAULT_SUSTAINABLE_EXPERT,
      potentials: DEFAULT_SUSTAINABLE_POTENTIALS
    }
  });

  // Top Emitter editing state
  const [editingEmitterId, setEditingEmitterId] = useState<string | null>(null);
  const [emitterFormData, setEmitterFormData] = useState<Partial<TopEmitterClient>>({
    name: '',
    sectorName: '',
    pkd: '',
    decarbonizationAnalysis: '',
    scopeEmissions: { scope1: 0, scope2: 0, scope3: 0 },
    trajectory: [
      { year: 2020, clientEmissions: 100000, sectorTarget15C: 95000, sectorTarget20C: 98000 },
      { year: 2024, clientEmissions: 85000, sectorTarget15C: 75000, sectorTarget20C: 80000 },
      { year: 2028, clientEmissions: 60000, sectorTarget15C: 50000, sectorTarget20C: 58000 },
      { year: 2030, clientEmissions: 40000, sectorTarget15C: 30000, sectorTarget20C: 42000 }
    ],
    csrdFlag: {
      applies: true,
      reason: 'Zatrudnienie > 250 osób lub roczne przychody > 170 mln PLN.',
      effectiveYear: 'Obowiązek od roku obrotowego 2024'
    }
  });

  // Save to server wrapper
  const handleTriggerSaveToServer = async () => {
    setSaveStatusMsg('Zapisywanie na serwerze...');
    try {
      await onSaveToServer();
      setSaveStatusMsg('✅ Dane zostały pomyślnie zapisane na serwerze w public/data.json!');
      setTimeout(() => setSaveStatusMsg(null), 4000);
    } catch (err: any) {
      setSaveStatusMsg('❌ Błąd podczas zapisu: ' + err.message);
    }
  };

  // --- INDUSTRY HANDLERS ---
  const handleEditIndustry = (ind: Industry) => {
    setEditingIndustryId(ind.id);
    setActiveIndustryTab('general');
    setErrorMessage(null);
    setIndustryFormData({
      ...ind,
      analyst: ind.analyst || { name: '', role: '', phone: '', email: '', teamsLink: '' },
      esgExpert: ind.esgExpert || { name: '', role: '', phone: '', email: '', teamsLink: '' },
      decarbonizationPillars: ind.decarbonizationPillars || [],
      esgLimitations: ind.esgLimitations || [],
      sustainableFinance: ind.sustainableFinance || {
        expert: DEFAULT_SUSTAINABLE_EXPERT,
        potentials: DEFAULT_SUSTAINABLE_POTENTIALS
      }
    });
  };

  const handleAddNewIndustry = () => {
    setEditingIndustryId('NEW');
    setActiveIndustryTab('general');
    setErrorMessage(null);
    setIndustryFormData({
      pkd: '',
      name: '',
      description: '',
      businessModel: '',
      costDrivers: [],
      revenueDrivers: [],
      keyKPIs: [],
      funFacts: [],
      checklist: [],
      analyst: { name: '', role: '', phone: '', email: '', teamsLink: '' },
      esgExpert: { name: '', role: '', phone: '', email: '', teamsLink: '' },
      decarbonizationPillars: [],
      esgLimitations: [],
      sustainableFinance: {
        expert: DEFAULT_SUSTAINABLE_EXPERT,
        potentials: DEFAULT_SUSTAINABLE_POTENTIALS
      }
    });
  };

  const handleSaveIndustry = () => {
    if (!industryFormData.pkd || !industryFormData.name) {
      setErrorMessage('Proszę wypełnić kod PKD i nazwę branży.');
      return;
    }

    const cleanedData = {
      ...industryFormData,
      decarbonizationPillars: industryFormData.decarbonizationPillars?.map((pillar) => ({
        ...pillar,
        sustainablePoints: pillar.sustainablePoints.map((point) => ({
          ...point,
          subpoints: point.subpoints.filter((s) => s.trim() !== '')
        }))
      })),
      esgLimitations: industryFormData.esgLimitations?.map((limitation) => ({
        ...limitation,
        points: limitation.points.map((point) => ({
          ...point,
          subpoints: point.subpoints.filter((s) => s.trim() !== '')
        }))
      }))
    };

    let updated: Industry[];
    if (editingIndustryId === 'NEW') {
      const newIndustry: Industry = {
        ...(cleanedData as Industry),
        id: Date.now().toString()
      };
      updated = [...industries, newIndustry];
    } else {
      updated = industries.map((ind) =>
        ind.id === editingIndustryId ? (cleanedData as Industry) : ind
      );
    }

    setIndustries(updated);
    setEditingIndustryId(null);
  };

  const handleDeleteIndustry = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę branżę?')) {
      setIndustries(industries.filter((ind) => ind.id !== id));
    }
  };

  const handleAutoFillAI = async () => {
    if (!industryFormData.pkd || !industryFormData.name) {
      setErrorMessage('Proszę wpisać kod PKD i nazwę branży przed generowaniem.');
      return;
    }
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const draft = await generateIndustryDraft(industryFormData.pkd!, industryFormData.name!);
      setIndustryFormData((prev) => ({ ...prev, ...draft }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Wystąpił błąd podczas generowania treści AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- TOP EMITTER HANDLERS ---
  const handleEditEmitter = (client: TopEmitterClient) => {
    setEditingEmitterId(client.id);
    setEmitterFormData(client);
  };

  const handleAddNewEmitter = () => {
    setEditingEmitterId('NEW');
    setEmitterFormData({
      name: '',
      sectorName: '',
      pkd: '',
      decarbonizationAnalysis: '',
      scopeEmissions: { scope1: 0, scope2: 0, scope3: 0 },
      trajectory: [
        { year: 2020, clientEmissions: 100000, sectorTarget15C: 90000, sectorTarget20C: 95000 },
        { year: 2024, clientEmissions: 80000, sectorTarget15C: 70000, sectorTarget20C: 75000 },
        { year: 2028, clientEmissions: 50000, sectorTarget15C: 45000, sectorTarget20C: 50000 },
        { year: 2030, clientEmissions: 30000, sectorTarget15C: 25000, sectorTarget20C: 35000 }
      ],
      csrdFlag: {
        applies: true,
        reason: 'Przekroczone kryteria dyrektywy CSRD',
        effectiveYear: 'Obowiązek od roku obrotowego 2024'
      }
    });
  };

  const handleSaveEmitter = () => {
    if (!emitterFormData.name || !emitterFormData.sectorName) {
      alert('Wprowadź nazwę klienta oraz sektor.');
      return;
    }

    let updated: TopEmitterClient[];
    if (editingEmitterId === 'NEW') {
      const newEmitter: TopEmitterClient = {
        ...(emitterFormData as TopEmitterClient),
        id: Date.now().toString()
      };
      updated = [...topEmitters, newEmitter];
    } else {
      updated = topEmitters.map((c) =>
        c.id === editingEmitterId ? (emitterFormData as TopEmitterClient) : c
      );
    }

    setTopEmitters(updated);
    setEditingEmitterId(null);
  };

  const handleDeleteEmitter = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      setTopEmitters(topEmitters.filter((c) => c.id !== id));
    }
  };

  // --- EXCEL TEMPLATE DOWNLOAD & EXPORT/IMPORT ---
  const handleDownloadExcelTemplate = () => {
    const wb = XLSX.utils.book_new();

    const wsBranze = XLSX.utils.aoa_to_sheet([
      [
        'ID_Branzy',
        'PKD',
        'Nazwa',
        'Opis',
        'Model_Biznesowy',
        'Czynniki_Kosztowe_Srednik',
        'Czynniki_Przychodowe_Srednik',
        'Analityk_Imie',
        'Analityk_Rola',
        'Analityk_Telefon',
        'Analityk_Email',
        'Analityk_Teams',
        'Ekspert_ESG_Imie',
        'Ekspert_ESG_Rola',
        'Ekspert_ESG_Telefon',
        'Ekspert_ESG_Email',
        'Ekspert_ESG_Teams',
        'Ekspert_Fin_Imie',
        'Ekspert_Fin_Rola',
        'Ekspert_Fin_Telefon',
        'Ekspert_Fin_Email',
        'Ekspert_Fin_Teams'
      ],
      [
        '1',
        '10.11.Z',
        'Przetwórstwo mięsa',
        'Przykładowy opis...',
        'Model oparty na wolumenie...',
        'Ceny surowca;Energia;Transport',
        'Eksport;Marki własne',
        'Grzegorz Kozieja',
        'Starszy Analityk',
        '515675314',
        'grzegorz@example.com',
        'https://teams...',
        'Kamila Michowska',
        'Ekspert ESG',
        '444555666',
        'kamila@example.com',
        '',
        'Krzysztof Majewski',
        'Ekspert ds. Finansowania Zrównoważonego',
        '500800900',
        'krzysztof@example.com',
        ''
      ]
    ]);
    XLSX.utils.book_append_sheet(wb, wsBranze, 'Branze');

    const wsChecklista = XLSX.utils.aoa_to_sheet([
      ['ID_Branzy', 'Pytanie', 'Kategoria'],
      ['1', 'Jaki jest udział eksportu w przychodach?', 'Biznes'],
      ['1', 'Czy firma mierzy ślad węglowy Scope 1, 2, 3?', 'ESG']
    ]);
    XLSX.utils.book_append_sheet(wb, wsChecklista, 'Checklista');

    const wsDekarbonizacja = XLSX.utils.aoa_to_sheet([
      ['ID_Branzy', 'Nazwa_Filaru', 'Opis_Filaru', 'Punkt_Glowny', 'Podpunkty_Srednik'],
      [
        '1',
        'Efektywność energetyczna',
        'Optymalizacja zużycia chłodnictwa',
        'Modernizacja sprężarek',
        'Przejście na amoniak/CO2;Odzysk ciepła'
      ]
    ]);
    XLSX.utils.book_append_sheet(wb, wsDekarbonizacja, 'Dekarbonizacja');

    const wsEsg = XLSX.utils.aoa_to_sheet([
      ['ID_Branzy', 'Nazwa_Ograniczenia', 'Opis_Ograniczenia', 'Punkt_Glowny', 'Podpunkty_Srednik'],
      ['1', 'Polityka sektorowa ESG', 'Obowiązkowe wymogi', 'Dobrostan zwierząt', 'Koszty certyfikacji']
    ]);
    XLSX.utils.book_append_sheet(wb, wsEsg, 'Ograniczenia_ESG');

    const wsTopEmiterzy = XLSX.utils.aoa_to_sheet([
      [
        'ID_Klienta',
        'Nazwa_Klienta',
        'Sektor',
        'PKD',
        'Analiza_Dekarbonizacji',
        'Scope_1',
        'Scope_2',
        'Scope_3',
        'CSRD_Tak_Nie',
        'CSRD_Rok',
        'CSRD_Uzasadnienie'
      ],
      [
        'top-1',
        'Huta Stal-Metal S.A.',
        'Hutnictwo',
        '24.10.Z',
        'Planowana zmiana na EAF...',
        '450000',
        '180000',
        '120000',
        'TAK',
        '2024',
        'Przekroczony progi zatrudnienia i przychodów'
      ]
    ]);
    XLSX.utils.book_append_sheet(wb, wsTopEmiterzy, 'Top_Emiterzy');

    XLSX.writeFile(wb, 'Szablon_CarbonBiz_Baza.xlsx');
  };

  const handleExportJSON = () => {
    const exportObj = {
      industries,
      topEmitters
    };
    const dataStr = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed)) {
          if (confirm('Zaimportowano bazę branż. Nadpisać dane?')) {
            setIndustries(parsed);
            alert('Branże zaimportowane!');
          }
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.industries) || Array.isArray(parsed.topEmitters)) {
            if (confirm('Czy na pewno chcesz nadpisać całą bazę (Sektory i Top Emiterzy)?')) {
              if (Array.isArray(parsed.industries)) setIndustries(parsed.industries);
              if (Array.isArray(parsed.topEmitters)) setTopEmitters(parsed.topEmitters);
              alert('Wszystkie dane zostały pomyślnie zaimportowane!');
            }
          }
        }
      } catch (err) {
        alert('Błąd podczas odczytu pliku JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div id="admin-screen" className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Zarządzania Bazy Wiedzy</h1>
          <p className="text-xs text-gray-500 mt-1">
            Zarządzaj branżami PKD, listą Top Emiterów, kontaktami ekspertów oraz eksportem do pliku data.json
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTriggerSaveToServer}
            className="px-4 py-2 bg-[#00915a] hover:bg-[#006646] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Zapisz na serwerze (data.json)</span>
          </button>

          <button
            onClick={handleDownloadExcelTemplate}
            className="px-3 py-2 bg-emerald-50 text-[#00915a] hover:bg-emerald-100 rounded-xl font-bold text-xs border border-emerald-200 transition-colors"
          >
            Pobierz Szablon Excel
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors"
          >
            Eksport JSON
          </button>

          <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors cursor-pointer">
            Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {saveStatusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-fadeIn">
          {saveStatusMsg}
        </div>
      )}

      {/* Main Admin Mode Switcher Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 bg-white p-2 rounded-2xl shadow-xs">
        <button
          onClick={() => {
            setMainAdminTab('SECTORS');
            setEditingIndustryId(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
            mainAdminTab === 'SECTORS'
              ? 'bg-[#00915a] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7m4 0v10" />
          </svg>
          <span>Sektory (PKD) — {industries.length}</span>
        </button>

        <button
          onClick={() => {
            setMainAdminTab('TOP_EMITTERS');
            setEditingEmitterId(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
            mainAdminTab === 'TOP_EMITTERS'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Top Emiterzy — {topEmitters.length}</span>
        </button>
      </div>

      {/* SECTION 1: SECTORS MANAGEMENT */}
      {mainAdminTab === 'SECTORS' && (
        <div className="space-y-6">
          {editingIndustryId ? (
            /* INDUSTRY EDITOR FORM */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingIndustryId === 'NEW' ? 'Dodaj nową branżę' : `Edycja branży: ${industryFormData.name}`}
                </h2>
                <button
                  onClick={() => setEditingIndustryId(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ✕ Zamknij
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Subtabs inside Industry Editor */}
              <div className="flex flex-wrap gap-2 border-b pb-3">
                {[
                  { key: 'general', label: 'Ogólne & Kontakt' },
                  { key: 'decarbonization', label: 'Filary Dekarbonizacji' },
                  { key: 'esgLimitations', label: 'Ograniczenia ESG' },
                  { key: 'checklist', label: 'Checklista Pytań' },
                  { key: 'sustainableFinance', label: 'Zrównoważone Finansowanie' }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveIndustryTab(t.key as any)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                      activeIndustryTab === t.key
                        ? 'bg-[#00915a] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Subtab 1: General Info */}
              {activeIndustryTab === 'general' && (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Kod PKD</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-xl"
                        value={industryFormData.pkd}
                        onChange={(e) => setIndustryFormData({ ...industryFormData, pkd: e.target.value })}
                        placeholder="np. 10.11.Z"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Nazwa Branży</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-xl"
                        value={industryFormData.name}
                        onChange={(e) => setIndustryFormData({ ...industryFormData, name: e.target.value })}
                        placeholder="np. Przetwórstwo mięsa"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleAutoFillAI}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-emerald-50 text-[#00915a] rounded-xl font-bold border border-emerald-200 text-xs hover:bg-emerald-100 disabled:opacity-50"
                    >
                      {isGenerating ? 'Generowanie AI...' : '⚡ Wygeneruj opis przez AI'}
                    </button>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Opis branży</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border rounded-xl"
                      value={industryFormData.description}
                      onChange={(e) => setIndustryFormData({ ...industryFormData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Model Biznesowy</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-xl"
                      value={industryFormData.businessModel}
                      onChange={(e) => setIndustryFormData({ ...industryFormData, businessModel: e.target.value })}
                    />
                  </div>

                  {/* Analyst Contacts */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Kontakt do Analityka</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <input
                        type="text"
                        placeholder="Imię i nazwisko"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.analyst?.name || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            analyst: { ...industryFormData.analyst!, name: e.target.value }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Rola"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.analyst?.role || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            analyst: { ...industryFormData.analyst!, role: e.target.value }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Telefon"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.analyst?.phone || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            analyst: { ...industryFormData.analyst!, phone: e.target.value }
                          })
                        }
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="p-2 border rounded-lg bg-white md:col-span-2"
                        value={industryFormData.analyst?.email || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            analyst: { ...industryFormData.analyst!, email: e.target.value }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Link Teams"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.analyst?.teamsLink || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            analyst: { ...industryFormData.analyst!, teamsLink: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* ESG Expert Contacts */}
                  <div className="p-4 bg-emerald-50/50 rounded-xl space-y-3 border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider">Kontakt do Eksperta ESG</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <input
                        type="text"
                        placeholder="Imię i nazwisko"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.esgExpert?.name || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            esgExpert: { ...industryFormData.esgExpert!, name: e.target.value }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Rola"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.esgExpert?.role || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            esgExpert: { ...industryFormData.esgExpert!, role: e.target.value }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Telefon"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.esgExpert?.phone || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            esgExpert: { ...industryFormData.esgExpert!, phone: e.target.value }
                          })
                        }
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="p-2 border rounded-lg bg-white md:col-span-2"
                        value={industryFormData.esgExpert?.email || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            esgExpert: { ...industryFormData.esgExpert!, email: e.target.value }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Link Teams"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.esgExpert?.teamsLink || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            esgExpert: { ...industryFormData.esgExpert!, teamsLink: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Subtab 2: Decarbonization Pillars */}
              {activeIndustryTab === 'decarbonization' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-sm">Filary Dekarbonizacji</h3>
                    <button
                      onClick={() => {
                        const newPillar = { id: Date.now().toString(), name: '', description: '', priority: 'MEDIUM' as const, requiredCapex: '' };
                        setIndustryFormData({
                          ...industryFormData,
                          decarbonizationPillars: [...(industryFormData.decarbonizationPillars || []), newPillar]
                        });
                      }}
                      className="px-3 py-1 bg-emerald-100 text-[#00915a] rounded-lg font-bold text-xs"
                    >
                      + Dodaj Filar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {industryFormData.decarbonizationPillars?.map((pillar, idx) => (
                      <div key={pillar.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-3">
                        <div className="flex justify-between items-start">
                          <input
                            type="text"
                            placeholder="Nazwa filaru"
                            className="w-1/2 px-2 py-1 border rounded text-sm font-bold"
                            value={pillar.name}
                            onChange={(e) => {
                              const updated = [...(industryFormData.decarbonizationPillars || [])];
                              updated[idx].name = e.target.value;
                              setIndustryFormData({ ...industryFormData, decarbonizationPillars: updated });
                            }}
                          />
                          <button
                            onClick={() => {
                              const updated = [...(industryFormData.decarbonizationPillars || [])];
                              updated.splice(idx, 1);
                              setIndustryFormData({ ...industryFormData, decarbonizationPillars: updated });
                            }}
                            className="text-red-500 text-xs font-bold hover:underline"
                          >
                            Usuń
                          </button>
                        </div>
                        <textarea
                          placeholder="Opis filaru"
                          className="w-full px-2 py-1 border rounded text-xs"
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => {
                            const updated = [...(industryFormData.decarbonizationPillars || [])];
                            updated[idx].description = e.target.value;
                            setIndustryFormData({ ...industryFormData, decarbonizationPillars: updated });
                          }}
                        />
                        <div className="flex space-x-4 text-xs">
                          <div>
                            <label className="font-bold text-gray-600 mr-2">Priorytet:</label>
                            <select
                              value={pillar.priority}
                              onChange={(e) => {
                                const updated = [...(industryFormData.decarbonizationPillars || [])];
                                updated[idx].priority = e.target.value as any;
                                setIndustryFormData({ ...industryFormData, decarbonizationPillars: updated });
                              }}
                              className="border rounded px-2 py-1"
                            >
                              <option value="HIGH">Wysoki</option>
                              <option value="MEDIUM">Średni</option>
                              <option value="LOW">Niski</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-bold text-gray-600 mr-2">Wymagany CAPEX:</label>
                            <input
                              type="text"
                              placeholder="np. Wysoki"
                              className="border rounded px-2 py-1 w-24"
                              value={pillar.requiredCapex}
                              onChange={(e) => {
                                const updated = [...(industryFormData.decarbonizationPillars || [])];
                                updated[idx].requiredCapex = e.target.value;
                                setIndustryFormData({ ...industryFormData, decarbonizationPillars: updated });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtab 3: ESG Limitations */}
              {activeIndustryTab === 'esgLimitations' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-sm">Ograniczenia ESG (Polityki)</h3>
                    <button
                      onClick={() => {
                        const newLimitation = { id: Date.now().toString(), title: '', riskLevel: 'MEDIUM' as const, description: '' };
                        setIndustryFormData({
                          ...industryFormData,
                          esgLimitations: [...(industryFormData.esgLimitations || []), newLimitation]
                        });
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg font-bold text-xs"
                    >
                      + Dodaj Ograniczenie
                    </button>
                  </div>
                  <div className="space-y-3">
                    {industryFormData.esgLimitations?.map((limitation, idx) => (
                      <div key={limitation.id} className="p-4 border border-red-100 rounded-xl bg-red-50/30 space-y-3">
                        <div className="flex justify-between items-start">
                          <input
                            type="text"
                            placeholder="Tytuł ograniczenia"
                            className="w-2/3 px-2 py-1 border rounded text-sm font-bold"
                            value={limitation.title}
                            onChange={(e) => {
                              const updated = [...(industryFormData.esgLimitations || [])];
                              updated[idx].title = e.target.value;
                              setIndustryFormData({ ...industryFormData, esgLimitations: updated });
                            }}
                          />
                          <button
                            onClick={() => {
                              const updated = [...(industryFormData.esgLimitations || [])];
                              updated.splice(idx, 1);
                              setIndustryFormData({ ...industryFormData, esgLimitations: updated });
                            }}
                            className="text-red-500 text-xs font-bold hover:underline"
                          >
                            Usuń
                          </button>
                        </div>
                        <textarea
                          placeholder="Opis polityki / ryzyka"
                          className="w-full px-2 py-1 border rounded text-xs"
                          rows={2}
                          value={limitation.description}
                          onChange={(e) => {
                            const updated = [...(industryFormData.esgLimitations || [])];
                            updated[idx].description = e.target.value;
                            setIndustryFormData({ ...industryFormData, esgLimitations: updated });
                          }}
                        />
                        <div className="text-xs">
                          <label className="font-bold text-gray-600 mr-2">Poziom Ryzyka:</label>
                          <select
                            value={limitation.riskLevel}
                            onChange={(e) => {
                              const updated = [...(industryFormData.esgLimitations || [])];
                              updated[idx].riskLevel = e.target.value as any;
                              setIndustryFormData({ ...industryFormData, esgLimitations: updated });
                            }}
                            className="border rounded px-2 py-1 bg-white"
                          >
                            <option value="HIGH">Wysokie Ryzyko</option>
                            <option value="MEDIUM">Średnie Ryzyko</option>
                            <option value="LOW">Niskie Ryzyko</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtab 4: Checklist */}
              {activeIndustryTab === 'checklist' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-sm">Checklista Pytań do Klienta</h3>
                    <button
                      onClick={() => {
                        const newQuestion = { id: Date.now().toString(), question: '', isDone: false };
                        setIndustryFormData({
                          ...industryFormData,
                          checklist: [...(industryFormData.checklist || []), newQuestion]
                        });
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold text-xs"
                    >
                      + Dodaj Pytanie
                    </button>
                  </div>
                  <div className="space-y-2">
                    {industryFormData.checklist?.map((item, idx) => (
                      <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 border rounded-lg">
                        <span className="text-gray-400 font-bold text-xs">{idx + 1}.</span>
                        <input
                          type="text"
                          placeholder="Treść pytania"
                          className="flex-1 px-2 py-1 border rounded text-sm"
                          value={item.question}
                          onChange={(e) => {
                            const updated = [...(industryFormData.checklist || [])];
                            updated[idx].question = e.target.value;
                            setIndustryFormData({ ...industryFormData, checklist: updated });
                          }}
                        />
                        <button
                          onClick={() => {
                            const updated = [...(industryFormData.checklist || [])];
                            updated.splice(idx, 1);
                            setIndustryFormData({ ...industryFormData, checklist: updated });
                          }}
                          className="text-red-500 text-xs font-bold hover:underline"
                        >
                          Usuń
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtab 5: Sustainable Finance Editor */}
              {activeIndustryTab === 'sustainableFinance' && (
                <div className="space-y-6">
                  {/* Expert Finansowy Contact */}
                  <div className="p-4 bg-emerald-900 text-white rounded-xl space-y-3">
                    <h4 className="font-bold text-emerald-200 text-xs uppercase tracking-wider">
                      Kontakt do Eksperta ds. Finansowania Zrównoważonego
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-900">
                      <input
                        type="text"
                        placeholder="Imię i nazwisko"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.sustainableFinance?.expert?.name || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            sustainableFinance: {
                              ...industryFormData.sustainableFinance,
                              expert: {
                                ...industryFormData.sustainableFinance?.expert!,
                                name: e.target.value
                              }
                            }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Rola"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.sustainableFinance?.expert?.role || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            sustainableFinance: {
                              ...industryFormData.sustainableFinance,
                              expert: {
                                ...industryFormData.sustainableFinance?.expert!,
                                role: e.target.value
                              }
                            }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Telefon"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.sustainableFinance?.expert?.phone || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            sustainableFinance: {
                              ...industryFormData.sustainableFinance,
                              expert: {
                                ...industryFormData.sustainableFinance?.expert!,
                                phone: e.target.value
                              }
                            }
                          })
                        }
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="p-2 border rounded-lg bg-white md:col-span-2"
                        value={industryFormData.sustainableFinance?.expert?.email || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            sustainableFinance: {
                              ...industryFormData.sustainableFinance,
                              expert: {
                                ...industryFormData.sustainableFinance?.expert!,
                                email: e.target.value
                              }
                            }
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Link Teams"
                        className="p-2 border rounded-lg bg-white"
                        value={industryFormData.sustainableFinance?.expert?.teamsLink || ''}
                        onChange={(e) =>
                          setIndustryFormData({
                            ...industryFormData,
                            sustainableFinance: {
                              ...industryFormData.sustainableFinance,
                              expert: {
                                ...industryFormData.sustainableFinance?.expert!,
                                teamsLink: e.target.value
                              }
                            }
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Potentials List Toggles */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-900 text-sm">Zarządzanie potencjałami produktów</h4>
                      <button
                        onClick={() => {
                          const newPotential = {
                            id: Date.now().toString(),
                            key: `pot-${Date.now()}`,
                            name: 'Nowy potencjał',
                            description: '',
                            isAvailable: true,
                            minRevenueMlnPLN: 0
                          };
                          setIndustryFormData({
                            ...industryFormData,
                            sustainableFinance: {
                              ...industryFormData.sustainableFinance,
                              potentials: [...(industryFormData.sustainableFinance?.potentials || []), newPotential]
                            }
                          });
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold text-xs"
                      >
                        + Dodaj Potencjał
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {industryFormData.sustainableFinance?.potentials?.map((pot, idx) => (
                        <div key={pot.id} className="p-4 border rounded-xl bg-gray-50 space-y-2 relative">
                          <div className="absolute top-2 right-2 flex items-center space-x-2">
                            <label className="flex items-center space-x-1 cursor-pointer">
                              <span className="text-xs font-bold text-gray-600">
                                {pot.isAvailable ? 'Dostępny ✓' : 'Niedostępny ✗'}
                              </span>
                              <input
                                type="checkbox"
                                checked={pot.isAvailable}
                                onChange={(e) => {
                                  const updatedPots = [...(industryFormData.sustainableFinance?.potentials || [])];
                                  updatedPots[idx].isAvailable = e.target.checked;
                                  setIndustryFormData({
                                    ...industryFormData,
                                    sustainableFinance: {
                                      ...industryFormData.sustainableFinance,
                                      potentials: updatedPots
                                    }
                                  });
                                }}
                                className="w-4 h-4 accent-[#00915a]"
                              />
                            </label>
                            <button
                              onClick={() => {
                                const updatedPots = [...(industryFormData.sustainableFinance?.potentials || [])];
                                updatedPots.splice(idx, 1);
                                setIndustryFormData({
                                  ...industryFormData,
                                  sustainableFinance: {
                                    ...industryFormData.sustainableFinance,
                                    potentials: updatedPots
                                  }
                                });
                              }}
                              className="text-red-500 text-xs font-bold hover:underline"
                            >
                              Usuń
                            </button>
                          </div>
                          
                          <div className="pt-4 space-y-2">
                            <input
                              type="text"
                              value={pot.name}
                              placeholder="Nazwa potencjału"
                              className="font-bold text-sm text-gray-900 border rounded px-2 py-1 w-full bg-white"
                              onChange={(e) => {
                                const updatedPots = [...(industryFormData.sustainableFinance?.potentials || [])];
                                updatedPots[idx].name = e.target.value;
                                setIndustryFormData({
                                  ...industryFormData,
                                  sustainableFinance: {
                                    ...industryFormData.sustainableFinance,
                                    potentials: updatedPots
                                  }
                                });
                              }}
                            />
                            
                            <textarea
                              value={pot.description}
                              placeholder="Opis potencjału"
                              className="text-xs text-gray-700 border rounded px-2 py-1 w-full bg-white"
                              rows={2}
                              onChange={(e) => {
                                const updatedPots = [...(industryFormData.sustainableFinance?.potentials || [])];
                                updatedPots[idx].description = e.target.value;
                                setIndustryFormData({
                                  ...industryFormData,
                                  sustainableFinance: {
                                    ...industryFormData.sustainableFinance,
                                    potentials: updatedPots
                                  }
                                });
                              }}
                            />

                            <div className="flex items-center space-x-2 text-xs">
                              <span className="font-bold text-gray-600">Min przychody (mln PLN):</span>
                              <input
                                type="number"
                                value={pot.minRevenueMlnPLN || 0}
                                onChange={(e) => {
                                  const updatedPots = [...(industryFormData.sustainableFinance?.potentials || [])];
                                  updatedPots[idx].minRevenueMlnPLN = Number(e.target.value);
                                  setIndustryFormData({
                                    ...industryFormData,
                                    sustainableFinance: {
                                      ...industryFormData.sustainableFinance,
                                      potentials: updatedPots
                                    }
                                  });
                                }}
                                className="w-20 p-1 border rounded bg-white font-bold text-center"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setEditingIndustryId(null)}
                  className="px-4 py-2 border rounded-xl font-bold text-xs hover:bg-gray-100"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleSaveIndustry}
                  className="px-6 py-2 bg-[#00915a] text-white rounded-xl font-bold text-xs hover:bg-[#006646] shadow-sm"
                >
                  Zapisz branżę
                </button>
              </div>
            </div>
          ) : (
            /* INDUSTRY LIST */
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">Lista zdefiniowanych branż PKD</h3>
                <button
                  onClick={handleAddNewIndustry}
                  className="px-4 py-2 bg-[#00915a] text-white rounded-xl font-bold text-xs hover:bg-[#006646] shadow-sm"
                >
                  + Dodaj nową branżę
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {industries.map((ind) => (
                  <div key={ind.id} className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-xl">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#00915a] text-xs bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          PKD {ind.pkd}
                        </span>
                        <h4 className="font-bold text-gray-900 text-base">{ind.name}</h4>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{ind.description}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditIndustry(ind)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDeleteIndustry(ind.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: TOP EMITTERS MANAGEMENT */}
      {mainAdminTab === 'TOP_EMITTERS' && (
        <div className="space-y-6">
          {editingEmitterId ? (
            /* EMITTER EDITOR FORM */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingEmitterId === 'NEW'
                    ? 'Dodaj klienta do Top Emiterów'
                    : `Edycja klienta: ${emitterFormData.name}`}
                </h2>
                <button
                  onClick={() => setEditingEmitterId(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ✕ Zamknij
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nazwa Klienta / Firmy</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-xl"
                    value={emitterFormData.name}
                    onChange={(e) => setEmitterFormData({ ...emitterFormData, name: e.target.value })}
                    placeholder="np. Huta Stal-Metal S.A."
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sektor</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-xl"
                    value={emitterFormData.sectorName}
                    onChange={(e) => setEmitterFormData({ ...emitterFormData, sectorName: e.target.value })}
                    placeholder="np. Hutnictwo"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kod PKD (opcjonalny)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-xl"
                    value={emitterFormData.pkd || ''}
                    onChange={(e) => setEmitterFormData({ ...emitterFormData, pkd: e.target.value })}
                    placeholder="np. 24.10.Z"
                  />
                </div>
              </div>

              {/* Analiza dekarbonizacji Klienta */}
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">
                  Analiza dekarbonizacji Klienta (Tekst)
                </label>
                <textarea
                  rows={5}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  value={emitterFormData.decarbonizationAnalysis}
                  onChange={(e) =>
                    setEmitterFormData({ ...emitterFormData, decarbonizationAnalysis: e.target.value })
                  }
                  placeholder="Opisz strategię dekarbonizacji, kluczowe inwestycje oraz wyzwania..."
                />
              </div>

              {/* Scope Emissions 1, 2, 3 */}
              <div className="p-4 bg-sky-50 rounded-xl space-y-3 border border-sky-100">
                <h4 className="font-bold text-sky-900 text-xs uppercase tracking-wider">
                  Emisje klienta w Scope 1, Scope 2 i Scope 3 (tCO₂e)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Scope 1 (Emisje bezpośrednie)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg bg-white font-mono font-bold"
                      value={emitterFormData.scopeEmissions?.scope1 || 0}
                      onChange={(e) =>
                        setEmitterFormData({
                          ...emitterFormData,
                          scopeEmissions: {
                            ...emitterFormData.scopeEmissions!,
                            scope1: Number(e.target.value)
                          }
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Scope 2 (Energia / ciepło)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg bg-white font-mono font-bold"
                      value={emitterFormData.scopeEmissions?.scope2 || 0}
                      onChange={(e) =>
                        setEmitterFormData({
                          ...emitterFormData,
                          scopeEmissions: {
                            ...emitterFormData.scopeEmissions!,
                            scope2: Number(e.target.value)
                          }
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Scope 3 (Łańcuch wartości)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-lg bg-white font-mono font-bold"
                      value={emitterFormData.scopeEmissions?.scope3 || 0}
                      onChange={(e) =>
                        setEmitterFormData({
                          ...emitterFormData,
                          scopeEmissions: {
                            ...emitterFormData.scopeEmissions!,
                            scope3: Number(e.target.value)
                          }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* CSRD Flag Editor */}
              <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Flaga CSRD</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Podlega CSRD?</label>
                    <select
                      value={emitterFormData.csrdFlag?.applies ? 'TAK' : 'NIE'}
                      onChange={(e) =>
                        setEmitterFormData({
                          ...emitterFormData,
                          csrdFlag: {
                            ...emitterFormData.csrdFlag!,
                            applies: e.target.value === 'TAK'
                          }
                        })
                      }
                      className="w-full p-2 border rounded-lg bg-white font-bold"
                    >
                      <option value="TAK">TAK (Podlega)</option>
                      <option value="NIE">NIE (Nie podlega)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Rok / Termin obowiązku</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg bg-white"
                      value={emitterFormData.csrdFlag?.effectiveYear || ''}
                      onChange={(e) =>
                        setEmitterFormData({
                          ...emitterFormData,
                          csrdFlag: {
                            ...emitterFormData.csrdFlag!,
                            effectiveYear: e.target.value
                          }
                        })
                      }
                      placeholder="np. Obowiązek od roku 2024"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Uzasadnienie / Kryteria</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg bg-white"
                      value={emitterFormData.csrdFlag?.reason || ''}
                      onChange={(e) =>
                        setEmitterFormData({
                          ...emitterFormData,
                          csrdFlag: {
                            ...emitterFormData.csrdFlag!,
                            reason: e.target.value
                          }
                        })
                      }
                      placeholder="Przekroczone progi zatrudnienia..."
                    />
                  </div>
                </div>
              </div>

              {/* Trajectory Editor */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-900 text-sm">
                    Punkty trajektorii emisyjnej (Wykres Liniowy)
                  </h4>
                  <button
                    onClick={() => {
                      const newPoints = [...(emitterFormData.trajectory || [])];
                      newPoints.push({
                        year: 2025,
                        clientEmissions: 50000,
                        sectorTarget15C: 45000,
                        sectorTarget20C: 48000
                      });
                      setEmitterFormData({ ...emitterFormData, trajectory: newPoints });
                    }}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800"
                  >
                    + Dodaj rok
                  </button>
                </div>

                <div className="space-y-2">
                  {emitterFormData.trajectory?.map((pt, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-xs bg-gray-50 p-2 rounded-lg">
                      <input
                        type="number"
                        placeholder="Rok"
                        className="w-20 p-1.5 border rounded bg-white font-bold"
                        value={pt.year}
                        onChange={(e) => {
                          const updated = [...(emitterFormData.trajectory || [])];
                          updated[idx].year = Number(e.target.value);
                          setEmitterFormData({ ...emitterFormData, trajectory: updated });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Emisje Klienta (t)"
                        className="w-36 p-1.5 border rounded bg-white font-bold"
                        value={pt.clientEmissions}
                        onChange={(e) => {
                          const updated = [...(emitterFormData.trajectory || [])];
                          updated[idx].clientEmissions = Number(e.target.value);
                          setEmitterFormData({ ...emitterFormData, trajectory: updated });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Cel 1.5C (t)"
                        className="w-32 p-1.5 border rounded bg-white"
                        value={pt.sectorTarget15C}
                        onChange={(e) => {
                          const updated = [...(emitterFormData.trajectory || [])];
                          updated[idx].sectorTarget15C = Number(e.target.value);
                          setEmitterFormData({ ...emitterFormData, trajectory: updated });
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Cel 2.0C (t)"
                        className="w-32 p-1.5 border rounded bg-white"
                        value={pt.sectorTarget20C}
                        onChange={(e) => {
                          const updated = [...(emitterFormData.trajectory || [])];
                          updated[idx].sectorTarget20C = Number(e.target.value);
                          setEmitterFormData({ ...emitterFormData, trajectory: updated });
                        }}
                      />
                      <button
                        onClick={() => {
                          const updated = [...(emitterFormData.trajectory || [])];
                          updated.splice(idx, 1);
                          setEmitterFormData({ ...emitterFormData, trajectory: updated });
                        }}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setEditingEmitterId(null)}
                  className="px-4 py-2 border rounded-xl font-bold text-xs hover:bg-gray-100"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleSaveEmitter}
                  className="px-6 py-2 bg-sky-600 text-white rounded-xl font-bold text-xs hover:bg-sky-700 shadow-sm"
                >
                  Zapisz Klienta
                </button>
              </div>
            </div>
          ) : (
            /* EMITTER LIST */
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">Lista Top Emiterów</h3>
                <button
                  onClick={handleAddNewEmitter}
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl font-bold text-xs hover:bg-sky-700 shadow-sm"
                >
                  + Dodaj nowego klienta
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {topEmitters.map((client) => {
                  const total =
                    client.scopeEmissions.scope1 +
                    client.scopeEmissions.scope2 +
                    client.scopeEmissions.scope3;
                  return (
                    <div
                      key={client.id}
                      className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-xl"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-gray-900 text-base">{client.name}</h4>
                          <span className="text-xs bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full font-bold border border-sky-100">
                            {client.sectorName}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              client.csrdFlag.applies
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            CSRD: {client.csrdFlag.applies ? 'TAK' : 'NIE'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono">
                          Łącznie: {total.toLocaleString('pl-PL')} tCO₂e (Scope 1: {client.scopeEmissions.scope1}, Scope 2: {client.scopeEmissions.scope2}, Scope 3: {client.scopeEmissions.scope3})
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditEmitter(client)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                        >
                          Edytuj
                        </button>
                        <button
                          onClick={() => handleDeleteEmitter(client.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg"
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PDF Export Footer */}
      <PdfExportFooter
        elementId="admin-screen"
        reportTitle="Panel Zarządzania Bazy Wiedzy CarbonBiz"
        fileNamePrefix="Raport_Bazy_Wiedzy"
        subtitle="Wygeneruj i pobierz raport z konfiguracją zdefiniowanych branż i klientów w formacie PDF."
      />
    </div>
  );
};

export default AdminView;
