import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      userInfo: null,
      
      // Rename this from setLogin to setUserInfo
      setUserInfo: (data) => set({ userInfo: data }),
      
      logout: () => {
        set({ userInfo: null });
        // No need to manually clear localStorage, persist handles it
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);