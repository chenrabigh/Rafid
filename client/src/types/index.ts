export interface Listing {
  id: string;
  materialType: string;
  quantity: number;
  unit: string;
  frequency: string;
  location: string;
  region: string;
  specs: string[];
  compliance: string;
  companyName: string;
  postedDate: string;
}

export interface Request {
  id: string;
  materialType: string;
  quantity: number;
  unit: string;
  frequency: string;
  location: string;
  region: string;
  specs: string[];
  compliance: string;
  companyName: string;
  postedDate: string;
  budget: string;
}

export interface Match {
  id: string;
  supplyId: string;
  demandId: string;
  matchScore: number;
  materialType: string;
  location: string;
  reasons: string[];
  potentialValue: string;
  estimatedCO2Avoided: string;
}

export interface KPI {
  value: number;
  unit: string;
  label: string;
  change: string;
  note: string;
}

export interface WasteByMaterial {
  material: string;
  diverted: number;
  percentage: number;
}

export interface DealPerQuarter {
  quarter: string;
  deals: number;
  value: number;
}

export interface Transaction {
  id: string;
  supplier: string;
  buyer: string;
  material: string;
  quantity: string;
  value: string;
  date: string;
  status: string;
}

export interface ImpactData {
  kpis: {
    totalWasteDiverted: KPI;
    estimatedCO2Avoided: KPI;
    economicValueEnabled: KPI;
    activeCircularPartnerships: KPI;
  };
  charts: {
    wasteByMaterial: WasteByMaterial[];
    dealsPerQuarter: DealPerQuarter[];
  };
  recentTransactions: Transaction[];
}
