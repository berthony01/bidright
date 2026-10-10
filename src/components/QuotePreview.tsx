import type { BusinessProfile, Quote } from "../types";
import { calcTotals, fmtDate, fmtMoney, num } from "../lib/calc";

/**
 * Clean, professional quote layout. Used for the in-app preview,
 * the read-only shared-quote view, and mirrors the PDF output.
 */
export default function QuotePreview(props: {
  quote: Quote;
  biz: BusinessProfile;
  pro: boolean;
}) {
  const { quote: q, biz, pro } = props;
  const t = calcTotals(q);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b-4 border-accent-600 bg-brand-950 px-5 py-5 text-white sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-extrabold tracking-tight sm:text-2xl">
              {biz.name || "Your Business"}
            </div>
            {(biz.phone || biz.email) && (
              <div className="mt-1 text-sm text-slate-300">
                {[biz.phone, biz.email].filter(Boolean).join("  •  ")}
              </div>
            )}
          </div>
          {pro && biz.logoDataUrl ? (
            <img
              src={biz.logoDataUrl}
              alt="Business logo"
              className="h-14 w-auto max-w-[130px] rounded bg-white object-contain p-1"
            />
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-bold uppercase tracking-widest text-accent-500">
            Pressure Washing Quote
          </div>
          <div className="text-sm text-slate-300">Date: {fmtDate(q.createdAt)}</div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-8">
        {/* Bill to / Job */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Bill to</div>
            <div className="mt-1 font-semibold text-slate-900">{q.clientName || "—"}</div>
            {[q.clientPhone, q.clientEmail, q.jobAddress].filter(Boolean).map((l) => (
              <div key={l} className="text-sm text-slate-600">
                {l}
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Job details</div>
            <div className="mt-1 text-sm text-slate-700">
              <span className="font-semibold">Service:</span> {q.jobType || "—"}
            </div>
            <div className="text-sm text-slate-700">
              <span className="font-semibold">Labor:</span> {num(q.laborHours)} hrs @{" "}
              {fmtMoney(num(q.hourlyRate))}/hr
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="bg-brand-950 text-left text-white">
                <th className="rounded-l-md px-3 py-2.5 font-semibold">Description</th>
                <th className="px-3 py-2.5 text-right font-semibold">Qty</th>
                <th className="px-3 py-2.5 text-right font-semibold">Unit Price</th>
                <th className="rounded-r-md px-3 py-2.5 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-2.5">Labor — {q.jobType || "Pressure washing"}</td>
                <td className="px-3 py-2.5 text-right">{num(q.laborHours)}</td>
                <td className="px-3 py-2.5 text-right">{fmtMoney(num(q.hourlyRate))}/hr</td>
                <td className="px-3 py-2.5 text-right font-medium">{fmtMoney(t.labor)}</td>
              </tr>
              {q.materials.map((m) => (
                <tr key={m.id}>
                  <td className="px-3 py-2.5">{m.name || "Material"}</td>
                  <td className="px-3 py-2.5 text-right">{num(m.qty)}</td>
                  <td className="px-3 py-2.5 text-right">{fmtMoney(num(m.unitPrice))}</td>
                  <td className="px-3 py-2.5 text-right font-medium">
                    {fmtMoney(num(m.qty) * num(m.unitPrice))}
                  </td>
                </tr>
              ))}
              {num(q.overheadFlat) > 0 && (
                <tr>
                  <td className="px-3 py-2.5">Overhead</td>
                  <td className="px-3 py-2.5 text-right">—</td>
                  <td className="px-3 py-2.5 text-right">—</td>
                  <td className="px-3 py-2.5 text-right font-medium">
                    {fmtMoney(num(q.overheadFlat))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-4 flex justify-end">
          <dl className="w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-medium">{fmtMoney(t.subtotal)}</dd>
            </div>
            {num(q.markupPct) !== 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-600">Markup ({num(q.markupPct)}%)</dt>
                <dd className="font-medium">{fmtMoney(t.markup)}</dd>
              </div>
            )}
            {num(q.taxPct) !== 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-600">Tax ({num(q.taxPct)}%)</dt>
                <dd className="font-medium">{fmtMoney(t.tax)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-brand-950 pt-2 text-lg">
              <dt className="font-extrabold text-brand-950">Total</dt>
              <dd className="font-extrabold text-brand-950">{fmtMoney(t.total)}</dd>
            </div>
            {num(q.depositPct) > 0 && (
              <>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Deposit due ({num(q.depositPct)}%)</dt>
                  <dd className="font-semibold text-accent-700">{fmtMoney(t.deposit)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Balance on completion</dt>
                  <dd className="font-semibold">{fmtMoney(t.balance)}</dd>
                </div>
              </>
            )}
          </dl>
        </div>

        {/* Notes */}
        {q.notes.trim() && (
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Notes</div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{q.notes.trim()}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 border-t border-slate-200 pt-3 text-center text-xs text-slate-400">
          {pro ? (
            <>Thank you for your business!{biz.name ? ` — ${biz.name}` : ""}</>
          ) : (
            <>Created with BidRight Free</>
          )}
        </div>
      </div>
    </div>
  );
}
