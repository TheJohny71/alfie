// calendar.js
export class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDates = new Set();
        this.currentView = 'month';
        this.region = 'UK';
        this.aiEnabled = true;
    }

    async initialize() {
        try {
            await this.renderCalendar();
            this.attachEventListeners();
            if (this.aiEnabled) {
                await this.initializeAIFeatures();
            }
            return true;
        } catch (error) {
            console.error('Calendar initialization error:', error);
            throw new Error('Calendar initialization failed');
        }
    }

    async renderCalendar() {
        const daysContainer = document.querySelector('.days');
        const currentMonthElement = document.getElementById('currentMonth');
        
        if (!daysContainer || !currentMonthElement) return;
        
        daysContainer.innerHTML = '';
        currentMonthElement.textContent = this.currentDate.toLocaleString('en-GB', { 
            month: 'long', 
            year: 'numeric' 
        });
    }

    attachEventListeners() {
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }

    async initializeAIFeatures() {
        try {
            // Mock AI features initialization
            return true;
        } catch (error) {
            console.error('AI features initialization failed:', error);
            this.aiEnabled = false;
        }
    }
}

// Initialize globally
window.Alfie = window.Alfie || {};
window.Alfie.Calendar = Calendar;
