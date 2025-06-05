import styles from './AuthPageLayout.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AuthForm from '@/components/AuthForm/AuthForm';

export default function AuthPageLayout({ isRegPage }) {
  return (
    <div className="page">
      <Header isAuthPage={true} />
      <main className={styles.authContainer} role="main">
        <AuthForm isRegPage={isRegPage} />
      </main>
      <Footer />
    </div>
  );
}
