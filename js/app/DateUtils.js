// DateUtils.js
export default class DateUtils {
  // Gibt die Anzahl der Tage zwischen zwei Daten zurück
  static daysBetween(startDate, endDate) {
    const msInDay = 24 * 60 * 60 * 1000;
    return Math.round((endDate - startDate) / msInDay);
  }

  static msPerDay = 24 * 60 * 60 * 1000;

  static daysPassedInYear(date = new Date()) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    return this.daysBetween(startOfYear, date);
  }

  // Anzahl der verbleibenden Tage im Jahr
  static daysRemainingInYear(date = new Date()) {
    const endOfYear = new Date(date.getFullYear(), 11, 31);
    return this.daysBetween(date, endOfYear);
  }

  // Gibt die Anzahl der Wochen zwischen zwei Daten zurück
  static weeksBetween(startDate, endDate) {
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.round((endDate - startDate) / msInWeek);
  }

  // Gibt die Anzahl der Monate zwischen zwei Daten zurück
  static monthsBetween(startDate, endDate) {
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();
    return years * 12 + months;
  }

  static weeksToGo(date = new Date()) {
    // return remaining weeks in the year
    const endOfYear = new Date(date.getFullYear(), 11, 31);
    const diffDays = Math.round(
      Math.abs((endOfYear - date) / DateUtils.msPerDay)
    );
    return Math.ceil(diffDays / 7);
  }

  static weeksPassed(date = new Date()) {
    // return passed weeks in the year
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diffDays = Math.round(
      Math.abs((date - startOfYear) / DateUtils.msPerDay)
    );
    return Math.floor(diffDays / 7);
  }
}
