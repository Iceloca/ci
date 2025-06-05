'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import MailIcon from '../Icons/MailIcon';
import EyeIcon from '../Icons/EyeIcon';
import { useDispatch } from 'react-redux';
import { login, register } from '@/store/authSlice';
import FormField from '../FormField/FormField';
import { validateEmail, validatePassword } from '@/utils/validators';
import { lazy, Suspense } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { useTranslation, Trans } from 'react-i18next';
import Link from 'next/link';
import styles from './AuthForm.module.css';

const NotificationPopup = lazy(() => import('../NotificationPopup/NotificationPopup'));

export default function AuthForm({ isRegPage }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { message, showNotification, closeNotification } = useNotification();
  const currentContent = isRegPage ? 'auth.reg.' : 'auth.login.';

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isRegPage) await dispatch(register(values)).unwrap();
      else await dispatch(login(values)).unwrap();
    router.replace('/');
    } catch (err) {
      showNotification(typeof err === 'object' ? err.message : err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={{ email: '', password: '' }} onSubmit={handleSubmit}>
      {({ isSubmitting, errors, touched }) => (
        <Form className={styles.regForm} role="form" aria-labelledby="authFormTitle">
          <div className={styles.regFormHeaders}>
            <h3 id="authFormTitle">{t(`${currentContent}h3`)}</h3>
            <p>{t(`${currentContent}h4`)}</p>
          </div>

          <FormField
            name="email"
            label={t(`${currentContent}email`)}
            placeholder="Enter email"
            icon={<MailIcon strokeColor="white" />}
            error={errors.email}
            touched={touched.email}
            validate={(value) => {
              const errorKey = validateEmail(value);
              return errorKey ? t(`validationErrors.${errorKey}`) : undefined;
            }}
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
          />

          <FormField
            name="password"
            type="password"
            placeholder="Enter password"
            icon={<EyeIcon strokeColor="white" />}
            error={errors.password}
            touched={touched.password}
            validate={(value) => {
              const errorKey = validatePassword(value);
              return errorKey ? t(`validationErrors.${errorKey}`) : undefined;
            }}
            label={t(`${currentContent}password`)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            aria-invalid={!!errors.password}
          />

          <button
            className="orange-button"
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? t(`loading`) : t(`${currentContent}button`)}
          </button>

          {isRegPage && (
            <p role="note" className={styles.regFormNote}>
              <Trans
                i18nKey={`${currentContent}terms`}
                components={[
                  <a key="terms" className={styles.textLink} tabIndex="0" />,
                  <a key="privacy" className={styles.textLink} tabIndex="0" />,
                ]}
              />
            </p>
          )}

          <h4 className={styles.h4}>
            {t(`${currentContent}transferH4`)}{' '}
            <Link href={isRegPage ? '/login' : '/register'} className={styles.textLink}>
              {t(`${currentContent}link`)}
            </Link>
          </h4>

          {message && (
            <Suspense fallback={null}>
              <NotificationPopup message={message} onClose={closeNotification} />
            </Suspense>
          )}
        </Form>
      )}
    </Formik>
  );
}
