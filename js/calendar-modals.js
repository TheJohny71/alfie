// calendar-modals.js
class CalendarModals {
    constructor() {
        this.activeModal = null;
        this.setupModalContainer();
        this.setupAIHandler();
    }

    setupModalContainer() {
        if (!document.getElementById('modal-container')) {
            const container = document.createElement('div');
            container.id = 'modal-container';
            container.style.display = 'none';
            document.body.appendChild(container);
        }
    }

    setupAIHandler() {
        this.aiHandler = {
            async getSmartSuggestions(input) {
                try {
                    const response = await fetch('/api/ai/suggest', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: input })
                    });
                    return await response.json();
                } catch (error) {
                    console.error('AI suggestion failed:', error);
                    return { error: 'Failed to get AI suggestions' };
                }
            }
        };
    }

    show(modalType, data = {}) {
        const modalContent = this.getModalContent(modalType, data);
        this.renderModal(modalContent);
    }

    hide() {
        const container = document.getElementById('modal-container');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
        this.activeModal = null;
    }

    getModalContent(type, data) {
        switch(type) {
            case 'leaveRequest':
                return this.createLeaveRequestModal(data);
            case 'quickActions':
                return this.createQuickActionsModal();
            case 'smartPlanning':
                return this.createSmartPlanningModal(data);
            case 'teamCoverage':
                return this.createTeamCoverageModal(data);
            default:
                return '';
        }
    }

    createLeaveRequestModal(data) {
        const { date, region } = data;
        const leaveType = region === 'UK' ? 'Annual Leave' : 'PTO';
        
        return `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Request ${leaveType}</h2>
                        <button class="close-button" onclick="window.calendarModals.hide()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="suggestion-card">
                            <div class="suggestion-type">Selected Date</div>
                            <div class="suggestion-message">${date.toDateString()}</div>
                        </div>
                        <div class="ai-suggestions" id="ai-leave-suggestions">
                            <div class="loading-spinner">Analyzing team coverage...</div>
                        </div>
                        <div class="input-container">
                            <input type="text" class="message-input" placeholder="Add a note...">
                            <button class="send-button" onclick="window.calendarModals.submitLeaveRequest()">Submit</button>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    createQuickActionsModal() {
        return `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Quick Actions</h2>
                        <button class="close-button" onclick="window.calendarModals.hide()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="quick-actions-grid">
                            <div class="action-card" onclick="window.calendarModals.show('leaveRequest')">
                                <div class="action-icon"><i class="fas fa-calendar-plus"></i></div>
                                <div class="action-title">Request Leave</div>
                                <div class="action-description">Submit a new leave request</div>
                            </div>
                            <div class="action-card" onclick="window.calendarModals.show('smartPlanning')">
                                <div class="action-icon"><i class="fas fa-brain"></i></div>
                                <div class="action-title">Smart Planning</div>
                                <div class="action-description">Get AI-powered suggestions</div>
                            </div>
                            <div class="action-card" onclick="window.calendarModals.show('teamCoverage')">
                                <div class="action-icon"><i class="fas fa-users"></i></div>
                                <div class="action-title">Team Coverage</div>
                                <div class="action-description">View team availability</div>
                            </div>
                            <div class="action-card" onclick="window.calendar.exportCalendar()">
                                <div class="action-icon"><i class="fas fa-file-export"></i></div>
                                <div class="action-title">Export</div>
                                <div class="action-description">Export calendar data</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    createSmartPlanningModal(data) {
        return `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Smart Planning Assistant</h2>
                        <button class="close-button" onclick="window.calendarModals.hide()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="message-container" id="planning-messages">
                            <div class="message assistant">
                                <div class="message-content">
                                    How can I help you plan your leave? I can suggest optimal dates based on:
                                    <ul>
                                        <li>Team coverage patterns</li>
                                        <li>Meeting schedules</li>
                                        <li>Holiday impact</li>
                                        <li>Work-life balance optimization</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="input-container">
                            <input type="text" 
                                   class="message-input" 
                                   placeholder="Ask for suggestions..."
                                   onkeypress="if(event.key === 'Enter') window.calendarModals.sendMessage(this.value)">
                            <button class="send-button" onclick="window.calendarModals.sendMessage(document.querySelector('.message-input').value)">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    createTeamCoverageModal(data) {
        return `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Team Coverage Analysis</h2>
                        <button class="close-button" onclick="window.calendarModals.hide()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="coverage-heatmap" id="coverage-heatmap">
                            <div class="loading-spinner">Loading team coverage...</div>
                        </div>
                        <div class="coverage-insights" id="coverage-insights"></div>
                        <div class="coverage-actions">
                            <button class="action-button" onclick="window.calendarModals.exportCoverageReport()">
                                Export Report
                            </button>
                            <button class="action-button" onclick="window.calendarModals.optimizeCoverage()">
                                Optimize Coverage
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    async submitLeaveRequest() {
        const note = document.querySelector('.message-input').value;
        const suggestions = document.getElementById('ai-leave-suggestions');
        
        try {
            suggestions.innerHTML = '<div class="loading-spinner">Processing request...</div>';
            
            const response = await fetch('/api/leave/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    note,
                    dates: Array.from(window.calendar.selectedDates),
                    type: window.regionManager.region === 'UK' ? 'annual' : 'pto'
                })
            });

            if (!response.ok) throw new Error('Request submission failed');
            
            this.showSuccess('Leave request submitted successfully');
            this.hide();
            window.calendar.renderCalendar();
        } catch (error) {
            console.error('Leave request failed:', error);
            this.showError('Failed to submit leave request');
        }
    }

    async sendMessage(message) {
        if (!message.trim()) return;

        const messagesContainer = document.getElementById('planning-messages');
        
        // Add user message
        messagesContainer.innerHTML += `
            <div class="message user">
                <div class="message-content">${message}</div>
            </div>`;

        // Clear input
        document.querySelector('.message-input').value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show typing indicator
        messagesContainer.innerHTML += `
            <div class="message assistant typing">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>`;

        try {
            // Get AI response
            const response = await this.aiHandler.getSmartSuggestions(message);
            
            // Remove typing indicator
            const typingIndicator = messagesContainer.querySelector('.typing');
            if (typingIndicator) typingIndicator.remove();

            // Add AI response
            messagesContainer.innerHTML += `
                <div class="message assistant">
                    <div class="message-content">
                        ${response.suggestions}
                        ${this.createSuggestionButtons(response.dates)}
                    </div>
                </div>`;
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('AI response failed:', error);
            // Handle error in UI
            const typingIndicator = messagesContainer.querySelector('.typing');
            if (typingIndicator) {
                typingIndicator.innerHTML = `
                    <div class="message-content error">
                        Sorry, I'm having trouble processing your request. Please try again.
                    </div>`;
            }
        }
    }

    createSuggestionButtons(dates) {
        if (!dates || !dates.length) return '';
        
        return `
            <div class="suggestion-buttons">
                ${dates.map(date => `
                    <button class="suggestion-button" onclick="window.calendar.selectSuggestedDate('${date}')">
                        ${new Date(date).toLocaleDateString()}
                    </button>
                `).join('')}
            </div>`;
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    renderModal(content) {
        const container = document.getElementById('modal-container');
        container.innerHTML = content;
        container.style.display = 'block';
        
        // Add escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
        }, { once: true });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calendarModals = new CalendarModals();
});
