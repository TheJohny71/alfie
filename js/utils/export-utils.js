/**
 * @class ExportUtils
 * Handles calendar and leave data exports in various formats
 * File location: /js/utils/export-utils.js
 */
class ExportUtils {
    constructor(dateFormatter) {
        this.dateFormatter = dateFormatter;
        this.supportedFormats = ['csv', 'ics', 'json'];
    }

    /**
     * Export calendar data to specified format
     * @param {Array} events - Calendar events to export
     * @param {string} format - Export format (csv, ics, json)
     * @param {Object} options - Export options
     * @returns {string|Blob} Exported data
     */
    exportCalendar(events, format = 'csv', options = {}) {
        if (!this.supportedFormats.includes(format)) {
            throw new Error(`Unsupported export format: ${format}`);
        }

        try {
            switch (format) {
                case 'csv':
                    return this.exportToCSV(events, options);
                case 'ics':
                    return this.exportToICS(events, options);
                case 'json':
                    return this.exportToJSON(events, options);
                default:
                    throw new Error('Invalid export format');
            }
        } catch (error) {
            console.error('Export failed:', error);
            throw new Error('Failed to export calendar data');
        }
    }

    /**
     * Export leave report with customizable fields
     * @param {Array} leaveData - Leave records to export
     * @param {Object} options - Export options and fields
     * @returns {Blob} Exported report file
     */
    exportLeaveReport(leaveData, options = {}) {
        try {
            const format = options.format || 'csv';
            const fields = options.fields || this.getDefaultLeaveFields();
            
            const formattedData = this.formatLeaveData(leaveData, fields);
            
            switch (format) {
                case 'csv':
                    return this.createCSVBlob(formattedData, fields);
                case 'json':
                    return this.createJSONBlob(formattedData);
                default:
                    throw new Error('Unsupported report format');
            }
        } catch (error) {
            console.error('Report export failed:', error);
            throw new Error('Failed to export leave report');
        }
    }

    /**
     * Export team calendar to Excel-compatible format
     * @param {Array} teamEvents - Team calendar events
     * @param {Object} options - Export options
     * @returns {Blob} Excel-compatible file
     */
    exportTeamCalendar(teamEvents, options = {}) {
        try {
            const monthData = this.generateMonthlyView(teamEvents, options);
            return this.createExcelBlob(monthData, options);
        } catch (error) {
            console.error('Team calendar export failed:', error);
            throw new Error('Failed to export team calendar');
        }
    }

    /**
     * Export to CSV format
     * @private
     */
    exportToCSV(events, options) {
        const rows = [this.getCSVHeaders(options)];
        
        events.forEach(event => {
            rows.push(this.formatEventForCSV(event, options));
        });

        const csv = rows.map(row => 
            row.map(cell => this.escapeCSVCell(cell)).join(',')
        ).join('\n');

        return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    }

    /**
     * Export to ICS format
     * @private
     */
    exportToICS(events, options) {
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Alfie//Leave Management//EN'
        ];

        events.forEach(event => {
            icsContent = icsContent.concat(this.formatEventForICS(event, options));
        });

        icsContent.push('END:VCALENDAR');

        return new Blob([icsContent.join('\r\n')], { 
            type: 'text/calendar;charset=utf-8;' 
        });
    }

    /**
     * Export to JSON format
     * @private
     */
    exportToJSON(events, options) {
        const formattedEvents = events.map(event => 
            this.formatEventForJSON(event, options)
        );

        return new Blob([JSON.stringify(formattedEvents, null, 2)], {
            type: 'application/json;charset=utf-8;'
        });
    }

    /**
     * Format leave data for export
     * @private
     */
    formatLeaveData(leaveData, fields) {
        return leaveData.map(record => {
            const formatted = {};
            fields.forEach(field => {
                formatted[field.id] = this.formatFieldValue(record[field.id], field.type);
            });
            return formatted;
        });
    }

    /**
     * Generate monthly view for team calendar
     * @private
     */
    generateMonthlyView(teamEvents, options) {
        const monthData = {
            headers: this.generateMonthHeaders(options),
            rows: []
        };

        // Group events by team member
        const eventsByMember = this.groupEventsByMember(teamEvents);

        // Generate rows for each team member
        for (const [member, events] of Object.entries(eventsByMember)) {
            monthData.rows.push(this.generateMemberRow(member, events, options));
        }

        return monthData;
    }

    /**
     * Format event for CSV export
     * @private
     */
    formatEventForCSV(event, options) {
        return [
            this.dateFormatter.formatDate(event.startDate, 'date'),
            this.dateFormatter.formatDate(event.endDate, 'date'),
            event.type || '',
            event.status || '',
            event.description || '',
            event.duration || this.dateFormatter.calculateDuration(event.startDate, event.endDate)
        ];
    }

    /**
     * Format event for ICS export
     * @private
     */
    formatEventForICS(event, options) {
        return [
            'BEGIN:VEVENT',
            `DTSTART:${this.formatDateForICS(event.startDate)}`,
            `DTEND:${this.formatDateForICS(event.endDate)}`,
            `SUMMARY:${event.type || 'Leave'}`,
            `DESCRIPTION:${event.description || ''}`,
            `STATUS:${event.status || 'CONFIRMED'}`,
            `UID:${event.id || this.generateUID()}`,
            'END:VEVENT'
        ];
    }

    /**
     * Format event for JSON export
     * @private
     */
    formatEventForJSON(event, options) {
        return {
            startDate: this.dateFormatter.formatDate(event.startDate, 'date'),
            endDate: this.dateFormatter.formatDate(event.endDate, 'date'),
            type: event.type || 'Leave',
            status: event.status || 'Confirmed',
            description: event.description || '',
            duration: event.duration || this.dateFormatter.calculateDuration(event.startDate, event.endDate)
        };
    }

    /**
     * Create Excel-compatible blob
     * @private
     */
    createExcelBlob(data, options) {
        // Implementation would use a library like XLSX
        // This is a simplified CSV version
        const rows = [data.headers];
        data.rows.forEach(row => rows.push(row));

        const csv = rows.map(row => 
            row.map(cell => this.escapeCSVCell(cell)).join(',')
        ).join('\n');

        return new Blob([csv], { 
            type: 'application/vnd.ms-excel;charset=utf-8;' 
        });
    }

    /**
     * Get default leave report fields
     * @private
     */
    getDefaultLeaveFields() {
        return [
            { id: 'employeeName', label: 'Employee', type: 'string' },
            { id: 'startDate', label: 'Start Date', type: 'date' },
            { id: 'endDate', label: 'End Date', type: 'date' },
            { id: 'type', label: 'Leave Type', type: 'string' },
            { id: 'duration', label: 'Duration', type: 'number' },
            { id: 'status', label: 'Status', type: 'string' }
        ];
    }

    /**
     * Format date for ICS file
     * @private
     */
    formatDateForICS(date) {
        const d = this.dateFormatter.parseDate(date);
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    /**
     * Generate unique identifier for ICS events
     * @private
     */
    generateUID() {
        return 'alfie-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Escape CSV cell content
     * @private
     */
    escapeCSVCell(cell) {
        cell = cell.toString().replace(/"/g, '""');
        return /[,"\n]/.test(cell) ? `"${cell}"` : cell;
    }

    /**
     * Format field value based on type
     * @private
     */
    formatFieldValue(value, type) {
        switch (type) {
            case 'date':
                return this.dateFormatter.formatDate(value, 'date');
            case 'number':
                return Number(value).toString();
            default:
                return value?.toString() || '';
        }
    }
}

export default ExportUtils;
