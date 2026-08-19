import { useState } from "react";
import { useNavigate } from "react-router";
import type { OwnerLot } from "../../types";
import { useOwnerLots, useOwnerTransactions, useWeeklyRevenue } from "../../hooks/useOwnerData";
import { SkeletonList } from "../../components/Skeleton";

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M₫";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K₫";
  return n.toLocaleString("vi-VN") + "₫";
}

function OccupancyBar({ lot }: { lot: OwnerLot }) {
  const pct = Math.round((lot.occupied / lot.total) * 100);
  const color = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e";
  return (
    <div
      className="card-sm p-4 tap"
      onClick={() => {}}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-black text-slate-800">{lot.name}</p>
          <p className="text-[11px] text-slate-400">{lot.address}</p>
        </div>
        {lot.status === "open" ? (
          <span className="status-pill-green text-[11px]">Đang mở</span>
        ) : lot.status === "maintenance" ? (
          <span className="status-pill-amber text-[11px]">Bảo trì</span>
        ) : (
          <span className="status-pill-red text-[11px]">Đóng cửa</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="progress-bar h-2">
            <div
              className="progress-fill"
              style={{ width: lot.status === "closed" ? "0%" : `${pct}%`, background: color }}
            />
          </div>
        </div>
        <span className="text-xs font-black mono" style={{ color }}>
          {lot.status === "closed" ? "–/–" : `${lot.occupied}/${lot.total}`}
        </span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-slate-400">Hôm nay</span>
        <span className="text-sm font-black text-blue-700 mono">+{fmt(lot.todayRevenue)}</span>
      </div>
    </div>
  );
}

export default function OwnerHomePage() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const { data: ownerLots = [] } = useOwnerLots();
  const { data: ownerTransactions = [] } = useOwnerTransactions();
  const { data: weeklyRevenue = [] } = useWeeklyRevenue();

  const MAX_BAR = Math.max(...weeklyRevenue.map((d) => d.v), 1);
  const todayTotal = ownerLots.reduce((s, l) => s + l.todayRevenue, 0);
  const weekTotal  = weeklyRevenue.reduce((s, d) => s + d.v, 0);
  const monthTotal = ownerLots.reduce((s, l) => s + l.monthRevenue, 0);

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-owner-grad px-5 pt-14 pb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-blue-200 text-xs font-semibold">Chào buổi sáng 👋</p>
            <h2 className="text-white font-black text-xl">Nguyễn Minh Thành</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative tap" onClick={() => navigate("/driver/notifications")}>
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-black flex items-center justify-center">2</div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&auto=format"
              alt="avatar"
              className="w-10 h-10 rounded-xl object-cover border-2 border-white/30"
            />
          </div>
        </div>

        {/* Revenue cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Hôm nay", value: todayTotal, icon: "📅" },
            { label: "Tuần này", value: weekTotal, icon: "📊" },
            { label: "Tháng này", value: monthTotal, icon: "💰" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <p className="text-blue-200 text-[10px] font-semibold mb-1">{s.icon} {s.label}</p>
              <p className="text-white font-black text-base mono leading-tight">
                {showBalance ? fmt(s.value) : "••••"}
              </p>
            </div>
          ))}
        </div>
        <button
          className="flex items-center gap-1.5 mt-3 text-blue-200 text-xs font-semibold tap"
          onClick={() => setShowBalance(!showBalance)}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {showBalance
              ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
              : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
            }
          </svg>
          {showBalance ? "Ẩn số liệu" : "Hiện số liệu"}
        </button>
      </div>

      <div className="flex-1 page-scroll pb-24">
        {/* Weekly bar chart */}
        <div className="mx-4 mt-4 card-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-slate-800 text-sm">Doanh thu 7 ngày</h3>
            <span className="text-xs text-blue-600 font-bold tap" onClick={() => navigate("/owner/earnings")}>Chi tiết →</span>
          </div>
          <div className="flex items-end justify-between gap-1" style={{ height: 64 }}>
            {weeklyRevenue.map((d) => {
              const h = Math.round((d.v / MAX_BAR) * 56);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg"
                    style={{
                      height: h,
                      background: (d as { today?: boolean }).today
                        ? "linear-gradient(to top,#1d4ed8,#3b82f6)"
                        : "#dbeafe",
                      minHeight: 4,
                      transition: "height 0.4s ease",
                    }}
                  />
                  <span className="text-[9px] text-slate-400 font-semibold">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mx-4 mt-4">
          <h3 className="font-black text-slate-800 text-sm mb-3">Thao tác nhanh</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { e: "💸", l: "Rút tiền",   p: "/owner/withdraw" },
              { e: "🏢", l: "Thêm bãi",   p: "/owner/lots/register" },
              { e: "🚦", l: "Điều khiển", p: "/owner/gate" },
              { e: "📋", l: "Báo cáo",    p: "/owner/earnings" },
            ].map((a) => (
              <div key={a.l} className="tap flex flex-col items-center gap-2" onClick={() => navigate(a.p)}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ background: "#eff6ff" }}>
                  {a.e}
                </div>
                <span className="text-[10px] font-bold text-slate-500 text-center leading-tight">{a.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy */}
        <div className="mx-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-slate-800 text-sm">Tình trạng bãi xe</h3>
            <span className="text-xs text-blue-600 font-bold tap" onClick={() => navigate("/owner/lots")}>Xem tất cả →</span>
          </div>
          <div className="space-y-3">
            {ownerLots.map((lot) => (
              <div key={lot.id} onClick={() => navigate("/owner/lots/" + lot.id)}>
                <OccupancyBar lot={lot} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="mx-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-slate-800 text-sm">Hoạt động gần đây</h3>
            <span className="text-xs text-blue-600 font-bold tap" onClick={() => navigate("/owner/earnings")}>Xem tất cả →</span>
          </div>
          <div className="card-sm overflow-hidden">
            {ownerTransactions.slice(0, 5).map((tx, i) => (
              <div key={tx.id}>
                {i > 0 && <div className="sep mx-4" />}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                    style={{ background: tx.type === "income" ? "#f0fdf6" : "#fef2f2" }}
                  >
                    {tx.type === "income" ? "🚗" : "💸"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{tx.label}</p>
                    <p className="text-[11px] text-slate-400 truncate">{tx.sub}</p>
                  </div>
                  <span className="font-black text-sm mono flex-shrink-0" style={{ color: tx.type === "income" ? "#16a34a" : "#ef4444" }}>
                    {tx.type === "income" ? "+" : ""}{Math.abs(tx.amount).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
