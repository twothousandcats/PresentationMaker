import * as React from 'react';
import { useEffect, useState } from 'react';
import type {
  AuthMode,
  ValidationError,
} from '../../store/types/utility-types.ts';
import { getCurrentUser, login, register } from '../../lib/authService.ts';
import { useNavigate } from 'react-router-dom';
import { PAGES_URL } from '../../store/utils/config.ts';
import style from './AuthPage.module.css';
import { LANGUAGES } from '../../store/utils/langs.ts';
import { AppHeader } from '../../components/AppHeader/AppHeader.tsx';
import { concatClassNames } from '../../store/utils/functions.ts';

const config = {
  name: {
    name: 'name',
    placeholder: 'Name',
  },
  email: {
    name: 'email',
    placeholder: 'Email',
  },
  password: {
    name: 'password',
    placeholder: 'Password',
  },
};

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<ValidationError>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const isLoginMode = () => {
    return mode === 'login';
  };

  const validateEmail = (errorLog: ValidationError) => {
    delete errorLog.email;

    if (!email.trim()) {
      errorLog.email = LANGUAGES.ru.validateEmailErrorRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorLog.email = LANGUAGES.ru.validateEmailErrorType;
    }
  };

  const validatePassword = (errorLog: ValidationError) => {
    delete errorLog.password;

    if (!password.trim()) {
      errorLog.password = LANGUAGES.ru.validatePasswordErrorRequired;
    } else if (password.length < 8) {
      errorLog.password = LANGUAGES.ru.validatePasswordErrorMinLen;
    }
  };

  const validateName = (errorLog: ValidationError) => {
    delete errorLog.name;

    if (!isLoginMode()) {
      if (!name.trim()) {
        errorLog.name = LANGUAGES.ru.validateNameErrorRequired;
      } else if (name.length < 2) {
        errorLog.name = LANGUAGES.ru.validateNameErrorLen;
      }
    }
  };

  const handleNameBlur = () => {
    const newErrors = { ...errors };
    validateName(newErrors);
    setErrors(newErrors);
  };

  const handleEmailBlur = () => {
    const newErrors = { ...errors };
    validateEmail(newErrors);
    setErrors(newErrors);
  };

  const handlePasswordBlur = () => {
    const newErrors = { ...errors };
    validatePassword(newErrors);
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: ValidationError = {};

    validateEmail(newErrors);
    validatePassword(newErrors);
    validateName(newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (isLoginMode()) {
        result = await login({ email, password });
      } else {
        result = await register({ email, password, name });
      }

      if (result.success) {
        navigate(PAGES_URL.collectionPage);
      } else {
        setServerError(result.message ? result.message : '');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(isLoginMode() ? 'register' : 'login');
    setErrors({});
  };

  return (
    <>
      <AppHeader />
      <div className={style.wrapper}>
        <form onSubmit={handleSubmit} className={style.form}>
          {isLoginMode() ? (
            <h2 className={style.formHeading}>{LANGUAGES.ru.loginTitle}</h2>
          ) : (
            <h2 className={style.formHeading}>
              {LANGUAGES.ru.registrationTitle}
            </h2>
          )}
          {!isLoginMode() && (
            <div className={style.formFieldBox}>
              <label htmlFor={config.name.name}></label>
              <input
                className={concatClassNames([
                  style.field,
                  errors.name && style.fieldError,
                ])}
                type="text"
                name={config.name.name}
                placeholder={config.name.placeholder}
                onChange={(event) => setName(event.target.value)}
                onBlur={handleNameBlur}
              />
              {errors.name && <p className={style.errorText}>{errors.name}</p>}
            </div>
          )}
          <div className={style.formFieldBox}>
            <label htmlFor={config.email.name}></label>
            <input
              className={concatClassNames([
                style.field,
                errors.email && style.fieldError,
              ])}
              type="email"
              name={config.email.name}
              placeholder={config.email.placeholder}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={handleEmailBlur}
            />
            {errors.email && <p className={style.errorText}>{errors.email}</p>}
          </div>
          <div className={style.formFieldBox}>
            <label htmlFor={config.password.name}></label>
            <input
              className={concatClassNames([
                style.field,
                errors.password && style.fieldError,
              ])}
              type="password"
              name={config.password.name}
              placeholder={config.password.placeholder}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={handlePasswordBlur}
            />
            {errors.password && (
              <p className={style.errorText}>{errors.password}</p>
            )}
          </div>
          <div className={style.buttonGroup}>
            {isLoginMode() && (
              <button className={style.submitButton} onClick={toggleMode}>
                {LANGUAGES.ru.loginToRegistration}
              </button>
            )}
            {!isLoginMode() && (
              <button className={style.submitButton} onClick={toggleMode}>
                {LANGUAGES.ru.registrationToLogin}
              </button>
            )}
            <button className={style.submitButton} type="submit">
              {isLoginMode()
                ? LANGUAGES.ru.submitLogin
                : LANGUAGES.ru.submitRegistration}
            </button>
          </div>
        </form>
      </div>
      <div className={concatClassNames([style.errorPopup, serverError && style.showPopup])}>
        <p className={style.errorPopupMessage}>{serverError}</p>
      </div>
    </>
  );
}
