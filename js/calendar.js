// js/calendar.js
class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.initializeElements();
    this.addEventListeners();
    this.render();
  }

  initializeElements() {
    this.monthDisplay = document.getElementById('currentMonth');
    this.daysContainer = document.getElementById('calendarDays');
    this.prevButton = document.getElementById('prevMonth');
    this.nextButton = document.getElementById('nextMonth');
    this.viewButtons = document.querySelectorAll('.view-btn');
  }

  addEventListeners() {
    this.prevButton.addEventListener('click', () => this.changeMonth(-1));
    this.nextButton.addEventListener('click', () => this.changeMonth(1));
    this.viewButtons.forEach(btn => {
      btn.addEventListener('click', () => this.changeView(btn));
    });
  }

  changeMonth(delta) {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.render();
  }

  changeView(button) {
    this.viewButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    // View switching logic will be added later
  }

  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Update month display
    const monthName = this.currentDate.toLocaleString('default', { month: 'long' });
    this.monthDisplay.textContent = `${monthName} ${year}`;
    
    // Clear previous days
    this.daysContainer.innerHTML = '';
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Add empty cells for days before start of month
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Adjust Sunday from 0 to 7
    
    for (let i = 1; i < firstDayOfWeek; i++) {
      this.createDayElement('');
    }
    
    // Add days of month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      this.createDayElement(day, isWeekend);
    }
  }

  createDayElement(content, isWeekend = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    if (isWeekend) dayElement.classList.add('weekend');
    dayElement.textContent = content;
    this.daysContainer.appendChild(dayElement);
  }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Calendar();
});
