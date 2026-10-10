import { jsPDF } from "jspdf";
import type { BusinessProfile, Quote } from "../types";
import { calcTotals, fmtDate, fmtMoney, num } from "./calc";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

const NAVY: [number, number, number] = [11, 21, 48];
const ORANGE: [number, number, number] = [234, 88, 12];
const GRAY: [number, number, number] = [100, 116, 139];
const LIGHT: [number, number, number] = [241, 245, 249];
const INK: [number, number, number] = [30, 30, 30];

function logoFormat(dataUrl: string): "PNG" | "JPEG" {
  return dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
}

/**
 * Generate and download the quote PDF.
 * Free tier: footer watermark "Created with BidRight Free".
 * Pro tier: no watermark + business logo in the header.
 */
export function downloadQuotePdf(q: Quote, biz: BusinessProfile, pro: boolean): void {
  const t = calcTotals(q);
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  let y = 0;

  const newPage = () => {
    doc.addPage();
    y = MARGIN;
  };
  const ensure = (needed: number) => {
    if (y + needed > PAGE_H - 70) newPage();
  };

  // ---- Header ------------------------------------------------------------
  y = MARGIN;
  if (pro && biz.logoDataUrl) {
    try {
      doc.addImage(biz.logoDataUrl, logoFormat(biz.logoDataUrl), PAGE_W - MARGIN - 130, y, 130, 52, undefined, "FAST");
    } catch {
      /* corrupt logo data — skip it rather than failing the PDF */
    }
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...NAVY);
  doc.text(biz.name || "Your Business", MARGIN, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  const contact = [biz.phone, biz.email].filter(Boolean).join("  •  ");
  if (contact) doc.text(contact, MARGIN, y + 34);
  y += 58;

  // Accent rule
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(3);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 26;

  // ---- Title block --------------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text("PRESSURE WASHING QUOTE", MARGIN, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text(`Date: ${fmtDate(q.createdAt)}`, PAGE_W - MARGIN - 150, y - 2);
  y += 26;

  // ---- Bill-to / Job info (two columns) -----------------------------------
  const col2 = MARGIN + CONTENT_W / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text("BILL TO", MARGIN, y);
  doc.text("JOB DETAILS", col2, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  const billLines = [q.clientName, q.clientPhone, q.clientEmail, q.jobAddress].filter(Boolean);
  const jobLines = [
    q.jobType ? `Service: ${q.jobType}` : "",
    `Labor: ${num(q.laborHours)} hrs @ ${fmtMoney(num(q.hourlyRate))}/hr`,
  ].filter(Boolean);
  const rows = Math.max(billLines.length, jobLines.length, 1);
  for (let i = 0; i < rows; i++) {
    if (billLines[i]) doc.text(billLines[i], MARGIN, y);
    if (jobLines[i]) doc.text(jobLines[i], col2, y);
    y += 13;
  }
  y += 12;

  // ---- Line items table ----------------------------------------------------
  ensure(120);
  const cDesc = MARGIN;
  const cQty = MARGIN + 300;
  const cUnit = MARGIN + 372;
  const cAmt = PAGE_W - MARGIN;

  doc.setFillColor(...NAVY);
  doc.rect(MARGIN, y - 12, CONTENT_W, 20, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Description", cDesc + 8, y + 2);
  doc.text("Qty", cQty, y + 2, { align: "right" });
  doc.text("Unit Price", cUnit + 64, y + 2, { align: "right" });
  doc.text("Amount", cAmt, y + 2, { align: "right" });
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  const item = (desc: string, qty: string, unit: string, amount: number) => {
    ensure(24);
    doc.text(desc, cDesc + 8, y);
    if (qty) doc.text(qty, cQty, y, { align: "right" });
    if (unit) doc.text(unit, cUnit + 64, y, { align: "right" });
    doc.text(fmtMoney(amount), cAmt, y, { align: "right" });
    doc.setDrawColor(...LIGHT);
    doc.setLineWidth(0.75);
    doc.line(MARGIN, y + 7, PAGE_W - MARGIN, y + 7);
    y += 22;
  };

  item(
    `Labor — ${q.jobType || "Pressure washing"}`,
    String(num(q.laborHours)),
    `${fmtMoney(num(q.hourlyRate))}/hr`,
    t.labor
  );
  for (const m of q.materials) {
    item(
      m.name || "Material",
      String(num(m.qty)),
      fmtMoney(num(m.unitPrice)),
      num(m.qty) * num(m.unitPrice)
    );
  }
  if (num(q.overheadFlat) > 0) {
    item("Overhead", "", "", num(q.overheadFlat));
  }

  // ---- Totals ---------------------------------------------------------------
  ensure(150);
  y += 6;
  const tot = (label: string, value: number, bold = false, size = 10) => {
    ensure(22);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(bold ? NAVY : INK));
    doc.text(label, cUnit - 60, y, { align: "left" });
    doc.text(fmtMoney(value), cAmt, y, { align: "right" });
    y += 18;
  };
  tot("Subtotal", t.subtotal);
  if (num(q.markupPct) !== 0) tot(`Markup (${num(q.markupPct)}%)`, t.markup);
  if (num(q.taxPct) !== 0) tot(`Tax (${num(q.taxPct)}%)`, t.tax);
  y += 4;
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(1.5);
  doc.line(cUnit - 60, y - 8, cAmt, y - 8);
  tot("TOTAL", t.total, true, 13);
  y += 4;
  if (num(q.depositPct) > 0) {
    tot(`Deposit due (${num(q.depositPct)}%)`, t.deposit);
    tot("Balance due on completion", t.balance, true);
  }

  // ---- Notes -----------------------------------------------------------------
  if (q.notes.trim()) {
    ensure(60);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text("Notes", MARGIN, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(q.notes.trim(), CONTENT_W);
    for (const line of lines as string[]) {
      ensure(16);
      doc.text(line, MARGIN, y);
      y += 13;
    }
  }

  // ---- Footer ------------------------------------------------------------------
  const footerY = PAGE_H - 44;
  doc.setDrawColor(...LIGHT);
  doc.setLineWidth(0.75);
  doc.line(MARGIN, footerY - 14, PAGE_W - MARGIN, footerY - 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  if (pro) {
    doc.setTextColor(...GRAY);
    doc.text("Thank you for your business!", MARGIN, footerY);
    if (biz.name) doc.text(biz.name, PAGE_W - MARGIN, footerY, { align: "right" });
  } else {
    doc.setTextColor(...ORANGE);
    doc.setFont("helvetica", "bold");
    doc.text("Created with BidRight Free", MARGIN, footerY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text("Upgrade to Pro to remove this watermark.", PAGE_W - MARGIN, footerY, {
      align: "right",
    });
  }

  const safeName = (q.clientName || "quote").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`bidright-quote-${safeName}.pdf`);
}
