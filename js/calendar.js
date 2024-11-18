// js/calendar.js
class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.selectedDates = new Set();
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

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.changeMonth(-1);
      if (e.key === 'ArrowRight') this.changeMonth(1);
    });
  }

  changeMonth(delta) {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.render();
  }

  changeView(button) {
    this.viewButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    // View switching logic will be implemented in next phase
  }

  handleDateClick(date) {
    const dateStr = date.toISOString().split('T')[0];
    if (this.selectedDates.has(dateStr)) {
      this.selectedDates.delete(dateStr);
    } else {
      this.selectedDates.add(dateStr);
    }
    this.render();
  }

  isDateSelected(date) {
    const dateStr = date.toISOString().split('T')[0];
    return this.selectedDates.has(dateStr);
  }

  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Update month display with animation
    const monthName = this.currentDate.toLocaleString('default', { month: 'long' });
    this.monthDisplay.textContent = `${monthName} ${year}`;
    
    // Clear previous days with fade out
    this.daysContainer.style.opacity = '0';
    setTimeout(() => {
      this.daysContainer.innerHTML = '';
      
      // Get first day and total days
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
        const isSelected = this.isDateSelected(date);
        this.createDayElement(day, isWeekend, isSelected, date);
      }
      
      // Fade in new days
      this.daysContainer.style.opacity = '1';
    }, 150);
  }

  createDayElement(content, isWeekend = false, isSelected = false, date = null) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    if (isWeekend) dayElement.classList.add('weekend');
    if (isSelected) dayElement.classList.add('selected');
    dayElement.textContent = content;

    if (date) {
      dayElement.addEventListener('click', () => this.handleDateClick(date));
    }

    this.daysContainer.appendChild(dayElement);
  }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for start button click (calendar is initially hidden)
  document.getElementById('startButton').addEventListener('click', () => {
    const welcome = document.getElementById('welcome');
    const calendar = document.getElementById('calendar');
    
    // Fade out welcome
    welcome.style.opacity = '0';
    welcome.style.transition = 'opacity 0.5s ease-out';
    
    // After welcome fades out, show calendar
    setTimeout(() => {
      welcome.style.display = 'none';
      calendar.style.display = 'block';
      new Calendar();
    }, 500);
  });
});
