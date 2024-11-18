// js/calendar.js
class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.selectedDates = new Set();
    this.currentView = 'month';
    this.init();
  }

  init() {
    this.renderCalendar();
    this.attachEventListeners();
  }

  renderCalendar() {
    const daysContainer = document.querySelector('.days');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!daysContainer || !currentMonthElement) return;

    // Clear existing content
    daysContainer.innerHTML = '';

    // Update month display
    const monthYear = this.currentDate.toLocaleString('default', { 
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

    // Calculate start padding
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

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
      
      dayElement.className = classes.join(' ');
      dayElement.textContent = day;
      dayElement.setAttribute('data-date', date.toDateString());
      
      // Add click handler
      dayElement.addEventListener('click', () => this.toggleDate(date));
      
      daysContainer.appendChild(dayElement);
    }
  }

  toggleDate(date) {
    const dateString = date.toDateString();
    if (this.selectedDates.has(dateString)) {
      this.selectedDates.delete(dateString);
    } else {
      this.selectedDates.add(dateString);
    }
    this.renderCalendar();
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
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.calendar = new Calendar();
});
