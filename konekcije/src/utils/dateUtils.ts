import { getDevDate } from './devUtils';

export function getTodayDateString(): string {
  // Check for dev mode date override
  const devDate = getDevDate();
  if (devDate) {
    return devDate;
  }

  const today = new Date();
  return formatDate(today);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}
