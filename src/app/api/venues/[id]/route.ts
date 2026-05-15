import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { deleteVenue, updateVenue } from "@/lib/tk04-data";

interface VenueRouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: VenueRouteContext) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses mengubah venue." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const venue = await updateVenue(id, await request.json());

    if (!venue) {
      return NextResponse.json({ error: "Venue tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(venue);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memperbarui venue." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: VenueRouteContext) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator", "organizer"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses menghapus venue." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const venue = await deleteVenue(id);

    if (!venue) {
      return NextResponse.json({ error: "Venue tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(venue);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menghapus venue." },
      { status: 500 }
    );
  }
}
