import { NextResponse } from "next/server";
import { findPromotionByCode } from "@/lib/tk04-data";

interface PromotionValidateContext {
  params: Promise<{ code: string }>;
}

export async function GET(_request: Request, context: PromotionValidateContext) {
  try {
    const { code } = await context.params;
    const promotion = await findPromotionByCode(code);

    if (!promotion) {
      return NextResponse.json({ error: "Kode promo tidak valid." }, { status: 404 });
    }

    return NextResponse.json(promotion);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memvalidasi promo." },
      { status: 500 }
    );
  }
}
