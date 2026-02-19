export function getDefaultDateForSeason(seasonYear: string): Date {
  const today = new Date();
  const parts = seasonYear.split("/");
  const firstYY = parts[0];
  const secondYY = parts[1];
  const month = today.getMonth();
  const yearSuffix = month <= 6 ? secondYY : firstYY;
  const fullYear = 2000 + Number.parseInt(yearSuffix!, 10);
  return new Date(fullYear, today.getMonth(), today.getDate());
}

export function formatDateToInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
