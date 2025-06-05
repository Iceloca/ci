'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Footer.module.css';

function Footer() {
  const theme = useSelector((state) => state.auth.user?.theme);

   const themeClass = theme === 'light' ? 'light-theme-dark' : 'dark-theme-dark'; 

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} ${themeClass}`} role="contentinfo">
      <p className={styles.footerText}>© {currentYear} sidekick</p>
    </footer>
  );
}

export default React.memo(Footer);
