export function fmt(n: number): string {
  return Math.abs(n).toLocaleString("vi-VN") + " ₫";
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
