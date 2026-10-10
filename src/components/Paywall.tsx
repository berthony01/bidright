import { PRO_PRICE_LABEL, PRO_PRICE_NOTE, STRIPE_PAYMENT_LINK } from "../lib/constants";

const FEATURES = [
  "No watermark on PDFs",
  "Your logo on every quote & PDF",
  "Unlimited saved quotes",
  "Priority support",
];

export default function Paywall(props: { open: boolean; onClose: () => void }) {
  if (!props.open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onClick={props.onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to BidRight Pro"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-brand-950 px-6 py-6 text-center text-white">
          <div className="text-sm font-bold uppercase tracking-widest text-accent-500">
            BidRight Pro
          </div>
          <div className="mt-2 text-4xl font-extrabold">
            {PRO_PRICE_LABEL}
            <span className="ml-2 align-middle text-sm font-normal text-slate-300">
              {PRO_PRICE_NOTE}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            One payment. Yours forever. No subscription.
          </p>
        </div>
        <ul className="space-y-2.5 px-6 py-5">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
        <div className="px-6 pb-6">
          <a href={STRIPE_PAYMENT_LINK} className="btn-primary w-full">
            Unlock Pro — {PRO_PRICE_LABEL}
          </a>
          <p className="mt-3 text-center text-xs text-slate-400">
            Secure checkout via Stripe. After payment you’ll return here and Pro unlocks
            automatically.
          </p>
          <button
            type="button"
            onClick={props.onClose}
            className="mt-2 w-full py-2 text-center text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
