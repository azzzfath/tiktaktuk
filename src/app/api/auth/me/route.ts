import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
