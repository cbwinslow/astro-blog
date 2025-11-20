/**
 * DateFormatter - Utility object for date formatting operations
 */

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const DateFormatter = {
  /**
   * Format date to readable string
   */
  formatDate(date: Date, format: string = "MMM DD, YYYY"): string {
    return dayjs(date).format(format);
  },

  /**
   * Format date with timezone
   */
  formatDateWithTimezone(
    date: Date,
    tz?: string,
    format: string = "MMM DD, YYYY"
  ): string {
    if (tz) {
      return dayjs(date).tz(tz).format(format);
    }
    return dayjs(date).format(format);
  },

  /**
   * Get relative time (e.g., "2 days ago")
   */
  getRelativeTime(date: Date): string {
    return dayjs(date).fromNow();
  },

  /**
   * Check if date is in the past
   */
  isPast(date: Date): boolean {
    return dayjs(date).isBefore(dayjs());
  },

  /**
   * Check if date is in the future
   */
  isFuture(date: Date): boolean {
    return dayjs(date).isAfter(dayjs());
  },

  /**
   * Get date range string
   */
  getDateRange(startDate: Date, endDate: Date): string {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (start.year() === end.year()) {
      if (start.month() === end.month()) {
        return `${start.format("MMM DD")} - ${end.format("DD, YYYY")}`;
      }
      return `${start.format("MMM DD")} - ${end.format("MMM DD, YYYY")}`;
    }

    return `${start.format("MMM DD, YYYY")} - ${end.format("MMM DD, YYYY")}`;
  },

  /**
   * Format date for ISO string
   */
  toISOString(date: Date): string {
    return dayjs(date).toISOString();
  },

  /**
   * Parse ISO string to Date
   */
  fromISOString(isoString: string): Date {
    return dayjs(isoString).toDate();
  },

  /**
   * Get day of week
   */
  getDayOfWeek(date: Date): string {
    return dayjs(date).format("dddd");
  },

  /**
   * Get month name
   */
  getMonthName(date: Date): string {
    return dayjs(date).format("MMMM");
  },

  /**
   * Get year
   */
  getYear(date: Date): number {
    return dayjs(date).year();
  },

  /**
   * Check if two dates are the same day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return dayjs(date1).isSame(dayjs(date2), "day");
  },

  /**
   * Get days between two dates
   */
  getDaysBetween(date1: Date, date2: Date): number {
    return Math.abs(dayjs(date1).diff(dayjs(date2), "day"));
  },

  /**
   * Format datetime for display
   */
  formatDateTime(
    date: Date,
    format: string = "MMM DD, YYYY [at] HH:mm"
  ): string {
    return dayjs(date).format(format);
  },
};

export default DateFormatter;
