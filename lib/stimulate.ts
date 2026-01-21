import type { SimulationParams, SimulationResult } from "@/types/mortgage-vs-rent";
import { pmtMonthly } from "./math";

export function simulate(params: SimulationParams): SimulationResult {
  const {
    housePrice,
    deposit,
    annualMortgageRate,
    annualHouseGrowth,
    years,
    monthlyBudget,
    stampDuty,
    lmi,
    initialRentMonthly,
    annualRentIncrease,
    annualInvestmentReturn,
  } = params;

  const months = years * 12;
  const rInv = annualInvestmentReturn / 12;
  const rHouse = annualHouseGrowth / 12;
  const rMort = annualMortgageRate / 12;

  const loan = Math.max(0, housePrice - deposit);
  const mortgagePMT = pmtMonthly(loan, annualMortgageRate, years);

  let mortBalance = loan;
  let mortInvestment = 0;
  let mortInvContrib = 0;
  let mortInterestPaid = 0;
  let mortPrincipalPaid = 0;
  let homeValue = housePrice;

  let rentInvestment = deposit + stampDuty;
  let rentInvContrib = deposit + stampDuty;

  const mortYearly: SimulationResult["mortYearly"] = [];
  const rentYearly: SimulationResult["rentYearly"] = [];
  const comparisonData: SimulationResult["comparisonData"] = [];

  let currentRentMonthly = initialRentMonthly;

  for (let m = 1; m <= months; m++) {
    const yearIndex = Math.ceil(m / 12);

    homeValue *= 1 + rHouse;

    if (mortBalance > 0) {
      const interest = mortBalance * rMort;
      let principal = mortgagePMT - interest;
      if (principal > mortBalance) principal = mortBalance;
      mortBalance -= principal;
      mortInterestPaid += interest;
      mortPrincipalPaid += principal;
    }

    const mortMonthlyInvest = Math.max(0, monthlyBudget - mortgagePMT);
    mortInvestment = mortInvestment * (1 + rInv) + mortMonthlyInvest;
    mortInvContrib += mortMonthlyInvest;

    const rentMonthlyInvest = Math.max(0, monthlyBudget - currentRentMonthly);
    rentInvestment = rentInvestment * (1 + rInv) + rentMonthlyInvest;
    rentInvContrib += rentMonthlyInvest;

    if (m % 12 === 0) {
      currentRentMonthly *= 1 + annualRentIncrease;

      const homeEquityYr = Math.max(0, homeValue - mortBalance);
      const mortNetWorthYr = homeEquityYr + mortInvestment - stampDuty - lmi;

      mortYearly.push({
        year: yearIndex,
        contributions: Math.max(0, mortInvContrib),
        growth: Math.max(0, mortInvestment - mortInvContrib),
      });

      rentYearly.push({
        year: yearIndex,
        contributions: Math.max(0, rentInvContrib),
        growth: Math.max(0, rentInvestment - rentInvContrib),
      });

      comparisonData.push({
        year: yearIndex,
        mortgage: mortNetWorthYr,
        rent: rentInvestment,
      });
    }
  }

  const homeEquity = Math.max(0, homeValue - mortBalance);
  const mortNetWorth = homeEquity + mortInvestment - stampDuty - lmi;
  const rentNetWorth = rentInvestment;

  return {
    loan,
    mortgagePMT,
    mortInterestPaid,
    mortPrincipalPaid,
    mortBalance,
    homeEquity,
    homeValue,
    mortInvestment,
    mortInvContrib,
    mortNetWorth,
    rentInvestment,
    rentInvContrib,
    rentNetWorth,
    mortYearly,
    rentYearly,
    comparisonData,
  };
}
