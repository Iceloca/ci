'use client';

import { createContext, useState, useEffect } from 'react';

export const DeviceContext = createContext(false);

export const DeviceProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <DeviceContext.Provider value={isMobile}>
      {children}
    </DeviceContext.Provider>
  );
};
