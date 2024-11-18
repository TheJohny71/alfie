// js/region-context.js
class RegionManager {
  constructor() {
    this.region = 'UK'; // Default region
    this.preferences = {
      dateFormat: 'DD/MM/YYYY',
      weekStart: 1, // Monday
      terminology: 'UK'
    };
    
    this.terms = {
      UK: {
        leave: 'Annual Leave',
        holiday: 'Bank Holiday',
        sick: 'Sick Leave'
      },
      US: {
        leave: 'PTO',
        holiday: 'Federal Holiday',
        sick: 'Sick Time'
      }
    };
    
    this.initializeHeader();
  }

  initializeHeader() {
    const header = document.querySelector('.header');
    const regionToggle = document.createElement('div');
    regionToggle.className = 'region-toggle';
    regionToggle.innerHTML = `
      <button class="region-btn ${this.region === 'UK' ? 'active' : ''}" data-region="UK">UK</button>
      <button class="region-btn ${this.region === 'US' ? 'active' : ''}" data-region="US">US</button>
    `;
    
    // Add to header after brand
    const brand = header.querySelector('.brand');
    brand.parentNode.insertBefore(regionToggle, brand.nextSibling);
    
    // Add event listeners
    regionToggle.addEventListener('click', (e) => {
      if (e.target.classList.contains('region-btn')) {
        this.setRegion(e.target.dataset.region);
      }
    });
  }

  setRegion(newRegion) {
    this.region = newRegion;
    this.updatePreferences();
    this.updateUI();
    
    // Update buttons
    document.querySelectorAll('.region-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.region === newRegion);
    });
  }

  updatePreferences() {
    this.preferences = {
      dateFormat: this.region === 'UK' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
      weekStart: this.region === 'UK' ? 1 : 0, // Monday for UK, Sunday for US
      terminology: this.region
    };
  }

  updateUI() {
    // Update terminology
    document.querySelectorAll('[data-term]').forEach(element => {
      const termKey = element.dataset.term;
      if (this.terms[this.region][termKey]) {
        element.textContent = this.terms[this.region][termKey];
      }
    });
  }

  getTerm(key) {
    return this.terms[this.region][key] || key;
  }

  formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return this.region === 'UK' 
      ? `${day}/${month}/${year}`
      : `${month}/${day}/${year}`;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.regionManager = new RegionManager();
});
