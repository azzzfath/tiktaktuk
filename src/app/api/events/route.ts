import { NextResponse } from "next/server";
import { listEvents } from "@/lib/tk04-data";

export async function GET() {
  try {
    return NextResponse.json(await listEvents());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memuat event." },
      { status: 500 }
    );
  }
}
