/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ReactNode, useContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";

// Define the shape of the context value
interface ModalContextType {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
  isModalOpen: boolean;
}

// Create context with default values
const ModalContext = React.createContext<ModalContextType>({
  showModal: () => {},
  hideModal: () => {},
  isModalOpen: false,
});

// Custom hook to use the modal context
export function useModal() {
  return useContext(ModalContext);
}

// ModalProvider component
interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showModal = (content: ReactNode) => {
    setModalContent(content);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setModalContent(null);
  };

  // Use useMemo to memoize the context value
  const contextValue = useMemo(
    () => ({
      showModal,
      hideModal,
      isModalOpen: isVisible,
    }),
    [isVisible]
  );

  const mountElement = document.getElementById("overlays");

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {isVisible &&
        mountElement &&
        ReactDOM.createPortal(
          <div
            className="h-screen w-screen fixed z-[1000] flex justify-center items-center bg-black/60"
            onClick={hideModal}
          >
            <div
              className="modal-content h-full w-full flex justify-center items-center p-5 rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              {modalContent}
            </div>
          </div>,
          mountElement
        )}
    </ModalContext.Provider>
  );
}
