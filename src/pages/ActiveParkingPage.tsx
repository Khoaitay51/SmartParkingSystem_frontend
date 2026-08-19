import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { BackBtn } from "../components/BackBtn";
import { Ic } from "../components/icons";
import { GateButton } from "../components/GateButton";
import { pad } from "../utils";

export default function ActiveParkingPage() {
  const navigate = useNavigate();
  const { appState, endParking } = useApp();
  const [elapsed, setElapsed] = useState(5077);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const cost = Math.ceil(elapsed / 3600) * (appState.activeLot?.price ?? 5000);

  // ── Checkout receipt ──────────────────────────────────────────────
  if (ending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-white px-6 text-center slide-up">
        <div
          className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-5"
          style={{ border: "3px solid #22c55e" }}
        >
          <div className="w-10 h-10 text-green-500">{Ic.check}</div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-1">Kết thúc gửi xe!</h2>
        <p className="text-slate-500 text-sm mb-1">
          Tổng thời gian:{" "}
          <span className="font-black text-slate-700 mono">{pad(h)}:{pad(m)}:{pad(s)}</span>
        </p>
        <p className="text-slate-500 text-sm mb-6">
          Phí đã trừ:{" "}
          <span className="font-black text-green-600 mono">{cost.toLocaleString()} ₫</span>
        </p>
        <div className="card p-4 w-full text-left mb-6">
          {[
            ["Bãi xe", appState.activeLot?.name ?? ""],
            ["Biển số", "30A-123.45"],
            ["Chỗ đỗ", "B2 · Tầng trệt"],
            ["Vào lúc", "08:30 · 19/08/2026"],
            ["Ra lúc", "09:54 · 19/08/2026"],
          ].map(([l, v], i) => (
            <div key={i}>
              {i > 0 && <div className="sep my-2" />}
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">{l}</span>
                <span className="text-sm font-bold text-slate-800">{v}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-brand w-full" onClick={() => { endParking(); navigate("/driver/home"); }}>
          Về trang chủ
        </button>
      </div>
    );
  }

  // ── Main active-parking view ──────────────────────────────────────
  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "#f4f6fb" }}>
      {/* Header */}
      <div className="bg-brand-grad px-5 pt-14 pb-5">
        <div className="flex items-center justify-between mb-4">
          <BackBtn onPress={() => navigate(-1 as unknown as string)} />
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontFamily: "Nunito" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#86efac", display: "inline-block", animation: "blink 1.6s infinite" }} />
            Đang gửi xe
          </div>
        </div>
        <p className="text-white/60 text-xs font-semibold">Địa điểm</p>
        <h2 className="text-xl font-black text-white leading-tight">{appState.activeLot?.name}</h2>
        <p className="text-white/50 text-xs mt-0.5">{appState.activeLot?.address}</p>
      </div>

      {/* Timer card */}
      <div className="mx-4 -mt-3 relative z-10">
        <div className="card p-6 text-center">
          <p className="text-xs text-slate-400 font-semibold mb-3">THỜI GIAN ĐỖ XE</p>
          <div
            className="w-36 h-36 rounded-full mx-auto flex flex-col items-center justify-center mb-4 timer-pulse"
            style={{ background: "linear-gradient(135deg,#f0fdf6,#dcfce8)", border: "3px solid #22c55e" }}
          >
            <p className="text-3xl font-black text-green-700 mono leading-none">{pad(h)}:{pad(m)}</p>
            <p className="text-base font-black text-green-400 mono">{pad(s)}</p>
          </div>
          <p className="text-slate-400 text-xs mb-1">Phí tạm tính</p>
          <p className="text-3xl font-black text-slate-800 mono">{cost.toLocaleString()} ₫</p>
          <p className="text-xs text-slate-300 mt-0.5">
            Tính theo giờ · {(appState.activeLot?.price ?? 5000).toLocaleString()}₫/h
          </p>
        </div>
      </div>

      {/* Vehicle info */}
      <div className="mx-4 mt-3">
        <div className="card-sm p-4">
          <p className="text-xs text-slate-400 font-bold mb-3">CHI TIẾT GỬI XE</p>
          {[
            ["Biển số xe", "30A-123.45"],
            ["Loại xe", "Ô tô con"],
            ["Vào lúc", "08:30 · 19/08/2026"],
            ["Chỗ đỗ", "B2 · Tầng trệt"],
            ["Số dư ví", "660.000 ₫"],
          ].map(([l, v], i) => (
            <div key={i}>
              {i > 0 && <div className="sep my-2.5" />}
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">{l}</span>
                <span className="text-sm font-bold text-slate-800">{v}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Camera feed */}
      <div className="mx-4 mt-3">
        <div className="card-sm overflow-hidden">
          <div className="relative" style={{ height: 120 }}>
            <img
              src="https://images.unsplash.com/photo-1593280405106-e438ebe93f5b?w=400&h=160&fit=crop&auto=format"
              alt="Camera bãi xe"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-black/50 rounded-xl px-3 py-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full" style={{ animation: "blink 1s infinite" }} />
                <span className="text-white text-xs font-bold">Camera LIVE · Khu vực B</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-2.5 flex items-center gap-2">
            <div className="w-3.5 h-3.5 text-green-500">{Ic.shield}</div>
            <p className="text-xs text-slate-500 font-medium">Camera AI đang theo dõi xe của bạn</p>
          </div>
        </div>
      </div>

      {/* Gate exit + End button */}
      <div className="mx-4 mt-3 pb-8">
        <p className="text-xs font-black text-slate-500 mb-2">MỞ CỔNG RA</p>
        <GateButton mode="exit" />

        <div className="mt-3 rounded-2xl p-3 flex gap-3 mb-3" style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}>
          <div className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5">{Ic.info}</div>
          <p className="text-xs text-amber-700 leading-relaxed">
            Mở cổng ra, lái xe ra khỏi bãi, rồi bấm "Kết thúc gửi xe" để hoàn tất. Phí sẽ được trừ tự động.
          </p>
        </div>

        <button
          className="btn-brand w-full"
          style={{
            background: "linear-gradient(135deg,#ef4444,#dc2626)",
            boxShadow: "0 6px 20px rgba(220,38,38,0.3)",
          }}
          onClick={() => setEnding(true)}
        >
          <div className="w-5 h-5">{Ic.power}</div>
          Kết thúc gửi xe
        </button>
      </div>
    </div>
  );
}
