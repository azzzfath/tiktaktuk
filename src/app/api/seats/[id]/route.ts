import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { getSupabaseServerClient } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses mengubah kursi." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { venue_id, section, row_number, seat_number } = await request.json();

    if (!venue_id || !section || !row_number || !seat_number) {
      return NextResponse.json({ error: "Venue, section, baris, dan nomor kursi wajib diisi." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("seat")
      .update({ venue_id, section: section.trim(), row_number: row_number.trim(), seat_number: seat_number.trim() })
      .eq("seat_id", id)
      .select("seat_id")
      .single<{ seat_id: string }>();

    if (error || !data) {
      return NextResponse.json({ error: "Kursi tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ message: "Kursi berhasil diperbarui." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memperbarui kursi." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses menghapus kursi." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();
    const { data: relation } = await supabase
      .from("has_relationship")
      .select("seat_id")
      .eq("seat_id", id)
      .maybeSingle<{ seat_id: string }>();

    if (relation) {
      const { data: seat } = await supabase
        .from("seat")
        .select("section, row_number, seat_number")
        .eq("seat_id", id)
        .single<{ section: string; row_number: string; seat_number: string }>();
      return NextResponse.json(
        {
          error: `Kursi ${seat?.section ?? ""} - Baris ${seat?.row_number ?? ""} No. ${seat?.seat_number ?? ""} tidak dapat dihapus karena sudah terisi.`,
        },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("seat").delete().eq("seat_id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "Kursi berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menghapus kursi." }, { status: 500 });
  }
}
