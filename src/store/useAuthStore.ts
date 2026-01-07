import { create } from "zustand";

interface AuthState {
  email: string;
  password: string;
  name: string;
  isSignUp: boolean;
  isLoading: boolean;
  error: string | null;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setName: (name: string) => void;
  //   toggleMode: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSignUp: (isSignUp: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  password: "",
  name: "",
  isSignUp: false,
  isLoading: false,
  error: null,

  setEmail: (email) => set({ email }),

  setPassword: (password) => set({ password }),

  setName: (name) => set({ name }),

  //   toggleMode: () =>
  //     set((state) => ({
  //       isSignUp: !state.isSignUp,
  //       error: null,
  //     })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsSignUp: (isSignUp) => set({ isSignUp }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      email: "",
      password: "",
      name: "",
      isSignUp: false,
      isLoading: false,
      error: null,
    }),
}));
