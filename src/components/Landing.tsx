import { navigate } from "../App";

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white open:shadow-sm">
      <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-3">
          {q}
          <span className="text-accent-600 transition group-open:rotate-45 text-xl leading-none">+</span>
        </span>
      </summary>
      <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{a}</p>
    </details>
  );
}

const FAQS = [
  {
    q: "How much should I charge to pressure wash a driveway?",
    a: "Most pros charge $0.15–$0.30 per square foot for concrete driveways, with a $150–$250 minimum. A standard 2-car driveway is about 400–600 sq ft, so that works out to roughly $120–$180 before minimums kick in. Heavily stained concrete, oil spots, or hard-to-reach areas push you toward the top of the range. BidRight lets you plug in the hours and materials and get a clean total instantly.",
  },
  {
    q: "What does a house wash typically cost?",
    a: "A soft-wash house cleaning usually runs $300–$600 for an average single-family home, or roughly $0.30–$0.60 per square foot of siding. Two-story homes cost more because of ladder work and safety setup. Never pressure-wash siding at high PSI the way you would concrete — soft washing with the right detergent is the professional standard and what customers are paying for.",
  },
  {
    q: "How do I estimate how long a job will take?",
    a: "As a rough rule of thumb, flat concrete cleans at about 500–1,000 sq ft per hour depending on condition and equipment. A 600 sq ft driveway is typically 1–1.5 hours of actual washing, plus 30–60 minutes of setup, plant protection, and pack-up. Track your real times for a few weeks and you'll be able to estimate from photos alone. BidRight's labor field is built around this: hours × your rate.",
  },
  {
    q: "Should I charge by the hour or by the job?",
    a: "Quote by the job, not by the hour. Customers buy a clean driveway, not your time — flat pricing is easier to sell and rewards you for getting faster. Use your hourly rate internally to make sure the flat price covers your costs: (hours × rate) + materials + overhead, then add your markup. That's exactly the math BidRight runs for you.",
  },
  {
    q: "How do I handle chemicals and materials in a quote?",
    a: "List them as line items and mark them up 15–30%, just like any contractor supply. Detergent, gas, and wear items (tips, hoses, seals) are real costs — if you absorb them, you're giving yourself a pay cut on every job. BidRight has a materials section with quantity and unit price so nothing gets forgotten.",
  },
  {
    q: "Should I take a deposit?",
    a: "Yes — 30–50% is standard for residential pressure washing. It covers your materials, protects against no-shows, and signals to the customer that you're a real business. BidRight calculates the deposit due and the remaining balance automatically and prints both on the quote.",
  },
  {
    q: "Do I need insurance to pressure wash houses?",
    a: "Yes. General liability insurance ($1M is the common benchmark) is expected by serious customers and required for most commercial work. It typically costs a few hundred to a couple thousand dollars per year depending on your state. Mentioning that you're insured on your quote instantly separates you from the guy with a rented machine.",
  },
  {
    q: "How is BidRight different from a spreadsheet?",
    a: "Speed and presentation. A spreadsheet works at your desk; BidRight works on a job site from your phone — 60 seconds from measurements to a professional PDF your customer can actually read. Plus shareable links, saved quotes, and totals that do the markup and tax math for you. The free plan covers the core quoting workflow.",
  },
];

const PRICING_ROWS = [
  { job: "Driveway / concrete", range: "$0.15 – $0.30 / sq ft", typical: "$150 – $350", note: "Most common job. 2-car driveway ≈ 400–600 sq ft." },
  { job: "House wash (soft wash)", range: "$0.30 – $0.60 / sq ft", typical: "$300 – $600", note: "Low pressure + detergent. Never blast siding." },
  { job: "Deck / fence", range: "$0.25 – $0.50 / sq ft", typical: "$200 – $450", note: "Wood needs lower PSI and care around grain." },
  { job: "Roof (soft wash)", range: "$0.30 – $0.60 / sq ft", typical: "$400 – $800", note: "No high pressure on shingles — ever." },
  { job: "Commercial flatwork", range: "$0.10 – $0.25 / sq ft", typical: "$500+", note: "Lower per-foot rate, much bigger areas." },
];

const FACTORS = [
  { t: "Condition", d: "Heavy mold, mildew, oil stains, or years of buildup add real time. Price it in — don't eat it." },
  { t: "Access", d: "Steep slopes, tight gates, long hose runs, and no nearby spigot all slow you down." },
  { t: "Height & stories", d: "Two-story work means ladders, safety setup, and slower passes. Charge for it." },
  { t: "Water source", d: "No spigot? You're hauling water, and that cost goes on the quote." },
  { t: "Region", d: "Rates in high-cost metros run 30–50% above rural areas. Know your local market." },
  { t: "Extras", d: "Plant protection, gutter brightening, concrete sealing — each is a line item, not a freebie." },
];

export default function Landing() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-950/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-lg">⌁</span>
            BidRight
          </span>
          <div className="flex items-center gap-3">
            <a href="#guide" className="hidden text-sm font-semibold text-slate-300 hover:text-white sm:inline">
              Pricing guide
            </a>
            <button type="button" onClick={() => navigate("/app")} className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-bold hover:bg-accent-700">
              Open the app
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-brand-950 text-white">
        <div className="mx-auto max-w-5xl px-4 pb-14 pt-12 sm:pt-16">
          <div className="max-w-2xl">
            <div className="inline-block rounded-full bg-accent-600/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-500">
              For pressure washing pros
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Quote any pressure washing job in 60 seconds.
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Labor, materials, markup, tax — BidRight does the math and turns it into a
              professional PDF you can hand to the customer before you leave the driveway.
              Free, no account, works on your phone.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => navigate("/app")} className="btn-primary !px-8 !py-4 !text-lg">
                Build a free quote
              </button>
              <a href="#guide" className="btn-secondary !px-8 !py-4 !text-lg !bg-white/10 hover:!bg-white/20">
                Pricing guide
              </a>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              ✓ No signup &nbsp;·&nbsp; ✓ Works offline-ready on any device &nbsp;·&nbsp; ✓ Your data stays on your phone
            </p>
          </div>

          {/* Mini demo card */}
          <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white p-5 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-extrabold">Sparkle Wash Pros</div>
                <div className="text-xs text-slate-500">Pressure washing quote</div>
              </div>
              <div className="text-right text-xs text-slate-500">
                Driveway · 600 sq ft
              </div>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Labor — 2 hrs</span><span className="font-semibold">$150.00</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Detergent & supplies</span><span className="font-semibold">$28.00</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Markup (20%)</span><span className="font-semibold">$35.60</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold">
                <span>Total</span><span className="text-accent-600">$213.60</span>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-brand-950 py-2.5 text-center text-sm font-bold text-white">
              Download PDF · Copy share link
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-brand-950">
          From job site to signed quote in three steps
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { n: "1", t: "Enter the job", d: "Hours, your rate, materials, and adjustments. Big touch-friendly fields built for phones and gloves-off speed." },
            { n: "2", t: "Review the total", d: "Markup, overhead, tax, and deposit are calculated live. What you see is exactly what the customer sees." },
            { n: "3", t: "Send it", d: "Download a clean PDF or copy a shareable link and text it to the customer on the spot. Save the quote for your records." },
          ].map((s) => (
            <div key={s.n} className="card">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-lg font-extrabold text-white">
                {s.n}
              </div>
              <h3 className="mt-3 font-bold text-slate-900">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button type="button" onClick={() => navigate("/app")} className="btn-primary">
            Try it free now
          </button>
        </div>
      </section>

      {/* Pricing guide */}
      <section id="guide" className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-950">
            Pressure washing pricing guide
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Real-world rate ranges from working contractors across the US. Rates vary by region
            and job condition — use these as starting points, then adjust with BidRight's
            calculator until every job clears your costs plus markup.
          </p>

          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-brand-950 text-left text-white">
                  <th className="px-4 py-3 font-semibold">Job type</th>
                  <th className="px-4 py-3 font-semibold">Per sq ft</th>
                  <th className="px-4 py-3 font-semibold">Typical total</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PRICING_ROWS.map((r) => (
                  <tr key={r.job} className="align-top">
                    <td className="px-4 py-3 font-semibold text-slate-900">{r.job}</td>
                    <td className="px-4 py-3 text-slate-700">{r.range}</td>
                    <td className="px-4 py-3 font-semibold text-accent-700">{r.typical}</td>
                    <td className="px-4 py-3 text-slate-600">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 text-xl font-extrabold text-brand-950">
            What actually moves the price
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FACTORS.map((f) => (
              <div key={f.t} className="card">
                <h4 className="font-bold text-slate-900">{f.t}</h4>
                <p className="mt-1 text-sm text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>

          <div className="card mt-8 !border-brand-900 !bg-brand-950 text-white">
            <h3 className="text-lg font-extrabold">The 60-second pricing formula</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-200">
              <li>Estimate hours (measure the area, divide by ~750 sq ft/hr for concrete).</li>
              <li>Multiply by your hourly rate — $65–$100/hr is typical for owner-operators.</li>
              <li>Add materials and a flat overhead allowance (fuel, wear, insurance slice).</li>
              <li>Add 15–25% markup. This is your profit — not optional.</li>
              <li>Add tax if your state requires it on services.</li>
            </ol>
            <p className="mt-3 text-sm text-slate-300">
              BidRight runs this exact formula for you, live, as you type.
            </p>
            <button type="button" onClick={() => navigate("/app")} className="btn-primary mt-4">
              Price my next job
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-brand-950">
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Stop doing quotes on scrap paper.
          </h2>
          <p className="mt-3 text-slate-300">
            Your next customer is deciding between you and the next guy. Show up with a
            professional quote in 60 seconds.
          </p>
          <button type="button" onClick={() => navigate("/app")} className="btn-primary mt-6 !px-8 !py-4 !text-lg">
            Build a free quote
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row">
          <span className="flex items-center gap-2 font-bold text-brand-950">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600 text-base text-white">⌁</span>
            BidRight
          </span>
          <span>Free pressure washing quote calculator for contractors.</span>
        </div>
      </footer>
    </div>
  );
}
