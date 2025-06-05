import { useState, useCallback } from 'react';

export function useNotification() {
  const [message, setMessage] = useState('');
  const showNotification = useCallback((msg) => setMessage(msg), []);
  const closeNotification = useCallback(() => setMessage(''), []);
  return { message, showNotification, closeNotification };
}
