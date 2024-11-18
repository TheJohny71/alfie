// js/smart-planning.js
class SmartPlanner {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'smart-planner-container';
    this.suggestions = [];
    this.coverage = new Map();
    
    this.initialize();
  }

  async initialize() {
    this.container.innerHTML = `
      <div class="planner-header">
        <h3>Smart Planning</h3>
        <div class="optimization-controls">
          <button class="optimize-btn">Optimize Leave</button>
          <button class="team-view-btn">Team Coverage</button>
        </div>
      </div>
      <div class="suggestions-panel"></div>
      <div class="coverage-panel"></div>
      <div class="conflict-panel"></div>
    `;

    this.addEventListeners();
    this.attachToDOM();
  }

  async generateSuggestions() {
    // Mock AI response for now
    return [
      {
        type: 'optimization',
        message: 'Consider taking leave around bank holidays to maximize time off',
        dates: ['2024-12-24', '2024-12-27'],
        impact: 'Get 5 days off using only 2 days of leave'
      },
      {
        type: 'coverage',
        message: 'Team coverage is low in March',
        dates: ['2024-03-15', '2024-03-30'],
        impact: 'Consider alternative dates'
      }
    ];
  }

  async updateTeamCoverage() {
    // Mock team coverage data
    const coverageData = {
      '2024-01': 85,
      '2024-02': 75,
      '2024-03': 45,
      '2024-04': 90
    };
    
    this.renderCoverage(coverageData);
  }

  detectConflicts(dates) {
    // Implementation for conflict detection
    return dates.filter(date => {
      const coverage = this.coverage.get(date);
      return coverage && coverage < 50;
    });
  }

  addEventListeners() {
    const optimizeBtn = this.container.querySelector('.optimize-btn');
    const teamViewBtn = this.container.querySelector('.team-view-btn');
    
    optimizeBtn.addEventListener('click', async () => {
      const suggestions = await this.generateSuggestions();
      this.renderSuggestions(suggestions);
    });
    
    teamViewBtn.addEventListener('click', async () => {
      await this.updateTeamCoverage();
    });
  }

  renderSuggestions(suggestions) {
    const panel = this.container.querySelector('.suggestions-panel');
    panel.innerHTML = suggestions.map(suggestion => `
      <div class="suggestion-card">
        <div class="suggestion-type">${suggestion.type}</div>
        <p class="suggestion-message">${suggestion.message}</p>
        <div class="suggestion-impact">${suggestion.impact}</div>
        <button class="apply-suggestion">Apply</button>
      </div>
    `).join('');
  }

  renderCoverage(coverageData) {
    const panel = this.container.querySelector('.coverage-panel');
    const months = Object.keys(coverageData);
    
    panel.innerHTML = `
      <div class="coverage-chart">
        ${months.map(month => `
          <div class="coverage-bar">
            <div class="bar-fill" style="height: ${coverageData[month]}%"></div>
            <div class="bar-label">${month}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  attachToDOM() {
    const calendar = document.querySelector('.calendar-section');
    if (calendar) {
      calendar.appendChild(this.container);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.smartPlanner = new SmartPlanner();
});
