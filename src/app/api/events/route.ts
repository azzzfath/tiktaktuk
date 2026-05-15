import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import pool from "@/lib/supabase"; // Ini adalah pool dari 'pg' yang sudah kita buat

export async function GET() {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let query = `
      SELECT 
        e.*, 
        v.venue_name,
        TO_CHAR(e.event_datetime, 'YYYY-MM-DD') AS event_date,
        TO_CHAR(e.event_datetime, 'HH24:MI') AS event_time
      FROM event e
      LEFT JOIN venue v ON e.venue_id = v.venue_id
    `;
    const values: any[] = [];

    // Jika yang login adalah organizer, pastikan dia hanya bisa melihat acara miliknya
    if (user.role === "organizer") {
      const orgResult = await pool.query("SELECT organizer_id FROM organizer WHERE user_id = $1", [user.userId]);
      const organizerId = orgResult.rows[0]?.organizer_id;

      query += ` WHERE e.organizer_id = $1`;
      values.push(organizerId);
    }

    query += ` ORDER BY e.event_datetime ASC`;

    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows);

  } catch (error: any) {
    console.error("GET Events Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getApiSessionUser();

  if (!user || !userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses membuat acara." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { event_title, event_date, event_time, venue_id } = body;

    if (!event_title || !event_date || !event_time || !venue_id) {
      return NextResponse.json({ error: "Judul acara, tanggal, waktu, dan venue wajib diisi." }, { status: 400 });
    }

    const event_datetime = `${event_date} ${event_time}:00`;
    let organizerId = null;

    // Cari ID Organizer dari tabel organizer jika user role-nya adalah organizer
    if (user.role === "organizer") {
      const orgResult = await pool.query("SELECT organizer_id FROM organizer WHERE user_id = $1", [user.userId]);
      organizerId = orgResult.rows[0]?.organizer_id;
    }

    // Insert menggunakan Parameterized Query
    const query = `
      INSERT INTO event (event_title, event_datetime, venue_id, organizer_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [event_title.trim(), event_datetime, venue_id, organizerId];

    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows[0], { status: 201 });

  } catch (error: any) {
    console.error("POST Event Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}