import { blankProfile, blankQuote } from "../types";
import type { BusinessProfile, Quote } from "../types";
import { LS_KEYS } from "./constants";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode) — app still works in-memory.
  }
}

// --- Business profile -------------------------------------------------------

export function loadBusiness(): BusinessProfile {
  const p = read<Partial<BusinessProfile>>(LS_KEYS.business, {});
  return { ...blankProfile(), ...p };
}

export function saveBusiness(p: BusinessProfile): void {
  write(LS_KEYS.business, p);
}

// --- Saved quotes -----------------------------------------------------------

export function loadQuotes(): Quote[] {
  const list = read<Quote[]>(LS_KEYS.quotes, []);
  return Array.isArray(list) ? list : [];
}

export function saveQuotes(list: Quote[]): void {
  write(LS_KEYS.quotes, list);
}

// --- Draft (autosaved work-in-progress) -------------------------------------

export function loadDraft(): Quote {
  const d = read<Partial<Quote>>(LS_KEYS.draft, {});
  // Merge over a blank quote so older/partial drafts can't break the form.
  return { ...blankQuote(), ...d, materials: Array.isArray(d.materials) ? d.materials : [] };
}

export function saveDraft(q: Quote): void {
  write(LS_KEYS.draft, q);
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(LS_KEYS.draft);
  } catch {
    /* ignore */
  }
}

// --- Pro flag ---------------------------------------------------------------

export function isPro(): boolean {
  try {
    return localStorage.getItem(LS_KEYS.pro) === "1";
  } catch {
    return false;
  }
}

export function setPro(): void {
  try {
    localStorage.setItem(LS_KEYS.pro, "1");
  } catch {
    /* ignore */
  }
}
