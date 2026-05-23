import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessions";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

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

  try {
    const body = await request.json();
    const { completedModules, currentModule } = body as {
      completedModules: string[];
      currentModule?: string;
    };

    if (!Array.isArray(completedModules)) {
      return NextResponse.json({ error: "completedModules must be an array" }, { status: 400 });
    }

    const upserts = completedModules.map((moduleId: string) => ({
      user_id: session.userId,
      username: session.username,
      module_id: moduleId,
      completed: true,
      completed_at: new Date().toISOString(),
    }));

    await supabaseAdmin.from("user_progress").upsert(upserts, {
      onConflict: "user_id,module_id",
    });

    return NextResponse.json({ success: true, synced: completedModules.length });
  } catch (err) {
    console.error("[Progress Sync] Error:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ completedModules: [] });
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/odf_session=([^;]+)/);

  if (!match) {
    return NextResponse.json({ completedModules: [] });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) return Response.json({ error: "Server misconfigured" }, { status: 500 });
  const session = getSession(match[1], secret);

  if (!session) {
    return NextResponse.json({ completedModules: [] });
  }

  const { data } = await supabaseAdmin
    .from("user_progress")
    .select("module_id")
    .eq("user_id", session.userId)
    .eq("completed", true);

  return NextResponse.json({
    completedModules: (data || []).map((r: any) => r.module_id),
  });
}
