import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { getSupabaseServerClient } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator"])) {
    return NextResponse.json({ error: "Hanya administrator yang dapat mengubah tiket." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { seat_id } = await request.json();
    const supabase = getSupabaseServerClient();

    await supabase.from("has_relationship").delete().eq("ticket_id", id);

    if (seat_id) {
      const { data: existing } = await supabase
        .from("has_relationship")
        .select("seat_id")
        .eq("seat_id", seat_id)
        .maybeSingle<{ seat_id: string }>();

      if (existing) {
        throw new Error("Kursi sudah terisi oleh tiket lain.");
      }

      const { error } = await supabase.from("has_relationship").insert({ seat_id, ticket_id: id });

      if (error) throw new Error(error.message);
    }

    return NextResponse.json({ message: "Tiket berhasil diperbarui." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memperbarui tiket." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator"])) {
    return NextResponse.json({ error: "Hanya administrator yang dapat menghapus tiket." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();
    await supabase.from("has_relationship").delete().eq("ticket_id", id);
    const { error } = await supabase.from("ticket").delete().eq("ticket_id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Tiket berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menghapus tiket." }, { status: 500 });
  }
}
