import axios from 'axios';
import { AuthModel, UserModel } from './_models';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/personal/profile`;
export const GET_PERMISSIONS_BY_URL = `${API_URL}/api/personal/permissions`;
export const LOGIN_URL = `${API_URL}/api/tokens`;
export const REFRESH_URL = `${API_URL}/api/tokens/refresh`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

// Server should return AuthModel
export function login(userName: string, password: string) {
  return axios.post<AuthModel>(
    LOGIN_URL,
    {
      userName,
      password,
    },
    {
      headers: {
        Authorization: null,
        tenant: 'root',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
}

export function refresh(token: string, refreshToken: string) {
  return axios.post<AuthModel>(
    REFRESH_URL,
    {
      token,
      refreshToken,
    },
    {
      headers: {
        tenant: 'root',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
}

// Server should return AuthModel
export function register(email: string, firstname: string, lastname: string, password: string, password_confirmation: string) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken() {
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL);
}
