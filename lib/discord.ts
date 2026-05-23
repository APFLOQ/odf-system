interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
}

const DISCORD_API = "https://discord.com/api/v10";

export async function exchangeCode(code: string, redirectUri: string): Promise<DiscordTokenResponse> {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId || "",
      client_secret: clientSecret || "",
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Discord token exchange failed: ${err}`);
  }

  return res.json();
}

export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Failed to fetch Discord user");
  return res.json();
}

export async function checkMembership(userId: string): Promise<boolean> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) return false;

  try {
    const res = await fetch(`${DISCORD_API}/guilds/${guildId}/members/${userId}`, {
      headers: { Authorization: `Bot ${botToken}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function buildOAuthUrl(state: string): string {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = (process.env.APP_URL || "http://localhost:3000") + "/api/auth/callback";
  const scopes = "guilds.members.read identify";
  const params = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes,
    state,
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}