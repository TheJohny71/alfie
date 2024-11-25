// calendar.js
class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.selectedDates = new Set();
    this.currentView = 'month';
    this.region = window.regionManager?.region || 'UK';
    this.aiEnabled = true;
    this.init();
  }

  async init() {
    try {
      await this.renderCalendar();
      this.attachEventListeners();
      this.initializeRegionContext();
      if (this.aiEnabled) {
        await this.initializeAIFeatures();
      }
    } catch (error) {
      console.error('Calendar initialization error:', error);
    }
  }

  async initializeAIFeatures() {
    try {
      await this.updateTeamCoverage();
      this.initializeSmartPlanning();
    } catch (error) {
      console.error('AI features initialization failed:', error);
      this.aiEnabled = false;
    }
  }

  initializeRegionContext() {
    this.regionSelector = document.getElementById('region-selector');
    if (this.regionSelector) {
      this.regionSelector.value = this.region;
      this.regionSelector.addEventListener('change', (e) => {
        this.region = e.target.value;
        this.renderCalendar();
      });
    }
  }

  initializeSmartPlanning() {
    const smartPlanningButton = document.createElement('button');
    smartPlanningButton.className = 'smart-planning-btn';
    smartPlanningButton.innerHTML = '<i class="fas fa-brain"></i> Smart Plan';
    smartPlanningButton.onclick = () => window.calendarModals.show('smartPlanning');
    
    const header = document.querySelector('.calendar-header');
    if (header) {
      header.appendChild(smartPlanningButton);
    }
  }

  async renderCalendar() {
    const daysContainer = document.querySelector('.days');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!daysContainer || !currentMonthElement) return;

    daysContainer.innerHTML = '';
    
    const monthYear = this.currentDate.toLocaleString(
      this.region === 'UK' ? 'en-GB' : 'en-US', 
      { month: 'long', year: 'numeric' }
    );
    currentMonthElement.textContent = monthYear;

    let coverageData = {};
    if (this.aiEnabled) {
      coverageData = await this.getTeamCoverageData();
    }

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

    const startPadding = this.region === 'UK' 
      ? (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1)
      : firstDay.getDay();

    // Add padding days
    for (let i = 0; i < startPadding; i++) {
      this.createDayElement(daysContainer, null, 'padding');
    }

    // Add month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      this.createDayElement(daysContainer, date, '', coverageData[day]);
    }

    if (this.aiEnabled) {
      this.updateTeamCoverageVisualization(coverageData);
    }
  }

  createDayElement(container, date, extraClass = '', coverageData = null) {
    const dayElement = document.createElement('div');
    const classes = ['calendar-day'];
    
    if (extraClass) {
      classes.push(extraClass);
    }

    if (date) {
      if (date.getDay() === 0 || date.getDay() === 6) {
        classes.push('weekend');
      }
      
      if (this.selectedDates.has(date.toDateString())) {
        classes.push('selected');
      }

      if (date.toDateString() === new Date().toDateString()) {
        classes.push('today');
      }

      if (coverageData) {
        dayElement.setAttribute('data-coverage', coverageData.coverage);
        classes.push(`coverage-${coverageData.level}`);
      }

      dayElement.textContent = date.getDate();
      dayElement.setAttribute('data-date', date.toDateString());
      dayElement.addEventListener('click', () => this.toggleDate(date));
    }
    
    dayElement.className = classes.join(' ');
    container.appendChild(dayElement);
  }

  async getTeamCoverageData() {
    try {
      const response = await fetch('/api/team-coverage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          month: this.currentDate.getMonth() + 1,
          year: this.currentDate.getFullYear()
        })
      });

      if (!response.ok) throw new Error('Coverage data fetch failed');
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch team coverage:', error);
      return {};
    }
  }

  updateTeamCoverageVisualization(coverageData) {
    const coverageContainer = document.getElementById('coverage-chart');
    if (!coverageContainer) return;

    let legend = coverageContainer.querySelector('.coverage-legend');
    if (!legend) {
      legend = document.createElement('div');
      legend.className = 'coverage-legend';
      coverageContainer.appendChild(legend);
    }

    legend.innerHTML = `
      <div class="legend-item">
        <span class="legend-color high"></span>
        <span>High Coverage</span>
      </div>
      <div class="legend-item">
        <span class="legend-color medium"></span>
        <span>Medium Coverage</span>
      </div>
      <div class="legend-item">
        <span class="legend-color low"></span>
        <span>Low Coverage</span>
      </div>
    `;
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
    if (window.calendarModals) {
      window.calendarModals.show('leaveRequest', {
        date,
        region: this.region
      });
    }
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

    const fab = document.querySelector('.fab');
    if (fab) {
      fab.addEventListener('click', () => {
        if (window.calendarModals) {
          window.calendarModals.show('quickActions');
        }
      });
    }

    this.initializeTouchSupport();
  }

  initializeTouchSupport() {
    let touchStartX = 0;
    const calendar = document.querySelector('.calendar-container');
    
    if (!calendar) return;

    calendar.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });

    calendar.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;

      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        } else {
          this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.renderCalendar();
      }
    });
  }
}

// Initialize when DOM is loaded
if (typeof window !== 'undefined') {
  window.Calendar = Calendar;
  if (!window.location.pathname.includes('welcome.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      window.calendar = new Calendar();
    });
  }
}
