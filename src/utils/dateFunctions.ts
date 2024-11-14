import { format, parseISO } from 'date-fns';

export function formatDateString(isoString: string, dateFormat?: string): string {
  if (!isoString) return '';

  const date = parseISO(isoString);
  return format(date, dateFormat ?? 'dd/MM/yyyy');
}

export function convertToDate(isoString: string): Date {
  return parseISO(isoString);
}

export function convertToTimestamp(isoString: string): number {
  const date = parseISO(isoString);
  return date.getTime();
}
