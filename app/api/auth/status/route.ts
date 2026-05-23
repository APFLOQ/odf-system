import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return Response.json({ authenticated: false });
  
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/odf_session=([^;]+)/);
  
  if (!match) {
    return NextResponse.json({ authenticated: false });
  }

  const session = getSession(match[1], secret);
  
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const avatarUrl = session.avatar 
    ? `https://cdn.discordapp.com/avatars/${session.userId}/${session.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(session.userId) >> BigInt(22)) % BigInt(6))}.png`;

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      username: session.username,
      avatar: avatarUrl,
      email: session.email,
      isMember: session.isMember,
      isAdmin: session.isAdmin,
    },
  });
}
