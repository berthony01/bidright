# BidRight

**Quote any pressure washing job in 60 seconds.**

BidRight is a free, mobile-first quote calculator for pressure washing contractors.
Build a professional quote on a job site from your phone — labor, materials, markup,
overhead, tax, deposit — then download a clean PDF or text the customer a shareable
link. No account, no backend, no database. Everything runs in the browser and your
data stays in your browser (localStorage).

Pro tier ($39 one-time via Stripe) removes the PDF watermark, puts your logo on
quotes/PDFs, and unlocks unlimited saved quotes.

## Tech

- Vite + React + TypeScript + Tailwind CSS
- jsPDF for PDF generation (client-side)
- Static export only — zero server, zero API, zero auth
- Hash-based routing (`#/app`, `#/success`, `#q=...`), so it works on any static host

## Run locally (dev)

```bash
cd ~/workspace/bidright
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build

```bash
npm run build
```

Runs `tsc` (type-check) then `vite build`. Output goes to `dist/`. The build must
pass with no errors before deploying.

## Deploy to Cloudflare Pages (static)

No build tricks needed — it's a plain static site.

**Option A — drag & drop:**
1. Run `npm run build`.
2. Go to Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets.
3. Upload the contents of `dist/`.

**Option B — connected to Git:**
1. Push this folder to a GitHub repo.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build settings: framework preset "Vite", build command `npm run build`,
   build output directory `dist`.

No redirects file or Functions are needed: all routing is hash-based, so deep
links like `/#q=...` work without server rewrites.

## OWNER SETUP — do these two things before launch

### 1. Replace the Stripe payment link (required for Pro sales)

In `src/lib/constants.ts`, replace the placeholder:

```ts
export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/REPLACE_ME";
```

Steps:
1. Stripe Dashboard → **Payment Links** → **Create payment link**.
2. Product: "BidRight Pro" — **$39.00 USD, one-time payment** (not a subscription).
3. Under "After payment", set the redirect to: `https://YOUR-DOMAIN/#/success`
   (use your real domain from step 2 below).
4. Copy the generated `https://buy.stripe.com/...` URL into `STRIPE_PAYMENT_LINK`.
5. Rebuild and redeploy (`npm run build`).

The `/#/success` page sets the `bidright_pro` flag in the customer's browser,
unlocking Pro on that device. This is a v1 soft gate — see "Pro fulfillment"
below.

### 2. Custom domain (optional but recommended)

In Cloudflare Pages → your project → **Custom domains** → Set up a custom domain
(e.g. `bidright.app`). Cloudflare provisions SSL automatically. Update the Stripe
payment link's "after payment" redirect to `https://YOUR-DOMAIN/#/success` so
customers land back on the right site.

## How the money math works

Documented order of operations (same in the UI, the PDF, and share links —
every step rounded to the cent):

```
labor     = hours × hourly rate
materials = Σ (qty × unit price)
subtotal  = labor + materials + overhead (flat $)
markup    = subtotal × markup %
taxable   = subtotal + markup
tax       = taxable × tax %
total     = taxable + tax
deposit   = total × deposit %
balance   = total − deposit
```

## Pro fulfillment (v1 soft gate)

- The "Unlock Pro" button sends the customer to `STRIPE_PAYMENT_LINK`.
- Stripe redirects back to `/#/success`, which writes `bidright_pro = "1"` to
  localStorage. Pro features (no watermark, logo on PDF, unlimited saved quotes)
  unlock on that device/browser.
- **Limitations (be honest with yourself):** anyone who visits `/#/success`
  directly gets Pro without paying, and Pro doesn't transfer between devices.
  This is acceptable for v1 validation. To harden later: verify purchases
  server-side with Stripe webhooks and issue signed unlock tokens.

## Project structure

```
src/
  App.tsx               Hash router: #/ (landing), #/app, #/success, #q=... (shared quote)
  types.ts              Quote, BusinessProfile, MaterialRow
  lib/
    calc.ts             Money math (unit-tested below)
    share.ts            base64url encode/decode for #q= share links
    pdf.ts              jsPDF quote PDF (watermark for free, logo for pro)
    storage.ts          localStorage: profile, saved quotes, draft, pro flag
    constants.ts        STRIPE_PAYMENT_LINK + plan limits  <-- OWNER: edit this
  components/
    Landing.tsx         Marketing page + real pricing guide + FAQ (SEO)
    QuoteApp.tsx        Tabbed app shell (Quote / Business / Saved) + action bar
    QuoteBuilder.tsx    Calculator form + live totals
    QuotePreview.tsx    Professional quote layout (also used for shared links)
    BusinessProfile.tsx Business info + logo upload (auto-downscaled)
    SavedQuotes.tsx     Save / load / delete (free capped at 3)
    Paywall.tsx         $39 Pro upsell modal → Stripe payment link
    SharedQuote.tsx     Read-only view for #q= links + CTA
    Success.tsx         Post-checkout page, sets bidright_pro flag
```

## Verification

- `npm run build` passes cleanly (`tsc` + `vite build`, no errors).
- Money math verified by unit test (`calcTotals`):
  4 hrs × $75 + $60 materials + 20% markup + 8% tax →
  subtotal $360.00, markup $72.00, tax $34.56, **total $466.56**,
  deposit (50%) $233.28, balance $233.28. ✓
- Share-link encode → decode round-trip verified (quote + business profile survive
  intact; garbage hashes rejected). ✓
- PDF generation verified in Node against jsPDF: both free (watermark text present)
  and pro (logo path) render with correct totals and line items. ✓
