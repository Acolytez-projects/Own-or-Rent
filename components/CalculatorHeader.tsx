import React from "react";
import { Home } from "lucide-react";

export function CalculatorHeader() {
  return (
    <div className="mb-6 sm:mb-8 text-center">
      <div className="mb-3 flex items-center justify-center gap-3">
        <div className="rounded-2xl bg-white p-3 text-black shadow">
          <Home className="h-6 w-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Mortgage vs Rent
          <span className="block sm:inline text-white/70"> Calculator</span>
        </h1>
      </div>
      <p className="mx-auto max-w-2xl text-sm sm:text-base text-white/55">
        Compare net worth outcomes over time by modeling home growth, mortgage repayments, rent increases, and investing the surplus.
      </p>
    </div>
  );
}
