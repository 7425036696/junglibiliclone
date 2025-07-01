import { supabase } from "@/lib/supbase"; // fixed typo
export type Order = {
  id: string;
  user_id: string | null;
  status: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  coupon_code?: string;
  created_at: string;
  updated_at?: string;  
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
  };
};

export async function fetchOrders({
  search = "",
  status = "",
  paymentMethod = "",
  startDate,
  endDate,
}: {
  search?: string;
  status?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}) {
  let query = supabase.from("orders").select("*", { count: "exact" });

  // Search by shipping_address.name (JSON field)
  if (search) {
    query = query.ilike("shipping_address->>name", `%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (paymentMethod) {
    query = query.eq("payment_method", paymentMethod);
  }

  if (startDate && endDate) {
    query = query.gte("created_at", startDate).lte("created_at", endDate);
  }

  const { data, count, error } = await query;

  if (error) throw new Error(error.message);

  return {
    data: data as Order[],
    total: count ?? 0,
    pagination: {
      page: 1,
      pages: 1,
      perPage: 10,
      current: 1,
      items: count ?? 0,
    },
  };
}

export async function fetchOrder(id: string) {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) throw new Error("Order not found");

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*, product:product_id(name)") // 👈 join with products
    .eq("order_id", id);

  if (itemsError) throw new Error("Order items not found");

  return { ...order, items };
}
