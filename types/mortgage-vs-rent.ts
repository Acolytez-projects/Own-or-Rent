export type SimulationParams = {
  housePrice: number;
  deposit: number;
  annualMortgageRate: number; // decimal (0.055)
  annualHouseGrowth: number;  // decimal
  years: number;
  monthlyBudget: number;
  stampDuty: number;
  lmi: number;
  initialRentMonthly: number;
  annualRentIncrease: number; // decimal
  annualInvestmentReturn: number; // decimal
};

export type YearlyData = {
  year: number;
  contributions: number;
  growth: number;
};

export type SimulationResult = {
  loan: number;
  mortgagePMT: number;
  mortInterestPaid: number;
  mortPrincipalPaid: number;
  mortBalance: number;
  homeEquity: number;
  homeValue: number;
  mortInvestment: number;
  mortInvContrib: number;
  mortNetWorth: number;
  rentInvestment: number;
  rentInvContrib: number;
  rentNetWorth: number;
  mortYearly: YearlyData[];
  rentYearly: YearlyData[];
  comparisonData: Array<{ year: number; mortgage: number; rent: number }>;
};
