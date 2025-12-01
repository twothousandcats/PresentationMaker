import { account } from './appwriteClient.ts';
import { getRandomId } from '../store/utils/functions.ts';
import { LANGUAGES } from '../store/utils/langs.ts';
import type { AppwriteException } from '../store/types/utility-interfaces.ts';

export type Credentials = {
  email: string;
  password: string;
};

export type UserData = Credentials & {
  name: string;
}

/*
const LS_KEYS = {
  isAuth: 'isAuth',
};

export async function isAuth (): Promise<boolean> {
  return localStorage.getItem(LS_KEYS.isAuth) === 'true'
}

export async function login() {
  localStorage.setItem(LS_KEYS.isAuth, 'true');
}

export async function register() {
  localStorage.setItem(LS_KEYS.isAuth, 'true');
} */

export async function register(
  {
    email,
    password,
    name,
  }: UserData
) {
  try {
    const user = await account.create(
      {
        userId: getRandomId(),
        email,
        password,
        name
      }
    );
    console.log(user);
    // auto login
    await account.createEmailPasswordSession({ email, password });
    return {
      success: true,
    }
  } catch (error) {
    const appwriteError = error as AppwriteException;
    return {
      success: false,
      message: appwriteError.message || LANGUAGES.ru.serverErrorRegisterFallback,
    }
  }
};

export async function login(
  {
    email,
    password
  }: Credentials
) {
  try {
    const result = await account.createEmailPasswordSession({email, password});
    console.log(result);
    return {
      success: true,
    }
  } catch (error) {
    const appwriteError = error as AppwriteException;
    return {
      success: false,
      message: appwriteError.message || LANGUAGES.ru.serverErrorLoginFallback,
    }
  }
};

export async function logout() {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export async function isAuthenticated() {
  try {
    await account.get();
    return true;
  } catch {
    return false;
  }
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}