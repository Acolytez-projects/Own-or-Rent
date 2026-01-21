import React from "react";
import { TabButton } from "./ui/TabButton";

export type ActiveTab = "overview" | "buying" | "renting" | "comparison";

type Props = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
};

export function Tabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
      {/* Desktop tabs */}
      <div className="hidden sm:flex gap-2">
        <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
          Overview
        </TabButton>
        <TabButton active={activeTab === "buying"} onClick={() => setActiveTab("buying")}>
          Buying Details
        </TabButton>
        <TabButton active={activeTab === "renting"} onClick={() => setActiveTab("renting")}>
          Renting Details
        </TabButton>
        <TabButton active={activeTab === "comparison"} onClick={() => setActiveTab("comparison")}>
          Year-by-Year
        </TabButton>
      </div>

      {/* Mobile select */}
      <div className="sm:hidden">
        <label className="block">
          <div className="mb-2 text-xs font-medium text-white/60">View</div>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as ActiveTab)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/15"
          >
            <option value="overview">Overview</option>
            <option value="buying">Buying Details</option>
            <option value="renting">Renting Details</option>
            <option value="comparison">Year-by-Year</option>
          </select>
        </label>
      </div>
    </div>
  );
}
