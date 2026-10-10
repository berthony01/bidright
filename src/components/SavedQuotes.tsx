import type { Quote } from "../types";
import { calcTotals, fmtDate, fmtMoney } from "../lib/calc";
import { FREE_SAVED_QUOTE_LIMIT } from "../lib/constants";

interface Props {
  quotes: Quote[];
  pro: boolean;
  onLoad: (q: Quote) => void;
  onDelete: (id: string) => void;
  onUpgrade: () => void;
}

export default function SavedQuotes({ quotes, pro, onLoad, onDelete, onUpgrade }: Props) {
  const sorted = [...quotes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (sorted.length === 0) {
    return (
      <div className="card text-center">
        <div className="text-4xl">📋</div>
        <h3 className="mt-2 font-bold text-slate-900">No saved quotes yet</h3>
        <p className="mt-1 text-sm text-slate-500">
          Build a quote, then tap “Save quote” to keep it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!pro && (
        <div className="card !border-amber-300 !bg-amber-50">
          <p className="text-sm text-amber-900">
            <span className="font-bold">Free plan:</span> {sorted.length} of{" "}
            {FREE_SAVED_QUOTE_LIMIT} saved quotes used.{" "}
            <button type="button" onClick={onUpgrade} className="font-bold underline">
              Go Pro for unlimited.
            </button>
          </p>
        </div>
      )}
      {sorted.map((q) => {
        const t = calcTotals(q);
        return (
          <div key={q.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-bold text-slate-900">
                  {q.clientName || "Untitled quote"}
                </div>
                <div className="text-sm text-slate-500">
                  {q.jobType} · {fmtDate(q.updatedAt)}
                </div>
                <div className="mt-1 text-lg font-extrabold text-brand-900">
                  {fmtMoney(t.total)}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <button type="button" className="btn-ghost !py-1.5 text-sm" onClick={() => onLoad(q)}>
                  Open
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm(`Delete the quote for ${q.clientName || "this client"}?`)) {
                      onDelete(q.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
