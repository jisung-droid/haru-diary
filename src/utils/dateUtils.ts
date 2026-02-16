import { format, parseISO, isToday, isYesterday, startOfWeek, startOfMonth, differenceInDays } from 'date-fns';

export function formatEntryDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatShortDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d');
}

export function formatMonthYear(dateString: string): string {
  return format(parseISO(dateString), 'MMMM yyyy');
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getWeekKey(dateString: string): string {
  const date = parseISO(dateString);
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  return format(weekStart, 'yyyy-MM-dd');
}

export function getMonthKey(dateString: string): string {
  const date = parseISO(dateString);
  return format(startOfMonth(date), 'yyyy-MM');
}

export function daysBetween(date1: string, date2: string): number {
  return Math.abs(differenceInDays(parseISO(date1), parseISO(date2)));
}
