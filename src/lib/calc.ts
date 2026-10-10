import type { Quote, QuoteTotals } from "../types";

/**
 * Money math for BidRight.
 *
 * Order of operations (documented in the UI + README):
 *   labor      = laborHours × hourlyRate
 *   materials  = Σ (qty × unitPrice)
 *   subtotal   = labor + materials + overheadFlat
 *   markup     = subtotal × markupPct / 100
 *   taxable    = subtotal + markup
 *   tax        = taxable × taxPct / 100
 *   total      = taxable + tax
 *   deposit    = total × depositPct / 100
 *   balance    = total − deposit
 *
 * Every step is rounded to the cent so the on-screen totals, the PDF,
 * and the shared link always agree.
 */

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Coerce anything (incl. empty strings from inputs) to a finite number, defaulting to 0. */
export function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function calcTotals(q: Quote): QuoteTotals {
  const labor = round2(num(q.laborHours) * num(q.hourlyRate));
  const materials = round2(
    q.materials.reduce((s, m) => s + num(m.qty) * num(m.unitPrice), 0)
  );
  const subtotal = round2(labor + materials + num(q.overheadFlat));
  const markup = round2((subtotal * num(q.markupPct)) / 100);
  const taxable = round2(subtotal + markup);
  const tax = round2((taxable * num(q.taxPct)) / 100);
  const total = round2(taxable + tax);
  const deposit = round2((total * num(q.depositPct)) / 100);
  const balance = round2(total - deposit);
  return { labor, materials, subtotal, markup, taxable, tax, total, deposit, balance };
}

export function fmtMoney(n: number): string {
  return num(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
