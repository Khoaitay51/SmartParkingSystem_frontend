import type { Transaction } from "../types";
import { Ic } from "./icons";
import { fmt } from "../utils";

interface TxRowProps {
  tx: Transaction;
  last: boolean;
}

export function TxRow({ tx, last }: TxRowProps) {
  const isIn = tx.amount > 0;
  return (
    <div>
      <div className="flex items-center gap-3 p-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isIn ? "#f0fdf6" : "#eff6ff",
            color: isIn ? "#16a34a" : "#3b82f6",
          }}
        >
          {isIn ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          ) : (
            <div className="w-5 h-5">{Ic.car}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{tx.label}</p>
          <p className="text-xs text-slate-400 truncate">{tx.sub}</p>
        </div>
        <span className={`text-sm font-black mono ${isIn ? "text-green-600" : "text-slate-700"}`}>
          {isIn ? "+" : "-"}{fmt(tx.amount)}
        </span>
      </div>
      {!last && <div className="sep mx-4" />}
    </div>
  );
}
