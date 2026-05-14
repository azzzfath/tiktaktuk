import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteSession, sessionCookieName } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(sessionCookieName)?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
