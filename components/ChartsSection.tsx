import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Home, TrendingUp, DollarSign, Calculator } from "lucide-react";

import type { SimulationParams, SimulationResult } from "@/types/mortgage-vs-rent";
import { fmtMoney } from "@/lib/format";
import { ChartCard } from "./ui/ChartCard";
import { Stat } from "./ui/Stat";
import type { ActiveTab } from "./Tabs";

type Props = {
  activeTab: ActiveTab;
  result: SimulationResult | null;
  appliedInputs: SimulationParams | null;
  qsWinnerText: string;
};

export function ChartsSection({ activeTab, result, appliedInputs, qsWinnerText }: Props) {
  if (!result) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60 backdrop-blur">
        Hit <span className="font-semibold text-white">Calculate</span> to generate the summary and charts.
      </div>
    );
  }

  return (
    <>
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Buying Net Worth" value={fmtMoney(result.mortNetWorth)} icon={<Home className="h-4 w-4" />} />
            <Stat label="Renting Net Worth" value={fmtMoney(result.rentNetWorth)} icon={<TrendingUp className="h-4 w-4" />} />
            <Stat label="Winner" value={qsWinnerText} icon={<DollarSign className="h-4 w-4" />} />
            <Stat label="Total Interest Paid" value={fmtMoney(result.mortInterestPaid)} icon={<Calculator className="h-4 w-4" />} />
          </div>

          <ChartCard title="Net Worth Over Time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.comparisonData} margin={{ left: 6, right: 6, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="rgba(255,255,255,0.55)"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                  }}
                  formatter={(value: any) => [fmtMoney(value), ""]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend wrapperStyle={{ color: "rgba(255,255,255,0.75)" }} />
                <Line type="monotone" dataKey="mortgage" stroke="#34d399" strokeWidth={3} name="Buying" dot={false} />
                <Line type="monotone" dataKey="rent" stroke="#22d3ee" strokeWidth={3} name="Renting" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {activeTab === "buying" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="Monthly Payment (P&I)" value={fmtMoney(result.mortgagePMT)} />
            <Stat
              label="Monthly Investment"
              value={fmtMoney(Math.max(0, (appliedInputs?.monthlyBudget ?? 0) - result.mortgagePMT))}
              hint="Surplus invested"
            />
            <Stat label="Total Interest Paid" value={fmtMoney(result.mortInterestPaid)} />
            <Stat label="Total Principal Paid" value={fmtMoney(result.mortPrincipalPaid)} />
            <Stat label="Home Equity" value={fmtMoney(result.homeEquity)} hint={`Home value: ${fmtMoney(result.homeValue)}`} />
            <Stat label="Investment Balance" value={fmtMoney(result.mortInvestment)} />
          </div>

          <ChartCard title="Investment Growth (Buying)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.mortYearly} margin={{ left: 6, right: 6, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="rgba(255,255,255,0.55)"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                  }}
                  formatter={(value: any, name: any) => [fmtMoney(value), name]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend wrapperStyle={{ color: "rgba(255,255,255,0.75)" }} />
                <Bar dataKey="contributions" stackId="a" fill="#34d399" name="Contributions" />
                <Bar dataKey="growth" stackId="a" fill="#22d3ee" name="Growth" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {activeTab === "renting" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat
              label="Initial Investment"
              value={fmtMoney((appliedInputs?.deposit ?? 0) + (appliedInputs?.stampDuty ?? 0))}
            />
            <Stat label="Starting Monthly Rent" value={fmtMoney(appliedInputs?.initialRentMonthly ?? 0)} />
            <Stat
              label="Initial Monthly Investment"
              value={fmtMoney(Math.max(0, (appliedInputs?.monthlyBudget ?? 0) - (appliedInputs?.initialRentMonthly ?? 0)))}
              hint="Surplus invested"
            />
            <Stat label="Final Investment Balance" value={fmtMoney(result.rentInvestment)} />
            <Stat label="Total Contributions" value={fmtMoney(result.rentInvContrib)} />
            <Stat label="Investment Growth" value={fmtMoney(result.rentInvestment - result.rentInvContrib)} />
          </div>

          <ChartCard title="Investment Growth (Renting)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.rentYearly} margin={{ left: 6, right: 6, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="rgba(255,255,255,0.55)"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.95)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                  }}
                  formatter={(value: any, name: any) => [fmtMoney(value), name]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend wrapperStyle={{ color: "rgba(255,255,255,0.75)" }} />
                <Bar dataKey="contributions" stackId="a" fill="#22d3ee" name="Contributions" />
                <Bar dataKey="growth" stackId="a" fill="#a78bfa" name="Growth" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {activeTab === "comparison" && (
        <ChartCard title="Year-by-Year Net Worth">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.comparisonData} margin={{ left: 6, right: 6, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.55)" tickLine={false} axisLine={false} />
              <YAxis
                stroke="rgba(255,255,255,0.55)"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.95)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                }}
                formatter={(value: any) => [fmtMoney(value), ""]}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.75)" }} />
              <Line type="monotone" dataKey="mortgage" stroke="#34d399" strokeWidth={3} name="Buying Net Worth" dot={false} />
              <Line type="monotone" dataKey="rent" stroke="#22d3ee" strokeWidth={3} name="Renting Net Worth" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </>
  );
}
