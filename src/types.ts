// Core domain types for BidRight.

export interface MaterialRow {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  jobAddress: string;
  jobType: string;
  laborHours: number;
  hourlyRate: number;
  materials: MaterialRow[];
  markupPct: number;
  overheadFlat: number;
  taxPct: number;
  depositPct: number;
  notes: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface BusinessProfile {
  name: string;
  phone: string;
  email: string;
  /** dataURL of the logo image (downscaled on upload), or empty string */
  logoDataUrl: string;
}

export interface QuoteTotals {
  labor: number;
  materials: number;
  subtotal: number;
  markup: number;
  taxable: number;
  tax: number;
  total: number;
  deposit: number;
  balance: number;
}

export const JOB_TYPES = [
  "Driveway / Concrete",
  "House Wash",
  "Deck / Fence",
  "Roof (Soft Wash)",
  "Commercial",
  "Other",
] as const;

export function newQuoteId(): string {
  return (
    "q_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8)
  );
}

export function newMaterialId(): string {
  return "m_" + Math.random().toString(36).slice(2, 10);
}

export function blankQuote(): Quote {
  const now = new Date().toISOString();
  return {
    id: newQuoteId(),
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    jobAddress: "",
    jobType: JOB_TYPES[0],
    laborHours: 0,
    hourlyRate: 75,
    materials: [],
    markupPct: 20,
    overheadFlat: 0,
    taxPct: 0,
    depositPct: 50,
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function blankProfile(): BusinessProfile {
  return { name: "", phone: "", email: "", logoDataUrl: "" };
}
