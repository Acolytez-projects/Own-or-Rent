export function fmtMoney(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function fmtPct01(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}
