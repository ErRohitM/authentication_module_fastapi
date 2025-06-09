import axios from 'axios';
import { authAtom, IAuth, IUser } from '../recoil/auth.atom';
import { MutableSnapshot } from 'recoil';

// You can configure this baseURL to match your FastAPI backend
const API = axios.create({
  baseURL: 'http://localhost:8000',
});

// Attach access token to request headers if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token logic (if needed) could be placed in response interceptors

export async function login(name: string, password: string) {
  // According to your statement, login endpoint requires x-www-form-urlencoded
  const formData = new URLSearchParams();
  formData.append('username', name);
  formData.append('password', password);

  const response = await API.post('/api/auth/login', formData);
  return response.data;
}

export async function registerUser(data: {
  name: string;
  password: string;
  email: string;
  phone_number: number;
  address: string;
}) {
  // registration endpoint accepts JSON
  const response = await API.post('/api/auth/register', data);
  return response.data;
}

export async function getUser() {
  const response = await API.get<IUser>('/api/user/me');
  return response.data;
}

export async function updateUser(userData: Partial<IUser>) {
  const response = await API.put<IUser>('/api/user/update', userData);
  return response.data;
}

export function persistTokens(authData: IAuth) {
  if (authData.accessToken) {
    localStorage.setItem('accessToken', authData.accessToken);
  }
  if (authData.refreshToken) {
    localStorage.setItem('refreshToken', authData.refreshToken || '');
  }
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function loadAuthSnapshot({ set }: MutableSnapshot) {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  // Optionally, you could retrieve user data from localStorage

  if (accessToken) {
    set(authAtom, {
      accessToken,
      refreshToken: refreshToken || undefined,
    });
  } else {
    set(authAtom, null);
  }
}
