import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessions";
import { trackAction, ActionType } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, metadata } = body as { action: ActionType; metadata?: Record<string, string | number | boolean> };

    if (!action) {
      return NextResponse.json({ error: "action required" }, { status: 400 });
    }

    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/odf_session=([^;]+)/);

    let userId = "anonymous";
    let username = "anonymous";

    if (match) {
      const secret = process.env.SESSION_SECRET;
      const session = secret ? getSession(match[1], secret) : null;
      if (session) {
        userId = session.userId;
        username = session.username;
      }
    }

    await trackAction(userId, username, { action, metadata });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Stats Track] Error:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
