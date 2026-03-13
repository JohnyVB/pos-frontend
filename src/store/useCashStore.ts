import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import type { CashBox } from '../interfaces/pages/CashBoxes.interface';

interface CashStore {
  cashBox: CashBox | null
  currentAmount: number
  setCashBox: (cashBox: CashBox | null) => void
  setCurrentAmount: (amount: number) => void
}

const useCashStore = create<CashStore>()(
  persist(
    (set) => ({
      cashBox: null,
      currentAmount: 0,
      setCashBox: (cashBox: CashBox | null) => set({ cashBox }),
      setCurrentAmount: (amount: number) => set({ currentAmount: amount }),
    }),
    {
      name: "cash-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCashStore;
