/**
 * @class WorkdayIntegration
 * Handles integration with Workday API for leave management
 */
class WorkdayIntegration {
    constructor(config) {
        this.baseUrl = config?.baseUrl || 'https://api.workday.com';
        this.tenantId = config?.tenantId;
        this.apiVersion = config?.apiVersion || 'v1';
        this.initialized = false;
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
    }

    /**
     * Initialize Workday integration
     * @async
     * @param {Object} credentials - OAuth credentials
     */
    async initialize(credentials) {
        try {
            this.credentials = credentials;
            await this.validateConnection();
            this.initialized = true;
            console.log('Workday integration initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Workday integration:', error);
            throw new Error('Workday initialization failed');
        }
    }

    /**
     * Sync leave balances from Workday
     * @async
     * @param {string} employeeId - Employee ID
     * @returns {Promise<Object>} Leave balances
     */
    async syncLeaveBalances(employeeId) {
        this.checkInitialization();
        
        try {
            const endpoint = `/leave-management/v1/workers/${employeeId}/leave-balances`;
            const response = await this.makeRequest('GET', endpoint);
            
            return {
                annual: response.balances.annual || 0,
                sick: response.balances.sick || 0,
                personal: response.balances.personal || 0,
                carried: response.balances.carried || 0,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to sync leave balances:', error);
            throw new Error('Leave balance sync failed');
        }
    }

    /**
     * Submit leave request to Workday
     * @async
     * @param {Object} leaveRequest - Leave request details
     * @returns {Promise<Object>} Request status
     */
    async submitLeaveRequest(leaveRequest) {
        this.checkInitialization();
        
        try {
            const endpoint = '/leave-management/v1/leave-requests';
            const payload = this.formatLeaveRequest(leaveRequest);
            
            const response = await this.makeRequest('POST', endpoint, payload);
            
            return {
                requestId: response.requestId,
                status: response.status,
                submissionDate: new Date().toISOString(),
                workdayReference: response.workdayReference
            };
        } catch (error) {
            console.error('Failed to submit leave request:', error);
            throw new Error('Leave request submission failed');
        }
    }

    /**
     * Cancel leave request in Workday
     * @async
     * @param {string} requestId - Leave request ID
     * @returns {Promise<Object>} Cancellation status
     */
    async cancelLeaveRequest(requestId) {
        this.checkInitialization();
        
        try {
            const endpoint = `/leave-management/v1/leave-requests/${requestId}`;
            const response = await this.makeRequest('DELETE', endpoint);
            
            return {
                status: response.status,
                cancellationDate: new Date().toISOString(),
                confirmation: response.confirmation
            };
        } catch (error) {
            console.error('Failed to cancel leave request:', error);
            throw new Error('Leave cancellation failed');
        }
    }

    /**
     * Get leave request status from Workday
     * @async
     * @param {string} requestId - Leave request ID
     * @returns {Promise<Object>} Request status
     */
    async getLeaveRequestStatus(requestId) {
        this.checkInitialization();
        
        try {
            const endpoint = `/leave-management/v1/leave-requests/${requestId}/status`;
            return await this.makeRequest('GET', endpoint);
        } catch (error) {
            console.error('Failed to get leave request status:', error);
            throw new Error('Failed to retrieve request status');
        }
    }

    /**
     * Format leave request for Workday API
     * @private
     */
    formatLeaveRequest(request) {
        return {
            workerId: request.employeeId,
            leaveType: request.type,
            startDate: request.startDate,
            endDate: request.endDate,
            duration: request.duration,
            comments: request.comments,
            attachments: request.attachments?.map(this.formatAttachment),
            notifyManager: request.notifyManager || true,
            status: 'SUBMITTED',
            submittedAt: new Date().toISOString()
        };
    }

    /**
     * Make authenticated request to Workday API
     * @private
     */
    async makeRequest(method, endpoint, data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getAuthHeaders();
        
        let attempt = 0;
        while (attempt < this.retryAttempts) {
            try {
                const response = await fetch(url, {
                    method,
                    headers,
                    body: data ? JSON.stringify(data) : null
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                attempt++;
                if (attempt === this.retryAttempts) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }

    /**
     * Get authentication headers for Workday API
     * @private
     */
    async getAuthHeaders() {
        const token = await this.getAccessToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': this.tenantId
        };
    }

    /**
     * Validate Workday connection
     * @private
     */
    async validateConnection() {
        try {
            const endpoint = '/system/v1/ping';
            await this.makeRequest('GET', endpoint);
        } catch (error) {
            throw new Error('Failed to validate Workday connection');
        }
    }

    /**
     * Check if integration is initialized
     * @private
     */
    checkInitialization() {
        if (!this.initialized) {
            throw new Error('Workday integration not initialized');
        }
    }

    /**
     * Format attachment for Workday API
     * @private
     */
    formatAttachment(attachment) {
        return {
            fileName: attachment.name,
            fileType: attachment.type,
            contentBase64: attachment.content,
            description: attachment.description || ''
        };
    }
}

export default WorkdayIntegration;
