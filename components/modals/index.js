// components/modals/index.js
export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);
  
  const openModal = (modalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
      <SmartPlanningModal />
      <LeaveRequestModal />
      <LeaveAssistantModal />
    </ModalContext.Provider>
  );
};

// Modal trigger buttons
export const ModalTriggers = () => {
  const { openModal } = useContext(ModalContext);
  
  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <button 
        onClick={() => openModal('smartPlanning')}
        className="rounded-full p-3 bg-purple-800/90 hover:bg-purple-700/90 backdrop-blur-xl"
      >
        <Users className="w-5 h-5 text-white" />
      </button>
      <button 
        onClick={() => openModal('leaveRequest')}
        className="rounded-full p-3 bg-purple-800/90 hover:bg-purple-700/90 backdrop-blur-xl"
      >
        <Calendar className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};
