import { Outlet, useLocation, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import type { Page } from "../types";

const HIDE_NAV = [
  "/driver/lot/",
  "/driver/parking",
  "/driver/topup",
  "/driver/vehicles/add",
  "/driver/history",
  "/driver/notifications",
];

const TABS: { path: string; page: Page; label: string; icon: React.ReactNode }[] = [
  {
    path: "/driver/home",
    page: "home",
    label: "Trang chủ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: "/driver/search",
    page: "search",
    label: "Tìm kiếm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    path: "/driver/wallet",
    page: "wallet",
    label: "Ví tiền",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    path: "/driver/vehicles",
    page: "vehicles",
    label: "Xe của tôi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    path: "/driver/profile",
    page: "profile",
    label: "Hồ sơ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function DriverLayout() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { appState } = useApp();

  const showNav = !HIDE_NAV.some((p) => location.pathname.startsWith(p));

  const activeTab = TABS.find(
    (t) => location.pathname === t.path || location.pathname.startsWith(t.path + "/")
  )?.path ?? "/driver/home";

  return (
    <>
      <Outlet />

      {showNav && (
        <div className="bottom-nav">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.path;
            const isHome   = tab.page === "home";
            return (
              <div
                key={tab.path}
                className="nav-item tap"
                onClick={() => navigate(tab.path)}
              >
                {/* Parking dot badge on home tab */}
                {isHome && appState.isParking && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: "calc(50% - 16px)",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#22c55e",
                      border: "2px solid #fff",
                    }}
                  />
                )}
                <div style={{ color: isActive ? "#16a34a" : "#94a3b8", transition: "color 0.15s" }}>
                  {tab.icon}
                </div>
                <span style={{ color: isActive ? "#16a34a" : "#94a3b8", fontWeight: isActive ? 800 : 600, transition: "color 0.15s" }}>
                  {tab.label}
                </span>
                {isActive && (
                  <div style={{ position: "absolute", bottom: 0, width: 24, height: 3, borderRadius: "3px 3px 0 0", background: "#16a34a" }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
