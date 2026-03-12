import { create } from 'zustand';
import type { CashBox } from '../interfaces/pages/CashBoxes.interface';

interface CashStore {
  cashBox: CashBox | null
  currentAmount: number
  setCashBox: (cashBox: CashBox | null) => void
  setCurrentAmount: (amount: number) => void
}

export const useCashStore = create<CashStore>((set) => ({
  cashBox: null,
  currentAmount: 0,
  setCashBox: (cashBox: CashBox | null) => set({ cashBox }),
  setCurrentAmount: (amount: number) => set({ currentAmount: amount }),
}))
