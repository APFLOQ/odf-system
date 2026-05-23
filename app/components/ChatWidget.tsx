"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[190] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
        style={{
          background: "var(--color-violet)",
          boxShadow: "0 0 20px rgba(128, 82, 255, 0.3)",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[189] w-80 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(16, 16, 16, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="p-4 border-b border-white/[0.06]">
              <h3 className="font-primary text-[16px] font-medium text-white">Support</h3>
              <p className="text-[12px] text-[#949494] mt-1">Ask us anything about the platform</p>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-violet)] flex items-center justify-center shrink-0">
                  <span className="text-[12px] font-bold text-white">ODF</span>
                </div>
                <div className="bg-white/[0.03] rounded-xl rounded-tl-sm px-3 py-2">
                  <p className="text-[13px] text-[#c1c1c1]">Hi! How can we help you today?</p>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-[13px] text-white outline-none placeholder:text-[#6d6d6d]"
                />
                <button className="w-8 h-8 rounded-lg bg-[var(--color-violet)] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
