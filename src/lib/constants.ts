// App-wide constants.

/**
 * ============================================================================
 * OWNER SETUP — READ THIS
 * ----------------------------------------------------------------------------
 * Replace the placeholder below with your real Stripe Payment Link before
 * launching. Create it in your Stripe Dashboard:
 *   Stripe Dashboard → Payment Links → Create payment link
 *   Product: "BidRight Pro", one-time payment of $39.00 USD
 *   After payment → redirect customers to: https://YOUR-DOMAIN/#/success
 * Then paste the generated https://buy.stripe.com/... URL here.
 * ============================================================================
 */
export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVq9AU18r5xxf7B4218Zq00";

export const PRO_PRICE_LABEL = "$39";
export const PRO_PRICE_NOTE = "one-time payment";

export const FREE_SAVED_QUOTE_LIMIT = 3;

export const LS_KEYS = {
  business: "bidright_business",
  quotes: "bidright_quotes",
  draft: "bidright_draft",
  pro: "bidright_pro",
} as const;
