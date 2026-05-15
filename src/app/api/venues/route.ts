import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import pool from "@/lib/supabase";

// GET: Mengambil semua daftar Venue
export async function GET() {
  const user = await getApiSessionUser();

  // Proteksi session (hanya user login yang bisa lihat daftar venue)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const query = 'SELECT * FROM venue ORDER BY venue_name ASC';
    const { rows } = await pool.query(query);
    
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET Venues Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Membuat Venue baru
export async function POST(request: Request) {
  const user = await getApiSessionUser();

  // Hanya Admin atau Organizer yang bisa menambah venue
  if (!user || !userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses membuat venue." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { venue_name, capacity, address, city, hasReservedSeating } = body;

    // Validasi input
    if (!venue_name || !capacity || !city) {
      return NextResponse.json(
        { error: 'Nama venue, kapasitas, dan kota wajib diisi.' }, 
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO venue (venue_name, capacity, address, city, has_reserved_seating) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [
      venue_name.trim(), 
      capacity, 
      address?.trim() || null, 
      city.trim(), 
      hasReservedSeating || false
    ];

    const { rows } = await pool.query(query, values);
    
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    console.error("POST Venue Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}