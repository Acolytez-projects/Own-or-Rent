import React from "react";
import type { SimulationResult } from "@/types/mortgage-vs-rent";
import { fmtMoney } from "@/lib/format";

type Props = {
  result: SimulationResult | null;
  winnerLabel: "" | "Buying" | "Renting" | "Tie";
  qsWinnerText: string;
};

export function SummarySidebar({ result, winnerLabel, qsWinnerText }: Props) {
  return (
    <aside className="lg:col-span-4">
      <div className="lg:sticky lg:top-6 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="text-xs font-medium text-white/60">Quick Summary</div>

          <div className="mt-3 grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-white/65">Buying net worth</div>
              <div className="font-semibold">{result ? fmtMoney(result.mortNetWorth) : "—"}</div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-white/65">Renting net worth</div>
              <div className="font-semibold">{result ? fmtMoney(result.rentNetWorth) : "—"}</div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-white/65">Winner</div>
              <div
                className={
                  "font-semibold " +
                  (!result || winnerLabel === "Tie"
                    ? "text-white"
                    : winnerLabel === "Buying"
                    ? "text-emerald-300"
                    : "text-cyan-300")
                }
              >
                {qsWinnerText}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
            <div className="text-xs text-white/55">Buying breakdown (end)</div>
            <div className="mt-2 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Home value</span>
                <span>{result ? fmtMoney(result.homeValue) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Mortgage balance</span>
                <span>{result ? fmtMoney(result.mortBalance) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Equity</span>
                <span>{result ? fmtMoney(result.homeEquity) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Investments</span>
                <span>{result ? fmtMoney(result.mortInvestment) : "—"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
            <div className="text-xs text-white/55">Renting breakdown (end)</div>
            <div className="mt-2 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Investment balance</span>
                <span>{result ? fmtMoney(result.rentInvestment) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Total contributed</span>
                <span>{result ? fmtMoney(result.rentInvContrib) : "—"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/55 backdrop-blur">
          <strong className="text-white">Disclaimer:</strong> Educational projection only. Excludes maintenance, repairs, insurance,
          council rates, taxes, selling fees, and other real-world costs.
        </div>
      </div>
    </aside>
  );
}
