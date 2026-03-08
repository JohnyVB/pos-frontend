export type inventoryType = {
  id: number;
  productId: number;
  quantity: number;
  created_at: string;
};

export type inventoryFormType = {
  productId: string;
  quantity: string;
};
