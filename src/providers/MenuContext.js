'use client';

import { createContext, useState } from 'react';

export const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  function toggleMenuMode() {
    setMenuOpen(!isMenuOpen);
  }

  return (
    <MenuContext.Provider value={{ isMenuOpen, toggleMenuMode }}>
      {children}
    </MenuContext.Provider>
  );
}
