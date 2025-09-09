import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  userId: number;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setToken: (token) => {
        try {
          const decodedUser = jwtDecode<User>(token);
          set({
            token,
            user: decodedUser,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Falha ao decodificar o token:", error);
          set({ token: null, user: null, isAuthenticated: false });
        }
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-cubos-movies', 
      partialize: (state) => ({ token: state.token }),
    }
  )
);