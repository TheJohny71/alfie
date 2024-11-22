class RegionManager {
  constructor() {
    this.region = 'UK';
    this.preferences = {
      dateFormat: 'DD/MM/YYYY',
      weekStart: 1,
      terminology: 'UK',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    this.terms = {
      UK: {
        leave: 'Annual Leave',
        holiday: 'Bank Holiday',
        sick: 'Sick Leave',
        approval: 'Leave Request',
        balance: 'Leave Balance',
        calendar: 'Holiday Calendar'
      },
      US: {
        leave: 'PTO',
        holiday: 'Federal Holiday',
        sick: 'Sick Time',
        approval: 'Time Off Request',
        balance: 'PTO Balance',
        calendar: 'Vacation Calendar'
      }
    };

    this.holidays = {
      UK: {
        'New Years Day': '2024-01-01',
        'Good Friday': '2024-03-29',
        'Easter Monday': '2024-04-01',
        'Early May Bank Holiday': '2024-05-06',
        'Spring Bank Holiday': '2024-05-27',
        'Summer Bank Holiday': '2024-08-26',
        'Christmas Day': '2024-12-25',
        'Boxing Day': '2024-12-26'
      },
      US: {
        'New Years Day': '2024-01-01',
        'Martin Luther King Jr. Day': '2024-01-15',
        'Presidents Day': '2024-02-19',
        'Memorial Day': '2024-05-27',
        'Independence Day': '2024-07-04',
        'Labor Day': '2024-09-02',
        'Thanksgiving': '2024-11-28',
        'Christmas Day': '2024-12-25'
      }
    };

    if (!document.querySelector('.region-toggle')) {
      this.initializeHeader();
    }
    
    this.attachEventListeners();
    this.initializeTimezoneHandling();
  }

  attachEventListeners() {
    document.querySelectorAll('.region-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (e.target.classList.contains('region-btn')) {
          this.setRegion(e.target.dataset.region);
        }
      });
    });

    // Listen for timezone changes
    window.addEventListener('timezoneChanged', (e) => {
      this.updateTimezone(e.detail.timezone);
    });
  }

  initializeTimezoneHandling() {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.updateTimezone(userTimezone);
  }

  updateTimezone(timezone) {
    this.preferences.timezone = timezone;
    this.updateUI();
  }

  initializeHeader() {
    const header = document.querySelector('.header');
    const brand = header.querySelector('.brand');
    
    if (!brand) return;
    
    const regionToggle = document.createElement('div');
    regionToggle.className = 'region-toggle fade-in';
    regionToggle.innerHTML = `
      <button class="region-btn ${this.region === 'UK' ? 'active' : ''}" data-region="UK">UK</button>
      <button class="region-btn ${this.region === 'US' ? 'active' : ''}" data-region="US">US</button>
    `;
    
    brand.parentNode.insertBefore(regionToggle, brand.nextSibling);
  }

  setRegion(newRegion) {
    if (newRegion !== 'UK' && newRegion !== 'US') return;
    
    this.region = newRegion;
    this.updatePreferences();
    this.updateUI();
    
    document.querySelectorAll('.region-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.region === newRegion);
    });

    window.dispatchEvent(new CustomEvent('regionChanged', { 
      detail: { 
        region: newRegion,
        preferences: this.preferences,
        holidays: this.getHolidays()
      } 
    }));
  }

  updatePreferences() {
    this.preferences = {
      dateFormat: this.region === 'UK' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
      weekStart: this.region === 'UK' ? 1 : 0,
      terminology: this.region,
      timezone: this.preferences.timezone
    };
  }

  updateUI() {
    document.querySelectorAll('[data-term]').forEach(element => {
      const termKey = element.dataset.term;
      if (this.terms[this.region][termKey]) {
        element.textContent = this.terms[this.region][termKey];
      }
    });

    // Update holiday displays
    this.updateHolidayDisplay();
  }

  updateHolidayDisplay() {
    const holidayContainer = document.querySelector('.holiday-list');
    if (!holidayContainer) return;

    const holidays = this.getHolidays();
    const holidayHTML = Object.entries(holidays)
      .map(([name, date]) => `
        <div class="holiday-item">
          <span class="holiday-name">${name}</span>
          <span class="holiday-date">${this.formatDate(date)}</span>
        </div>
      `).join('');

    holidayContainer.innerHTML = holidayHTML;
  }

  getTerm(key) {
    return this.terms[this.region][key] || key;
  }

  getHolidays() {
    return this.holidays[this.region] || {};
  }

  isHoliday(date) {
    const formattedDate = this.formatDateISO(date);
    return Object.values(this.holidays[this.region]).includes(formattedDate);
  }

  formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return this.region === 'UK' 
      ? `${day}/${month}/${year}`
      : `${month}/${day}/${year}`;
  }

  formatDateISO(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  getLeaveTypes() {
    return {
      UK: [
        { id: 'annual', name: 'Annual Leave', color: '#4B0082' },
        { id: 'bank', name: 'Bank Holiday', color: '#E74C3C' },
        { id: 'sick', name: 'Sick Leave', color: '#F39C12' }
      ],
      US: [
        { id: 'pto', name: 'PTO', color: '#4B0082' },
        { id: 'federal', name: 'Federal Holiday', color: '#E74C3C' },
        { id: 'sick', name: 'Sick Time', color: '#F39C12' }
      ]
    }[this.region];
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.regionManager = new RegionManager();
});
