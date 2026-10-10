import { useRef, useState } from "react";
import type { BusinessProfile as Profile } from "../types";
import { Field } from "./fields";

interface Props {
  profile: Profile;
  onChange: (p: Profile) => void;
  pro: boolean;
}

/** Downscale an uploaded image so it stays small in localStorage and the PDF. */
function fileToDataUrl(file: File, maxW = 400): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no 2d context");
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        // PNG keeps transparency (JPEG would turn it black).
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}

export default function BusinessProfile({ profile: p, onChange, pro }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const set = (patch: Partial<Profile>) => onChange({ ...p, ...patch });

  const onFile = async (f: File | undefined) => {
    setError("");
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (PNG or JPG).");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(f);
      set({ logoDataUrl: dataUrl });
    } catch {
      setError("Could not read that image. Try a different file.");
    }
  };

  return (
    <div className="card space-y-4">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-900">
          Business profile
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          This appears on every quote and PDF. Saved on this device only.
        </p>
      </div>

      <Field label="Business name" value={p.name} onChange={(v) => set({ name: v })} placeholder="e.g. Sparkle Wash Pros" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Phone" value={p.phone} onChange={(v) => set({ phone: v })} inputMode="tel" placeholder="(555) 123-4567" />
        <Field label="Email" value={p.email} onChange={(v) => set({ email: v })} inputMode="email" placeholder="you@business.com" />
      </div>

      <div>
        <span className="field-label">Logo</span>
        <div className="flex items-center gap-4">
          {p.logoDataUrl ? (
            <img
              src={p.logoDataUrl}
              alt="Business logo"
              className="h-16 w-auto max-w-[160px] rounded-lg border border-slate-200 bg-white object-contain p-1"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
              No logo
            </div>
          )}
          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}>
              {p.logoDataUrl ? "Replace logo" : "Upload logo"}
            </button>
            {p.logoDataUrl && (
              <button
                type="button"
                className="block text-sm font-semibold text-red-600 hover:underline"
                onClick={() => set({ logoDataUrl: "" })}
              >
                Remove
              </button>
            )}
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {!pro && (
          <p className="mt-2 text-xs text-slate-400">
            Your logo appears on PDFs with <span className="font-semibold">BidRight Pro</span>.
          </p>
        )}
      </div>
    </div>
  );
}
