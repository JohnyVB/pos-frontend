import type { Sale, SaleItem } from "../../pages/Sales-history.interface";

export interface ReturnModalProps {
  show: boolean
  onHide: () => void
  selectedSale: Sale | null
  handleConfirmReturn: (items: ReturnedItem[]) => void
}

export interface ReturnedItem extends SaleItem {
  reintegrate: boolean
}