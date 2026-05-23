import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function logoutResponse(request: Request) {
  const url = new URL("/", process.env.APP_URL || "http://localhost:3000");
  const response = NextResponse.redirect(url);
  response.cookies.set("odf_session", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function GET(request: Request) {
  return logoutResponse(request);
}

export async function POST(request: Request) {
  return logoutResponse(request);
}
