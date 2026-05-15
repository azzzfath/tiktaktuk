import { NextResponse } from "next/server";
import { getApiSessionUser } from "@/lib/api-session";
import { getSupabaseServerClient } from "@/lib/db";

export async function GET() {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("venue")
      .select("venue_id, venue_name")
      .order("venue_name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ venues: data ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memuat venue." }, { status: 500 });
  }
}
