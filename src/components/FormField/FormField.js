'use client';

import { Field } from 'formik';
import { useSelector } from 'react-redux';
import styles from './FormField.module.css'; // ваши стили из CSS-модуля

export default function FormField({
  name,
  label,
  placeholder,
  icon,
  children,
  validate,
  error,
  touched,
  as = 'input',
  type = 'text',
}) {
  const { user } = useSelector((state) => state.auth);
  const inputId = as === 'input' ? `${name}-field` : `${name}-textarea`;
  const errorId = `${name}-error`;
  const theme = user?.theme === 'light' ? 'light' : 'dark';
  const inputClass = `input ${theme}-theme-input ${error && touched ? 'error' : ''}`;

  return (
    <div className={styles.formField}>
      <label htmlFor={inputId} className={styles.formFieldLabel}>
        {icon}
        <span>{label}</span>
      </label>

      {as === 'textarea' ? (
        children
      ) : (
        <Field
          id={inputId}
          name={name}
          placeholder={placeholder}
          className={inputClass}
          validate={validate}
          type={type}
          aria-invalid={!!(error && touched)}
          aria-describedby={error && touched ? errorId : undefined}
        />
      )}

      {error && touched && (
        <div id={errorId} className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
