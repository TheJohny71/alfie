class CalendarModals {
    constructor() {
        this.activeModal = null;
        this.setupModalContainer();
    }

    setupModalContainer() {
        if (!document.getElementById('modal-container')) {
            const container = document.createElement('div');
            container.id = 'modal-container';
            container.style.display = 'none';
            document.body.appendChild(container);
        }
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
                        <div class="suggestion-card" onclick="window.calendarModals.show('leaveRequest')">
                            <div class="suggestion-type">Request Leave</div>
                            <div class="suggestion-message">Submit a new leave request</div>
                        </div>
                        <div class="suggestion-card" onclick="window.calendarModals.show('smartPlanning')">
                            <div class="suggestion-type">Smart Planning</div>
                            <div class="suggestion-message">Get AI-powered suggestions</div>
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
                                    How can I help you plan your leave?
                                </div>
                            </div>
                        </div>
                        <div class="input-container">
                            <input type="text" 
                                   class="message-input" 
                                   placeholder="Ask for suggestions..."
                                   onkeypress="if(event.key === 'Enter') window.calendarModals.sendMessage(this.value)">
                            <button class="send-button" onclick="window.calendarModals.sendMessage(document.querySelector('.message-input').value)">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    renderModal(content) {
        const container = document.getElementById('modal-container');
        container.innerHTML = content;
        container.style.display = 'block';
    }

    submitLeaveRequest() {
        // Implementation for leave request submission
        const note = document.querySelector('.message-input').value;
        console.log('Submitting leave request with note:', note);
        this.hide();
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

        // Simulate AI response
        setTimeout(() => {
            messagesContainer.innerHTML += `
                <div class="message assistant">
                    <div class="message-content">
                        Based on team coverage and your leave balance, I suggest taking leave in the last week of the month.
                    </div>
                </div>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calendarModals = new CalendarModals();
});
