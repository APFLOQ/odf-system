import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const DISCORD_API_URL = "https://discord.com/api/v10";

  console.log("=== CALLBACK START ===");

  if (error) {
    console.log("OAuth error:", error, errorDescription);
    return NextResponse.redirect(new URL(`/?auth=error&msg=${encodeURIComponent(errorDescription || error)}`, request.url));
  }

  if (!code) {
    console.log("No code provided - user cancelled or OAuth issue");
    return NextResponse.redirect(new URL("/?auth=cancelled", request.url));
  }

  const CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
  const GUILD_ID = process.env.DISCORD_GUILD_ID || "";
  const SESSION_SECRET = process.env.SESSION_SECRET;
  if (!SESSION_SECRET) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  const REDIRECT_URI = (process.env.APP_URL || "https://odf-sigma.vercel.app") + "/api/auth/callback";

  console.log("CLIENT_ID configured:", !!CLIENT_ID);
  console.log("BOT_TOKEN configured:", !!BOT_TOKEN);
  console.log("GUILD_ID configured:", GUILD_ID);

  try {
    console.log("Exchanging code for token...");

    const tokenRes = await fetch(`${DISCORD_API_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.log("Token exchange failed:", tokenRes.status, errText);
      return NextResponse.redirect(new URL(`/?auth=failed&msg=token_error`, request.url));
    }

    const tokenData = await tokenRes.json();
    console.log("Token obtained successfully");

    const userRes = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      console.log("Failed to get user:", userRes.status);
      return NextResponse.redirect(new URL("/?auth=failed&msg=user_error", request.url));
    }

    const discordUser = await userRes.json();
    console.log("User fetched:", discordUser.username, discordUser.id);

    let isMember = false;
    if (GUILD_ID && BOT_TOKEN) {
      console.log("Checking membership in guild:", GUILD_ID);
      try {
        const memberRes = await fetch(`${DISCORD_API_URL}/guilds/${GUILD_ID}/members/${discordUser.id}`, {
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });
        console.log("Membership check status:", memberRes.status);
        isMember = memberRes.ok;
      } catch (e) {
        console.log("Membership check error:", e);
      }
    } else {
      console.log("GUILD_ID or BOT_TOKEN not configured - granting member access");
      isMember = true;
    }

    const isAdmin = (process.env.ADMIN_DISCORD_IDS || "").split(",").includes(discordUser.id);
    console.log("isMember:", isMember, "isAdmin:", isAdmin);

    const sessionToken = createSession(
      {
        id: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator || "0",
        avatar: discordUser.avatar || "",
        email: discordUser.email || "",
        isMember,
        isAdmin,
      },
      SESSION_SECRET
    );

    console.log("Session created, redirecting to dashboard...");

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("odf_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(new URL(`/?auth=failed&msg=${encodeURIComponent(String(err))}`, request.url));
  }
}
