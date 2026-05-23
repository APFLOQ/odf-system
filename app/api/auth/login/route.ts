import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = crypto.randomUUID();
  const clientId = "1504945911850205205";
  const redirectUri = "https://odf-sigma.vercel.app/api/auth/callback";
  const scopes = "guilds.members.read identify email";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes,
    state,
  });
  const oauthUrl = `https://discord.com/oauth2/authorize?${params.toString()}`;
  
  console.log("OAuth URL:", oauthUrl);
  
  // Return a redirect instead of JSON
  return NextResponse.redirect(oauthUrl);
}
