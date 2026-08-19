import { Outlet, useLocation, useNavigate } from "react-router";

const HIDE_NAV = [
  "/owner/lots/register",
  "/owner/lots/",
  "/owner/withdraw",
];

const TABS: { path: string; label: string; icon: React.ReactNode }[] = [
  {
    path: "/owner/home",
    label: "Tổng quan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    path: "/owner/lots",
    label: "Bãi xe",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    path: "/owner/earnings",
    label: "Thu nhập",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    path: "/owner/gate",
    label: "Cổng IoT",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    ),
  },
  {
    path: "/owner/profile",
    label: "Hồ sơ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function OwnerLayout() {
  const location = useLocation();
  const navigate  = useNavigate();

  // Hide nav on lots/:id and register, but NOT on /owner/lots (the list page)
  const showNav = !HIDE_NAV.some((p) => {
    if (p === "/owner/lots/") {
      // only hide for /owner/lots/register and /owner/lots/:id (numeric)
      const segment = location.pathname.replace("/owner/lots/", "");
      return location.pathname.startsWith("/owner/lots/") && segment.length > 0;
    }
    return location.pathname.startsWith(p);
  });

  const activeTab = (() => {
    // exact or prefix match, but /owner/lots list page should match "lots" tab
    if (location.pathname === "/owner/lots") return "/owner/lots";
    return TABS.find((t) => location.pathname.startsWith(t.path))?.path ?? "/owner/home";
  })();

  return (
    <>
      <Outlet />

      {showNav && (
        <div className="bottom-nav">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.path;
            return (
              <div
                key={tab.path}
                className="nav-item tap"
                onClick={() => navigate(tab.path)}
              >
                <div style={{ color: isActive ? "#1d4ed8" : "#94a3b8", transition: "color 0.15s" }}>
                  {tab.icon}
                </div>
                <span style={{ color: isActive ? "#1d4ed8" : "#94a3b8", fontWeight: isActive ? 800 : 600, transition: "color 0.15s" }}>
                  {tab.label}
                </span>
                {isActive && (
                  <div style={{ position: "absolute", bottom: 0, width: 24, height: 3, borderRadius: "3px 3px 0 0", background: "#1d4ed8" }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
