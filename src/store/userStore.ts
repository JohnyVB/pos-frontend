import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../interfaces/global.interface";

interface UserStore {
  token: string | null;
  userData: User | null;
  setToken: (token: string | null) => void;
  setUserData: (user: User | null) => void;
}

const userStore = create<UserStore>()(
  persist(
    (set) => ({
      token: null,
      userData: null,

      setToken: (token: string | null) => set({ token }),
      setUserData: (user: User | null) => set({ userData: user }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default userStore;
