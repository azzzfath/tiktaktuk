import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import pool from "@/lib/supabase";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getApiSessionUser();

  if (!user || !userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses mengedit venue." }, { status: 403 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { venue_name, capacity, address, city, hasReservedSeating } = body;

    const query = `
      UPDATE venue 
      SET venue_name = $1, capacity = $2, address = $3, city = $4, has_reserved_seating = $5
      WHERE venue_id = $6 
      RETURNING *
    `;
    const values = [venue_name.trim(), capacity, address, city, hasReservedSeating, id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Venue tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error("PUT Venue Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getApiSessionUser();

  if (!user || !userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses menghapus venue." }, { status: 403 });
  }

  try {
    const { id } = params;

    // Catatan: Jika venue sudah dipakai di tabel 'event', 
    // query ini mungkin akan error karena Foreign Key Constraint.
    const query = "DELETE FROM venue WHERE venue_id = $1 RETURNING *";
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Venue tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Venue berhasil dihapus" });
  } catch (error: any) {
    console.error("DELETE Venue Error:", error);
    // Jika error karena masih dipakai di tabel lain
    if (error.code === '23503') {
        return NextResponse.json({ error: "Venue tidak bisa dihapus karena masih digunakan oleh acara aktif." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}