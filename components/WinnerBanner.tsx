import React from "react";
import type { SimulationParams, SimulationResult } from "@/types/mortgage-vs-rent";
import { fmtMoney } from "@/lib/format";

type Props = {
  appliedInputs: SimulationParams | null;
  result: SimulationResult | null;
};

export function WinnerBanner({ appliedInputs, result }: Props) {
  const diff = result ? result.mortNetWorth - result.rentNetWorth : 0;
  const winnerLabel = !result ? "" : diff > 0 ? "Buying" : diff < 0 ? "Renting" : "Tie";

  const bannerTone =
    !result
      ? "border-white/10 bg-white/5"
      : diff > 0
      ? "border-emerald-400/25 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"
      : diff < 0
      ? "border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10"
      : "border-white/10 bg-white/5";

  const bannerTitle =
    !result
      ? "Enter your numbers and hit Calculate"
      : winnerLabel === "Buying"
      ? "🏠 Buying Wins"
      : winnerLabel === "Renting"
      ? "🏢 Renting Wins"
      : "📊 It’s a Tie";

  const bannerSub =
    !result
      ? "Your graphs and summary will update after you submit."
      : `Winning margin: ${fmtMoney(Math.abs(diff))}`;

  return (
    <div className={`mb-6 rounded-2xl border p-5 sm:p-6 text-center ${bannerTone}`}>
      <div className="text-xs sm:text-sm font-medium text-white/60">
        {appliedInputs ? `After ${appliedInputs.years} years` : "Ready when you are"}
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-bold">{bannerTitle}</div>
      <div className="mt-2 text-base sm:text-lg text-white/70">{bannerSub}</div>
    </div>
  );
}
