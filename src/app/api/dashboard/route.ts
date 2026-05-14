import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDashboardData, getSessionUser, sessionCookieName } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    return NextResponse.json({ message: "Session tidak valid." }, { status: 401 });
  }

  const dashboard = await getDashboardData(user);

  return NextResponse.json({ dashboard });
}
