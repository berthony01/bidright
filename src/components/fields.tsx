import { useEffect, useState } from "react";

/** Text input with label. */
export function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "decimal";
}) {
  return (
    <label className="block">
      <span className="field-label">{props.label}</span>
      <input
        type={props.type ?? "text"}
        inputMode={props.inputMode}
        className="field-input"
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

/**
 * Numeric input that tolerates intermediate typing states ("4.", "") without
 * fighting the cursor. Commits parsed numbers upward; empty means 0.
 */
export function NumField(props: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  step?: string;
}) {
  const [text, setText] = useState(props.value === 0 ? "" : String(props.value));

  // Sync when the value changes from outside (e.g. loading a saved quote).
  useEffect(() => {
    const parsed = text.trim() === "" ? 0 : parseFloat(text);
    if (!Number.isNaN(parsed) && parsed !== props.value) {
      setText(props.value === 0 ? "" : String(props.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  const commit = (t: string) => {
    setText(t);
    if (t.trim() === "") {
      props.onChange(0);
      return;
    }
    const n = parseFloat(t);
    if (Number.isFinite(n)) props.onChange(n);
  };

  return (
    <label className="block">
      <span className="field-label">{props.label}</span>
      <div className="relative">
        {props.prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {props.prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          min={props.min ?? 0}
          step={props.step ?? "any"}
          className={`field-input ${props.prefix ? "pl-7" : ""} ${props.suffix ? "pr-9" : ""}`}
          value={text}
          placeholder="0"
          onChange={(e) => commit(e.target.value)}
        />
        {props.suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {props.suffix}
          </span>
        )}
      </div>
    </label>
  );
}

/** Multiline notes field. */
export function TextArea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="field-label">{props.label}</span>
      <textarea
        className="field-input min-h-[88px] resize-y"
        value={props.value}
        rows={props.rows ?? 3}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

/** Section heading used inside cards. */
export function SectionTitle(props: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold uppercase tracking-wide text-brand-900">
      {props.children}
    </h3>
  );
}
