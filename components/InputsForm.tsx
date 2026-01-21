import React from "react";
import { Calculator, Home, DollarSign, TrendingUp, ChevronDown } from "lucide-react";

import type { SimulationParams, SimulationResult } from "@/types/mortgage-vs-rent";
import { fmtMoney, fmtPct01 } from "@/lib/format";
import { InputField } from "./ui/InputField";

type Props = {
  // Draft inputs (strings)
  housePrice: string; setHousePrice: (v: string) => void;
  deposit: string; setDeposit: (v: string) => void;
  years: string; setYears: (v: string) => void;
  annualMortgageRatePct: string; setAnnualMortgageRatePct: (v: string) => void;
  annualHouseGrowthPct: string; setAnnualHouseGrowthPct: (v: string) => void;
  monthlyBudget: string; setMonthlyBudget: (v: string) => void;
  stampDuty: string; setStampDuty: (v: string) => void;
  lmi: string; setLmi: (v: string) => void;
  initialRentMonthly: string; setInitialRentMonthly: (v: string) => void;
  annualRentIncreasePct: string; setAnnualRentIncreasePct: (v: string) => void;
  annualInvestmentReturnPct: string; setAnnualInvestmentReturnPct: (v: string) => void;

  // Draft helpers from parent (lightweight)
  draftHouse: number;
  draftDepositPct01: number;
  draftLvr01: number;

  // Submit
  onSubmit: (e?: React.FormEvent) => void;

  // Applied result (to show some “after calculate” blocks)
  result: SimulationResult | null;
  appliedInputs: SimulationParams | null;
};

export function InputsForm(props: Props) {
  const {
    housePrice, setHousePrice,
    deposit, setDeposit,
    years, setYears,
    annualMortgageRatePct, setAnnualMortgageRatePct,
    annualHouseGrowthPct, setAnnualHouseGrowthPct,
    monthlyBudget, setMonthlyBudget,
    stampDuty, setStampDuty,
    lmi, setLmi,
    initialRentMonthly, setInitialRentMonthly,
    annualRentIncreasePct, setAnnualRentIncreasePct,
    annualInvestmentReturnPct, setAnnualInvestmentReturnPct,
    draftHouse, draftDepositPct01, draftLvr01,
    onSubmit,
    result,
    appliedInputs,
  } = props;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* General */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
            <Calculator className="h-5 w-5 text-cyan-300" />
            General
          </h2>

          <div className="space-y-4">
            <InputField label="House Price" value={housePrice} onChange={setHousePrice} prefix="$" min={0} placeholder="e.g. 800000" />

            <InputField
              label="Initial Deposit"
              value={deposit}
              onChange={setDeposit}
              prefix="$"
              min={0}
              max={draftHouse || undefined}
              helper={
                draftHouse > 0
                  ? `${fmtPct01(draftDepositPct01)} of price • LVR: ${fmtPct01(draftLvr01)}`
                  : "Enter a house price to see deposit % and LVR"
              }
              placeholder="e.g. 160000"
            />

            <InputField
              label="Loan Period"
              value={years}
              onChange={setYears}
              suffix="years"
              min={1}
              max={50}
              placeholder="e.g. 30"
              helper="If left empty, defaults to 30"
            />

            <InputField
              label="Monthly Budget"
              value={monthlyBudget}
              onChange={setMonthlyBudget}
              prefix="$"
              min={0}
              helper="Total available for housing + investing"
              placeholder="e.g. 4000"
            />

            <InputField
              label="Investment Return (Annual)"
              value={annualInvestmentReturnPct}
              onChange={setAnnualInvestmentReturnPct}
              suffix="%"
              step="0.1"
              placeholder="e.g. 8"
            />
          </div>
        </section>

        {/* Buying */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
            <Home className="h-5 w-5 text-emerald-300" />
            Buying
          </h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs text-white/55">Loan Amount</div>
              <div className="mt-1 text-xl font-semibold text-emerald-300">
                {result ? fmtMoney(result.loan) : "—"}
              </div>
              <div className="mt-1 text-xs text-white/45">Updates after Calculate</div>
            </div>

            <InputField
              label="Mortgage Rate (Annual)"
              value={annualMortgageRatePct}
              onChange={setAnnualMortgageRatePct}
              suffix="%"
              step="0.1"
              placeholder="e.g. 5.5"
            />

            <InputField
              label="House Growth (Annual)"
              value={annualHouseGrowthPct}
              onChange={setAnnualHouseGrowthPct}
              suffix="%"
              step="0.1"
              helper="Used to project future home value"
              placeholder="e.g. 5"
            />

            <InputField label="Stamp Duty" value={stampDuty} onChange={setStampDuty} prefix="$" min={0} placeholder="e.g. 43070" />
            <InputField label="LMI (if applicable)" value={lmi} onChange={setLmi} prefix="$" min={0} placeholder="e.g. 0" />

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs text-white/55">Monthly Payment (P&I)</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {result ? fmtMoney(result.mortgagePMT) : "—"}
              </div>
              <div className="mt-1 text-xs text-white/45">Updates after Calculate</div>
            </div>
          </div>
        </section>

        {/* Renting */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
            <DollarSign className="h-5 w-5 text-cyan-300" />
            Renting
          </h2>

          <div className="space-y-4">
            <InputField label="Monthly Rent (Initial)" value={initialRentMonthly} onChange={setInitialRentMonthly} prefix="$" min={0} placeholder="e.g. 2300" />

            <InputField
              label="Rent Increase (Annual)"
              value={annualRentIncreasePct}
              onChange={setAnnualRentIncreasePct}
              suffix="%"
              step="0.1"
              placeholder="e.g. 2.5"
            />

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs text-white/55">Initial Investment</div>
              <div className="mt-1 text-xl font-semibold text-cyan-300">
                {result && appliedInputs ? fmtMoney(appliedInputs.deposit + appliedInputs.stampDuty) : "—"}
              </div>
              <div className="mt-1 text-xs text-white/45">Updates after Calculate</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs text-white/55">Monthly Investment (Initial)</div>
              <div className="mt-1 text-xl font-semibold text-white">
                {result && appliedInputs
                  ? fmtMoney(Math.max(0, appliedInputs.monthlyBudget - appliedInputs.initialRentMonthly))
                  : "—"}
              </div>
              <div className="mt-1 text-xs text-white/45">Updates after Calculate</div>
            </div>
          </div>
        </section>

        {/* Helpful note + submit */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur md:col-span-2">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-white p-2 text-black">
              <TrendingUp className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <div className="font-semibold">What this is doing</div>
              <div className="mt-1 text-sm text-white/60">
                Each month, it compares your housing cost (mortgage payment or rent) against your monthly budget.
                Any leftover is invested. Buying net worth = home equity + investments − stamp duty − LMI.
              </div>

              <details className="mt-3 group">
                <summary className="flex cursor-pointer items-center gap-2 text-sm text-white/70 hover:text-white">
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  Assumptions & exclusions
                </summary>
                <div className="mt-2 text-sm text-white/55">
                  Simplified model: excludes maintenance, repairs, insurance, rates, tax impacts, vacancy/fees, and transaction costs on sale.
                  Use as a directional tool only.
                </div>
              </details>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow hover:bg-white/90 active:bg-white/80"
                >
                  Calculate
                </button>

                <div className="text-xs text-white/45 flex items-center">
                  {result ? "Calculated ✓" : "Not calculated yet"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
