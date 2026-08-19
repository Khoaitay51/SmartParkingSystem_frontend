import { useNavigate } from "react-router";
import { useLots } from "../../hooks/useLots";
import { LotCard } from "../../components/LotCard";
import { SkeletonList } from "../../components/Skeleton";
import { Ic } from "../../components/icons";

export default function HomeIdleSection() {
  const navigate = useNavigate();
  const { data: lots = [], isLoading } = useLots();
  return (
    <>
      {/* Empty-state banner */}
      <div
        className="mx-4 mb-5 rounded-3xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg,#f0fdf6 0%,#dcfce8 100%)", border: "1.5px dashed #86efac" }}
      >
        <div className="px-5 py-5 flex items-center gap-4">
          {/* Mini parking illustration */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 relative">
              <div className="absolute bottom-0 left-0 right-0 h-4 rounded-b-2xl bg-slate-200" />
              <div className="absolute bottom-4 left-2 right-2 h-8 rounded-t-xl border-2 border-dashed border-green-300 bg-green-50 flex items-center justify-center">
                <span className="text-green-500 font-black text-lg" style={{ fontFamily: "Nunito" }}>P</span>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 opacity-30">
                <div className="w-10 h-10 text-slate-400">{Ic.car}</div>
              </div>
              <div className="absolute top-1 right-0 text-green-400 font-black text-sm" style={{ fontFamily: "Nunito" }}>?</div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-green-800 font-black text-sm mb-0.5">Chưa gửi xe ở đâu</p>
            <p className="text-green-600 text-xs leading-relaxed">
              Tìm bãi xe gần bạn và bắt đầu gửi xe thông minh với ParkIQ.
            </p>
            <button
              className="mt-3 btn-brand text-xs py-2 px-4"
              style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(22,163,74,0.25)" }}
              onClick={() => navigate("/driver/search")}
            >
              <div className="w-4 h-4">{Ic.search}</div>
              Tìm bãi xe ngay
            </button>
          </div>
        </div>
      </div>

      {/* Nearby lots */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="font-black text-slate-800 text-base">Bãi xe gần bạn</h3>
        <span className="text-xs text-green-600 font-bold tap" onClick={() => navigate("/driver/search")}>Xem tất cả</span>
      </div>
      <div className="px-4 space-y-3">
        {isLoading ? <SkeletonList n={3} /> : lots.slice(0, 3).map((lot) => (
          <LotCard key={lot.id} lot={lot} onClick={() => navigate("/driver/lot/" + lot.id)} />
        ))}
      </div>

      {/* Recently visited */}
      <div className="px-4 mt-5">
        <h3 className="font-black text-slate-800 text-base mb-3">Hay gửi xe ở</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {lots.slice(0, 3).map((lot) => (
            <div
              key={lot.id}
              className="flex-shrink-0 card-sm p-3 tap"
              style={{ width: 150 }}
              onClick={() => navigate("/driver/lot/" + lot.id)}
            >
              <div className="w-full h-20 rounded-xl overflow-hidden bg-slate-100 mb-2">
                <img
                  src="https://images.unsplash.com/photo-1593280405106-e438ebe93f5b?w=200&h=100&fit=crop&auto=format"
                  alt={lot.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-black text-slate-700 truncate">{lot.name}</p>
              <p className="text-[11px] text-green-600 font-bold">{lot.price.toLocaleString()}₫/h</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-3 h-3 text-amber-400">{Ic.star}</div>
                <span className="text-[10px] text-slate-500 font-semibold">{lot.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
