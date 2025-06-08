import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  isKeyboardUser: boolean;
  focusVisible: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  isKeyboardUser: false,
  focusVisible: false,
});

export const useAccessibility = () => useContext(AccessibilityContext);

interface A11yProviderProps {
  children: React.ReactNode;
}

export const A11yProvider: React.FC<A11yProviderProps> = ({ children }) => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    // Detect keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        setFocusVisible(true);
      }
    };

    // Reset when mouse is used
    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      setFocusVisible(false);
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    // Add skip-to-content link styles
    const style = document.createElement('style');
    style.textContent = `
      .skip-to-content {
        position: absolute;
        top: -40px;
        left: 0;
        background: #0066cc;
        color: white;
        padding: 8px;
        z-index: 100;
        transition: top 0.2s;
      }
      .skip-to-content:focus {
        top: 0;
      }
      *:focus-visible {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <AccessibilityContext.Provider value={{ isKeyboardUser, focusVisible }}>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default A11yProvider; 