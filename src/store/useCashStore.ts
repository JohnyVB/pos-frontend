import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import type { CashBoxSession } from '../interfaces/pages/CashBoxSessions.interface';

interface CashStore {
  cashBoxSession: CashBoxSession | null
  currentAmount: number
  setCashBoxSession: (cashBoxSession: CashBoxSession | null) => void
  setCurrentAmount: (amount: number) => void
}

const useCashStore = create<CashStore>()(
  persist(
    (set) => ({
      cashBoxSession: null,
      currentAmount: 0,
      setCashBoxSession: (cashBoxSession: CashBoxSession | null) => set({ cashBoxSession }),
      setCurrentAmount: (amount: number) => set({ currentAmount: amount }),
    }),
    {
      name: "cash-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCashStore;
