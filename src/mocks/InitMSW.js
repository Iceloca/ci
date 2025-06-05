'use client';

import { useEffect } from 'react';
import { initDbPersistence } from './db';

export default function InitMSW() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('./browser.js').then(({ worker }) => {
        initDbPersistence();
        worker.start({ onUnhandledRequest: 'warn' });
      });
    }
  }, []);

  return null;
}
