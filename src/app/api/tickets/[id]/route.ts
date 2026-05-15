import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { getSupabaseServerClient } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiSessionUser();

  if (!user || !userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses untuk mengubah tiket." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { seat_id } = await request.json();
    const supabase = getSupabaseServerClient();

    if (user.role === "organizer") {
      const { data: ticketData } = await supabase
        .from("ticket")
        .select("ticket_category(event(organizer_id))")
        .eq("ticket_id", id)
        .single<any>();
      const { data: orgData } = await supabase
        .from("organizer")
        .select("organizer_id")
        .eq("user_id", user.userId)
        .single();
        
      if (ticketData?.ticket_category?.event?.organizer_id !== orgData?.organizer_id) {
        return NextResponse.json({ error: "Akses ditolak. Tiket ini bukan milik event Anda." }, { status: 403 });
      }
    }

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

  if (!user || !userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses untuk menghapus tiket." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();
    
    if (user.role === "organizer") {
      const { data: ticketData } = await supabase
        .from("ticket")
        .select("ticket_category(event(organizer_id))")
        .eq("ticket_id", id)
        .single<any>();
      const { data: orgData } = await supabase
        .from("organizer")
        .select("organizer_id")
        .eq("user_id", user.userId)
        .single();
        
      if (ticketData?.ticket_category?.event?.organizer_id !== orgData?.organizer_id) {
        return NextResponse.json({ error: "Akses ditolak. Tiket ini bukan milik event Anda." }, { status: 403 });
      }
    }

    await supabase.from("has_relationship").delete().eq("ticket_id", id);
    const { error } = await supabase.from("ticket").delete().eq("ticket_id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Tiket berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menghapus tiket." }, { status: 500 });
  }
}
