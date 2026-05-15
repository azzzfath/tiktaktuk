import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { createVenue, listVenues } from "@/lib/tk04-data";

export async function GET() {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await listVenues());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memuat venue." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses membuat venue." }, { status: 403 });
  }

  try {
    const venue = await createVenue(await request.json());
    return NextResponse.json(venue, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal membuat venue." },
      { status: 500 }
    );
  }
}
