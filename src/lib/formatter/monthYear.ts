export function formatMonthYear(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
