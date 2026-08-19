import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { GateButton } from "../../components/GateButton";
import { useOwnerLots } from "../../hooks/useOwnerData";
import { SkeletonList } from "../../components/Skeleton";

const ACTIVITY = [
  { plate: "30A-123.45", action: "vào", time: "14:23", gate: "Cổng vào A" },
  { plate: "51G-456.78", action: "ra",  time: "14:10", gate: "Cổng ra B" },
  { plate: "29A-789.01", action: "vào", time: "13:55", gate: "Cổng vào A" },
  { plate: "30F-222.33", action: "ra",  time: "13:40", gate: "Cổng ra B" },
  { plate: "34A-111.22", action: "vào", time: "13:21", gate: "Cổng vào A" },
];

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M₫";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K₫";
  return n.toLocaleString() + "₫";
}

export default function OwnerLotDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: ownerLots = [], isLoading } = useOwnerLots();
  const lot = ownerLots.find((l) => l.id === Number(id));
  const [status, setStatus] = useState<"open" | "closed" | "maintenance">(lot?.status ?? "open");
  const [editMode, setEditMode] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col" style={{ height: "100dvh" }}>
        <div className="h-48 bg-slate-200 animate-pulse" />
        <div className="p-4"><SkeletonList n={3} /></div>
      </div>
    );
  }
  if (!lot) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <p className="text-slate-400 font-semibold">Không tìm thấy bãi xe</p>
      </div>
    );
  }
  const pct = lot.total > 0 ? Math.round((lot.occupied / lot.total) * 100) : 0;
  const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#22c55e";

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-owner-grad px-5 pt-14 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center tap"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={() => navigate(-1)}
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-blue-200 text-xs">Chi tiết bãi xe</p>
            <h2 className="text-white font-black text-lg leading-tight">{lot.name}</h2>
          </div>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center tap"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={() => setEditMode(true)}
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Occupancy ring */}
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
              <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white font-black text-lg mono leading-none">{pct}%</span>
              <span className="text-blue-200 text-[9px]">lấp đầy</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            {[
              { l: "Tổng chỗ",    v: lot.total.toString() },
              { l: "Đang đỗ",     v: lot.occupied.toString() },
              { l: "Hôm nay",     v: fmt(lot.todayRevenue) },
              { l: "Tháng này",   v: fmt(lot.monthRevenue) },
            ].map((s) => (
              <div key={s.l} className="rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.12)" }}>
                <p className="text-white font-black text-sm mono">{s.v}</p>
                <p className="text-blue-200 text-[10px]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 page-scroll pb-8">
        {/* Status toggle */}
        <div className="mx-4 mt-4 card-sm p-4">
          <p className="text-xs font-black text-slate-500 mb-3">TRẠNG THÁI BÃI XE</p>
          <div className="flex gap-2">
            {(["open", "closed", "maintenance"] as const).map((s) => (
              <button
                key={s}
                className="flex-1 py-2.5 rounded-xl text-xs font-black tap transition-all"
                style={{
                  background: status === s
                    ? s === "open" ? "#16a34a" : s === "maintenance" ? "#f59e0b" : "#ef4444"
                    : "#f8fafc",
                  color: status === s ? "#fff" : "#94a3b8",
                  border: "1.5px solid",
                  borderColor: status === s
                    ? s === "open" ? "#16a34a" : s === "maintenance" ? "#f59e0b" : "#ef4444"
                    : "#e2e8f0",
                }}
                onClick={() => setStatus(s)}
              >
                {s === "open" ? "Đang mở" : s === "maintenance" ? "Bảo trì" : "Đóng cửa"}
              </button>
            ))}
          </div>
        </div>

        {/* Gate controls */}
        <div className="mx-4 mt-4">
          <p className="text-xs font-black text-slate-500 mb-3">ĐIỀU KHIỂN CỔNG IoT</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-2 text-center">🟢 Cổng vào A</p>
              <GateButton mode="entry" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-2 text-center">🔴 Cổng ra B</p>
              <GateButton mode="exit" />
            </div>
          </div>
        </div>

        {/* Camera feed */}
        <div className="mx-4 mt-4 card-sm overflow-hidden">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=180&fit=crop&auto=format"
              alt="Camera live"
              className="w-full object-cover"
              style={{ height: 160, filter: "brightness(0.7)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: "rgba(0,0,0,0.5)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" style={{ animation: "blink 1.2s infinite" }} />
                  TRỰC TIẾP
                </div>
                <span className="text-white text-[10px] font-semibold bg-black/50 px-2 py-0.5 rounded-full">CAM-01 · Cổng vào</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-[10px]">19/08/2026 14:23:45</span>
                <div className="flex gap-1">
                  {["📷", "⛶", "💾"].map((e) => (
                    <div key={e} className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: "rgba(0,0,0,0.4)" }}>{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-t border-slate-100">
            {["CAM-01 Cổng vào", "CAM-02 Cổng ra", "CAM-03 Bãi xe"].map((cam, i) => (
              <button
                key={cam}
                className="flex-1 py-2.5 text-[10px] font-bold tap transition-colors"
                style={{ color: i === 0 ? "#1d4ed8" : "#94a3b8", borderBottom: i === 0 ? "2px solid #1d4ed8" : "2px solid transparent" }}
              >
                {cam}
              </button>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div className="mx-4 mt-4">
          <p className="text-xs font-black text-slate-500 mb-3">LỊCH SỬ CỔNG HÔM NAY</p>
          <div className="card-sm overflow-hidden">
            {ACTIVITY.map((a, i) => (
              <div key={i}>
                {i > 0 && <div className="sep mx-4" />}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: a.action === "vào" ? "#f0fdf6" : "#fef2f2" }}
                  >
                    {a.action === "vào" ? "⬇" : "⬆"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-700 mono">{a.plate}</p>
                    <p className="text-[11px] text-slate-400">{a.gate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 mono">{a.time}</p>
                    <p className="text-[10px]" style={{ color: a.action === "vào" ? "#16a34a" : "#ef4444" }}>
                      {a.action === "vào" ? "Xe vào" : "Xe ra"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lot info */}
        <div className="mx-4 mt-4 card-sm p-4">
          <p className="text-xs font-black text-slate-500 mb-3">THÔNG TIN BÃI XE</p>
          {[
            { l: "Địa chỉ",         v: lot.address },
            { l: "Sức chứa",        v: `${lot.total} chỗ (${Math.round(lot.total * 0.7)} ô tô · ${Math.round(lot.total * 0.3)} xe máy)` },
            { l: "Giá theo giờ",    v: `${lot.priceHour.toLocaleString()}₫/h (ô tô)` },
            { l: "Giá theo ngày",   v: `${lot.priceDay.toLocaleString()}₫/ngày` },
            { l: "Đánh giá",        v: `${lot.rating} ⭐ (trung bình)` },
          ].map((r) => (
            <div key={r.l} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-400 font-semibold">{r.l}</span>
              <span className="text-xs font-bold text-slate-700 text-right max-w-[55%]">{r.v}</span>
            </div>
          ))}
          <button className="btn-owner-ghost w-full mt-3 text-sm py-3" onClick={() => setEditMode(true)}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Chỉnh sửa thông tin
          </button>
        </div>

        {editMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="card mx-4 p-6 w-full max-w-sm slide-up">
              <h3 className="font-black text-slate-800 text-lg mb-4">Chỉnh sửa bãi xe</h3>
              <p className="text-slate-400 text-sm mb-4">Tính năng chỉnh sửa chi tiết sẽ có trong bản cập nhật tiếp theo.</p>
              <button className="btn-owner w-full" onClick={() => setEditMode(false)}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
