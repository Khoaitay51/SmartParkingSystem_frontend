import { useState } from "react";
import { useNavigate } from "react-router";
import { TRANSACTIONS } from "../data";
import { Ic } from "../components/icons";
import { TxRow } from "../components/TxRow";

export default function WalletPage() {
  const navigate = useNavigate();
  const [vis, setVis] = useState(true);
  const spent = TRANSACTIONS.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Bank-style card */}
      <div className="px-4 pt-14 pb-4 flex-shrink-0" style={{ background: "#f4f6fb" }}>
        <h2 className="text-xl font-black text-slate-800 mb-4">Ví tiền</h2>
        <div className="wallet-card">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/60 text-xs font-medium">Ví ParkIQ</p>
                <p className="text-white font-bold text-sm">Nguyễn Văn An</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setVis(!vis)} className="text-white/50">{Ic.eye(vis)}</button>
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <rect x="3" y="3" width="18" height="18" rx="3" fill="rgba(255,255,255,0.3)" />
                    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-white/50 text-xs mb-1">Số dư khả dụng</p>
            <p className="text-white text-4xl font-black mono mb-5">
              {vis ? "660.000 ₫" : "•••.••• ₫"}
            </p>
            <div className="flex gap-3">
              <button
                className="btn-ghost flex-1 py-2.5 text-sm"
                style={{ borderRadius: 14 }}
                onClick={() => navigate("/driver/topup")}
              >
                + Nạp tiền
              </button>
              <button
                className="flex-1 py-2.5 text-sm rounded-xl font-bold text-white/80 border border-white/20 bg-white/10 tap"
              >
                ↓ Rút tiền
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats + quick topup methods */}
      <div className="flex-shrink-0 px-4 pb-3" style={{ background: "#f4f6fb" }}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="card-sm p-4">
            <p className="text-xs text-slate-400 mb-1">Chi tháng này</p>
            <p className="text-lg font-black text-red-500 mono">{spent.toLocaleString()} ₫</p>
          </div>
          <div className="card-sm p-4">
            <p className="text-xs text-slate-400 mb-1">Lượt gửi xe</p>
            <p className="text-lg font-black text-blue-600 mono">
              {TRANSACTIONS.filter((t) => t.type === "parking").length} lần
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            ["🏦", "VNPAY",    "#fef3c7", "#d97706"],
            ["🟣", "MoMo",     "#fdf2f8", "#9333ea"],
            ["🔵", "ZaloPay",  "#eff6ff", "#3b82f6"],
            ["💳", "Thẻ NH",   "#f0fdf6", "#16a34a"],
          ].map(([e, l, bg, c]) => (
            <button
              key={l}
              className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl flex-shrink-0 tap"
              style={{ background: bg, minWidth: 72 }}
              onClick={() => navigate("/driver/topup")}
            >
              <span className="text-xl">{e}</span>
              <span className="text-[11px] font-bold" style={{ color: c }}>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-y border-slate-100 flex-shrink-0">
        <h3 className="font-black text-slate-800 text-sm">Lịch sử giao dịch</h3>
        <span className="text-xs text-green-600 font-bold tap" onClick={() => navigate("/driver/history")}>
          Xem tất cả
        </span>
      </div>
      <div className="flex-1 page-scroll bg-white pb-24">
        {TRANSACTIONS.map((tx, i) => (
          <TxRow key={tx.id} tx={tx} last={i === TRANSACTIONS.length - 1} />
        ))}
      </div>
    </div>
  );
}
