// js/leave-request.js
class LeaveRequest {
  constructor(calendar) {
    this.calendar = calendar;
    this.panel = document.getElementById('leaveRequestPanel');
    this.startDate = document.getElementById('startDate');
    this.endDate = document.getElementById('endDate');
    this.leaveType = document.getElementById('leaveType');
    this.submitBtn = document.getElementById('submitLeave');
    this.validationMsg = document.getElementById('validationMessage');
    this.workingDays = document.getElementById('workingDays');
    this.leaveBalance = document.getElementById('leaveBalance');
    
    // Default leave balance (would come from backend)
    this.maxLeave = window.regionManager.region === 'UK' ? 25 : 15;
    this.currentLeave = this.maxLeave;
    
    this.initializePanel();
    this.setupEventListeners();
    this.updateLeaveBalance();
  }

  initializePanel() {
    const calendarHeader = document.querySelector('.calendar-view');
    const requestBtn = document.createElement('button');
    requestBtn.className = 'request-btn';
    requestBtn.textContent = `Request ${window.regionManager.getTerm('leave')}`;
    requestBtn.onclick = () => this.showPanel();
    calendarHeader.appendChild(requestBtn);
    
    this.updateLeaveTypes();
  }

  updateLeaveTypes() {
    const leaveTypes = {
      UK: [
        { id: 'annual', label: window.regionManager.getTerm('leave') },
        { id: 'sick', label: window.regionManager.getTerm('sick') },
        { id: 'bank', label: window.regionManager.getTerm('holiday') }
      ],
      US: [
        { id: 'pto', label: window.regionManager.getTerm('leave') },
        { id: 'sick', label: window.regionManager.getTerm('sick') },
        { id: 'federal', label: window.regionManager.getTerm('holiday') }
      ]
    };

    this.leaveType.innerHTML = '<option value="" disabled selected>Select leave type...</option>';
    leaveTypes[window.regionManager.region].forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.label;
      this.leaveType.appendChild(option);
    });
  }

  setupEventListeners() {
    document.getElementById('closeLeavePanel').onclick = () => this.hidePanel();
    
    [this.startDate, this.endDate, this.leaveType].forEach(input => {
      input.addEventListener('change', () => this.validateRequest());
    });

    this.submitBtn.onclick = () => this.submitRequest();
    
    // Calendar date selection
    this.calendar.addEventListener('click', (e) => {
      const day = e.target.closest('.calendar-day');
      if (day && !day.classList.contains('weekend') && !day.classList.contains('holiday')) {
        const date = new Date(this.calendar.currentDate);
        date.setDate(parseInt(day.textContent));
        this.handleDateSelection(date);
      }
    });
  }

  handleDateSelection(date) {
    const formattedDate = date.toISOString().split('T')[0];
    if (!this.startDate.value) {
      this.startDate.value = formattedDate;
    } else if (!this.endDate.value && date > new Date(this.startDate.value)) {
      this.endDate.value = formattedDate;
    } else {
      this.startDate.value = formattedDate;
      this.endDate.value = '';
    }
    this.validateRequest();
  }

  calculateWorkingDays() {
    if (!this.startDate.value || !this.endDate.value) return 0;
    
    const start = new Date(this.startDate.value);
    const end = new Date(this.endDate.value);
    let workDays = 0;
    
    // Get holidays for selected date range
    const holidays = this.getHolidaysInRange(start, end);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const day = date.getDay();
      const isHoliday = holidays.some(h => this.isSameDay(date, new Date(h.date)));
      if (day !== 0 && day !== 6 && !isHoliday) workDays++;
    }
    
    return workDays;
  }

  getHolidaysInRange(start, end) {
    // This would typically fetch from an API
    // For now, returning sample holidays
    const region = window.regionManager.region;
    const holidays = {
      UK: [
        { date: '2024-12-25', name: 'Christmas Day' },
        { date: '2024-12-26', name: 'Boxing Day' }
      ],
      US: [
        { date: '2024-12-25', name: 'Christmas Day' },
        { date: '2024-01-01', name: 'New Year\'s Day' }
      ]
    };
    
    return holidays[region].filter(h => {
      const holiday = new Date(h.date);
      return holiday >= start && holiday <= end;
    });
  }

  isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  updateLeaveBalance() {
    const remaining = this.maxLeave - this.calculateUsedLeave();
    this.leaveBalance.textContent = remaining;
  }

  calculateUsedLeave() {
    // This would typically fetch from backend
    // For now returning sample used leave
    return 5;
  }

  validateRequest() {
    let isValid = true;
    let message = '';

    if (!this.leaveType.value) {
      isValid = false;
      message = 'Please select a leave type';
    } else if (!this.startDate.value || !this.endDate.value) {
      isValid = false;
      message = 'Please select both start and end dates';
    } else {
      const workDays = this.calculateWorkingDays();
      this.workingDays.textContent = workDays;

      if (workDays === 0) {
        isValid = false;
        message = 'Selected dates contain no working days';
      } else if (this.leaveType.value === 'annual' || this.leaveType.value === 'pto') {
        const remaining = this.maxLeave - this.calculateUsedLeave();
        if (workDays > remaining) {
          isValid = false;
          message = `Insufficient leave balance (${remaining} days remaining)`;
        }
      }
    }

    this.validationMsg.textContent = message;
    this.submitBtn.disabled = !isValid;
    return isValid;
  }

  submitRequest() {
    if (!this.validateRequest()) return;

    const request = {
      type: this.leaveType.value,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      workingDays: this.calculateWorkingDays(),
      region: window.regionManager.region
    };

    // Here you would typically send to backend
    console.log('Leave request:', request);

    // Update calendar
    this.updateCalendarDisplay(request);

    // Reset form and hide panel
    this.leaveType.value = '';
    this.startDate.value = '';
    this.endDate.value = '';
    this.hidePanel();
  }

  updateCalendarDisplay(request) {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const day = this.calendar.querySelector(`[data-date="${date.toISOString().split('T')[0]}"]`);
      if (day) {
        day.classList.add('leave-requested');
      }
    }
  }

  showPanel() {
    this.panel.style.display = 'block';
  }

  hidePanel() {
    this.panel.style.display = 'none';
    this.validationMsg.textContent = '';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startButton').addEventListener('click', () => {
    setTimeout(() => {
      const calendar = document.querySelector('.calendar-grid');
      if (calendar) new LeaveRequest(calendar);
    }, 500);
  });
});
