export type OrderStatus = "pending" | "processing" | "delivered" | "cancel";
export type OrderMethod = "cash" | "card" | "credit";

export type Order = {
  id: string;
  invoiceNo: string;
  orderTime: Date | string;
  customerName: string;
  method: OrderMethod;
  amount: string;
  status: OrderStatus;
  subRows?: Order[];
};
export interface OrderItem {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
}
