// date-formatter.js
export class DateFormatter {
    constructor(config = {}) {
        this.defaultLocale = config.defaultLocale || 'en-US';
        this.regionFormats = {
            'en-US': {
                weekStart: 0, // Sunday
                firstWeek: 1
            },
            'en-GB': {
                weekStart: 1, // Monday
                firstWeek: 1
            }
        };
    }

    formatDate(date, format = 'short', locale = this.defaultLocale) {
        const dateObj = this.parseDate(date);
        return new Intl.DateTimeFormat(locale, this.getFormatOptions(format)).format(dateObj);
    }

    parseDate(date) {
        if (date instanceof Date) return date;
        return new Date(date);
    }

    calculateWorkingDays(startDate, endDate, holidays = []) {
        const start = this.parseDate(startDate);
        const end = this.parseDate(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return Math.max(Math.round(days * 0.71), 1); // Rough working days estimate
    }

    formatDateRange(startDate, endDate, locale = this.defaultLocale) {
        const start = this.formatDate(startDate, 'short', locale);
        const end = this.formatDate(endDate, 'short', locale);
        return `${start} - ${end}`;
    }

    getFormatOptions(format) {
        switch (format) {
            case 'short':
                return { 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                };
            case 'long':
                return {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                };
            default:
                return { dateStyle: format };
        }
    }

    isWorkingDay(date) {
        const day = this.parseDate(date).getDay();
        return day !== 0 && day !== 6;
    }
}

// Initialize globally
window.Alfie = window.Alfie || {};
window.Alfie.DateFormatter = DateFormatter;
