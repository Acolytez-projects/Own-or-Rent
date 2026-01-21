export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function pmtMonthly(principal: number, annualRate: number, years: number): number {
  const n = years * 12;
  const r = annualRate / 12;
  if (annualRate === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

export function parseNum(v: string): number {
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}
