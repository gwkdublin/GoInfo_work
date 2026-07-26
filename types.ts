export interface ChecklistItem {
  id: string;
  question: string;
  isDone: boolean;
  category?: 'Biznes' | 'ESG';
}

export interface Analyst {
  name: string;
  role: string;
  phone: string;
  email: string;
  teamsLink: string;
}

export interface SustainablePoint {
  id: string;
  text: string;
  subpoints: string[];
}

export interface DecarbonizationPillar {
  id: string;
  name: string;
  description: string;
  sustainablePoints: SustainablePoint[];
}

export interface ESGLimitationPoint {
  id: string;
  text: string;
  subpoints: string[];
}

export interface ESGLimitation {
  id: string;
  name: string;
  description: string;
  points: ESGLimitationPoint[];
}

export interface SustainablePotentialItem {
  id: string;
  key: 'kredyt_dekarbonizacyjny' | 'sll' | 'esg_rating_loan' | 'kredyt_ekologiczny' | 'pure_player' | 'envirly' | 'fx' | 'commodities' | string;
  name: string;
  description?: string;
  isAvailable: boolean;
  minRevenueMlnPLN?: number; // Minimum revenue in PLN million for availability
  customNote?: string;
}

export interface SustainableFinanceConfig {
  expert?: Analyst;
  potentials?: SustainablePotentialItem[];
}

export interface Industry {
  id: string;
  pkd: string;
  name: string;
  description: string;
  businessModel: string;
  costDrivers: string[];
  revenueDrivers: string[];
  keyKPIs: { label: string; value: string }[];
  funFacts: string[];
  checklist: ChecklistItem[];
  analyst?: Analyst;
  esgExpert?: Analyst;
  decarbonizationPillars?: DecarbonizationPillar[];
  esgLimitations?: ESGLimitation[];
  sustainableFinance?: SustainableFinanceConfig;
}

export interface ScopeEmissions {
  scope1: number; // in tCO2e
  scope2: number; // in tCO2e
  scope3: number; // in tCO2e
}

export interface EmissionTrajectoryPoint {
  year: number;
  clientEmissions: number;
  sectorTarget15C: number;
  sectorTarget20C: number;
}

export interface CSRDFlag {
  applies: boolean; // true = TAK, false = NIE
  reason?: string;
  effectiveYear?: string;
}

export interface TopEmitterClient {
  id: string;
  name: string;
  sectorName: string;
  pkd?: string;
  decarbonizationAnalysis: string;
  scopeEmissions: ScopeEmissions;
  trajectory: EmissionTrajectoryPoint[];
  csrdFlag: CSRDFlag;
}

export interface AppData {
  industries: Industry[];
  topEmitters: TopEmitterClient[];
}

export type AppView = 'ADVISOR' | 'ADMIN';
export type WorkPathway = 'LANDING' | 'SECTORS' | 'TOP_EMITTERS';
