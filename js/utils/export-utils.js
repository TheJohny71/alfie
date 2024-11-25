// export-utils.js
export class ExportUtils {
    constructor(dateFormatter) {
        this.dateFormatter = dateFormatter || new window.Alfie.DateFormatter();
        this.supportedFormats = ['csv', 'ics', 'json'];
    }

    exportCalendar(events, format = 'csv', options = {}) {
        if (!this.supportedFormats.includes(format)) {
            throw new Error(`Unsupported format: ${format}`);
        }

        try {
            switch (format) {
                case 'csv':
                    return this.exportToCSV(events);
                case 'ics':
                    return this.exportToICS(events);
                case 'json':
                    return this.exportToJSON(events);
            }
        } catch (error) {
            console.error('Export failed:', error);
            throw new Error('Export failed');
        }
    }

    exportToCSV(events) {
        const headers = ['Start Date', 'End Date', 'Type', 'Status'];
        const rows = [headers];

        events.forEach(event => {
            rows.push([
                this.dateFormatter.formatDate(event.startDate),
                this.dateFormatter.formatDate(event.endDate),
                event.type || 'Leave',
                event.status || 'Confirmed'
            ]);
        });

        const csv = rows.map(row => 
            row.map(cell => this.escapeCSV(cell)).join(',')
        ).join('\n');

        return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    }

    exportToICS(events) {
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Alfie//Leave Management//EN'
        ];

        events.forEach(event => {
            ics.push('BEGIN:VEVENT');
            ics.push(`DTSTART:${this.formatICSDate(event.startDate)}`);
            ics.push(`DTEND:${this.formatICSDate(event.endDate)}`);
            ics.push(`SUMMARY:${event.type || 'Leave'}`);
            ics.push('END:VEVENT');
        });

        ics.push('END:VCALENDAR');
        return new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
    }

    exportToJSON(events) {
        const data = events.map(event => ({
            startDate: this.dateFormatter.formatDate(event.startDate),
            endDate: this.dateFormatter.formatDate(event.endDate),
            type: event.type || 'Leave',
            status: event.status || 'Confirmed'
        }));

        return new Blob([JSON.stringify(data, null, 2)], 
            { type: 'application/json;charset=utf-8;' });
    }

    escapeCSV(cell) {
        cell = cell.toString().replace(/"/g, '""');
        return /[,"\n]/.test(cell) ? `"${cell}"` : cell;
    }

    formatICSDate(date) {
        return this.dateFormatter.parseDate(date)
            .toISOString()
            .replace(/[-:]/g, '')
            .split('.')[0] + 'Z';
    }
}

// Initialize globally
window.Alfie = window.Alfie || {};
window.Alfie.ExportUtils = ExportUtils;
