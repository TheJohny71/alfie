/**
 * @class OutlookIntegration
 * Handles integration with Microsoft Outlook Calendar
 * File location: /js/enterprise/outlook-integration.js
 */
class OutlookIntegration {
    constructor(config) {
        this.clientId = config?.clientId;
        this.tenantId = config?.tenantId;
        this.scopes = ['Calendars.ReadWrite', 'Mail.Send'];
        this.initialized = false;
    }

    /**
     * Initialize Outlook integration
     * @async
     * @param {Object} credentials - Microsoft Graph API credentials
     */
    async initialize(credentials) {
        try {
            this.credentials = credentials;
            await this.validateAuth();
            this.initialized = true;
            console.log('Outlook integration initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Outlook integration:', error);
            throw new Error('Outlook initialization failed');
        }
    }

    /**
     * Add leave to Outlook calendar
     * @async
     * @param {Object} leaveDetails - Leave event details
     */
    async addLeaveToCalendar(leaveDetails) {
        this.checkInitialization();
        
        try {
            const event = this.createCalendarEvent(leaveDetails);
            await this.createEvent(event);
            
            if (leaveDetails.setOutOfOffice) {
                await this.setAutomaticReplies(leaveDetails);
            }
            
            console.log('Leave added to calendar successfully');
        } catch (error) {
            console.error('Failed to add leave to calendar:', error);
            throw new Error('Calendar update failed');
        }
    }

    /**
     * Update leave in Outlook calendar
     * @async
     * @param {string} eventId - Calendar event ID
     * @param {Object} updates - Updated leave details
     */
    async updateLeaveInCalendar(eventId, updates) {
        this.checkInitialization();
        
        try {
            const event = this.createCalendarEvent(updates);
            await this.updateEvent(eventId, event);
            
            if (updates.setOutOfOffice !== undefined) {
                await this.updateAutomaticReplies(updates);
            }
            
            console.log('Leave updated in calendar successfully');
        } catch (error) {
            console.error('Failed to update leave in calendar:', error);
            throw new Error('Calendar update failed');
        }
    }

    /**
     * Remove leave from Outlook calendar
     * @async
     * @param {string} eventId - Calendar event ID
     */
    async removeLeaveFromCalendar(eventId) {
        this.checkInitialization();
        
        try {
            await this.deleteEvent(eventId);
            console.log('Leave removed from calendar successfully');
        } catch (error) {
            console.error('Failed to remove leave from calendar:', error);
            throw new Error('Calendar deletion failed');
        }
    }

    /**
     * Create calendar event object
     * @private
     */
    createCalendarEvent(details) {
        return {
            subject: `Out of Office: ${details.reason || 'Leave'}`,
            start: {
                dateTime: details.startDate,
                timeZone: details.timeZone || 'UTC'
            },
            end: {
                dateTime: details.endDate,
                timeZone: details.timeZone || 'UTC'
            },
            showAs: 'oof',
            sensitivity: 'normal',
            isOnlineMeeting: false,
            body: {
                contentType: 'text',
                content: details.comments || 'Out of office'
            }
        };
    }

    /**
     * Set automatic replies for leave period
     * @private
     */
    async setAutomaticReplies(details) {
        const settings = {
            automaticRepliesSetting: {
                status: 'scheduled',
                scheduledStartDateTime: {
                    dateTime: details.startDate,
                    timeZone: details.timeZone || 'UTC'
                },
                scheduledEndDateTime: {
                    dateTime: details.endDate,
                    timeZone: details.timeZone || 'UTC'
                },
                internalReplyMessage: details.internalMessage || 'I am currently out of office.',
                externalReplyMessage: details.externalMessage || 'I am currently out of office.'
            }
        };

        await this.updateMailboxSettings(settings);
    }

    /**
     * Update automatic replies
     * @private
     */
    async updateAutomaticReplies(details) {
        if (details.setOutOfOffice) {
            await this.setAutomaticReplies(details);
        } else {
            await this.disableAutomaticReplies();
        }
    }

    /**
     * Disable automatic replies
     * @private
     */
    async disableAutomaticReplies() {
        const settings = {
            automaticRepliesSetting: {
                status: 'disabled'
            }
        };

        await this.updateMailboxSettings(settings);
    }

    /**
     * Create event in Outlook calendar
     * @private
     */
    async createEvent(event) {
        const endpoint = '/me/events';
        return await this.makeGraphRequest('POST', endpoint, event);
    }

    /**
     * Update event in Outlook calendar
     * @private
     */
    async updateEvent(eventId, event) {
        const endpoint = `/me/events/${eventId}`;
        return await this.makeGraphRequest('PATCH', endpoint, event);
    }

    /**
     * Delete event from Outlook calendar
     * @private
     */
    async deleteEvent(eventId) {
        const endpoint = `/me/events/${eventId}`;
        return await this.makeGraphRequest('DELETE', endpoint);
    }

    /**
     * Update mailbox settings
     * @private
     */
    async updateMailboxSettings(settings) {
        const endpoint = '/me/mailboxSettings';
        return await this.makeGraphRequest('PATCH', endpoint, settings);
    }

    /**
     * Make authenticated request to Microsoft Graph API
     * @private
     */
    async makeGraphRequest(method, endpoint, data = null) {
        const url = `https://graph.microsoft.com/v1.0${endpoint}`;
        const token = await this.getAccessToken();
        
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            throw new Error(`Graph API error! status: ${response.status}`);
        }

        return method !== 'DELETE' ? await response.json() : null;
    }

    /**
     * Validate authentication
     * @private
     */
    async validateAuth() {
        try {
            await this.makeGraphRequest('GET', '/me');
        } catch (error) {
            throw new Error('Failed to validate Graph API authentication');
        }
    }

    /**
     * Check initialization status
     * @private
     */
    checkInitialization() {
        if (!this.initialized) {
            throw new Error('Outlook integration not initialized');
        }
    }
}

export default OutlookIntegration;
