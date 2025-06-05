'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || i18n.language || 'en';
    setLanguage(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  const toggleLanguage = () => {
    const newLanguage = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const themeClass = user?.theme === 'light' ? 'light' : '';

  return (
    <button
      className={`${styles.languageSwitcher} ${themeClass}`}
      onClick={toggleLanguage}
      aria-label={t('switchLanguage')}
    >
      {language === 'ru' ? '🇷🇺 Рус' : '🇺🇸 Eng'}
    </button>
  );
}
