// components/modals/index.js
const React = window.React;
const { createElement: h, createContext, useContext, useState, useEffect } = React;

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
      }, 'X'),
      children
    ])
  ]);
};

// Modal Triggers Component (Now properly exported)
export const ModalTriggers = () => {
  const { openModal } = useContext(ModalContext);
  
  return h('div', { className: 'fixed bottom-4 right-4 flex gap-2' }, [
    h('button', {
      onClick: () => openModal(MODAL_TYPES.SMART_PLANNING),
      className: 'rounded-full p-3 bg-purple-800/90 hover:bg-purple-700/90 backdrop-blur-xl text-white'
    }, 'Plan'),
    h('button', {
      onClick: () => openModal(MODAL_TYPES.LEAVE_REQUEST),
      className: 'rounded-full p-3 bg-purple-800/90 hover:bg-purple-700/90 backdrop-blur-xl text-white'
    }, 'Leave'),
    h('button', {
      onClick: () => openModal(MODAL_TYPES.LEAVE_ASSISTANT),
      className: 'rounded-full p-3 bg-purple-800/90 hover:bg-purple-700/90 backdrop-blur-xl text-white'
    }, 'Help')
  ]);
};

// Leave Request Modal
const LeaveRequestModal = () => {
  const { closeModal } = useContext(ModalContext);
  return h(Modal, { onClose: closeModal }, 
    h('div', null, 'Leave Request Form')
  );
};

// Smart Planning Modal
const SmartPlanningModal = () => {
  const { closeModal } = useContext(ModalContext);
  return h(Modal, { onClose: closeModal }, 
    h('div', null, 'Smart Planning')
  );
};

// Leave Assistant Modal
const LeaveAssistantModal = () => {
  const { closeModal } = useContext(ModalContext);
  return h(Modal, { onClose: closeModal }, 
    h('div', null, 'Leave Assistant')
  );
};

// Export everything needed
export {
  Modal,
  LeaveRequestModal,
  SmartPlanningModal,
  LeaveAssistantModal
};
