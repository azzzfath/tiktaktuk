import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { deletePromotion, updatePromotion } from "@/lib/tk04-data";

interface PromotionRouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: PromotionRouteContext) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses mengubah promo." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const promotion = await updatePromotion(id, await request.json());

    if (!promotion) {
      return NextResponse.json({ error: "Promo tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(promotion);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memperbarui promo." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: PromotionRouteContext) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses menghapus promo." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const promotion = await deletePromotion(id);

    if (!promotion) {
      return NextResponse.json({ error: "Promo tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(promotion);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menghapus promo." },
      { status: 500 }
    );
  }
}
