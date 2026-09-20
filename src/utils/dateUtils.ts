import { TaskStatus } from '../types';

/**
 * Formats an ISO date string (e.g. 2026-09-25) into a readable format: Sep 25, 2026
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'No date';
  try {
    // Handle both YYYY-MM-DD and full ISO strings
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a timestamp (ISO string) into readable date + time (e.g. Sep 20, 2026, 10:30 AM)
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * Returns today's date in YYYY-MM-DD format for date input defaults/min
 */
export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if a task is overdue.
 * A task is overdue if its dueDate is strictly before today and status is NOT 'Completed'.
 */
export function isTaskOverdue(dueDate: string, status: TaskStatus): boolean {
  if (!dueDate || status === 'Completed') {
    return false;
  }

  const todayStr = getTodayString();
  const taskDueDate = dueDate.split('T')[0];

  return taskDueDate < todayStr;
}
