import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { createPromotion, listPromotions } from "@/lib/tk04-data";

export async function GET() {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await listPromotions());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memuat promo." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses membuat promo." }, { status: 403 });
  }

  try {
    const promotion = await createPromotion(await request.json());
    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal membuat promo." },
      { status: 500 }
    );
  }
}
