const { Client } = require("pg");

const SQL = `
-- Table: user_actions
CREATE TABLE IF NOT EXISTS public.user_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON public.user_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_actions_action ON public.user_actions(action);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON public.user_actions(user_id);

-- Table: site_stats
CREATE TABLE IF NOT EXISTS public.site_stats (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  total_visits INT DEFAULT 0,
  total_logins INT DEFAULT 0,
  total_logouts INT DEFAULT 0,
  total_page_views INT DEFAULT 0,
  total_module_starts INT DEFAULT 0,
  total_completions INT DEFAULT 0,
  total_uncompletes INT DEFAULT 0,
  total_searches INT DEFAULT 0,
  total_brain_views INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.site_stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Function: increment_stat
CREATE OR REPLACE FUNCTION public.increment_stat(action_name TEXT)
RETURNS VOID AS $$
DECLARE
  field TEXT;
BEGIN
  field := CASE action_name
    WHEN 'login' THEN 'total_logins'
    WHEN 'logout' THEN 'total_logouts'
    WHEN 'page_view' THEN 'total_page_views'
    WHEN 'module_start' THEN 'total_module_starts'
    WHEN 'module_complete' THEN 'total_completions'
    WHEN 'module_uncomplete' THEN 'total_uncompletes'
    WHEN 'search' THEN 'total_searches'
    WHEN 'brain_view' THEN 'total_brain_views'
    ELSE NULL
  END;
  IF field IS NULL THEN RETURN; END IF;
  EXECUTE format(
    'UPDATE public.site_stats SET %I = %I + 1, last_updated = NOW() WHERE id = 1',
    field, field
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_can_insert_action" ON public.user_actions FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_actions" ON public.user_actions FOR SELECT USING (true);

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_stats" ON public.site_stats FOR SELECT USING (true);
CREATE POLICY "service_update_stats" ON public.site_stats FOR UPDATE USING (true);
`;

async function main() {
  const password = process.env.SUPABASE_DB_PASSWORD;

  if (!password) {
    throw new Error("Missing SUPABASE_DB_PASSWORD environment variable.");
  }

  const client = new Client({
    host: "db.xrompnuiaoshdabpxyyo.supabase.co",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Supabase Postgres");

  const statements = SQL.split(";").filter(s => s.trim().length > 0);
  for (const stmt of statements) {
    try {
      await client.query(stmt + ";");
      console.log("OK:", stmt.split("\n")[1]?.trim() || stmt.substring(0, 50));
    } catch (err) {
      console.error("Error:", err.message);
    }
  }

  await client.end();
  console.log("Done!");
}

main().catch(console.error);
