'use client';

import React from 'react';
import styles from './CreatePost.module.css';
import UserAvatar from '../UserAvatar/UserAvatar';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function CreatePost({ openModal }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  if (!isAuthenticated) return null;

  const themeClass = user?.theme === 'light' ? 'light-theme-section' : 'dark-theme-section';

  return (
    <section
      className={`${themeClass} ${styles.createPostContainer}`}
      aria-label={t('createPost.ariaLabel')}
    >
      <UserAvatar imgSrc={user.userAvatar} />
      <div className={styles.inputSection}>
        <h4>{t('createPost.whatsHappening')}</h4>
        <button onClick={openModal} className="orange-button" type="button">
          {t('createPost.tellEveryone')}
        </button>
      </div>
    </section>
  );
}

export default React.memo(CreatePost);
