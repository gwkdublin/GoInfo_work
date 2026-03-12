
import React, { useState } from 'react';
import { Industry, ChecklistItem, Analyst } from '../types';
import { generateIndustryDraft } from '../geminiService';

interface AdminViewProps {
  industries: Industry[];
  setIndustries: (updated: Industry[]) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ industries, setIndustries }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'decarbonization'>('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Industry>>({
    pkd: '',
    name: '',
    description: '',
    businessModel: '',
    costDrivers: [],
    revenueDrivers: [],
    keyKPIs: [],
    funFacts: [],
    checklist: [],
    analyst: {
      name: '',
      role: '',
      phone: '',
      email: '',
      teamsLink: ''
    },
    decarbonizationPillars: []
  });

  const handleEdit = (ind: Industry) => {
    setEditingId(ind.id);
    setActiveTab('general');
    setErrorMessage(null);
    setFormData({
      ...ind,
      analyst: ind.analyst || { name: '', role: '', phone: '', email: '', teamsLink: '' },
      decarbonizationPillars: ind.decarbonizationPillars || []
    });
  };

  const handleAddNew = () => {
    setEditingId('NEW');
    setActiveTab('general');
    setErrorMessage(null);
    setFormData({
      pkd: '',
      name: '',
      description: '',
      businessModel: '',
      costDrivers: [],
      revenueDrivers: [],
      keyKPIs: [],
      funFacts: [],
      checklist: [],
      analyst: {
        name: '',
        role: '',
        phone: '',
        email: '',
        teamsLink: ''
      },
      decarbonizationPillars: []
    });
  };

  const handleAutoFill = async () => {
    if (!formData.pkd || !formData.name) {
      setErrorMessage("Proszę wpisać kod PKD i nazwę branży przed generowaniem.");
      return;
    }
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const draft = await generateIndustryDraft(formData.pkd!, formData.name!);
      setFormData(prev => ({ ...prev, ...draft }));
    } catch (err: any) {
      setErrorMessage(err.message || "Wystąpił błąd podczas generowania treści AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!formData.pkd || !formData.name) return;

    const cleanedData = {
      ...formData,
      decarbonizationPillars: formData.decarbonizationPillars?.map(pillar => ({
        ...pillar,
        sustainablePoints: pillar.sustainablePoints.map(point => ({
          ...point,
          subpoints: point.subpoints.filter(s => s.trim() !== '')
        }))
      }))
    };

    let updated: Industry[];
    if (editingId === 'NEW') {
      const newIndustry: Industry = {
        ...cleanedData as Industry,
        id: Date.now().toString()
      };
      updated = [...industries, newIndustry];
    } else {
      updated = industries.map(ind => ind.id === editingId ? (cleanedData as Industry) : ind);
    }
    
    setIndustries(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę branżę?')) {
      setIndustries(industries.filter(ind => ind.id !== id));
    }
  };

  const updateAnalyst = (field: keyof Analyst, value: string) => {
    setFormData({
      ...formData,
      analyst: {
        ...(formData.analyst as Analyst),
        [field]: value
      }
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(industries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carbonbiz_dane_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        if (Array.isArray(parsedData)) {
          if (confirm('Czy na pewno chcesz nadpisać obecne dane zaimportowanymi?')) {
            setIndustries(parsedData);
            alert('Dane zostały pomyślnie zaimportowane!');
          }
        } else {
          alert('Nieprawidłowy format pliku. Oczekiwano listy branż.');
        }
      } catch (error) {
        alert('Wystąpił błąd podczas odczytu pliku JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (editingId) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{editingId === 'NEW' ? 'Dodaj nową branżę' : 'Edytuj branżę'}</h2>
          <button 
            onClick={() => setEditingId(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {errorMessage}
          </div>
        )}

        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${
              activeTab === 'general' ? 'text-[#00915a]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ogólne Informacje
            {activeTab === 'general' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00915a] rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('decarbonization')}
            className={`pb-4 px-2 font-bold text-sm transition-colors relative ${
              activeTab === 'decarbonization' ? 'text-[#00915a]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Filary Dekarbonizacji
            {activeTab === 'decarbonization' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00915a] rounded-t-full"></div>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === 'general' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Kod PKD</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a]"
                    value={formData.pkd}
                    onChange={e => setFormData({...formData, pkd: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nazwa Branży</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a]"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAutoFill}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 bg-emerald-50 text-[#00915a] px-4 py-2 rounded-lg font-bold border border-[#00915a]/20 hover:bg-emerald-100 disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span>{isGenerating ? 'Generowanie przez AI...' : 'Wygeneruj dane przez AI'}</span>
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informacje Kontaktowe (Analityk)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Imię i Nazwisko</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a]"
                      value={formData.analyst?.name}
                      onChange={e => updateAnalyst('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Rola / Stanowisko</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a]"
                      value={formData.analyst?.role}
                      onChange={e => updateAnalyst('role', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Telefon</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a]"
                      value={formData.analyst?.phone}
                      onChange={e => updateAnalyst('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a]"
                      value={formData.analyst?.email}
                      onChange={e => updateAnalyst('email', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Link do Teams (opcjonalny)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a]"
                      value={formData.analyst?.teamsLink}
                      onChange={e => updateAnalyst('teamsLink', e.target.value)}
                      placeholder="https://teams.microsoft.com/l/chat/..."
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-1">Krótki Opis</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a]"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Model Biznesowy</label>
                <textarea 
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a]"
                  value={formData.businessModel}
                  onChange={e => setFormData({...formData, businessModel: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Czynniki Kosztowe (po przecinku)</label>
                  <textarea 
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                    value={formData.costDrivers?.join(', ')}
                    onChange={e => setFormData({...formData, costDrivers: e.target.value.split(',').map(s => s.trim())})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Czynniki Przychodowe (po przecinku)</label>
                  <textarea 
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                    value={formData.revenueDrivers?.join(', ')}
                    onChange={e => setFormData({...formData, revenueDrivers: e.target.value.split(',').map(s => s.trim())})}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Zarządzanie Filarami Dekarbonizacji</h3>
                <button
                  onClick={() => {
                    const newPillar = {
                      id: Date.now().toString(),
                      name: '',
                      description: '',
                      sustainablePoints: []
                    };
                    setFormData({
                      ...formData,
                      decarbonizationPillars: [...(formData.decarbonizationPillars || []), newPillar]
                    });
                  }}
                  className="bg-emerald-50 text-[#00915a] px-4 py-2 rounded-lg font-bold text-sm border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  + Dodaj Filar
                </button>
              </div>

              {(!formData.decarbonizationPillars || formData.decarbonizationPillars.length === 0) ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-500 text-sm">Brak zdefiniowanych filarów dekarbonizacji.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {formData.decarbonizationPillars.map((pillar, pIndex) => (
                    <div key={pillar.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                      <button
                        onClick={() => {
                          const newPillars = [...(formData.decarbonizationPillars || [])];
                          newPillars.splice(pIndex, 1);
                          setFormData({ ...formData, decarbonizationPillars: newPillars });
                        }}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                        title="Usuń filar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Nazwa Filaru</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a] text-sm font-bold"
                            value={pillar.name}
                            onChange={(e) => {
                              const newPillars = [...(formData.decarbonizationPillars || [])];
                              newPillars[pIndex].name = e.target.value;
                              setFormData({ ...formData, decarbonizationPillars: newPillars });
                            }}
                            placeholder="np. Efektywność Energetyczna"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Krótki Opis</label>
                          <textarea
                            rows={2}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00915a] text-sm"
                            value={pillar.description}
                            onChange={(e) => {
                              const newPillars = [...(formData.decarbonizationPillars || [])];
                              newPillars[pIndex].description = e.target.value;
                              setFormData({ ...formData, decarbonizationPillars: newPillars });
                            }}
                            placeholder="Opis filaru..."
                          />
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold text-emerald-800">Co możemy oznaczyć jako zrównoważone?</h4>
                          <button
                            onClick={() => {
                              const newPillars = [...(formData.decarbonizationPillars || [])];
                              newPillars[pIndex].sustainablePoints.push({
                                id: Date.now().toString(),
                                text: '',
                                subpoints: []
                              });
                              setFormData({ ...formData, decarbonizationPillars: newPillars });
                            }}
                            className="text-xs font-bold text-[#00915a] hover:text-[#006646]"
                          >
                            + Dodaj Punkt
                          </button>
                        </div>

                        {pillar.sustainablePoints.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">Brak punktów w tym filarze.</p>
                        ) : (
                          <div className="space-y-4">
                            {pillar.sustainablePoints.map((point, spIndex) => (
                              <div key={point.id} className="pl-4 border-l-2 border-emerald-200 relative">
                                <button
                                  onClick={() => {
                                    const newPillars = [...(formData.decarbonizationPillars || [])];
                                    newPillars[pIndex].sustainablePoints.splice(spIndex, 1);
                                    setFormData({ ...formData, decarbonizationPillars: newPillars });
                                  }}
                                  className="absolute -left-2.5 top-2 bg-white text-red-400 hover:text-red-600 rounded-full"
                                  title="Usuń punkt"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                </button>
                                
                                <input
                                  type="text"
                                  className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#00915a] text-sm font-semibold mb-2"
                                  value={point.text}
                                  onChange={(e) => {
                                    const newPillars = [...(formData.decarbonizationPillars || [])];
                                    newPillars[pIndex].sustainablePoints[spIndex].text = e.target.value;
                                    setFormData({ ...formData, decarbonizationPillars: newPillars });
                                  }}
                                  placeholder="Główny punkt (np. Modernizacja instalacji)"
                                />
                                
                                <div className="pl-4">
                                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Podpunkty (po enterze)</label>
                                  <textarea
                                    rows={2}
                                    className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#00915a] text-xs text-gray-600"
                                    value={point.subpoints.join('\n')}
                                    onChange={(e) => {
                                      const newPillars = [...(formData.decarbonizationPillars || [])];
                                      newPillars[pIndex].sustainablePoints[spIndex].subpoints = e.target.value.split('\n');
                                      setFormData({ ...formData, decarbonizationPillars: newPillars });
                                    }}
                                    placeholder="Podpunkt 1&#10;Podpunkt 2"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-4 pt-8">
            <button 
              onClick={handleSave}
              className="flex-1 bg-[#00915a] text-white py-3 rounded-xl font-bold hover:bg-[#006646] transition-colors"
            >
              Zapisz Branżę
            </button>
            <button 
              onClick={() => setEditingId(null)}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Zarządzanie bazą branż</h2>
          <p className="text-sm text-gray-500">Dodawaj, edytuj lub usuwaj branże dostępne dla doradców.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleExport}
            className="bg-white text-gray-700 px-4 py-2.5 rounded-xl font-bold flex items-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-all text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Eksportuj (JSON)
          </button>
          <label className="bg-white text-gray-700 px-4 py-2.5 rounded-xl font-bold flex items-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-all text-sm cursor-pointer">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Importuj (JSON)
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button 
            onClick={handleAddNew}
            className="bg-[#00915a] text-white px-6 py-2.5 rounded-xl font-bold flex items-center shadow-md hover:bg-[#006646] transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Dodaj branżę
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">PKD</th>
              <th className="px-6 py-4">Nazwa Branży</th>
              <th className="px-6 py-4">Analityk</th>
              <th className="px-6 py-4 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {industries.map((ind) => (
              <tr key={ind.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded">{ind.pkd}</span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">{ind.name}</td>
                <td className="px-6 py-4">
                  {ind.analyst?.name ? (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-bold italic">
                      {ind.analyst.name}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">Brak przypisanego</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button 
                    onClick={() => handleEdit(ind)}
                    className="text-[#00915a] hover:text-[#006646] font-bold text-sm"
                  >
                    Edytuj
                  </button>
                  <button 
                    onClick={() => handleDelete(ind.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-sm"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminView;
