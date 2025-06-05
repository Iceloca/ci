'use client';

import React, { useContext } from 'react';
import styles from './HamburgerButton.module.css';
import { MenuContext } from '@/providers/MenuContext';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function HamburgerButton() {
  const { toggleMenuMode } = useContext(MenuContext);
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const themeClass = user?.theme === 'light' ? styles.darkBackground : styles.lightBackground;

  return (
    <button
      className={styles.hamburgerButton}
      onClick={toggleMenuMode}
      aria-label={t('toggleMenu')}
    >
      <span className={themeClass} />
      <span className={themeClass} />
      <span className={themeClass} />
    </button>
  );
}
