
import { Industry } from './types';

export const INITIAL_INDUSTRIES: Industry[] = [
  {
    id: '1',
    pkd: '10.11.Z',
    name: 'Przetwórstwo mięsa',
    description: 'Działalność polegająca na uboju zwierząt i przetwarzaniu mięsa na wędliny, konserwy i inne produkty.',
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
      { id: 'c1', question: 'Jaki jest udział eksportu w przychodach?', isDone: false },
      { id: 'c2', question: 'Jak zabezpieczają Państwo ceny surowca?', isDone: false },
      { id: 'c3', question: 'Czy planowane są inwestycje w automatyzację uboju?', isDone: false }
    ],
    analyst: {
      name: 'Adam Nowak',
      role: 'Starszy Analityk Sektora Agro',
      phone: '+48 600 100 200',
      email: 'adam.nowak@bank.pl',
      teamsLink: 'https://teams.microsoft.com/l/chat/0/0?users=adam.nowak@bank.pl'
    },
    decarbonizationPillars: [
      {
        id: 'p1',
        name: 'Efektywność Energetyczna',
        description: 'Optymalizacja zużycia energii w procesach chłodzenia i produkcji.',
        sustainablePoints: [
          {
            id: 'sp1',
            text: 'Modernizacja instalacji chłodniczych',
            subpoints: [
              'Wymiana czynników chłodniczych na naturalne (np. amoniak, CO2)',
              'Instalacja systemów odzysku ciepła z agregatów chłodniczych'
            ]
          },
          {
            id: 'sp2',
            text: 'Termomodernizacja budynków',
            subpoints: [
              'Docieplenie hal produkcyjnych',
              'Wymiana oświetlenia na LED'
            ]
          }
        ]
      },
      {
        id: 'p2',
        name: 'Odnawialne Źródła Energii (OZE)',
        description: 'Przejście na zasilanie z zielonej energii.',
        sustainablePoints: [
          {
            id: 'sp3',
            text: 'Instalacje fotowoltaiczne',
            subpoints: [
              'Montaż paneli PV na dachach hal',
              'Budowa farm fotowoltaicznych na terenach przyległych'
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    pkd: '62.01.Z',
    name: 'Działalność związana z oprogramowaniem',
    description: 'Tworzenie i wdrażanie systemov IT, aplikacji mobilnych oraz rozwiązań chmurowych.',
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
      { id: 'c4', question: 'Jaki procent przychodów to dochód powtarzalny (Recurring)?', isDone: false },
      { id: 'c5', question: 'Jak wygląda rotacja pracowników w kluczowych zespołach?', isDone: false },
      { id: 'c6', question: 'Kto posiada autorskie prawa majątkowe do kluczowego kodu?', isDone: false }
    ],
    analyst: {
      name: 'Marta Wiśniewska',
      role: 'Ekspert ds. Sektora TMT',
      phone: '+48 700 300 400',
      email: 'marta.wisniewska@bank.pl',
      teamsLink: 'https://teams.microsoft.com/l/chat/0/0?users=marta.wisniewska@bank.pl'
    }
  }
];
