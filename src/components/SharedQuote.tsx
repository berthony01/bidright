import { useEffect } from "react";
import type { SharedPayload } from "../lib/share";
import { isPro } from "../lib/storage";
import { navigate } from "../App";
import QuotePreview from "./QuotePreview";

/**
 * Read-only view rendered when someone opens a `#q=...` share link.
 * Includes a CTA for the viewer to create their own quote.
 */
export default function SharedQuote({ payload }: { payload: SharedPayload }) {
  const { quote, biz } = payload;

  useEffect(() => {
    document.title = `Quote from ${biz.name || "BidRight"} — BidRight`;
  }, [biz.name]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-brand-950 text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-lg">
              ⌁
            </span>
            BidRight
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            Shared quote
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <p className="mb-4 text-sm text-slate-500">
          {biz.name || "A contractor"} shared this quote with you. It’s read-only — contact them
          directly with any questions.
        </p>
        <QuotePreview quote={quote} biz={biz} pro={isPro()} />

        <div className="card mt-6 !border-brand-900 !bg-brand-950 text-center text-white">
          <h2 className="text-lg font-extrabold">Run a pressure washing business?</h2>
          <p className="mt-1 text-sm text-slate-300">
            Build quotes like this in 60 seconds — free, right from your phone.
          </p>
          <button type="button" onClick={() => navigate("/app")} className="btn-primary mt-4">
            Create your own quote — free
          </button>
          <p className="mt-2 text-xs text-slate-400">No account needed. Works in your browser.</p>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Made with BidRight — the 60-second pressure washing quote tool.
      </footer>
    </div>
  );
}
