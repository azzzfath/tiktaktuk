import { NextResponse } from "next/server";
import { getApiSessionUser } from "@/lib/api-session";
import { createOrderForCustomer, listOrdersForUser } from "@/lib/tk04-data";

export async function GET() {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await listOrdersForUser(user));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memuat order." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getApiSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "customer") {
    return NextResponse.json({ error: "Hanya customer yang dapat membuat order." }, { status: 403 });
  }

  try {
    const order = await createOrderForCustomer(user, await request.json());
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal membuat order." },
      { status: 500 }
    );
  }
}
