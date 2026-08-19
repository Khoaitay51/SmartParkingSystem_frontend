import type { Page } from "../types";
import { Ic } from "./icons";

const NAV = [
  { id: "home",     label: "Trang chủ", icon: Ic.home },
  { id: "search",   label: "Tìm bãi",   icon: Ic.search },
  { id: "wallet",   label: "Ví tiền",   icon: Ic.wallet },
  { id: "vehicles", label: "Xe của tôi", icon: Ic.car },
  { id: "profile",  label: "Tài khoản", icon: Ic.person },
] as const;

export const MAIN_TABS: Page[] = ["home", "search", "wallet", "vehicles", "profile"];

interface BottomNavProps {
  active: Page;
  isParking: boolean;
  onChange: (p: Page) => void;
}

export function BottomNav({ active, isParking, onChange }: BottomNavProps) {
  const current = MAIN_TABS.includes(active) ? active : "home";
  return (
    <div className="bottom-nav">
      {NAV.map((t) => {
        const on = current === t.id;
        return (
          <div key={t.id} className="nav-item" onClick={() => onChange(t.id as Page)}>
            <div className="relative">
              <div
                className="w-6 h-6 transition-all duration-150"
                style={{ color: on ? "#16a34a" : "#94a3b8", transform: on ? "scale(1.12)" : "scale(1)" }}
              >
                {t.icon}
              </div>
              {t.id === "home" && isParking && (
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  style={{ animation: "blink 1.6s infinite" }}
                />
              )}
            </div>
            <span style={{ color: on ? "#16a34a" : "#94a3b8" }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
