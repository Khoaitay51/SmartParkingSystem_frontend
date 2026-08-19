import { useState } from "react";
import { useNavigate } from "react-router";
import type { OwnerLot } from "../../types";
import { OWNER_LOTS } from "../../data";

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M₫";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K₫";
  return n.toLocaleString() + "₫";
}

function LotManageCard({ lot, onClick }: { lot: OwnerLot; onClick: () => void }) {
  const pct = lot.total > 0 ? Math.round((lot.occupied / lot.total) * 100) : 0;
  const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e";

  return (
    <div className="card p-5 tap" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="font-black text-slate-800 text-base leading-tight">{lot.name}</h3>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{lot.address}</p>
        </div>
        <span
          className="text-[11px] font-black px-3 py-1 rounded-full flex-shrink-0"
          style={{
            background: lot.status === "open" ? "#f0fdf6" : lot.status === "maintenance" ? "#fffbeb" : "#fef2f2",
            color: lot.status === "open" ? "#16a34a" : lot.status === "maintenance" ? "#d97706" : "#dc2626",
          }}
        >
          {lot.status === "open" ? "● Đang mở" : lot.status === "maintenance" ? "⚠ Bảo trì" : "✕ Đóng cửa"}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Tổng chỗ",   value: `${lot.total}`, unit: "chỗ" },
          { label: "Đang đỗ",    value: `${lot.occupied}`, unit: "xe" },
          { label: "Hôm nay",    value: fmt(lot.todayRevenue), unit: "" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-2 text-center" style={{ background: "#f8fafc" }}>
            <p className="text-xs font-black text-slate-700 mono">{s.value}<span className="text-[9px] font-semibold text-slate-400 ml-0.5">{s.unit}</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Occupancy bar */}
      {lot.status !== "closed" && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-400">Mức lấp đầy</span>
            <span className="text-[11px] font-black mono" style={{ color: barColor }}>{pct}%</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="font-semibold">{lot.rating}</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
          Quản lý
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function OwnerLotsPage() {
  const navigate = useNavigate();
  const [lots] = useState(OWNER_LOTS);

  const openCount = lots.filter((l) => l.status === "open").length;

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-owner-grad px-5 pt-14 pb-5 flex-shrink-0">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-blue-200 text-xs font-semibold mb-1">Quản lý bãi xe</p>
            <h2 className="text-white font-black text-2xl">Bãi xe của tôi</h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.15)", color: "#bfdbfe" }}>
            {openCount}/{lots.length} đang mở
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { v: lots.reduce((s, l) => s + l.total, 0).toString(),    l: "Tổng chỗ" },
            { v: lots.reduce((s, l) => s + l.occupied, 0).toString(),  l: "Đang đỗ" },
            { v: lots.reduce((s, l) => s + l.todayRevenue, 0) >= 1_000_000
                ? (lots.reduce((s, l) => s + l.todayRevenue, 0) / 1_000_000).toFixed(1) + "M₫"
                : Math.round(lots.reduce((s, l) => s + l.todayRevenue, 0) / 1000) + "K₫",
              l: "Doanh thu hôm nay" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <p className="text-white font-black text-lg mono leading-tight">{s.v}</p>
              <p className="text-blue-200 text-[10px] mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lots list */}
      <div className="flex-1 page-scroll px-4 pt-4 pb-28 space-y-4">
        {lots.map((lot) => (
          <LotManageCard key={lot.id} lot={lot} onClick={() => navigate("/owner/lots/" + lot.id)} />
        ))}
      </div>

      {/* FAB */}
      <div className="fixed bottom-20 right-4 z-50">
        <button
          className="btn-owner px-5 py-3.5 rounded-2xl text-sm"
          style={{ boxShadow: "0 6px 24px rgba(29,78,216,0.40)" }}
          onClick={() => navigate("/owner/lots/register")}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Thêm bãi xe mới
        </button>
      </div>
    </div>
  );
}
