import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { TRANSACTIONS } from "../../data";
import { Ic } from "../../components/icons";
import { TxRow } from "../../components/TxRow";
import HomeIdleSection from "./HomeIdleSection";
import HomeActiveSection from "./HomeActiveSection";

export default function HomePage() {
  const navigate = useNavigate();
  const { appState } = useApp();
  const [balanceVis, setBalanceVis] = useState(true);

  return (
    <div className="page-scroll pb-24" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-brand-grad px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-xs font-semibold">Xin chào 👋</p>
            <h2 className="text-white font-black text-xl leading-tight">Nguyễn Văn An</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative tap" onClick={() => navigate("/driver/notifications")}>
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <div className="w-5 h-5 text-white">{Ic.bell}</div>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-black">3</span>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white/12 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white/60 text-xs font-semibold">Số dư ví ParkIQ</span>
            <button onClick={() => setBalanceVis(!balanceVis)} className="text-white/50">
              {Ic.eye(balanceVis)}
            </button>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white text-3xl font-black mono leading-none">
                {balanceVis ? "660.000 ₫" : "•••.••• ₫"}
              </p>
              <p className="text-white/40 text-[11px] mt-1">Cập nhật vừa xong</p>
            </div>
            <button
              className="btn-ghost py-2 px-3 text-xs"
              style={{ borderRadius: 12 }}
              onClick={() => navigate("/driver/topup")}
            >
              + Nạp tiền
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 pt-4 pb-2">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Ic.search, label: "Tìm bãi",  path: "/driver/search",  bg: "#eff6ff", c: "#3b82f6" },
            { icon: Ic.wallet, label: "Nạp tiền", path: "/driver/topup",   bg: "#f0fdf6", c: "#16a34a" },
            { icon: Ic.clock,  label: "Lịch sử",  path: "/driver/history", bg: "#fef3c7", c: "#d97706" },
            { icon: Ic.qr,     label: "Quét QR",  path: "/driver/home",    bg: "#fdf2f8", c: "#9333ea" },
          ].map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-2 tap" onClick={() => navigate(a.path)}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: a.bg }}>
                <div className="w-6 h-6" style={{ color: a.c }}>{a.icon}</div>
              </div>
              <span className="text-xs text-slate-500 font-semibold text-center">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sep mx-4 my-4" />

      {/* Conditional parking section */}
      {appState.isParking
        ? <HomeActiveSection appState={appState} />
        : <HomeIdleSection />
      }

      {/* Recent transactions */}
      <div className="flex items-center justify-between px-4 mt-5 mb-3">
        <h3 className="font-black text-slate-800 text-base">Giao dịch gần đây</h3>
        <span className="text-xs text-green-600 font-bold tap" onClick={() => navigate("/driver/history")}>
          Xem tất cả
        </span>
      </div>
      <div className="card-sm mx-4 overflow-hidden">
        {TRANSACTIONS.slice(0, 4).map((tx, i) => (
          <TxRow key={tx.id} tx={tx} last={i === 3} />
        ))}
      </div>
    </div>
  );
}
