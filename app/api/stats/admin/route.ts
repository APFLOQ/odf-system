import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessions";
import { getAdminStats } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/odf_session=([^;]+)/);

  if (!match) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) return Response.json({ error: "Server misconfigured" }, { status: 500 });
  const session = getSession(match[1], secret);

  if (!session) {
    return NextResponse.json({ error: "invalid session" }, { status: 401 });
  }

  if (!session.isAdmin) {
    return NextResponse.json({ error: "admin only" }, { status: 403 });
  }

  const stats = await getAdminStats();

  if (!stats) {
    return NextResponse.json(
      {
        error: "stats not available",
        message: "Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(stats);
}
