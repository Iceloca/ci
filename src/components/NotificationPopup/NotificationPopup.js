import React from 'react';
import styles from './NotificationPopup.module.css';
import XIcon from '../Icons/XIcon';
import { useTranslation } from 'react-i18next';

function NotificationPopup({ message, onClose }) {
  const { t } = useTranslation();

  if (!message) return null;

  return (
    <div
      className={styles.popup}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <p className={styles.message}>{message}</p>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label={t('closeNot')}
      >
        <XIcon strokeColor="white" aria-hidden="true" />
      </button>
    </div>
  );
}

export default React.memo(NotificationPopup);
