import { useState } from "react";

const notifications = [
  { title: "New order received", sub: "Order #12345 has been placed", time: "5 min ago", color: "from-green-400 to-emerald-500", icon: "🛒" },
  { title: "New user registered", sub: "User @john_doe has signed up", time: "30 min ago", color: "from-green-500 to-green-600", icon: "👤" },
  { title: "Payment confirmed", sub: "Payment of $299 received", time: "1 hour ago", color: "from-gold to-gold-hover", icon: "💳" },
];

const profileLinks = ["Home", "Inbox", "Chat", "Activity", "Account Settings"];

export default function Topbar({ onToggleSidebar }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  function closeAll() {
    setShowNotif(false);
    setShowProfile(false);
  }

  return (
    <>
      {/* Click-outside overlay */}
      {(showNotif || showProfile) && (
        <div className="fixed inset-0 z-40" onClick={closeAll} />
      )}

      <header className="h-14 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-5 shrink-0 shadow-sm z-50 relative text-[var(--color-deep-text)]">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted-text)] hover:bg-[var(--color-surface-3)] transition-colors cursor-pointer"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-text)] font-medium">
            <span>สถาบันเศรษฐกิจพอเพียง</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative z-50">
            <button
              onClick={() => { setShowNotif((v) => !v); setShowProfile(false); }}
              className="relative w-8 h-8 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted-text)] hover:bg-[var(--color-surface-3)] transition-colors cursor-pointer"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6" />
                <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-error)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[var(--color-border)] rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--color-surface-3)] font-bold text-sm text-[var(--color-deep-text)]">
                  Notifications
                </div>
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)]/40 last:border-0 transition-colors cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${n.color} shrink-0 flex items-center justify-center text-sm`}>
                      {n.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-deep-text)]">{n.title}</p>
                      <p className="text-xs text-[var(--color-muted-text)]">{n.sub}</p>
                      <p className="text-[10px] text-[var(--color-disabled)] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 text-center bg-[var(--color-surface)] border-t border-[var(--color-surface-3)]">
                  {/* เปลี่ยนเป็นสีทอง/เขียวของระบบ */}
                  <a href="#" className="text-xs text-[var(--color-green)] font-bold hover:underline">
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative z-50">
            <button
              onClick={() => { setShowProfile((v) => !v); setShowNotif(false); }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-green-light)] to-[var(--color-green)] text-white text-xs font-bold flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
            >
              S
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[var(--color-border)] rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--color-surface-3)]">
                  <p className="text-xs font-bold text-[var(--color-deep-text)]">Shrina Tesla</p>
                  <p className="text-[10px] text-[var(--color-muted-text)]">@imshrina</p>
                </div>
                {profileLinks.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block px-4 py-2 text-xs text-[var(--color-deep-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-forest-green)] transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}