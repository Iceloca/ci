'use client';

import React, { useContext } from 'react';
import styles from './Header.module.css';
import LogoDark from '@/components/Icons/Logo/LogoDark';
import LogoLight from '@/components/Icons/Logo/LogoLight';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import HamburgerButton from '@/components/HamburgerButton/HamburgerButton';
import { DeviceContext } from '@/providers/DeviceProvider';
import { useSelector } from 'react-redux';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Header({ isAuthPage }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isMobile = useContext(DeviceContext);
  const { t } = useTranslation();
  const router = useRouter();

  const Logo = user?.theme === 'light' ? LogoLight : LogoDark;
  const themeClass = user?.theme === 'light' ? 'light-theme-dark' : 'dark-theme-dark';

  const AuthLinks = (
    <nav className={styles.nav}>
      <Link href="/reg" className={styles.navLink}>
        {t('header.signUp')}
      </Link>
      <Link href="/login" className={styles.navLink}>
        {t('header.signIn')}
      </Link>
    </nav>
  );

  const UserInfo = (
    <button
      className={styles.userInfo}
      onClick={() => router.push('/profile/info')}
      aria-label={t('header.profile')}
    >
      <UserAvatar height="24" imgSrc={user?.userAvatar} />
      <span className={styles.userInfoSpan}>{user?.userName}</span>
    </button>
  );

  return (
    <header className={`${styles.header} ${themeClass}`} role="banner">
      <div className={styles.staticPart}>
        <Logo />
        <LanguageSwitcher />
      </div>
      {isMobile ? <HamburgerButton /> : !isAuthPage && (isAuthenticated ? UserInfo : AuthLinks)}
    </header>
  );
}

export default React.memo(Header);
