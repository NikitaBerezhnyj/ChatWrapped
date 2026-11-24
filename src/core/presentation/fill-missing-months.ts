interface MonthCount {
  month: string;
  count: number;
}

function toIndex(month: string): number {
  const [year, monthNumber] = month.split("-").map(Number);

  return year * 12 + (monthNumber - 1);
}

function fromIndex(index: number): string {
  const year = Math.floor(index / 12);
  const monthNumber = (index % 12) + 1;

  return `${year}-${String(monthNumber).padStart(2, "0")}`;
}

export function fillMissingMonths(months: MonthCount[]): MonthCount[] {
  if (months.length === 0) {
    return [];
  }

  const counts = new Map(months.map(item => [item.month, item.count]));
  const indexes = months.map(item => toIndex(item.month));

  const filled: MonthCount[] = [];

  for (let index = Math.min(...indexes); index <= Math.max(...indexes); index += 1) {
    const month = fromIndex(index);

    filled.push({ month, count: counts.get(month) ?? 0 });
  }

  return filled;
}
