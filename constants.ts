import { Industry, TopEmitterClient, SustainablePotentialItem, Analyst } from './types';

export const DEFAULT_SUSTAINABLE_POTENTIALS: SustainablePotentialItem[] = [
  {
    id: 'pot-1',
    key: 'kredyt_dekarbonizacyjny',
    name: 'Kredyt dekarbonizacyjny',
    description: 'Finansowanie dedykowane bezpośrednim inwestycjom w redukcję emisji i transformację energetyczną.',
    isAvailable: true,
    minRevenueMlnPLN: 10
  },
  {
    id: 'pot-2',
    key: 'sll',
    name: 'SLL',
    description: 'Kredyt powiązany z realizacją kluczowych wskaźników efektywności ESG (KPI) i rabatem na marży.',
    isAvailable: true,
    minRevenueMlnPLN: 50
  },
  {
    id: 'pot-3',
    key: 'esg_rating_loan',
    name: 'ESG rating linked loan',
    description: 'Finansowanie warunkowane utrzymaniem lub poprawą niezależnego ratingu ESG.',
    isAvailable: true,
    minRevenueMlnPLN: 100
  },
  {
    id: 'pot-4',
    key: 'kredyt_ekologiczny',
    name: 'Kredy ekologiczny',
    description: 'Preferencyjne wsparcie na termomodernizację, wymianę maszyn oraz wdrażanie systemów OZE.',
    isAvailable: true,
    minRevenueMlnPLN: 5
  },
  {
    id: 'pot-5',
    key: 'pure_player',
    name: 'Status Pure Player',
    description: 'Certyfikacja podmiotu, którego ponad 90% działalności spełnia kryteria Taksonomii UE.',
    isAvailable: false,
    minRevenueMlnPLN: 20
  },
  {
    id: 'pot-6',
    key: 'envirly',
    name: 'Potencjał na Envirly',
    description: 'Wdrożenie platformy zarządczej do automatycznej kalkulacji i raportowania śladu węglowego.',
    isAvailable: true,
    minRevenueMlnPLN: 15
  },
  {
    id: 'pot-7',
    key: 'fx',
    name: 'FX',
    description: 'Zabezpieczenie ryzyka kursowego dla kontraktów na zakupy niskoemisyjnych technologii.',
    isAvailable: true,
    minRevenueMlnPLN: 30
  },
  {
    id: 'pot-8',
    key: 'commodities',
    name: 'Commodities',
    description: 'Strukturyzowane instrumenty zabezpieczające ceny energii elektrycznej, gazu i uprawnień CO2.',
    isAvailable: true,
    minRevenueMlnPLN: 25
  }
];

export const DEFAULT_SUSTAINABLE_EXPERT: Analyst = {
  name: 'Krzysztof Majewski',
  role: 'Ekspert ds. Finansowania Zrównoważonego',
  phone: '+48 500 800 900',
  email: 'krzysztof.majewski@bnpparibas.pl',
  teamsLink: 'https://teams.microsoft.com/l/chat/0/0?users=krzysztof.majewski@bnpparibas.pl'
};

export const INITIAL_INDUSTRIES: Industry[] = [
  {
    id: '1',
    pkd: '10.11.Z',
    name: 'Przetwórstwo mięsa',
    description: 'Branża przetwórstwa mięsa obejmuje procesy przetwarzania mięsa pochodzącego z chowu zwierząt na mięso spożywcze, w tym ubój, rozbiór, obróbkę, konserwację, pakowanie i dystrybucję produktów mięsnych.',
    businessModel: 'Model oparty na wysokim wolumenie przy relatywnie niskich marżach jednostkowych. Kluczowa jest logistyka i zarządzanie łańcuchem dostaw.',
    costDrivers: [
      'Ceny surowca (żywiec)',
      'Energia i chłodnictwo',
      'Koszty logistyki i paliwa',
      'Wymogi sanitarno-weterynaryjne'
    ],
    revenueDrivers: [
      'Eksport na rynki UE i Azję',
      'Marki własne sieci handlowych',
      'Premiumizacja produktów (BIO, EKO)'
    ],
    keyKPIs: [
      { label: 'Yield (Wydajność)', value: '%' },
      { label: 'Margin per kg', value: 'PLN' },
      { label: 'Stock turnover', value: 'Dni' }
    ],
    funFacts: [
      'Polska jest jednym z największych eksporterów drobiu w UE.',
      'Sektor ten przechodzi obecnie intensywną konsolidację.'
    ],
    checklist: [
      { id: 'c1', question: 'Jaki jest udział eksportu w przychodach?', isDone: false, category: 'Biznes' },
      { id: 'c2', question: 'Jak zabezpieczają Państwo ceny surowca?', isDone: false, category: 'Biznes' },
      { id: 'c3', question: 'Czy planowane są inwestycje w automatyzację uboju?', isDone: false, category: 'Biznes' },
      { id: 'c3-esg1', question: 'Czy firma mierzy swój ślad węglowy (emisje w Scope 1, 2 i 3)?', isDone: false, category: 'ESG' },
      { id: 'c3-esg2', question: 'Czy zakład posiada odzysk ciepła z instalacji chłodniczych?', isDone: false, category: 'ESG' }
    ],
    analyst: {
      name: 'Grzegorz Kozieja',
      role: 'Starszy Analityk Sektora Agro',
      phone: '+48 515 675 314',
      email: 'grzegorz.kozieja@bnpparibas.pl',
      teamsLink: 'https://teams.microsoft.com/l/chat/0/0?users=grzegorz.kozieja@bnpparibas.pl'
    },
    esgExpert: {
      name: 'Kamila Michowska',
      role: 'Specjalista ds. Ekspertyzy i Analizy Potencjału ESG',
      phone: '+48 444 555 666',
      email: 'kamila.michowska1@bnpparibas.pl',
      teamsLink: ''
    },
    decarbonizationPillars: [
      {
        id: 'p1',
        name: 'Efektywność energetyczna produkcji',
        description: 'Optymalizacja zużycia energii w procesach chłodzenia i produkcji.',
        sustainablePoints: [
          {
            id: 'sp1',
            text: 'Modernizacja chłodnictwa',
            subpoints: [
              'Wymiana sprężarek na amoniak/CO2',
              'Systemy odzysku ciepła z agregatów'
            ]
          }
        ]
      }
    ],
    esgLimitations: [
      {
        id: 'lim-1',
        name: 'Polityka sektorowa ESG',
        description: 'Wymagana ocena łańcucha dostaw pod kątem dobrostanu zwierząt i deforestacji.',
        points: [
          {
            id: 'p-1',
            text: 'Certyfikacja pasz bezsojowych / bez GMO',
            subpoints: ['Wysoki koszt surowców zastępczych']
          }
        ]
      }
    ],
    sustainableFinance: {
      expert: DEFAULT_SUSTAINABLE_EXPERT,
      potentials: DEFAULT_SUSTAINABLE_POTENTIALS
    }
  },
  {
    id: '2',
    pkd: '62.01.Z',
    name: 'Działalność związana z oprogramowaniem',
    description: 'Tworzenie i wdrażanie systemów IT, aplikacji mobilnych oraz rozwiązań chmurowych.',
    businessModel: 'Opiera się na sprzedaży licencji (SaaS) lub rozliczaniu czasu pracy specjalistów (Time & Material / Fixed Price).',
    costDrivers: [
      'Wynagrodzenia deweloperów',
      'Koszty pozyskania talentów',
      'Infrastruktura chmurowa (AWS/Azure)',
      'Szkolenia i certyfikacje'
    ],
    revenueDrivers: [
      'Abonamenty SaaS',
      'Usługi wdrożeniowe',
      'Utrzymanie i wsparcie (Maintenance)'
    ],
    keyKPIs: [
      { label: 'MRR / ARR', value: 'USD/PLN' },
      { label: 'Churn Rate', value: '%' },
      { label: 'LTV/CAC Ratio', value: 'X' }
    ],
    funFacts: [
      'Branża IT generuje blisko 8% PKB Polski.',
      'Ponad 60% polskich firm IT pracuje dla klientów zagranicznych.'
    ],
    checklist: [
      { id: 'c4', question: 'Jaki procent przychodów to dochód powtarzalny (Recurring)?', isDone: false, category: 'Biznes' },
      { id: 'c5', question: 'Jak wygląda rotacja pracowników w kluczowych zespołach?', isDone: false, category: 'Biznes' },
      { id: 'c6', question: 'Czy centra danych używają energii ze źródeł odnawialnych?', isDone: false, category: 'ESG' }
    ],
    analyst: {
      name: 'Marta Nowak',
      role: 'Ekspert ds. Sektora TMT',
      phone: '+48 700 300 400',
      email: 'marta.wisniewska@bank.pl',
      teamsLink: 'https://teams.microsoft.com/l/chat/0/0?users=marta.wisniewska@bank.pl'
    },
    esgExpert: {
      name: 'Kamila Michowska',
      role: 'Specjalista ds. Ekspertyzy i Analizy Potencjału ESG',
      phone: '+48 444 555 666',
      email: 'kamila.michowska1@bnpparibas.pl',
      teamsLink: ''
    },
    sustainableFinance: {
      expert: DEFAULT_SUSTAINABLE_EXPERT,
      potentials: DEFAULT_SUSTAINABLE_POTENTIALS.map(p => p.key === 'pure_player' ? { ...p, isAvailable: true } : p)
    }
  },
  {
    id: '3',
    pkd: '16.21.Z',
    name: 'Produkcja arkuszy fornirowych i płyt wykonanych na bazie drewna',
    description: 'Działalność polegająca na produkcji arkuszy fornirowych i płyt wykonanych na bazie drewna (sklejka, OSB, MDF).',
    businessModel: 'Model produkcyjny B2B o dużej skali, silnie kapitałochłonny, oparty na długofalowych kontraktach z producentami mebli.',
    costDrivers: [
      'Ceny drewna okrągłego',
      'Energia elektryczna i gaz',
      'Surowce chemiczne (żywice, kleje)'
    ],
    revenueDrivers: [
      'Popyt na polskie meble na rynkach UE',
      'Dynamika budownictwa i wykończenia wnętrz'
    ],
    keyKPIs: [
      { label: 'Marża EBITDA', value: '8-14%' },
      { label: 'Net Debt/EBITDA', value: 'x' }
    ],
    funFacts: [
      'Polska jest jednym z trzech największych producentów płyt drewnopochodnych w Europie.'
    ],
    checklist: [
      { id: 'c7', question: 'Jaki jest udział drewna certyfikowanego FSC/PEFC?', isDone: false, category: 'ESG' }
    ],
    analyst: {
      name: 'Jan Kowalski',
      role: 'Ekspert Sektorowy',
      phone: '+48 111 222 333',
      email: 'jan.kowalski@bank.pl',
      teamsLink: ''
    },
    esgExpert: {
      name: 'Kamila Michowska',
      role: 'Specjalista ds. Ekspertyzy i Analizy Potencjału ESG',
      phone: '+48 444 555 666',
      email: 'kamila.michowska1@bnpparibas.pl',
      teamsLink: ''
    },
    sustainableFinance: {
      expert: DEFAULT_SUSTAINABLE_EXPERT,
      potentials: DEFAULT_SUSTAINABLE_POTENTIALS
    }
  }
];

export const INITIAL_TOP_EMITTERS: TopEmitterClient[] = [
  {
    id: 'top-1',
    name: 'Huta Stal-Metal S.A.',
    sectorName: 'Hutnictwo i Przetwórstwo Stali',
    pkd: '24.10.Z',
    decarbonizationAnalysis: `Klient jest jednym z kluczowych producentów wyrobów stalowych w Europie Środkowej. Przejście z tradycyjnego wielkiego pieca (BF-BOF) na piec elektryczny (EAF) zasilany energią z odnawialnych źródeł stanowi priorytet strategiczny.
    
**Główne wnioski i cele:**
- Planowana budowa instalacji fotowoltaicznej 45 MWp do końca 2026 r.
- Przejście na zielony wodór w procesach redukcji żelaza (DRI-H2) od 2030 r.
- Oczekiwana redukcja emisji Scope 1 i 2 o 42% do 2028 roku.
- Potrzebne finansowanie strukturyzowane (SLL / Kredyt Dekarbonizacyjny) na kwotę 180 mln PLN.`,
    scopeEmissions: {
      scope1: 450000,
      scope2: 180000,
      scope3: 120000
    },
    trajectory: [
      { year: 2020, clientEmissions: 820000, sectorTarget15C: 800000, sectorTarget20C: 810000 },
      { year: 2022, clientEmissions: 790000, sectorTarget15C: 720000, sectorTarget20C: 750000 },
      { year: 2024, clientEmissions: 750000, sectorTarget15C: 630000, sectorTarget20C: 680000 },
      { year: 2026, clientEmissions: 610000, sectorTarget15C: 520000, sectorTarget20C: 590000 },
      { year: 2028, clientEmissions: 430000, sectorTarget15C: 400000, sectorTarget20C: 480000 },
      { year: 2030, clientEmissions: 260000, sectorTarget15C: 250000, sectorTarget20C: 360000 },
      { year: 2035, clientEmissions: 110000, sectorTarget15C: 100000, sectorTarget20C: 210000 },
      { year: 2040, clientEmissions: 30000, sectorTarget15C: 25000, sectorTarget20C: 90000 }
    ],
    csrdFlag: {
      applies: true,
      reason: 'Przekroczone progi: zatrudnienie > 350 osób, przychody netto > 210 mln PLN.',
      effectiveYear: 'Obowiązek od roku obrotowego 2024 (Raportowanie w 2025 r.)'
    }
  },
  {
    id: 'top-2',
    name: 'Cem-Bud Polska Sp. z o.o.',
    sectorName: 'Produkcja Cementu i Materiałów Budowlanych',
    pkd: '23.51.Z',
    decarbonizationAnalysis: `Wiodący producent cementu portlandzkiego oraz mieszanek betonowych. Proces dekarbonizacji skupia się na redukcji wskaźnika klinkierowego, odzysku ciepła odpadowego z pieców obrotowych oraz technologiiwychwytywania CO2 (CCUS).

**Główne cele i wyzwania:**
- Zwiększenie udziału paliw alternatywnych (RDF) w miksie energetycznym pieców do 85%.
- Wdrożenie platformy Envirly do ciągłego monitorowania dostawców kruszywa i chemii budowlanej (Scope 3).
- Nakłady inwestycyjne w wysokie efektywności energetyczne szacowane na 95 mln PLN.`,
    scopeEmissions: {
      scope1: 620000,
      scope2: 95000,
      scope3: 145000
    },
    trajectory: [
      { year: 2020, clientEmissions: 950000, sectorTarget15C: 900000, sectorTarget20C: 920000 },
      { year: 2022, clientEmissions: 910000, sectorTarget15C: 810000, sectorTarget20C: 850000 },
      { year: 2024, clientEmissions: 860000, sectorTarget15C: 710000, sectorTarget20C: 770000 },
      { year: 2026, clientEmissions: 720000, sectorTarget15C: 590000, sectorTarget20C: 670000 },
      { year: 2028, clientEmissions: 540000, sectorTarget15C: 450000, sectorTarget20C: 550000 },
      { year: 2030, clientEmissions: 380000, sectorTarget15C: 300000, sectorTarget20C: 420000 },
      { year: 2035, clientEmissions: 180000, sectorTarget15C: 120000, sectorTarget20C: 250000 },
      { year: 2040, clientEmissions: 50000, sectorTarget15C: 30000, sectorTarget20C: 110000 }
    ],
    csrdFlag: {
      applies: true,
      reason: 'Duża jednostka zainteresowania publicznego: zatrudnienie > 500 osób.',
      effectiveYear: 'Obowiązek od roku obrotowego 2024 (Raportowanie w 2025 r.)'
    }
  },
  {
    id: 'top-3',
    name: 'Agro-Przetwórnia Pol-Food Group',
    sectorName: 'Przetwórstwo Spożywcze i Chłodnictwo',
    pkd: '10.11.Z',
    decarbonizationAnalysis: `Kombinat przetwórstwa mięsnego i garmażeryjnego z własną siecią chłodni logistycznych.
    
**Główne kierunki:**
- Wymiana instalacji freonowych na amoniak oraz pomp ciepła.
- Budowa własnej biogazowni rolniczo-przemysłowej o mocy 2 MW.
- Finansowanie z wykorzystaniem Kredytu Dekarbonizacyjnego i Ekologicznego.`,
    scopeEmissions: {
      scope1: 65000,
      scope2: 110000,
      scope3: 210000
    },
    trajectory: [
      { year: 2020, clientEmissions: 410000, sectorTarget15C: 400000, sectorTarget20C: 405000 },
      { year: 2022, clientEmissions: 395000, sectorTarget15C: 360000, sectorTarget20C: 380000 },
      { year: 2024, clientEmissions: 385000, sectorTarget15C: 310000, sectorTarget20C: 340000 },
      { year: 2026, clientEmissions: 290000, sectorTarget15C: 240000, sectorTarget20C: 290000 },
      { year: 2028, clientEmissions: 190000, sectorTarget15C: 170000, sectorTarget20C: 230000 },
      { year: 2030, clientEmissions: 110000, sectorTarget15C: 100000, sectorTarget20C: 160000 },
      { year: 2035, clientEmissions: 45000, sectorTarget15C: 40000, sectorTarget20C: 85000 },
      { year: 2040, clientEmissions: 12000, sectorTarget15C: 10000, sectorTarget20C: 35000 }
    ],
    csrdFlag: {
      applies: false,
      reason: 'Sektor MŚP poniżej progu zatrudnienia (< 250 os.) oraz sumy bilansowej.',
      effectiveYear: 'Dobrowolne raportowanie (standard VSME)'
    }
  }
];
