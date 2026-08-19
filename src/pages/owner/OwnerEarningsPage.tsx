import { useState } from "react";
import { useNavigate } from "react-router";
import { OWNER_TRANSACTIONS, WEEKLY_REVENUE, OWNER_LOTS } from "../../data";

const MAX_BAR = Math.max(...WEEKLY_REVENUE.map((d) => d.v));

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M₫";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K₫";
  return n.toLocaleString("vi-VN") + "₫";
}

export default function OwnerEarningsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | "income" | "withdrawal">("all");
  const [showBalance, setShowBalance] = useState(true);

  const totalBalance = 18_750_000;
  const monthIncome  = OWNER_LOTS.reduce((s, l) => s + l.monthRevenue, 0);
  const monthOut     = 5_000_000;
  const weekTotal    = WEEKLY_REVENUE.reduce((s, d) => s + d.v, 0);

  const filtered = OWNER_TRANSACTIONS.filter((tx) =>
    tab === "all" || tx.type === tab
  );

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-owner-grad px-5 pt-14 pb-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-blue-200 text-xs font-semibold">Tài chính chủ bãi</p>
            <h2 className="text-white font-black text-2xl">Thu nhập</h2>
          </div>
          <button
            className="btn-owner px-4 py-2.5 text-sm rounded-xl"
            onClick={() => navigate("/owner/withdraw")}
          >
            💸 Rút tiền
          </button>
        </div>

        {/* Earnings card */}
        <div className="earnings-card relative">
          <div className="relative z-10">
            <p className="text-blue-200 text-xs font-semibold mb-1">SỐ DƯ KHẢ DỤNG</p>
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-white font-black text-3xl mono">
                {showBalance ? fmt(totalBalance) : "••••••"}
              </p>
              <button className="text-blue-300 tap" onClick={() => setShowBalance(!showBalance)}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showBalance
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-blue-300 text-[10px]">Thu tháng này</p>
                <p className="text-white font-black text-sm mono">+{fmt(monthIncome)}</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-blue-300 text-[10px]">Đã rút</p>
                <p className="text-white font-black text-sm mono">−{fmt(monthOut)}</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-blue-300 text-[10px]">Tuần này</p>
                <p className="text-white font-black text-sm mono">+{fmt(weekTotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 page-scroll pb-24">
        {/* Bar chart */}
        <div className="mx-4 mt-4 card-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-slate-800 text-sm">Doanh thu theo ngày</h3>
            <span className="text-[11px] text-slate-400 font-semibold">Tuần này</span>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: 80 }}>
            {WEEKLY_REVENUE.map((d) => {
              const h = Math.round((d.v / MAX_BAR) * 68);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] font-bold text-slate-400 mono">
                    {d.v >= 1_000_000 ? (d.v / 1_000_000).toFixed(1) + "M" : Math.round(d.v / 1000) + "K"}
                  </span>
                  <div
                    className="w-full rounded-t-lg"
                    style={{
                      height: h,
                      background: (d as { today?: boolean }).today
                        ? "linear-gradient(to top,#1e3a8a,#3b82f6)"
                        : "#dbeafe",
                      minHeight: 4,
                    }}
                  />
                  <span className="text-[9px] text-slate-400 font-semibold">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-lot breakdown */}
        <div className="mx-4 mt-4 card-sm p-4">
          <h3 className="font-black text-slate-800 text-sm mb-3">Doanh thu theo bãi — tháng này</h3>
          {OWNER_LOTS.map((lot) => {
            const pct = Math.round((lot.monthRevenue / monthIncome) * 100);
            return (
              <div key={lot.id} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700 truncate flex-1 mr-2">{lot.name}</span>
                  <span className="text-xs font-black text-blue-700 mono">{fmt(lot.monthRevenue)}</span>
                </div>
                <div className="progress-bar h-2">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: "linear-gradient(to right,#1d4ed8,#3b82f6)" }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{pct}% tổng doanh thu</span>
              </div>
            );
          })}
        </div>

        {/* Transactions */}
        <div className="mx-4 mt-4">
          <h3 className="font-black text-slate-800 text-sm mb-3">Lịch sử giao dịch</h3>

          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            {[["all","Tất cả"],["income","Thu tiền"],["withdrawal","Rút tiền"]].map(([v, l]) => (
              <button
                key={v}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{ background: tab === v ? "#1d4ed8" : "#f1f5f9", color: tab === v ? "#fff" : "#64748b" }}
                onClick={() => setTab(v as typeof tab)}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="card-sm overflow-hidden">
            {filtered.map((tx, i) => (
              <div key={tx.id}>
                {i > 0 && <div className="sep mx-4" />}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: tx.type === "income" ? "#f0fdf6" : "#fef2f2" }}
                  >
                    {tx.type === "income" ? "🚗" : "💸"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{tx.label}</p>
                    <p className="text-[11px] text-slate-400 truncate">{tx.sub}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-base mono" style={{ color: tx.type === "income" ? "#16a34a" : "#ef4444" }}>
                      {tx.type === "income" ? "+" : "−"}{Math.abs(tx.amount).toLocaleString("vi-VN")}₫
                    </p>
                    {tx.plate && <p className="text-[10px] text-slate-400 mono">{tx.plate}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
