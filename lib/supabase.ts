import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

export const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

export type ActionType =
  | "login"
  | "logout"
  | "page_view"
  | "module_start"
  | "module_complete"
  | "module_uncomplete"
  | "search"
  | "brain_view";

export interface TrackPayload {
  action: ActionType;
  metadata?: Record<string, string | number | boolean>;
}

export async function trackAction(
  userId: string,
  username: string,
  payload: TrackPayload
): Promise<void> {
  if (!supabaseAdmin) {
    console.log("[Stats] Supabase not configured, skipping track:", payload);
    return;
  }

  const { action, metadata } = payload;

  try {
    await Promise.all([
      supabaseAdmin.from("user_actions").insert({
        user_id: userId,
        username,
        action,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      }),

      (async () => {
        try {
          await supabaseAdmin.rpc("increment_stat", {
            action_name: action,
          });
        } catch {
          return incrementStatFallback(action);
        }
      })(),
    ]);
  } catch (err) {
    console.error("[Stats] Failed to track action:", err);
  }
}

async function incrementStatFallback(action: ActionType): Promise<void> {
  if (!supabaseAdmin) return;

  const fieldMap: Record<ActionType, string> = {
    login: "total_logins",
    logout: "total_logouts",
    page_view: "total_page_views",
    module_start: "total_module_starts",
    module_complete: "total_completions",
    module_uncomplete: "total_uncompletes",
    search: "total_searches",
    brain_view: "total_brain_views",
  };

  const field: string = fieldMap[action];
  if (!field) return;

  try {
    const { data } = await supabaseAdmin
      .from("site_stats")
      .select(field)
      .eq("id", 1)
      .single();

    if (data) {
      const val = ((data as unknown) as Record<string, number | string>)[field] as number || 0;
      await supabaseAdmin
        .from("site_stats")
        .update({ [field]: val + 1, last_updated: new Date().toISOString() })
        .eq("id", 1);
    } else {
      const initial: Record<string, string | number> = { id: 1, last_updated: new Date().toISOString() };
      initial[field] = 1;
      await supabaseAdmin.from("site_stats").insert(initial);
    }
  } catch (err) {
    console.error("[Stats] Fallback increment failed:", err);
  }
}

export interface AdminStats {
  total_visits: number;
  total_logins: number;
  total_page_views: number;
  total_module_starts: number;
  total_completions: number;
  total_searches: number;
  total_brain_views: number;
  active_users_24h: number;
  active_users_7d: number;
  recent_actions: RecentAction[];
  last_updated: string | null;
}

export interface RecentAction {
  id: string;
  username: string;
  action: ActionType;
  metadata: Record<string, string | number | boolean>;
  created_at: string;
}

interface SiteStatsRow {
  total_visits: number;
  total_logins: number;
  total_logouts: number;
  total_page_views: number;
  total_module_starts: number;
  total_completions: number;
  total_uncompletes: number;
  total_searches: number;
  total_brain_views: number;
  last_updated: string;
}

export async function getAdminStats(): Promise<AdminStats | null> {
  if (!supabaseAdmin) return null;

  try {
    const [statsResult, actionsResult, active24hResult, active7dResult] = await Promise.all([
      supabaseAdmin.from("site_stats").select("*").eq("id", 1).single(),
      supabaseAdmin
        .from("user_actions")
        .select("id, username, action, metadata, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseAdmin
        .from("user_actions")
        .select("user_id")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      supabaseAdmin
        .from("user_actions")
        .select("user_id")
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    const stats = (statsResult.data as SiteStatsRow | null) || {
      total_visits: 0,
      total_logins: 0,
      total_page_views: 0,
      total_module_starts: 0,
      total_completions: 0,
      total_searches: 0,
      total_brain_views: 0,
      last_updated: "",
    };

    return {
      total_visits: stats.total_visits,
      total_logins: stats.total_logins,
      total_page_views: stats.total_page_views,
      total_module_starts: stats.total_module_starts,
      total_completions: stats.total_completions,
      total_searches: stats.total_searches,
      total_brain_views: stats.total_brain_views,
      active_users_24h: [...new Set((active24hResult.data || []).map((r: any) => r.user_id))].length,
      active_users_7d: [...new Set((active7dResult.data || []).map((r: any) => r.user_id))].length,
      recent_actions: (actionsResult.data || []) as RecentAction[],
      last_updated: stats.last_updated,
    };
  } catch (err) {
    console.error("[Stats] Failed to get admin stats:", err);
    return null;
  }
}