import React from "react";

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <div className="hidden sm:block text-xs text-white/50">Scroll/hover for details</div>
      </div>
      <div className="h-72 sm:h-80">{children}</div>
    </div>
  );
}
