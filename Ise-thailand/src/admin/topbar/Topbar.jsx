import { useState } from "react";
import { useAuth } from "../../hook/useAuth";

// const profileLinks = ["Home", "Inbox", "Chat", "Activity", "Account Settings"];

export default function Topbar() {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();

  function closeAll() {
    setShowProfile(false);
  }

  return (
    <>
      {showProfile && (
        <div className="fixed inset-0 z-20" onClick={closeAll} />
      )}

      <header className="h-14 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-5 shrink-0 shadow-sm z-30 relative text-[var(--color-deep-text)]">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-text)] font-medium">
            <span className="pl-10 md:pl-0">สถาบันเศรษฐกิจพอเพียง</span> 
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile((v) => !v)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-green-light)] to-[var(--color-green)] text-white text-xs font-bold flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
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
                {/* {profileLinks.map((l) => (

                  <a key={l}
                    href="#"
                    className="block px-4 py-2 text-xs text-[var(--color-deep-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-forest-green)] transition-colors"
                  >
                    {l}
                  </a>
                ))} */}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}