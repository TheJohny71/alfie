/**
 * @class DateFormatter
 * Handles date formatting and calculations across different regions
 * File location: /js/utils/date-formatter.js
 */
class DateFormatter {
    constructor(config = {}) {
        this.defaultLocale = config.defaultLocale || 'en-US';
        this.defaultTimezone = config.defaultTimezone || 'UTC';
        this.regionFormats = {
            'en-US': {
                date: 'MM/dd/yyyy',
                time: 'h:mm a',
                datetime: 'MM/dd/yyyy h:mm a',
                calendar: {
                    weekStart: 0, // Sunday
                    firstWeek: 1
                }
            },
            'en-GB': {
                date: 'dd/MM/yyyy',
                time: 'HH:mm',
                datetime: 'dd/MM/yyyy HH:mm',
                calendar: {
                    weekStart: 1, // Monday
                    firstWeek: 1
                }
            }
        };
    }

    /**
     * Format date according to region settings
     * @param {Date|string} date - Date to format
     * @param {string} format - Desired format
     * @param {string} locale - Locale code
     * @returns {string} Formatted date string
     */
    formatDate(date, format, locale = this.defaultLocale) {
        const dateObj = this.parseDate(date);
        const formatter = new Intl.DateTimeFormat(locale, this.getFormatOptions(format));
        return formatter.format(dateObj);
    }

    /**
     * Parse date string to Date object
     * @param {string|Date} date - Date string or object
     * @returns {Date} Date object
     */
    parseDate(date) {
        if (date instanceof Date) {
            return date;
        }
        
        // Handle various date string formats
        if (typeof date === 'string') {
            // Try ISO format first
            const isoDate = new Date(date);
            if (!isNaN(isoDate)) {
                return isoDate;
            }

            // Try parsing different regional formats
            for (const locale of Object.keys(this.regionFormats)) {
                const parsed = this.parseRegionalDate(date, locale);
                if (parsed) {
                    return parsed;
                }
            }
        }

        throw new Error('Invalid date format');
    }

    /**
     * Calculate working days between two dates
     * @param {Date|string} startDate - Start date
     * @param {Date|string} endDate - End date
     * @param {Array} holidays - Array of holiday dates
     * @returns {number} Number of working days
     */
    calculateWorkingDays(startDate, endDate, holidays = []) {
        const start = this.parseDate(startDate);
        const end = this.parseDate(endDate);
        const holidayDates = holidays.map(h => this.parseDate(h));
        
        let workingDays = 0;
        const current = new Date(start);
        
        while (current <= end) {
            // Check if it's a weekday and not a holiday
            if (this.isWorkingDay(current) && !this.isHoliday(current, holidayDates)) {
                workingDays++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        return workingDays;
    }

    /**
     * Calculate leave duration in different units
     * @param {Date|string} startDate - Start date
     * @param {Date|string} endDate - End date
     * @param {string} unit - Unit of measurement (days, weeks, hours)
     * @returns {number} Duration in specified unit
     */
    calculateDuration(startDate, endDate, unit = 'days') {
        const start = this.parseDate(startDate);
        const end = this.parseDate(endDate);
        
        const diffTime = Math.abs(end - start);
        
        switch (unit.toLowerCase()) {
            case 'days':
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            case 'weeks':
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
            case 'hours':
                return Math.ceil(diffTime / (1000 * 60 * 60));
            default:
                throw new Error('Invalid duration unit');
        }
    }

    /**
     * Get local date string for storage/API
     * @param {Date|string} date - Date to format
     * @returns {string} ISO date string
     */
    getStorageDate(date) {
        const dateObj = this.parseDate(date);
        return dateObj.toISOString().split('T')[0];
    }

    /**
     * Format date range for display
     * @param {Date|string} startDate - Start date
     * @param {Date|string} endDate - End date
     * @param {string} locale - Locale code
     * @returns {string} Formatted date range
     */
    formatDateRange(startDate, endDate, locale = this.defaultLocale) {
        const start = this.parseDate(startDate);
        const end = this.parseDate(endDate);
        
        // Same day
        if (start.toDateString() === end.toDateString()) {
            return this.formatDate(start, 'date', locale);
        }
        
        // Same month
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${start.getDate()} - ${this.formatDate(end, 'date', locale)}`;
        }
        
        // Different months
        return `${this.formatDate(start, 'date', locale)} - ${this.formatDate(end, 'date', locale)}`;
    }

    /**
     * Check if date is a working day
     * @private
     */
    isWorkingDay(date) {
        const day = date.getDay();
        return day !== 0 && day !== 6; // Not Sunday and not Saturday
    }

    /**
     * Check if date is a holiday
     * @private
     */
    isHoliday(date, holidays) {
        return holidays.some(holiday => 
            holiday.getDate() === date.getDate() &&
            holiday.getMonth() === date.getMonth() &&
            holiday.getFullYear() === date.getFullYear()
        );
    }

    /**
     * Parse date string according to regional format
     * @private
     */
    parseRegionalDate(dateStr, locale) {
        const format = this.regionFormats[locale].date;
        const parts = dateStr.split(/[/.-]/);
        
        if (parts.length !== 3) {
            return null;
        }

        let year, month, day;
        
        switch (format) {
            case 'MM/dd/yyyy':
                [month, day, year] = parts;
                break;
            case 'dd/MM/yyyy':
                [day, month, year] = parts;
                break;
            default:
                return null;
        }

        // Ensure year has 4 digits
        if (year.length === 2) {
            year = '20' + year;
        }

        const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return !isNaN(parsedDate) ? parsedDate : null;
    }

    /**
     * Get format options for Intl.DateTimeFormat
     * @private
     */
    getFormatOptions(format) {
        switch (format) {
            case 'date':
                return {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                };
            case 'time':
                return {
                    hour: '2-digit',
                    minute: '2-digit'
                };
            case 'datetime':
                return {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                };
            default:
                return {};
        }
    }
}

export default DateFormatter;
