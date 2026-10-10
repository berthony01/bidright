import { useEffect, useState } from "react";
import { isPro, setPro } from "../lib/storage";
import { navigate } from "../App";

/**
 * Post-checkout landing page.
 * v1 fulfillment (soft gate): visiting this page sets the `bidright_pro`
 * flag in localStorage, which unlocks Pro on this device/browser.
 * The Stripe Payment Link must redirect here after payment:
 *   https://YOUR-DOMAIN/#/success
 * TODO (hardening): verify purchases server-side via Stripe webhooks and
 * issue signed unlock tokens instead of trusting the redirect.
 */
export default function Success() {
  const [already, setAlready] = useState(false);

  useEffect(() => {
    setAlready(isPro());
    setPro();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-brand-950">
          {already ? "Pro is already unlocked" : "Welcome to BidRight Pro!"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {already
            ? "This device already has Pro unlocked."
            : "Your payment was successful. Pro is now unlocked on this device — no watermark on PDFs, your logo on every quote, and unlimited saved quotes."}
        </p>
        <button type="button" onClick={() => navigate("/app")} className="btn-primary mt-6 w-full">
          Open the app
        </button>
        <p className="mt-3 text-xs text-slate-400">
          Pro is tied to this browser. If you switch devices, complete checkout again from the new
          device (or contact support with your receipt).
        </p>
      </div>
    </div>
  );
}
