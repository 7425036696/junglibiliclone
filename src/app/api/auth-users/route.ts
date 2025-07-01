import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Safe only on server
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Apply search filter manually (name, email, phone)
  const filtered = data.users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.email?.toLowerCase().includes(q) ||
      user.phone?.includes(q) ||
      user.user_metadata?.name?.toLowerCase().includes(q)
    );
  });

  return Response.json(filtered);
}
