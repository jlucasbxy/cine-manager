export function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function daysAgo(days: number): Date {
  return daysFromNow(-days);
}
