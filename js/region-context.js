// js/region-context.js
class RegionManager {
  constructor() {
    this.region = 'UK';
    this.preferences = {
      dateFormat: 'DD/MM/YYYY',
      weekStart: 1,
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

    // Only initialize if toggle doesn't exist
    if (!document.querySelector('.region-toggle')) {
      this.initializeHeader();
    }
    
    // Add event listener to any existing toggles
    document.querySelectorAll('.region-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (e.target.classList.contains('region-btn')) {
          this.setRegion(e.target.dataset.region);
        }
      });
    });
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

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('regionChanged', { 
      detail: { region: newRegion } 
    }));
  }

  updatePreferences() {
    this.preferences = {
      dateFormat: this.region === 'UK' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
      weekStart: this.region === 'UK' ? 1 : 0, // Monday for UK, Sunday for US
      terminology: this.region
    };
  }

  updateUI() {
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.regionManager = new RegionManager();
});
