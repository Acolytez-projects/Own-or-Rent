"use client";

import React, { useState, useCallback, useEffect } from "react";
import type {
  SimulationParams,
  SimulationResult,
} from "@/types/mortgage-vs-rent";
import { clamp, parseNum } from "@/lib/math";
import { fmtMoney } from "@/lib/format";
import { simulate } from "@/lib/stimulate";

import { CalculatorHeader } from "./CalculatorHeader";
import { WinnerBanner } from "./WinnerBanner";
import { InputsForm } from "./InputsForm";
import { Tabs, type ActiveTab } from "./Tabs";
import { ChartsSection } from "./ChartsSection";
import { SummarySidebar } from "./SummarySidebar";

const STORAGE_KEY = "mvr:v1";

export function MortgageVsRentCalculator() {
  // Draft inputs (strings)
  const [housePrice, setHousePrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [years, setYears] = useState("");
  const [annualMortgageRatePct, setAnnualMortgageRatePct] = useState("");
  const [annualHouseGrowthPct, setAnnualHouseGrowthPct] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [stampDuty, setStampDuty] = useState("");
  const [lmi, setLmi] = useState("");
  const [initialRentMonthly, setInitialRentMonthly] = useState("");
  const [annualRentIncreasePct, setAnnualRentIncreasePct] = useState("");
  const [annualInvestmentReturnPct, setAnnualInvestmentReturnPct] =
    useState("");

  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  const [appliedInputs, setAppliedInputs] = useState<SimulationParams | null>(
    null,
  );
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Draft helpers (NO simulation)
  const draftHouse = Math.max(0, parseNum(housePrice));
  const draftDeposit = clamp(Math.max(0, parseNum(deposit)), 0, draftHouse);
  const draftLoan = Math.max(0, draftHouse - draftDeposit);
  const draftDepositPct01 = draftHouse > 0 ? draftDeposit / draftHouse : 0;
  const draftLvr01 = draftHouse > 0 ? draftLoan / draftHouse : 0;

  const onSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault?.();

      const safeYears = clamp(parseNum(years) || 30, 1, 50);
      const safeHouse = Math.max(0, parseNum(housePrice));
      const safeDep = clamp(Math.max(0, parseNum(deposit)), 0, safeHouse);

      const next: SimulationParams = {
        housePrice: safeHouse,
        deposit: safeDep,
        years: safeYears,
        annualMortgageRate: (parseNum(annualMortgageRatePct) || 0) / 100,
        annualHouseGrowth: (parseNum(annualHouseGrowthPct) || 0) / 100,
        monthlyBudget: Math.max(0, parseNum(monthlyBudget)),
        stampDuty: Math.max(0, parseNum(stampDuty)),
        lmi: Math.max(0, parseNum(lmi)),
        initialRentMonthly: Math.max(0, parseNum(initialRentMonthly)),
        annualRentIncrease: (parseNum(annualRentIncreasePct) || 0) / 100,
        annualInvestmentReturn:
          (parseNum(annualInvestmentReturnPct) || 0) / 100,
      };

      setAppliedInputs(next);
      setResult(simulate(next));
    },
    [
      years,
      housePrice,
      deposit,
      annualMortgageRatePct,
      annualHouseGrowthPct,
      monthlyBudget,
      stampDuty,
      lmi,
      initialRentMonthly,
      annualRentIncreasePct,
      annualInvestmentReturnPct,
    ],
  );

  const diff = result ? result.mortNetWorth - result.rentNetWorth : 0;
  const winnerLabel = !result
    ? ""
    : diff > 0
      ? "Buying"
      : diff < 0
        ? "Renting"
        : "Tie";

  const qsWinnerText = !result
    ? "—"
    : winnerLabel === "Tie"
      ? "Tie"
      : winnerLabel === "Buying"
        ? `Mortgage wins by ${fmtMoney(Math.abs(diff))}`
        : `Renting wins by ${fmtMoney(Math.abs(diff))}`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as any;

      setHousePrice(saved.housePrice ?? "");
      setDeposit(saved.deposit ?? "");
      setYears(saved.years ?? "");
      setAnnualMortgageRatePct(saved.annualMortgageRatePct ?? "");
      setAnnualHouseGrowthPct(saved.annualHouseGrowthPct ?? "");
      setMonthlyBudget(saved.monthlyBudget ?? "");
      setStampDuty(saved.stampDuty ?? "");
      setLmi(saved.lmi ?? "");
      setInitialRentMonthly(saved.initialRentMonthly ?? "");
      setAnnualRentIncreasePct(saved.annualRentIncreasePct ?? "");
      setAnnualInvestmentReturnPct(saved.annualInvestmentReturnPct ?? "");
      setActiveTab(saved.activeTab ?? "overview");

      if (saved.appliedInputs) {
        setAppliedInputs(saved.appliedInputs);
        setResult(simulate(saved.appliedInputs));
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const payload = {
      housePrice,
      deposit,
      years,
      annualMortgageRatePct,
      annualHouseGrowthPct,
      monthlyBudget,
      stampDuty,
      lmi,
      initialRentMonthly,
      annualRentIncreasePct,
      annualInvestmentReturnPct,
      activeTab,
      appliedInputs, // only save applied inputs (then we recompute result on load)
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore quota/private mode
    }
  }, [
    housePrice,
    deposit,
    years,
    annualMortgageRatePct,
    annualHouseGrowthPct,
    monthlyBudget,
    stampDuty,
    lmi,
    initialRentMonthly,
    annualRentIncreasePct,
    annualInvestmentReturnPct,
    activeTab,
    appliedInputs,
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute left-[-10%] top-[-20%] h-[40rem] w-[40rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[36rem] w-[36rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-25%] left-[20%] h-[44rem] w-[44rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <CalculatorHeader />
        <WinnerBanner appliedInputs={appliedInputs} result={result} />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-8 space-y-6">
            <InputsForm
              housePrice={housePrice}
              setHousePrice={setHousePrice}
              deposit={deposit}
              setDeposit={setDeposit}
              years={years}
              setYears={setYears}
              annualMortgageRatePct={annualMortgageRatePct}
              setAnnualMortgageRatePct={setAnnualMortgageRatePct}
              annualHouseGrowthPct={annualHouseGrowthPct}
              setAnnualHouseGrowthPct={setAnnualHouseGrowthPct}
              monthlyBudget={monthlyBudget}
              setMonthlyBudget={setMonthlyBudget}
              stampDuty={stampDuty}
              setStampDuty={setStampDuty}
              lmi={lmi}
              setLmi={setLmi}
              initialRentMonthly={initialRentMonthly}
              setInitialRentMonthly={setInitialRentMonthly}
              annualRentIncreasePct={annualRentIncreasePct}
              setAnnualRentIncreasePct={setAnnualRentIncreasePct}
              annualInvestmentReturnPct={annualInvestmentReturnPct}
              setAnnualInvestmentReturnPct={setAnnualInvestmentReturnPct}
              draftHouse={draftHouse}
              draftDepositPct01={draftDepositPct01}
              draftLvr01={draftLvr01}
              onSubmit={onSubmit}
              result={result}
              appliedInputs={appliedInputs}
            />

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <ChartsSection
              activeTab={activeTab}
              result={result}
              appliedInputs={appliedInputs}
              qsWinnerText={qsWinnerText}
            />
          </div>

          {/* Right */}
          <SummarySidebar
            result={result}
            winnerLabel={winnerLabel as any}
            qsWinnerText={qsWinnerText}
          />
        </div>
      </div>
    </div>
  );
}
