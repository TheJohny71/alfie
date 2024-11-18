// components/modals/index.js
const React = window.React;
const { createElement: h, createContext, useContext, useState, useEffect } = React;
import { X, Send, Calendar, Users, MessageCircle } from 'lucide-react';

// Create Modal Context
export const ModalContext = createContext();

// Modal Types
export const MODAL_TYPES = {
  SMART_PLANNING: 'smartPlanning',
  LEAVE_REQUEST: 'leaveRequest',
  LEAVE_ASSISTANT: 'leaveAssistant'
};

// Modal Provider Component
export const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);
  
  const openModal = (modalType) => {
    setActiveModal(modalType);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  const value = {
    activeModal,
    openModal,
    closeModal
  };

  return h(
    ModalContext.Provider,
    { value },
    h('div', null, [
      children,
      activeModal === MODAL_TYPES.SMART_PLANNING && h(SmartPlanningModal),
      activeModal === MODAL_TYPES.LEAVE_REQUEST && h(LeaveRequestModal),
      activeModal === MODAL_TYPES.LEAVE_ASSISTANT && h(LeaveAssistantModal)
    ])
  );
};

// Base Modal Component
const Modal = ({ children, onClose }) => {
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    const deltaY = e.touches[0].clientY - touchStart;
    if (deltaY > 50) onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return h('div', { 
    className: 'fixed inset-0 z-50 flex items-center justify-center'
  }, [
    h('div', {
      className: 'fixed inset-0 bg-black/20 backdrop-blur-sm',
      onClick: onClose
    }),
    h('div', {
      className: 'relative w-11/12 max-w-lg bg-[rgba(42,16,82,0.8)] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl',
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove
    }, [
      h('button', {
        onClick: onClose,
        className: 'absolute right-4 top-4 text-white/70 hover:text-white transition-colors'
      }, h(X, { size: 24 })),
      children
    ])
  ]);
};

// Leave Assistant Modal (converted from your leave-assistant.js)
const LeaveAssistantModal = () => {
  const { closeModal } = useContext(ModalContext);
  const [messages, setMessages] = useState([
    { type: 'assistant', text: 'How can I help you plan your leave?' }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    "How can I maximize my leave?",
    "When is team coverage lowest?",
    "What are the upcoming holidays?"
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    setInput('');

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: generateResponse(input)
      }]);
    }, 1000);
  };

  const generateResponse = (query) => {
    const responses = {
      holiday: "Based on the calendar, taking leave around bank holidays in December could give you 10 days off using only 3 days of leave.",
      team: "Your team's coverage is lowest in March. Consider planning your leave in February or April instead.",
      balance: "You have 15 days of leave remaining this year. Would you like suggestions for how to use them effectively?"
    };

    const topic = Object.keys(responses).find(key => query.toLowerCase().includes(key)) || 'default';
    return responses[topic] || "I can help you plan your leave effectively. What would you like to know?";
  };

  return h(Modal, { onClose: closeModal }, [
    h('div', { className: 'space-y-4' }, [
      h('h2', { className: 'text-xl font-semibold text-white' }, 'Leave Assistant'),
      h('div', {
        className: 'h-64 overflow-y-auto p-3 rounded-lg bg-white/5 space-y-3'
      }, messages.map((msg, index) => 
        h('div', {
          key: index,
          className: `flex gap-2 ${msg.type === 'user' ? 'justify-end' : ''}`
        }, [
          msg.type === 'assistant' && h('div', {
            className: 'flex-shrink-0 w-8 h-8 rounded-full bg-[#4B0082] flex items-center justify-center text-white'
          }, 'A'),
          h('div', {
            className: `rounded-2xl p-3 max-w-[80%] ${
              msg.type === 'user' ? 'bg-[#4B0082]' : 'bg-white/10'
            }`
          }, h('p', { className: 'text-sm text-white' }, msg.text))
        ])
      )),
      h('div', { className: 'flex gap-2' }, [
        h('input', {
          type: 'text',
          placeholder: 'Type your message...',
          className: 'flex-1 p-2 rounded-full bg-white/10 border border-white/20 text-white',
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyPress: (e) => e.key === 'Enter' && handleSendMessage()
        }),
        h('button', {
          onClick: handleSendMessage,
          className: 'p-2 bg-[#4B0082] hover:bg-[#4B0082]/90 text-white rounded-full transition-colors'
        }, h(Send, { size: 20 }))
      ])
    ])
  ]);
};

// SmartPlanningModal (converted from your smart-planning.js)
const SmartPlanningModal = () => {
  const { closeModal } = useContext(ModalContext);
  const [view, setView] = useState('suggestions');
  const [suggestions] = useState([
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
  ]);

  return h(Modal, { onClose: closeModal }, [
    h('div', { className: 'space-y-4' }, [
      h('h2', { className: 'text-xl font-semibold text-white' }, 'Smart Planning'),
      h('div', { className: 'flex gap-2 mb-4' }, [
        h('button', {
          className: `px-4 py-2 rounded-lg ${
            view === 'suggestions' ? 'bg-[#4B0082]' : 'bg-white/10'
          } text-white`,
          onClick: () => setView('suggestions')
        }, 'Suggestions'),
        h('button', {
          className: `px-4 py-2 rounded-lg ${
            view === 'coverage' ? 'bg-[#4B0082]' : 'bg-white/10'
          } text-white`,
          onClick: () => setView('coverage')
        }, 'Team Coverage')
      ]),
      h('div', { className: 'space-y-3' },
        suggestions.map((suggestion, index) => 
          h('div', {
            key: index,
            className: 'bg-white/5 rounded-lg p-4'
          }, [
            h('div', { className: 'text-[#4B0082] font-medium' }, suggestion.type),
            h('p', { className: 'text-white mt-2' }, suggestion.message),
            h('p', { className: 'text-white/70 text-sm mt-1' }, suggestion.impact),
            h('button', {
              className: 'mt-3 px-4 py-2 bg-[#4B0082] hover:bg-[#4B0082]/90 text-white rounded-full transition-colors'
            }, 'Apply')
          ])
        )
      )
    ])
  ]);
};

// Export components
export { Modal, LeaveAssistantModal, SmartPlanningModal };
