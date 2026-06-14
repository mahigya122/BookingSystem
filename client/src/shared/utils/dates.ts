export function toLocalDateMs(dateValue: string | null | undefined) {
  if (!dateValue) return 0;

  if (dateValue.includes("T")) {
    return new Date(dateValue).getTime();
  }

  const [year, month, day] = dateValue.split("-").map(Number);

  return new Date(year, month - 1, day).getTime();
}