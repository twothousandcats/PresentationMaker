import * as React from 'react';
import { useState } from 'react';
import type { AuthMode } from '../../store/types/utility-types.ts';
import { login, register } from '../../lib/authService.ts';
import { useNavigate } from 'react-router-dom';
import { PAGES_URL } from '../../store/utils/config.ts';
import style from './AuthPage.module.css';
import ThemeSwitcher from '../../components/ThemeSwitcher/ThemeSwitcher.tsx';
import { LANGUAGES } from '../../store/utils/langs.ts';

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
  const [error, setError] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const isLoginMode = () => {
    return mode === 'login';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isLoginMode()) {
        console.log({ email, password });
        result = await login({ email, password });
      } else {
        console.log({ email, password, name });
        result = await register({ email, password, name });
      }

      if (result.success) {
        navigate(PAGES_URL.collectionPage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.logoWrapper}>
        <h1 className={style.logo}>{LANGUAGES.ru.projectName}</h1>
      </div>
      {
        // <ThemeSwitcher />
        // TODO: можно ли убрать ul из ThemeSwitcher?
        // TODO: Добавить UserIcon на уровень ThemeSwitcher (hexBgByUserName)
        // TODO: Добавить LogoutBtn на уровень ThemeSwitcher
      }
      <form onSubmit={handleSubmit} className={style.form}>
        {isLoginMode() ? (
          <h2 className={style.formHeading}>
            {LANGUAGES.ru.loginTitle}
          </h2>
        ) : (
          <h2 className={style.formHeading}>
            {LANGUAGES.ru.registrationTitle}
          </h2>
        )}
        {!isLoginMode() && (
          <div className={style.formFieldBox}>
            <label htmlFor={config.name.name}></label>
            <input
              className={style.field}
              type="text"
              name={config.name.name}
              placeholder={config.name.placeholder}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        )}
        <div className={style.formFieldBox}>
          <label htmlFor={config.email.name}></label>
          <input
            className={style.field}
            type="email"
            name={config.email.name}
            placeholder={config.email.placeholder}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={style.formFieldBox}>
          <label htmlFor={config.password.name}></label>
          <input
            className={style.field}
            type="password"
            name={config.password.name}
            placeholder={config.password.placeholder}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {isLoginMode() && (
          <button
            className={style.submitButton}
            onClick={() => setMode('register')}
          >
            {LANGUAGES.ru.loginToRegistration}
          </button>
        )}
        <button className={style.submitButton} type="submit">
          {isLoginMode()
            ? LANGUAGES.ru.submitLogin
            : LANGUAGES.ru.submitRegistration}
        </button>
      </form>
    </div>
  );
}
