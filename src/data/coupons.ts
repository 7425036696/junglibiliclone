import { supabase } from "@/lib/supbase";
export const fetchCoupons = async ({
  search = "",
}: {
  search?: string;
}) => {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", `%${search}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return {
    data,
    total: data.length,
  };
};
