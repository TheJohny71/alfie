/**
 * @class TeamsIntegration
 * Handles integration with Microsoft Teams for leave notifications and status updates
 */
class TeamsIntegration {
    constructor(config) {
        this.webhookUrl = config?.webhookUrl;
        this.appId = config?.appId;
        this.tenantId = config?.tenantId;
        this.initialized = false;
        this.maxRetries = 3;
    }

    /**
     * Initialize Teams integration
     * @async
     * @param {Object} credentials - Teams API credentials
     */
    async initialize(credentials) {
        try {
            this.credentials = credentials;
            await this.validateWebhook();
            this.initialized = true;
            console.log('Teams integration initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Teams integration:', error);
            throw new Error('Teams initialization failed');
        }
    }

    /**
     * Send leave request notification to Teams
     * @async
     * @param {Object} leaveRequest - Leave request details
     */
    async sendLeaveNotification(leaveRequest) {
        this.checkInitialization();
        
        try {
            const card = this.createLeaveRequestCard(leaveRequest);
            await this.sendAdaptiveCard(card);
            
            console.log('Leave notification sent successfully');
        } catch (error) {
            console.error('Failed to send leave notification:', error);
            throw new Error('Leave notification failed');
        }
    }

    /**
     * Update leave status in Teams
     * @async
     * @param {Object} leaveUpdate - Leave status update details
     */
    async updateLeaveStatus(leaveUpdate) {
        this.checkInitialization();
        
        try {
            const card = this.createStatusUpdateCard(leaveUpdate);
            await this.updateAdaptiveCard(leaveUpdate.messageId, card);
            
            console.log('Leave status updated successfully');
        } catch (error) {
            console.error('Failed to update leave status:', error);
            throw new Error('Status update failed');
        }
    }

    /**
     * Set out of office message in Teams
     * @async
     * @param {Object} leaveDetails - Leave details for OOO message
     */
    async setOutOfOffice(leaveDetails) {
        this.checkInitialization();
        
        try {
            const presence = this.createOutOfOfficePresence(leaveDetails);
            await this.updatePresence(presence);
            
            console.log('Out of office status set successfully');
        } catch (error) {
            console.error('Failed to set out of office status:', error);
            throw new Error('Out of office update failed');
        }
    }

    /**
     * Create adaptive card for leave request
     * @private
     */
    createLeaveRequestCard(request) {
        return {
            type: 'AdaptiveCard',
            version: '1.4',
            body: [
                {
                    type: 'TextBlock',
                    size: 'Medium',
                    weight: 'Bolder',
                    text: 'Leave Request'
                },
                {
                    type: 'FactSet',
                    facts: [
                        {
                            title: 'Employee',
                            value: request.employeeName
                        },
                        {
                            title: 'Type',
                            value: request.leaveType
                        },
                        {
                            title: 'From',
                            value: new Date(request.startDate).toLocaleDateString()
                        },
                        {
                            title: 'To',
                            value: new Date(request.endDate).toLocaleDateString()
                        },
                        {
                            title: 'Duration',
                            value: `${request.duration} days`
                        }
                    ]
                },
                {
                    type: 'TextBlock',
                    text: request.comments,
                    wrap: true
                }
            ],
            actions: [
                {
                    type: 'Action.Submit',
                    title: 'Approve',
                    data: {
                        action: 'approve',
                        requestId: request.id
                    }
                },
                {
                    type: 'Action.Submit',
                    title: 'Reject',
                    data: {
                        action: 'reject',
                        requestId: request.id
                    }
                }
            ]
        };
    }

    /**
     * Create status update card
     * @private
     */
    createStatusUpdateCard(update) {
        return {
            type: 'AdaptiveCard',
            version: '1.4',
            body: [
                {
                    type: 'TextBlock',
                    size: 'Medium',
                    weight: 'Bolder',
                    text: 'Leave Request Update'
                },
                {
                    type: 'TextBlock',
                    text: `Status: ${update.status}`,
                    color: this.getStatusColor(update.status)
                },
                {
                    type: 'TextBlock',
                    text: update.message,
                    wrap: true
                }
            ]
        };
    }

    /**
     * Create out of office presence object
     * @private
     */
    createOutOfOfficePresence(details) {
        return {
            sessionId: details.sessionId,
            availability: 'OOF',
            activity: 'Away',
            expirationDateTime: details.endDate,
            message: {
                content: `Out of office until ${new Date(details.endDate).toLocaleDateString()}`
            }
        };
    }

    /**
     * Send adaptive card to Teams
     * @private
     */
    async sendAdaptiveCard(card) {
        const payload = {
            type: 'message',
            attachments: [
                {
                    contentType: 'application/vnd.microsoft.card.adaptive',
                    content: card
                }
            ]
        };

        let attempt = 0;
        while (attempt < this.maxRetries) {
            try {
                const response = await fetch(this.webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                attempt++;
                if (attempt === this.maxRetries) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    /**
     * Update existing adaptive card
     * @private
     */
    async updateAdaptiveCard(messageId, card) {
        // Implementation for updating existing cards
        // This would use the Teams API to update a specific message
    }

    /**
     * Update presence in Teams
     * @private
     */
    async updatePresence(presence) {
        // Implementation for updating user presence
        // This would use the Microsoft Graph API
    }

    /**
     * Validate Teams webhook
     * @private
     */
    async validateWebhook() {
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'message',
                    text: 'Webhook validation'
                })
            });

            if (!response.ok) {
                throw new Error('Invalid webhook URL');
            }
        }
