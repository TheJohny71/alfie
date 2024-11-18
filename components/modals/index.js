// components/modals/index.js
import React, { createContext, useContext, useState, useEffect } from 'react';
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

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
      {activeModal === MODAL_TYPES.SMART_PLANNING && <SmartPlanningModal />}
      {activeModal === MODAL_TYPES.LEAVE_REQUEST && <LeaveRequestModal />}
      {activeModal === MODAL_TYPES.LEAVE_ASSISTANT && <LeaveAssistantModal />}
    </ModalContext.Provider>
  );
};

// Base Modal Component
const Modal = ({ children, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const deltaY = e.touches[0].clientY - touchStart;
    if (deltaY > 50) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div 
        className={`
          relative w-11/12 max-w-lg bg-[rgba(42,16,82,0.8)] backdrop-blur-xl
          border border-white/10 rounded-2xl p-6 shadow-xl
          transform transition-all duration-300 ease-out
          ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

// Leave Request Modal
const LeaveRequestModal = () => {
  const { closeModal } = useContext(ModalContext);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: ''
  });

  return (
    <Modal onClose={closeModal}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">New Leave Request</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-white/80 mb-1">Leave Type</label>
            <select 
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
              value={formData.leaveType}
              onChange={e => setFormData(prev => ({ ...prev, leaveType: e.target.value }))}
            >
              <option value="">Select type...</option>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/80 mb-1">Start Date</label>
              <input 
                type="date"
                className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                value={formData.startDate}
                onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">End Date</label>
              <input 
                type="date"
                className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                value={formData.endDate}
                onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
          <button 
            className="w-full py-3 px-4 bg-[#4B0082] hover:bg-[#4B0082]/90 
                     text-white rounded-full font-medium transition-colors"
            onClick={closeModal}
          >
            Submit Request
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Smart Planning Modal
const SmartPlanningModal = () => {
  const { closeModal } = useContext(ModalContext);

  return (
    <Modal onClose={closeModal}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Smart Planning</h2>
        <div className="bg-white/5 rounded-lg p-3">
          <h3 className="font-medium text-[#4B0082] mb-2">Suggested Leave Dates</h3>
          <p className="text-sm text-white/80">Based on team coverage and holidays:</p>
          <ul className="mt-2 space-y-1 text-sm text-white/90">
            <li>• Dec 27-29 (3 days, low coverage)</li>
            <li>• Mar 15-19 (5 days, bank holiday bonus)</li>
          </ul>
        </div>
        <button 
          onClick={closeModal}
          className="w-full py-3 px-4 bg-[#4B0082] hover:bg-[#4B0082]/90 
                   text-white rounded-full font-medium transition-colors"
        >
          Apply Suggestion
        </button>
      </div>
    </Modal>
  );
};

// Leave Assistant Modal
const LeaveAssistantModal = () => {
  const { closeModal } = useContext(ModalContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { type: 'assistant', text: 'How can I help you plan your leave?' }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { type: 'user', text: message }]);
    setMessage('');
    
    // Simulate assistant response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        text: 'I can help you find the best dates for your leave based on team coverage and holidays.'
      }]);
    }, 1000);
  };

  return (
    <Modal onClose={closeModal}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Leave Assistant</h2>
        <div className="h-64 overflow-y-auto p-3 rounded-lg bg-white/5 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : ''}`}>
              {msg.type === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4B0082] 
                              flex items-center justify-center text-white">
                  A
                </div>
              )}
              <div className={`rounded-2xl p-3 max-w-[80%] ${
                msg.type === 'user' ? 'bg-[#4B0082]' : 'bg-white/10'
              }`}>
                <p className="text-sm text-white">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-full bg-white/10 border border-white/20 text-white"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="p-2 bg-[#4B0082] hover:bg-[#4B0082]/90 
                     text-white rounded-full transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Modal Triggers Component
export const ModalTriggers = () => {
  const { openModal } = useContext(ModalContext);
  
  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <button 
        onClick={() => openModal(MODAL_TYPES.SMART_PLANNING)}
        className="rounded-full p-3 bg-purple-800/90 hover:bg-purple-700/90 backdrop-blur-xl"
      >
        <Users className="w-5 h-5 text-white" />
      </button>
      <button 
        onClick={() => openModal(MODAL_TYPES.LEAVE_REQUEST)}
        className="rounded-full p-3 bg-purple-800/90 hover:bg-purple-700/90 backdrop-blur-xl"
      >
        <Calendar className="w-5 h-5 text-white" />
      </button>
      <button 
        onClick={() => openModal(MODAL_TYPES.LEAVE_ASSISTANT)}
        className="rounded-full p-3 bg-purple-800/90 hover:bg-purple-700/90 backdrop-blur-xl"
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default Modal;
