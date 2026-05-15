import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { getSupabaseServerClient } from "@/lib/db";

export async function GET() {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServerClient();
    const [{ data: seats, error: seatError }, { data: venues, error: venueError }, { data: relationships, error: relationError }] =
      await Promise.all([
        supabase.from("seat").select("seat_id, section, row_number, seat_number, venue_id"),
        supabase.from("venue").select("venue_id, venue_name"),
        supabase.from("has_relationship").select("seat_id"),
      ]);

    if (seatError || venueError || relationError) {
      throw new Error(seatError?.message || venueError?.message || relationError?.message);
    }

    const venueNames = new Map((venues ?? []).map((venue) => [venue.venue_id, venue.venue_name]));
    const occupiedSeats = new Set((relationships ?? []).map((relationship) => relationship.seat_id));
    const rows = (seats ?? [])
      .map((seat) => ({
        ...seat,
        venue_name: venueNames.get(seat.venue_id) ?? "-",
        is_occupied: occupiedSeats.has(seat.seat_id),
      }))
      .sort((a, b) => `${a.venue_name}${a.section}${a.row_number}${a.seat_number}`.localeCompare(`${b.venue_name}${b.section}${b.row_number}${b.seat_number}`));

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memuat kursi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses membuat kursi." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { venue_id, section, row_number, seat_number } = body;

    if (!venue_id || !section || !row_number || !seat_number) {
      return NextResponse.json({ error: "Venue, section, baris, dan nomor kursi wajib diisi." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("seat")
      .insert({ venue_id, section: section.trim(), row_number: row_number.trim(), seat_number: seat_number.trim() })
      .select("seat_id")
      .single<{ seat_id: string }>();

    if (error || !data) {
      throw new Error(error?.message || "Gagal membuat kursi.");
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal membuat kursi." }, { status: 500 });
  }
}
