
export interface ChecklistItem {
  id: string;
  question: string;
  isDone: boolean;
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
  decarbonizationPillars?: DecarbonizationPillar[];
}

export type AppView = 'ADVISOR' | 'ADMIN';
