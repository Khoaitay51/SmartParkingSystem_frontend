import { useState } from "react";
import { OWNER_LOTS } from "../../data";
import { GateButton } from "../../components/GateButton";

const GATE_LOG = [
  { plate: "30A-123.45", action: "vào", time: "14:23", lot: "Mỹ Đình A", gate: "Cổng A" },
  { plate: "51G-456.78", action: "ra",  time: "14:10", lot: "Mỹ Đình A", gate: "Cổng B" },
  { plate: "29A-789.01", action: "vào", time: "13:55", lot: "Cầu Giấy",  gate: "Cổng A" },
  { plate: "30F-222.33", action: "ra",  time: "13:40", lot: "Cầu Giấy",  gate: "Cổng B" },
  { plate: "34A-111.22", action: "vào", time: "13:21", lot: "Mỹ Đình A", gate: "Cổng A" },
  { plate: "88H-999.11", action: "ra",  time: "13:05", lot: "Mỹ Đình A", gate: "Cổng B" },
  { plate: "43A-555.66", action: "vào", time: "12:48", lot: "Cầu Giấy",  gate: "Cổng A" },
];

export default function OwnerGatePage() {
  const [selectedLot, setSelectedLot] = useState(0);
  const lot = OWNER_LOTS[selectedLot];

  const logForLot = GATE_LOG.filter((g) =>
    lot.name.includes(g.lot.split(" ").pop()!)
  );

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-owner-grad px-5 pt-14 pb-5 flex-shrink-0">
        <p className="text-blue-200 text-xs font-semibold mb-1">Điều khiển từ xa</p>
        <h2 className="text-white font-black text-2xl">Cổng IoT</h2>

        {/* IoT signal */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-end gap-0.5">
            {[3, 5, 7, 9].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-sm"
                style={{
                  height: h,
                  background: i < 3 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
          <span className="text-blue-200 text-xs font-semibold">Kết nối ổn định · Độ trễ 12ms</span>
          <div className="w-2 h-2 rounded-full bg-green-400 ml-auto" style={{ animation: "blink 2s infinite" }} />
        </div>
      </div>

      <div className="flex-1 page-scroll pb-24">
        {/* Lot selector */}
        <div className="mx-4 mt-4">
          <p className="text-xs font-black text-slate-500 mb-2">CHỌN BÃI XE</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {OWNER_LOTS.map((l, i) => (
              <button
                key={l.id}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black tap"
                style={{
                  background: selectedLot === i ? "#1d4ed8" : "#fff",
                  color: selectedLot === i ? "#fff" : "#64748b",
                  border: `1.5px solid ${selectedLot === i ? "#1d4ed8" : "#e2e8f0"}`,
                  boxShadow: selectedLot === i ? "0 4px 12px rgba(29,78,216,0.25)" : "none",
                }}
                onClick={() => setSelectedLot(i)}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lot status */}
        <div className="mx-4 mt-3 card-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-slate-800">{lot.name}</p>
            <p className="text-xs text-slate-400">{lot.address}</p>
          </div>
          <div className="text-right">
            <span
              className="text-xs font-black px-3 py-1.5 rounded-full"
              style={{
                background: lot.status === "open" ? "#f0fdf6" : "#fef2f2",
                color: lot.status === "open" ? "#16a34a" : "#dc2626",
              }}
            >
              {lot.status === "open" ? "● Đang mở" : "✕ Đóng cửa"}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">{lot.occupied}/{lot.total} chỗ đã đỗ</p>
          </div>
        </div>

        {/* Gate controls */}
        {lot.status === "open" ? (
          <div className="mx-4 mt-4">
            <p className="text-xs font-black text-slate-500 mb-3">ĐIỀU KHIỂN CỔNG</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="card-sm p-3 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs font-black text-slate-700">Cổng vào A</span>
                </div>
                <GateButton mode="entry" />
              </div>
              <div>
                <div className="card-sm p-3 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs font-black text-slate-700">Cổng ra B</span>
                </div>
                <GateButton mode="exit" />
              </div>
            </div>

            {/* Emergency */}
            <button
              className="w-full mt-4 py-3.5 rounded-2xl text-sm font-black tap"
              style={{ background: "#fef2f2", color: "#dc2626", border: "1.5px solid #fecaca" }}
            >
              🚨 Khóa khẩn cấp tất cả cổng
            </button>
          </div>
        ) : (
          <div className="mx-4 mt-4 card-sm p-6 text-center">
            <span className="text-4xl block mb-3">🔒</span>
            <p className="font-black text-slate-600 text-sm">Bãi xe đang đóng cửa</p>
            <p className="text-xs text-slate-400 mt-1">Mở lại bãi xe để điều khiển cổng</p>
          </div>
        )}

        {/* Camera feed */}
        <div className="mx-4 mt-4 card-sm overflow-hidden">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=180&fit=crop&auto=format"
              alt="Live camera"
              className="w-full object-cover"
              style={{ height: 150, filter: "brightness(0.65)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: "rgba(0,0,0,0.5)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" style={{ animation: "blink 1.2s infinite" }} />
                  TRỰC TIẾP
                </div>
                <span className="text-white text-[10px] font-semibold bg-black/50 px-2 py-0.5 rounded-full">
                  {lot.name} · Cổng vào
                </span>
              </div>
              <span className="text-white/60 text-[10px] font-mono">19/08/2026 14:28:37</span>
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div className="mx-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black text-slate-500">LỊCH SỬ CỔNG HÔM NAY</p>
            <span className="text-[11px] text-blue-600 font-bold">{GATE_LOG.length} sự kiện</span>
          </div>
          <div className="card-sm overflow-hidden">
            {(logForLot.length > 0 ? logForLot : GATE_LOG.slice(0, 5)).map((g, i) => (
              <div key={i}>
                {i > 0 && <div className="sep mx-4" />}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: g.action === "vào" ? "#f0fdf6" : "#fef2f2" }}
                  >
                    {g.action === "vào" ? "⬇️" : "⬆️"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-700 mono">{g.plate}</p>
                    <p className="text-[11px] text-slate-400">{g.gate} · Xe {g.action}</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mono">{g.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IoT devices status */}
        <div className="mx-4 mt-4 mb-4">
          <p className="text-xs font-black text-slate-500 mb-3">THIẾT BỊ IoT</p>
          <div className="card-sm p-4 space-y-3">
            {[
              { name: "Cảm biến vào A",  status: "online", ping: "8ms" },
              { name: "Cảm biến ra B",   status: "online", ping: "11ms" },
              { name: "Camera CAM-01",   status: "online", ping: "24ms" },
              { name: "Camera CAM-02",   status: lot.status === "open" ? "online" : "offline", ping: "—" },
              { name: "Màn hình LED",    status: "online", ping: "6ms" },
            ].map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.status === "online" ? "#22c55e" : "#ef4444" }} />
                  <span className="text-xs font-semibold text-slate-600">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] mono text-slate-400">{d.ping}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: d.status === "online" ? "#f0fdf6" : "#fef2f2",
                      color: d.status === "online" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {d.status === "online" ? "Online" : "Offline"}
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
