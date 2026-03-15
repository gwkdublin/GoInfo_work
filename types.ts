
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
}

export type AppView = 'ADVISOR' | 'ADMIN';
