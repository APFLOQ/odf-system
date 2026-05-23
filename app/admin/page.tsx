"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Stats {
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

interface RecentAction {
  id: string;
  username: string;
  action: string;
  metadata: Record<string, string | number | boolean>;
  created_at: string;
}

const actionColors: Record<string, string> = {
  login: "#5865F2",
  logout: "#71717a",
  page_view: "#8052ff",
  module_start: "#06b6d4",
  module_complete: "#22c55e",
  module_uncomplete: "#f59e0b",
  search: "#ec4899",
  brain_view: "#8052ff",
};

const actionIcons: Record<string, ReactNode> = {
  login: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>,
  logout: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  page_view: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  module_start: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  module_complete: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  module_uncomplete: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  search: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  brain_view: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
};

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl bg-surface border border-subtle"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-text-muted uppercase tracking-wider">{label}</span>
        <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      </div>
      <span className="text-[32px] font-bold font-mono text-text-primary">{value.toLocaleString()}</span>
    </motion.div>
  );
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats/admin")
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 401 ? "unauthorized" : res.status === 403 ? "admin only" : "error");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-void p-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <span className="mono-label block mb-3">Admin</span>
            <h1 className="text-[28px] font-bold text-text-primary">Statistics</h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-5 rounded-xl bg-surface border border-subtle">
                <div className="skeleton h-4 w-20 mb-3" />
                <div className="skeleton h-8 w-16" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-void p-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="p-8 rounded-2xl bg-surface border border-subtle text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-[18px] font-semibold text-text-primary mb-2">Stats Unavailable</h3>
            <p className="text-[14px] text-text-tertiary">
              {error === "unauthorized" ? "You need to log in to view stats." :
               error === "admin only" ? "Only admins can access the stats dashboard." :
               "Configure Supabase to enable stats tracking."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!stats) return null;

  return (
    <main className="min-h-screen bg-void p-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <span className="mono-label block mb-3">Admin Panel</span>
            <h1 className="text-[28px] font-bold text-text-primary">Site Statistics</h1>
          </div>
          {stats.last_updated && (
            <span className="text-[12px] text-text-muted">
              Updated {new Date(stats.last_updated).toLocaleString()}
            </span>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard label="Total Visits" value={stats.total_visits} color="#8052ff" />
          <MetricCard label="Logins" value={stats.total_logins} color="#5865F2" />
          <MetricCard label="Page Views" value={stats.total_page_views} color="#06b6d4" />
          <MetricCard label="Completions" value={stats.total_completions} color="#22c55e" />
          <MetricCard label="Module Starts" value={stats.total_module_starts} color="#06b6d4" />
          <MetricCard label="Searches" value={stats.total_searches} color="#ec4899" />
          <MetricCard label="Brain Views" value={stats.total_brain_views} color="#8052ff" />
          <MetricCard label="Active (24h)" value={stats.active_users_24h} color="#ffb829" />
        </div>

        <div className="p-4 rounded-xl bg-surface border border-subtle mb-6">
          <div className="flex items-center gap-4 text-[13px] text-text-tertiary">
            <span>Active users (7d): <strong className="text-text-secondary">{stats.active_users_7d}</strong></span>
          </div>
        </div>

        <div className="rounded-xl bg-surface border border-subtle overflow-hidden">
          <div className="px-5 py-4 border-b border-subtle">
            <h2 className="text-[16px] font-semibold text-text-primary">Recent Activity</h2>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {stats.recent_actions.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-[14px]">
                No actions recorded yet.
              </div>
            ) : (
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-subtle">
                    <th className="text-left px-5 py-3 text-text-muted font-medium">Action</th>
                    <th className="text-left px-5 py-3 text-text-muted font-medium">User</th>
                    <th className="text-left px-5 py-3 text-text-muted font-medium">Details</th>
                    <th className="text-left px-5 py-3 text-text-muted font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_actions.map((action) => (
                    <tr key={action.id} className="border-b border-subtle hover:bg-white/[0.02]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: `${actionColors[action.action] || "#8052ff"}15`, color: actionColors[action.action] || "#8052ff" }}
                          >
                            {actionIcons[action.action] || actionIcons.page_view}
                          </div>
                          <span className="text-text-secondary capitalize">{action.action.replace("_", " ")}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-text-secondary">{action.username}</td>
                      <td className="px-5 py-3 text-text-muted text-[12px]">
                        {action.metadata && Object.keys(action.metadata).length > 0
                          ? Object.entries(action.metadata)
                              .slice(0, 2)
                              .map(([k, v]) => `${k}:${v}`)
                              .join(", ")
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-text-muted">
                        {new Date(action.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}