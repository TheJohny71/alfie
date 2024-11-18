// js/leave-assistant.js
class LeaveAssistant {
  constructor() {
    this.conversation = [];
    this.container = document.createElement('div');
    this.container.className = 'assistant-container';
    
    this.initialize();
  }

  initialize() {
    this.container.innerHTML = `
      <div class="assistant-header">
        <h3>Leave Assistant</h3>
        <button class="close-assistant">×</button>
      </div>
      <div class="conversation-view"></div>
      <div class="suggestions-panel"></div>
      <div class="assistant-input">
        <input type="text" placeholder="Ask about leave planning..." class="query-input">
        <button class="send-query">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    `;

    this.addEventListeners();
    this.attachToDOM();
    this.generateInitialSuggestions();
  }

  addEventListeners() {
    const input = this.container.querySelector('.query-input');
    const sendBtn = this.container.querySelector('.send-query');
    const closeBtn = this.container.querySelector('.close-assistant');

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleQuery(input.value);
    });

    sendBtn.addEventListener('click', () => {
      this.handleQuery(input.value);
    });

    closeBtn.addEventListener('click', () => {
      this.container.classList.remove('active');
    });
  }

  async handleQuery(query) {
    if (!query.trim()) return;

    const input = this.container.querySelector('.query-input');
    input.value = '';

    this.addMessage('user', query);

    // Mock AI response
    const response = await this.generateResponse(query);
    this.addMessage('assistant', response);
  }

  addMessage(type, content) {
    const conversation = this.container.querySelector('.conversation-view');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = content;
    conversation.appendChild(message);
    conversation.scrollTop = conversation.scrollHeight;
  }

  async generateResponse(query) {
    // Mock response generation
    const responses = {
      holiday: "Based on the calendar, taking leave around bank holidays in December could give you 10 days off using only 3 days of leave.",
      team: "Your team's coverage is lowest in March. Consider planning your leave in February or April instead.",
      balance: "You have 15 days of leave remaining this year. Would you like suggestions for how to use them effectively?"
    };

    const topic = Object.keys(responses).find(key => query.toLowerCase().includes(key)) || 'default';
    return responses[topic] || "I can help you plan your leave effectively. What would you like to know?";
  }

  generateInitialSuggestions() {
    const suggestions = [
      "How can I maximize my leave?",
      "When is team coverage lowest?",
      "What are the upcoming holidays?"
    ];

    const panel = this.container.querySelector('.suggestions-panel');
    panel.innerHTML = suggestions.map(suggestion => `
      <button class="suggestion-chip">${suggestion}</button>
    `).join('');

    panel.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-chip')) {
        this.handleQuery(e.target.textContent);
      }
    });
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
  window.leaveAssistant = new LeaveAssistant();
});
