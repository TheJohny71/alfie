// outlook-integration.js
export class OutlookIntegration {
    constructor(config = {}) {
        this.clientId = config.clientId || 'mock-client-id';
        this.initialized = false;
        this.mockEvents = new Map();
        this.mockSettings = {
            automaticReplies: false,
            replyMessage: ''
        };
    }

    async initialize(credentials = {}) {
        try {
            this.initialized = true;
            return { status: 'success', message: 'Outlook initialized' };
        } catch (error) {
            console.error('Outlook initialization failed:', error);
            throw new Error('Outlook initialization failed');
        }
    }

    async addLeaveToCalendar(leaveDetails) {
        if (!this.initialized) return { status: 'mock', message: 'Not initialized' };
        
        const eventId = 'OL-' + Date.now();
        const event = {
            id: eventId,
            subject: `Out of Office: ${leaveDetails.reason || 'Leave'}`,
            start: leaveDetails.startDate,
            end: leaveDetails.endDate,
            status: 'confirmed'
        };

        this.mockEvents.set(eventId, event);
        
        if (leaveDetails.setOutOfOffice) {
            await this.setAutomaticReplies(leaveDetails);
        }

        return { eventId, status: 'created' };
    }

    async updateLeaveInCalendar(eventId, updates) {
        if (!this.initialized) return { status: 'mock', message: 'Not initialized' };
        
        const event = this.mockEvents.get(eventId);
        if (event) {
            const updatedEvent = { ...event, ...updates };
            this.mockEvents.set(eventId, updatedEvent);
            
            if (updates.setOutOfOffice !== undefined) {
                await this.updateAutomaticReplies(updates);
            }
            
            return { status: 'updated', eventId };
        }
        return { status: 'not_found' };
    }

    async removeLeaveFromCalendar(eventId) {
        if (!this.initialized) return { status: 'mock', message: 'Not initialized' };
        
        this.mockEvents.delete(eventId);
        return { status: 'deleted' };
    }

    async setAutomaticReplies(details) {
        this.mockSettings.automaticReplies = true;
        this.mockSettings.replyMessage = details.message || 'I am currently out of office.';
        this.mockSettings.startDate = details.startDate;
        this.mockSettings.endDate = details.endDate;
        
        return { status: 'success' };
    }

    async updateAutomaticReplies(details) {
        if (details.setOutOfOffice) {
            return this.setAutomaticReplies(details);
        } else {
            this.mockSettings.automaticReplies = false;
            this.mockSettings.replyMessage = '';
            return { status: 'disabled' };
        }
    }

    async getCalendarEvents(startDate, endDate) {
        if (!this.initialized) return [];
        
        return Array.from(this.mockEvents.values()).filter(event => 
            new Date(event.start) >= new Date(startDate) &&
            new Date(event.end) <= new Date(endDate)
        );
    }
}

// Initialize globally
window.Alfie = window.Alfie || {};
window.Alfie.OutlookIntegration = OutlookIntegration;
