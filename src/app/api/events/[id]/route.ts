import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import pool from "@/lib/supabase"; // Pool raw SQL

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getApiSessionUser();

  if (!user || !userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses mengedit acara." }, { status: 403 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { event_title, event_date, event_time, venue_id } = body;

    const event_datetime = `${event_date} ${event_time}:00`;

    // Validasi kepemilikan acara sebelum update
    if (user.role === "organizer") {
      const orgResult = await pool.query("SELECT organizer_id FROM organizer WHERE user_id = $1", [user.userId]);
      const userOrganizerId = orgResult.rows[0]?.organizer_id;

      const evtResult = await pool.query("SELECT organizer_id FROM event WHERE event_id = $1", [id]);
      const eventOrganizerId = evtResult.rows[0]?.organizer_id;

      if (userOrganizerId !== eventOrganizerId) {
        return NextResponse.json({ error: "Anda hanya bisa mengedit acara milik sendiri." }, { status: 403 });
      }
    }

    const query = `
      UPDATE event 
      SET event_title = $1, event_datetime = $2, venue_id = $3 
      WHERE event_id = $4 
      RETURNING *
    `;
    const values = [event_title.trim(), event_datetime, venue_id, id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Acara tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);

  } catch (error: any) {
    console.error("PUT Event Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getApiSessionUser();

  if (!user || !userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses menghapus acara." }, { status: 403 });
  }

  try {
    const { id } = params;

    // Validasi kepemilikan acara sebelum dihapus
    if (user.role === "organizer") {
      const orgResult = await pool.query("SELECT organizer_id FROM organizer WHERE user_id = $1", [user.userId]);
      const userOrganizerId = orgResult.rows[0]?.organizer_id;

      const evtResult = await pool.query("SELECT organizer_id FROM event WHERE event_id = $1", [id]);
      const eventOrganizerId = evtResult.rows[0]?.organizer_id;

      if (userOrganizerId !== eventOrganizerId) {
        return NextResponse.json({ error: "Anda hanya bisa menghapus acara milik sendiri." }, { status: 403 });
      }
    }

    const query = "DELETE FROM event WHERE event_id = $1 RETURNING *";
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Acara tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Acara berhasil dihapus", deleted: rows[0] });

  } catch (error: any) {
    console.error("DELETE Event Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}