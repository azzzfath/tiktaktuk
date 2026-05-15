import { NextResponse } from "next/server";
import { getApiSessionUser, userHasRole } from "@/lib/api-session";
import { deleteOrder, updateOrderStatus } from "@/lib/tk04-data";

interface OrderRouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: OrderRouteContext) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses mengubah order." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const { status } = await request.json();
    const order = await updateOrderStatus(id, status);

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memperbarui order." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: OrderRouteContext) {
  const user = await getApiSessionUser();

  if (!userHasRole(user, ["administrator"])) {
    return NextResponse.json({ error: "Anda tidak memiliki akses menghapus order." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const order = await deleteOrder(id);

    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menghapus order." },
      { status: 500 }
    );
  }
}
