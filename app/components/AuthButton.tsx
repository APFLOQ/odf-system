"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  username: string;
  avatar: string;
  isMember: boolean;
  isAdmin: boolean;
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login");
    const data = await res.json();
    window.location.href = data.url;
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
    );
  }

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 24px',
          background: '#5865F2',
          color: 'white',
          fontFamily: 'var(--font-roobert)',
          fontSize: '16px',
          fontWeight: 400,
          borderRadius: '75.024px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#4752C4';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#5865F2';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
        </svg>
        Login
      </button>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 12px 6px 6px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '9999px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {user.avatar ? (
          <img
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
            alt={user.username}
            style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: '#8052ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '13px', fontWeight: 700
          }}>
            {user.username[0]?.toUpperCase() || '?'}
          </div>
        )}
        <span style={{ fontSize: '13px', color: '#ffffff', fontWeight: 400 }}>
          {user.username}
        </span>
        {user.isAdmin && (
          <span style={{
            padding: '2px 8px', fontSize: '10px', fontWeight: 600,
            background: '#ffb829', color: 'black', borderRadius: '4px', textTransform: 'uppercase',
          }}>
            Admin
          </span>
        )}
        {user.isMember && !user.isAdmin && (
          <span style={{
            padding: '2px 8px', fontSize: '10px', fontWeight: 600,
            background: '#15846e', color: 'white', borderRadius: '4px', textTransform: 'uppercase',
          }}>
            Member
          </span>
        )}
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              minWidth: '160px',
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '4px',
              zIndex: 100,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px 14px',
                textAlign: 'left',
                fontSize: '13px',
                color: '#71717a',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#71717a';
              }}
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}