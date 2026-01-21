import React from "react";

export function InputField({
  label,
  value,
  onChange,
  type = "number",
  step,
  prefix,
  suffix,
  helper,
  min,
  max,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  step?: string;
  prefix?: string;
  suffix?: string;
  helper?: string;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-white/75">{label}</div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            {prefix}
          </span>
        )}
        <input
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/15"
          style={{
            paddingLeft: prefix ? "2rem" : undefined,
            paddingRight: suffix ? "2.75rem" : undefined,
          }}
          type={type}
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          step={step}
          placeholder={placeholder}
          inputMode={type === "number" ? "decimal" : undefined}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
            {suffix}
          </span>
        )}
      </div>
      {helper ? <div className="mt-1 text-xs text-white/45">{helper}</div> : null}
    </label>
  );
}
