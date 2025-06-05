'use client';

import React from 'react';
import styles from './UserAvatar.module.css';
import UserAvatar from '@/components/UserAvatar/UserAvatar';

function UserAccount({ userAvatar, username, extraText, gap = '12px' }) {
  return (
    <div className={styles.userAccountContainer} style={{ gap }}>
      <UserAvatar imgSrc={userAvatar} />
      <div className={styles.userInfo}>
        <h4 className={styles.username}>{username}</h4>
        <span className={styles.extraText}>{extraText}</span>
      </div>
    </div>
  );
}

export default React.memo(UserAccount);
