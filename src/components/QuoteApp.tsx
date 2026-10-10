import { useEffect, useRef, useState } from "react";
import type { BusinessProfile as Profile, Quote } from "../types";
import { blankQuote } from "../types";
import {
  isPro,
  loadBusiness,
  loadDraft,
  loadQuotes,
  saveBusiness,
  saveDraft,
  saveQuotes,
} from "../lib/storage";
import { downloadQuotePdf } from "../lib/pdf";
import { encodeShareLink } from "../lib/share";
import { FREE_SAVED_QUOTE_LIMIT } from "../lib/constants";
import { navigate } from "../App";
import QuoteBuilder from "./QuoteBuilder";
import QuotePreview from "./QuotePreview";
import BusinessProfile from "./BusinessProfile";
import SavedQuotes from "./SavedQuotes";
import Paywall from "./Paywall";

type Tab = "quote" | "business" | "saved";

export default function QuoteApp() {
  const [quote, setQuote] = useState<Quote>(() => loadDraft());
  const [biz, setBiz] = useState<Profile>(() => loadBusiness());
  const [quotes, setQuotes] = useState<Quote[]>(() => loadQuotes());
  const [pro] = useState<boolean>(() => isPro());
  const [tab, setTab] = useState<Tab>("quote");
  const [preview, setPreview] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  // Autosave draft + business profile.
  useEffect(() => {
    saveDraft(quote);
  }, [quote]);
  useEffect(() => {
    saveBusiness(biz);
  }, [biz]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  };

  const needsClient = (): boolean => {
    if (!quote.clientName.trim()) {
      showToast("Add a client name first.");
      return true;
    }
    return false;
  };

  const handlePdf = () => {
    if (needsClient()) return;
    downloadQuotePdf(quote, biz, pro);
    showToast(pro ? "PDF downloaded." : "PDF downloaded (Free watermark).");
  };

  const handleShare = async () => {
    if (needsClient()) return;
    const link = encodeShareLink(quote, biz, window.location.href);
    try {
      await navigator.clipboard.writeText(link);
      showToast("Share link copied — send it to your customer.");
    } catch {
      window.prompt("Copy this link to share the quote:", link);
    }
  };

  const handleSave = () => {
    if (needsClient()) return;
    const isNew = !quotes.some((s) => s.id === quote.id);
    if (isNew && !pro && quotes.length >= FREE_SAVED_QUOTE_LIMIT) {
      setPaywallOpen(true);
      return;
    }
    const stamped: Quote = { ...quote, updatedAt: new Date().toISOString() };
    const next = isNew ? [stamped, ...quotes] : quotes.map((s) => (s.id === quote.id ? stamped : s));
    setQuotes(next);
    saveQuotes(next);
    showToast("Quote saved.");
  };

  const handleNew = () => {
    if (window.confirm("Start a new quote? Your current draft will be cleared.")) {
      const fresh = blankQuote();
      setQuote(fresh);
      saveDraft(fresh);
      setPreview(false);
      setTab("quote");
    }
  };

  const handleLoad = (q: Quote) => {
    setQuote({ ...q });
    setPreview(false);
    setTab("quote");
    showToast("Quote loaded.");
  };

  const handleDelete = (id: string) => {
    const next = quotes.filter((s) => s.id !== id);
    setQuotes(next);
    saveQuotes(next);
    showToast("Quote deleted.");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "quote", label: "Quote" },
    { id: "business", label: "Business" },
    { id: "saved", label: `Saved${quotes.length ? ` (${quotes.length})` : ""}` },
  ];

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-950 text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-extrabold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-lg">
              ⌁
            </span>
            BidRight
          </button>
          {pro ? (
            <span className="rounded-full bg-accent-600 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              Pro
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setPaywallOpen(true)}
              className="rounded-full bg-accent-600 px-4 py-1.5 text-sm font-bold hover:bg-accent-700"
            >
              Go Pro
            </button>
          )}
        </div>
        {/* Tabs */}
        <nav className="mx-auto flex max-w-3xl gap-1 px-4 pb-2" aria-label="Sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setPreview(false);
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                tab === t.id ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5 pb-36">
        {tab === "quote" &&
          (preview ? (
            <div className="space-y-4">
              <button type="button" onClick={() => setPreview(false)} className="btn-ghost">
                ← Back to editor
              </button>
              <QuotePreview quote={quote} biz={biz} pro={pro} />
            </div>
          ) : (
            <QuoteBuilder quote={quote} onChange={setQuote} />
          ))}

        {tab === "business" && (
          <BusinessProfile profile={biz} onChange={setBiz} pro={pro} />
        )}

        {tab === "saved" && (
          <SavedQuotes
            quotes={quotes}
            pro={pro}
            onLoad={handleLoad}
            onDelete={handleDelete}
            onUpgrade={() => setPaywallOpen(true)}
          />
        )}
      </main>

      {/* Action bar (quote tab, editor mode) */}
      {tab === "quote" && !preview && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">
            <button type="button" onClick={() => setPreview(true)} className="btn-secondary !px-3">
              Preview
            </button>
            <button type="button" onClick={handlePdf} className="btn-primary !px-3">
              PDF
            </button>
            <button type="button" onClick={handleShare} className="btn-ghost !py-3">
              Copy link
            </button>
            <button type="button" onClick={handleSave} className="btn-ghost !py-3">
              Save quote
            </button>
          </div>
          <div className="mx-auto mt-2 max-w-3xl text-center">
            <button
              type="button"
              onClick={handleNew}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Start a new quote
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
          <div className="rounded-lg bg-brand-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <Paywall open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
