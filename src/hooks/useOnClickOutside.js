'use client';

import { useEffect } from 'react';

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Ничего не делаем, если клик был внутри элемента
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
