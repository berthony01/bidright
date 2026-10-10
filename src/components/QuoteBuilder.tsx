import { JOB_TYPES, newMaterialId } from "../types";
import type { MaterialRow, Quote } from "../types";
import { calcTotals, fmtMoney, num } from "../lib/calc";
import { Field, NumField, SectionTitle, TextArea } from "./fields";

interface Props {
  quote: Quote;
  onChange: (q: Quote) => void;
}

export default function QuoteBuilder({ quote: q, onChange }: Props) {
  const t = calcTotals(q);
  const set = (patch: Partial<Quote>) =>
    onChange({ ...q, ...patch, updatedAt: new Date().toISOString() });

  const setMaterial = (id: string, patch: Partial<MaterialRow>) =>
    set({
      materials: q.materials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });

  const addMaterial = () =>
    set({
      materials: [...q.materials, { id: newMaterialId(), name: "", qty: 1, unitPrice: 0 }],
    });

  const removeMaterial = (id: string) =>
    set({ materials: q.materials.filter((m) => m.id !== id) });

  return (
    <div className="space-y-4">
      {/* Client */}
      <div className="card space-y-3">
        <SectionTitle>Client</SectionTitle>
        <Field label="Client name" value={q.clientName} onChange={(v) => set({ clientName: v })} placeholder="e.g. Jane Smith" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Phone" value={q.clientPhone} onChange={(v) => set({ clientPhone: v })} inputMode="tel" placeholder="(555) 123-4567" />
          <Field label="Email" value={q.clientEmail} onChange={(v) => set({ clientEmail: v })} inputMode="email" placeholder="jane@email.com" />
        </div>
        <Field label="Job address" value={q.jobAddress} onChange={(v) => set({ jobAddress: v })} placeholder="123 Main St" />
      </div>

      {/* Job */}
      <div className="card space-y-3">
        <SectionTitle>Job</SectionTitle>
        <label className="block">
          <span className="field-label">Service type</span>
          <select
            className="field-input"
            value={q.jobType}
            onChange={(e) => set({ jobType: e.target.value })}
          >
            {JOB_TYPES.map((jt) => (
              <option key={jt} value={jt}>
                {jt}
              </option>
            ))}
          </select>
        </label>
        <TextArea label="Notes (shown on the quote)" value={q.notes} onChange={(v) => set({ notes: v })} placeholder="e.g. Includes detergent and plant protection. Valid for 30 days." />
      </div>

      {/* Labor */}
      <div className="card space-y-3">
        <SectionTitle>Labor</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <NumField label="Hours" value={q.laborHours} onChange={(v) => set({ laborHours: v })} suffix="hrs" />
          <NumField label="Hourly rate" value={q.hourlyRate} onChange={(v) => set({ hourlyRate: v })} prefix="$" suffix="/hr" />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Labor subtotal</span>
          <span className="font-semibold">{fmtMoney(t.labor)}</span>
        </div>
      </div>

      {/* Materials */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <SectionTitle>Materials</SectionTitle>
          <button type="button" onClick={addMaterial} className="btn-ghost !py-1.5 text-sm">
            + Add item
          </button>
        </div>
        {q.materials.length === 0 && (
          <p className="text-sm text-slate-400">
            No materials yet — add detergent, gas, replacement tips, etc.
          </p>
        )}
        {q.materials.map((m) => (
          <div key={m.id} className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2">
              <Field label="Item" value={m.name} onChange={(v) => setMaterial(m.id, { name: v })} placeholder="e.g. Detergent" />
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
              <NumField label="Qty" value={m.qty} onChange={(v) => setMaterial(m.id, { qty: v })} />
              <NumField label="Unit price" value={m.unitPrice} onChange={(v) => setMaterial(m.id, { unitPrice: v })} prefix="$" />
              <button
                type="button"
                onClick={() => removeMaterial(m.id)}
                className="mb-0.5 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                aria-label={`Remove ${m.name || "material"}`}
              >
                ✕
              </button>
            </div>
            <div className="mt-1 text-right text-sm text-slate-500">
              = {fmtMoney(num(m.qty) * num(m.unitPrice))}
            </div>
          </div>
        ))}
        {q.materials.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Materials subtotal</span>
            <span className="font-semibold">{fmtMoney(t.materials)}</span>
          </div>
        )}
      </div>

      {/* Adjustments */}
      <div className="card space-y-3">
        <SectionTitle>Adjustments</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <NumField label="Markup" value={q.markupPct} onChange={(v) => set({ markupPct: v })} suffix="%" />
          <NumField label="Overhead (flat)" value={q.overheadFlat} onChange={(v) => set({ overheadFlat: v })} prefix="$" />
          <NumField label="Tax" value={q.taxPct} onChange={(v) => set({ taxPct: v })} suffix="%" />
          <NumField label="Deposit" value={q.depositPct} onChange={(v) => set({ depositPct: v })} suffix="%" />
        </div>
        <p className="text-xs text-slate-400">
          Applied in order: subtotal (labor + materials + overhead) → markup → tax. Deposit is a
          percentage of the final total.
        </p>
      </div>

      {/* Live totals */}
      <div className="card !border-brand-900 !bg-brand-950 text-white">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal</span>
            <span>{fmtMoney(t.subtotal)}</span>
          </div>
          {num(q.markupPct) !== 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Markup ({num(q.markupPct)}%)</span>
              <span>{fmtMoney(t.markup)}</span>
            </div>
          )}
          {num(q.taxPct) !== 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Tax ({num(q.taxPct)}%)</span>
              <span>{fmtMoney(t.tax)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-white/20 pt-2 text-2xl font-extrabold">
            <span>Total</span>
            <span className="text-accent-500">{fmtMoney(t.total)}</span>
          </div>
          {num(q.depositPct) > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>
                Deposit due ({num(q.depositPct)}%) · Balance {fmtMoney(t.balance)}
              </span>
              <span className="font-semibold text-white">{fmtMoney(t.deposit)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
