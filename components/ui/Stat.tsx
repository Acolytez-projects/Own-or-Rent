import React from "react";

export function Stat({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-medium text-white/60">
          {icon}
          <span>{label}</span>
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</div>
        {hint ? <div className="mt-1 text-xs text-white/45">{hint}</div> : null}
      </div>
    </div>
  );
}
