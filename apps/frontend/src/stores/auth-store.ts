import { create } from 'zustand';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';

export const ACCESS_TOKEN = 'hris_access_token';

interface AuthUser {
  name: string;
  avatarUrl: string;
  createdAt: string;
  email: string;
  id: string;
  isActive: boolean;
  role: string;
  updatedAt: string;
}

interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    setAccessToken: (accessToken: string, refreshToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN);
  const initToken = cookieState ? JSON.parse(cookieState) : '';
  return {
    auth: {
      user: null,
      setUser: (user) => set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken, refreshToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken));
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          return { ...state, auth: { ...state.auth, accessToken, refreshToken } };
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: '', refreshToken: '' } };
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', refreshToken: '' },
          };
        }),
    },
  };
});
