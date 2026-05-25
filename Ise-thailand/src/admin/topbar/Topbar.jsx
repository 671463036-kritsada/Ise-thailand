import { useState } from "react";
import { useAuth } from "../../hook/useAuth";
import { Moon, Sun, Menu } from "lucide-react";

export default function Topbar({ onToggleSidebar, darkMode, onToggleDarkMode }) {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();

  const profileLinks = ["Home", "Inbox", "Chat", "Activity", "Account Settings"];

  return (
    <>
      {showProfile && (
        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
      )}

      <header className="h-14 bg-[var(--color-forest-blue)] border-b border-[var(--color-blue)]/40 flex items-center justify-between px-5 shrink-0 shadow-md z-50 relative">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/70 font-medium">
            สถาบันเศรษฐกิจพอเพียง
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
            title={darkMode ? "เปลี่ยนเป็น Light Mode" : "เปลี่ยนเป็น Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Profile */}
          <div className="relative z-50">
            <button
              onClick={() => setShowProfile((v) => !v)}
              className="w-8 h-8 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            >
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[var(--color-border)] rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--color-surface-3)]">
                  <p className="text-xs font-bold text-[var(--color-deep-text)]">{user?.name || '-'}</p>
                  <p className="text-[10px] text-[var(--color-muted-text)]">
                    {user?.role === 1 ? 'Administrator' : 'User'}
                  </p>
                </div>
                {profileLinks.map((l) => (
                  <a key={l} href="#"
                    className="block px-4 py-2 text-xs text-[var(--color-deep-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-forest-blue)] transition-colors"
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