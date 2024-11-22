class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.selectedDates = new Set();
    this.currentView = 'month';
    this.region = 'uk'; // Add region support
    this.init();
  }

  init() {
    this.renderCalendar();
    this.attachEventListeners();
    this.initializeRegionContext();
  }

  initializeRegionContext() {
    // Initialize region-specific features
    this.regionSelector = document.getElementById('region-selector');
    if (this.regionSelector) {
      this.regionSelector.value = this.region;
      this.regionSelector.addEventListener('change', (e) => {
        this.region = e.target.value;
        this.renderCalendar();
      });
    }
  }

  renderCalendar() {
    const daysContainer = document.querySelector('.days');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!daysContainer || !currentMonthElement) return;

    // Clear existing content
    daysContainer.innerHTML = '';

    // Update month display with region-aware formatting
    const monthYear = this.currentDate.toLocaleString(this.region === 'uk' ? 'en-GB' : 'en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
    currentMonthElement.textContent = monthYear;

    // Calculate days
    const firstDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    );

    // Calculate start padding based on region
    const startPadding = this.region === 'uk' 
      ? (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1)
      : firstDay.getDay();

    // Add padding days
    for (let i = 0; i < startPadding; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day padding';
      daysContainer.appendChild(dayElement);
    }

    // Add month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      const dayElement = document.createElement('div');
      
      // Set base classes
      const classes = ['calendar-day'];
      
      // Add weekend class
      if (date.getDay() === 0 || date.getDay() === 6) {
        classes.push('weekend');
      }
      
      // Add selected class
      if (this.selectedDates.has(date.toDateString())) {
        classes.push('selected');
      }

      // Add today class
      if (date.toDateString() === new Date().toDateString()) {
        classes.push('today');
      }
      
      dayElement.className = classes.join(' ');
      dayElement.textContent = day;
      dayElement.setAttribute('data-date', date.toDateString());
      
      // Add click handler
      dayElement.addEventListener('click', () => this.toggleDate(date));
      
      daysContainer.appendChild(dayElement);
    }

    // Update team coverage if available
    this.updateTeamCoverage();
  }

  toggleDate(date) {
    const dateString = date.toDateString();
    if (this.selectedDates.has(dateString)) {
      this.selectedDates.delete(dateString);
    } else {
      this.selectedDates.add(dateString);
    }
    this.renderCalendar();
    this.triggerLeaveRequest(date);
  }

  triggerLeaveRequest(date) {
    // Trigger leave request modal
    const leaveType = this.region === 'uk' ? 'Annual Leave' : 'PTO';
    console.log(`Requesting ${leaveType} for ${date.toDateString()}`);
    // Modal implementation will go here
  }

  updateTeamCoverage() {
    const coverageChart = document.getElementById('coverage-chart');
    if (coverageChart) {
      // Implement team coverage visualization
      // This will be enhanced with actual team data
    }
  }

  attachEventListeners() {
    // Navigation
    document.getElementById('prevMonth')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        button.classList.add('active');
        this.currentView = button.dataset.view;
        this.renderCalendar();
      });
    });

    // Quick actions button
    const fab = document.querySelector('.fab');
    if (fab) {
      fab.addEventListener('click', () => this.openQuickActions());
    }
  }

  openQuickActions() {
    // Implement quick actions modal
    console.log('Opening quick actions');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.calendar = new Calendar();
});
