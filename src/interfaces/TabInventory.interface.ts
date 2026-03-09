export interface inventoryType {
  id: number;
  productId: number;
  quantity: number;
  created_at: string;
}

export interface inventoryFormType {
  productId: string;
  quantity: string;
}
