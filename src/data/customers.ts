import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicmFycmx2dm12a3h4enJlYWlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTcxMDA1MywiZXhwIjoyMDY1Mjg2MDUzfQ.pL1ezVssQVt1guYHMtjTHfZVwr1yJMMOeDV6BKbirgw" // ✅ Required for admin.listUsers()
);
export const fetchCustomers = async ({ search = "" }) => {
  let query = supabase.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching customers:", error.message);
    return {
      data: [],
      total: 0,
    };
  }

  // Filter client-side since Supabase Admin API doesn't support search
  const filtered = data.users.filter((user) =>
    [user.email, user.user_metadata?.name]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return {
    data: filtered,
    total: filtered.length,
  };
};
