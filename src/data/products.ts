// fetchProducts.ts
import { supabase } from "@/lib/supbase";
export const fetchProducts = async ({
  page = 1,
  perPage = 10,
  search = "",
  category = "",
  sort = "",
}) => {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .range(from, to);

  if (search) query = query.ilike("name", `%${search}%`);
  if (category) query = query.eq("category", category);
  if (sort === "low") query = query.order("price", { ascending: true });
  if (sort === "high") query = query.order("price", { ascending: false });
  if (sort === "date-added-asc") query = query.order("created_at", { ascending: true });
  if (sort === "date-added-desc") query = query.order("created_at", { ascending: false });

  const { data, count, error } = await query;
  if (error) {
    console.error("Supabase Error:", error.message);
    return { data: [], total: 0, page, perPage };
  }

  return { data, total: count || 0, page, perPage };
};
