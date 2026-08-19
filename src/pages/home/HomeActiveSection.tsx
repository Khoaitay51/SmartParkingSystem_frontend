import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { AppState } from "../../types";
import { LOTS } from "../../data";
import { LotCard } from "../../components/LotCard";
import { Ic } from "../../components/icons";
import { pad } from "../../utils";

interface Props {
  appState: AppState;
}

export default function HomeActiveSection({ appState }: Props) {
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(5077);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const cost = Math.ceil(elapsed / 3600) * (appState.activeLot?.price ?? 5000);

  return (
    <>
      {/* Prominent active-parking card */}
      <div className="mx-4 mb-5">
        <div
          className="rounded-3xl p-5 tap relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#16a34a,#15803d)",
            boxShadow: "0 8px 28px rgba(22,163,74,0.32)",
          }}
          onClick={() => navigate("/driver/parking")}
        >
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-10" style={{ background: "radial-gradient(circle,#fff,transparent)", transform: "translate(30%,-30%)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <div className="w-4 h-4 text-white">{Ic.parking}</div>
                </div>
                <div>
                  <p className="text-white/70 text-[10px] font-semibold">ĐANG GỬI XE</p>
                  <p className="text-white font-black text-sm leading-tight">{appState.activeLot?.name}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontFamily: "Nunito" }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#86efac", display: "inline-block", animation: "blink 1.6s infinite" }} />
                Đang chạy
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-xs mb-0.5">Thời gian đỗ</p>
                <p className="text-white text-3xl font-black mono leading-none">
                  {pad(h)}:{pad(m)}:{pad(s)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs mb-0.5">Tạm tính</p>
                <p className="text-white text-xl font-black mono">{cost.toLocaleString()}₫</p>
              </div>
            </div>

            <div className="sep mt-4 mb-3" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 text-white/60">{Ic.car}</div>
                <span className="text-white/80 text-xs font-bold mono">30A-123.45</span>
                <span className="text-white/50 text-xs">· Chỗ B2</span>
              </div>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                Xem chi tiết <div className="w-4 h-4">{Ic.arrowRight}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other nearby lots */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="font-black text-slate-800 text-base">Bãi xe khác gần đây</h3>
        <span className="text-xs text-green-600 font-bold tap" onClick={() => navigate("/driver/search")}>Xem tất cả</span>
      </div>
      <div className="px-4 space-y-3">
        {LOTS.filter((l) => l.id !== appState.activeLot?.id).slice(0, 2).map((lot) => (
          <LotCard key={lot.id} lot={lot} onClick={() => navigate("/driver/lot/" + lot.id)} />
        ))}
      </div>
    </>
  );
}
