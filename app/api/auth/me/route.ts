import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return Response.json({ user: null }, { status: 401 });
  
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/odf_session=([^;]+)/);
  
  if (!match) {
    return NextResponse.json({ 
      authenticated: false, 
      isMember: false, 
      isAdmin: false 
    });
  }

  const session = getSession(match[1], secret);
  
  if (!session) {
    return NextResponse.json({ 
      authenticated: false, 
      isMember: false, 
      isAdmin: false 
    });
  }

  console.log("me route - session isMember:", session.isMember, "isAdmin:", session.isAdmin);

  return NextResponse.json({
    authenticated: true,
    isMember: session.isMember,
    isAdmin: session.isAdmin,
    username: session.username,
    avatar: session.avatar,
  });
}
