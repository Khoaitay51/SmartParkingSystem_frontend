import type { Lot } from "../types";
import { Ic } from "./icons";

interface LotCardProps {
  lot: Lot;
  onClick: () => void;
}

export function LotCard({ lot, onClick }: LotCardProps) {
  const pct = Math.round(((lot.total - lot.free) / lot.total) * 100);
  const isFull = lot.free === 0;
  const isAlmostFull = lot.free > 0 && lot.free <= 8;
  const barColor = isFull ? "#ef4444" : isAlmostFull ? "#f59e0b" : "#22c55e";
  const badgeColor = isFull
    ? { bg: "#fef2f2", text: "#dc2626" }
    : isAlmostFull
    ? { bg: "#fffbeb", text: "#d97706" }
    : { bg: "#f0fdf6", text: "#16a34a" };

  return (
    <div className="card-sm p-4 tap" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="font-bold text-slate-800 text-sm">{lot.name}</h4>
            {isFull && <span className="chip bg-red-50 text-red-500 text-[10px]">Hết chỗ</span>}
            {isAlmostFull && <span className="chip bg-amber-50 text-amber-600 text-[10px]">Sắp đầy</span>}
          </div>
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1 truncate">
            <span className="w-3 h-3 inline-block text-slate-300 flex-shrink-0">{Ic.pin}</span>
            {lot.address}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-green-600">{lot.price.toLocaleString()}₫/h</span>
            <span className="text-xs text-slate-400">{lot.dist}</span>
            <div className="flex items-center gap-0.5">
              <div className="w-3 h-3 text-amber-400">{Ic.star}</div>
              <span className="text-xs font-semibold text-slate-600">{lot.rating}</span>
            </div>
          </div>
        </div>
        <div className="text-center flex-shrink-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-0.5"
            style={{ background: badgeColor.bg, color: badgeColor.text }}
          >
            <span className="font-black text-base mono">{lot.free}</span>
          </div>
          <p className="text-[9px] text-slate-400">chỗ trống</p>
        </div>
      </div>
      <div className="mt-3 progress-bar h-1.5">
        <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}
