const DEV_DATE_KEY = 'konekcije_dev_date';

export function isDevMode(): boolean {
  // Check environment variable
  return import.meta.env.VITE_DEV_MODE === 'true';
}

export function setDevDate(date: string): void {
  if (isDevMode()) {
    localStorage.setItem(DEV_DATE_KEY, date);
  }
}

export function getDevDate(): string | null {
  if (isDevMode()) {
    return localStorage.getItem(DEV_DATE_KEY);
  }
  return null;
}

export function clearDevDate(): void {
  localStorage.removeItem(DEV_DATE_KEY);
}
