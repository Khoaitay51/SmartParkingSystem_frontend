import { useState } from "react";
import { useNavigate } from "react-router";
import { TRANSACTIONS } from "../data";
import { BackBtnLight } from "../components/BackBtn";
import { TxRow } from "../components/TxRow";

type Filter = "all" | "parking" | "topup";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Filter>("all");
  const filtered = TRANSACTIONS.filter((t) => tab === "all" || t.type === tab);

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      <div className="bg-white border-b border-slate-100 flex-shrink-0 px-4 pt-14 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <BackBtnLight onPress={() => navigate(-1 as unknown as string)} />
          <h2 className="text-xl font-black text-slate-800">Lịch sử giao dịch</h2>
        </div>
        <div className="flex gap-2">
          {([["all", "Tất cả"], ["parking", "Gửi xe"], ["topup", "Nạp tiền"]] as [Filter, string][]).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{ background: tab === v ? "#16a34a" : "#f1f5f9", color: tab === v ? "#fff" : "#64748b" }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 page-scroll px-4 pt-3 pb-6">
        <div className="card-sm overflow-hidden">
          {filtered.map((tx, i) => (
            <TxRow key={tx.id} tx={tx} last={i === filtered.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
