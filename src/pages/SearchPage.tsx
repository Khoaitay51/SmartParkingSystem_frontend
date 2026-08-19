import { useState } from "react";
import { useNavigate } from "react-router";
import { useLots } from "../hooks/useLots";
import { LotCard } from "../components/LotCard";
import { SkeletonList } from "../components/Skeleton";
import { Ic } from "../components/icons";

export default function SearchPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "available" | "cheap">("all");
  const { data: lots = [], isLoading } = useLots();

  const filtered = lots.filter((l) =>
    (q === "" || l.name.toLowerCase().includes(q.toLowerCase()) || l.address.toLowerCase().includes(q.toLowerCase())) &&
    (filter === "all" || (filter === "available" && l.free > 0) || (filter === "cheap" && l.price <= 5500))
  );

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Map placeholder */}
      <div className="relative flex-shrink-0" style={{ height: 220 }}>
        <img
          src="https://images.unsplash.com/photo-1526675094705-751b333fad0c?w=500&h=280&fit=crop&auto=format"
          alt="Bản đồ khu vực"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(59,130,246,0.08),rgba(244,246,251,0.95))" }} />

        {/* Lot pins */}
        {[
          { t: "30%", l: "28%", i: 0 },
          { t: "52%", l: "62%", i: 1 },
          { t: "42%", l: "78%", i: 2 },
          { t: "66%", l: "44%", i: 3 },
        ].map((pin, idx) => {
          const lot = lots[pin.i];
          return (
            <div
              key={idx}
              className="absolute flex flex-col items-center tap"
              style={{ top: pin.t, left: pin.l, transform: "translate(-50%,-100%)" }}
              onClick={() => navigate("/driver/lot/" + lot.id)}
            >
              <div
                className="px-2 py-1 rounded-lg text-white text-xs font-black shadow-lg whitespace-nowrap"
                style={{ background: lot.free === 0 ? "#ef4444" : lot.free <= 8 ? "#f59e0b" : "#16a34a" }}
              >
                {lot.free === 0 ? "Đầy" : `${lot.free} chỗ`}
              </div>
              <div
                className="w-2 h-2 rotate-45 -mt-1"
                style={{ background: lot.free === 0 ? "#ef4444" : lot.free <= 8 ? "#f59e0b" : "#16a34a" }}
              />
            </div>
          );
        })}

        {/* Search bar */}
        <div className="absolute top-3 left-4 right-4">
          <div className="bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2">
            <div className="w-4 h-4 text-slate-400 flex-shrink-0">{Ic.search}</div>
            <input
              className="flex-1 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 bg-transparent"
              placeholder="Tìm theo tên, địa chỉ..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button className="text-slate-400 text-lg leading-none" onClick={() => setQ("")}>×</button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-slate-100 flex-shrink-0 items-center">
        {[["all", "Tất cả"], ["available", "Còn chỗ"], ["cheap", "Giá rẻ"]].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v as typeof filter)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{ background: filter === v ? "#16a34a" : "#f1f5f9", color: filter === v ? "#fff" : "#64748b" }}
          >
            {l}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} kết quả</span>
      </div>

      {/* List */}
      <div className="flex-1 page-scroll px-4 pt-3 pb-24 space-y-3">
        {isLoading ? (
          <SkeletonList n={4} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 text-slate-300">{Ic.search}</div>
            </div>
            <p className="font-bold text-slate-400 text-sm">Không tìm thấy bãi xe</p>
            <p className="text-xs text-slate-300 mt-1">Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          filtered.map((lot) => (
            <LotCard key={lot.id} lot={lot} onClick={() => navigate("/driver/lot/" + lot.id)} />
          ))
        )}
      </div>
    </div>
  );
}
