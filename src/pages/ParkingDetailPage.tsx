import { useNavigate, useParams } from "react-router";
import { useLot } from "../hooks/useLots";
import { useApp } from "../context/AppContext";
import { BackBtn } from "../components/BackBtn";
import { Ic } from "../components/icons";
import { GateButton } from "../components/GateButton";
import { SkeletonList } from "../components/Skeleton";

export default function ParkingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const { startParking } = useApp();
  const { data: lot, isLoading } = useLot(Number(id));

  if (isLoading) {
    return (
      <div className="flex flex-col" style={{ height: "100dvh" }}>
        <div className="h-64 bg-slate-200 animate-pulse" />
        <div className="p-4">
          <SkeletonList n={3} />
        </div>
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
  const pct = Math.round(((lot.total - lot.free) / lot.total) * 100);
  const isFull = lot.free === 0;

  function handleStart() {
    startParking(lot!);
    navigate("/driver/home");
  }

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Hero photo */}
      <div className="relative flex-shrink-0" style={{ height: 250 }}>
        <img
          src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=500&h=300&fit=crop&auto=format"
          alt={lot.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0) 50%,rgba(244,246,251,0.3) 100%)" }}
        />
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <BackBtn onPress={() => navigate(-1)} />
          <div>
            {isFull
              ? <span className="status-pill-red">Hết chỗ</span>
              : lot.free <= 8
              ? <span className="status-pill-amber">{lot.free} chỗ trống</span>
              : <span className="status-pill-green">{lot.free} chỗ trống</span>
            }
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-xl font-black text-white drop-shadow-lg">{lot.name}</h2>
          <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
            <span className="w-3 h-3 inline-block">{Ic.pin}</span>
            {lot.address}
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 page-scroll bg-white rounded-t-3xl -mt-3 relative px-5 pt-4 pb-36">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Giá/giờ", val: `${lot.price.toLocaleString()}₫`, c: "#16a34a" },
            { label: "Đánh giá", val: `${lot.rating} ★`, c: "#d97706" },
            { label: "Giờ mở", val: lot.open, c: "#3b82f6" },
          ].map((s) => (
            <div key={s.label} className="card-sm p-3 text-center">
              <p className="text-sm font-black" style={{ color: s.c }}>{s.val}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Occupancy */}
        <div className="card-sm p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-slate-700">Mức độ lấp đầy</span>
            <span className="text-sm font-black mono" style={{ color: pct > 90 ? "#dc2626" : pct > 70 ? "#d97706" : "#16a34a" }}>
              {pct}%
            </span>
          </div>
          <div className="progress-bar h-3 mb-1.5">
            <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "#22c55e" }} />
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-slate-400">{lot.total - lot.free} xe đang đỗ</span>
            <span className="text-xs font-bold text-green-600">{lot.free} chỗ còn trống</span>
          </div>
        </div>

        {/* Features */}
        <p className="text-sm font-black text-slate-700 mb-2">Tiện ích bãi xe</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {lot.features.map((f) => (
            <div key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 border border-green-100">
              <div className="w-3.5 h-3.5 text-green-500">{Ic.check}</div>
              <span className="text-xs font-bold text-green-700">{f}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <p className="text-sm font-black text-slate-700 mb-2">Bảng giá</p>
        <div className="card-sm overflow-hidden mb-5">
          {[
            ["Phí theo giờ", `${lot.price.toLocaleString()} ₫/h`],
            ["Cả ngày (≤24h)", `${lot.priceDay.toLocaleString()} ₫`],
            ["Qua đêm", `${Math.round(lot.priceDay * 1.2).toLocaleString()} ₫`],
          ].map(([l, v], i) => (
            <div key={i}>
              {i > 0 && <div className="sep mx-4" />}
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-slate-500">{l}</span>
                <span className="text-sm font-black text-slate-800 mono">{v}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <p className="text-sm font-black text-slate-700 mb-3">Đánh giá ({lot.reviews})</p>
        {[
          { name: "Trần Minh Đức", rating: 5, text: "Camera nhận diện rất nhanh, không cần quẹt thẻ.", date: "2 ngày trước" },
          { name: "Lê Thu Hà",     rating: 4, text: "Vị trí thuận tiện, thanh toán tự động tiện lợi.", date: "1 tuần trước" },
        ].map((r) => (
          <div key={r.name} className="card-sm p-4 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-black text-green-700">{r.name[0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700">{r.name}</p>
                <div className="flex gap-0.5">
                  {Array(r.rating).fill(0).map((_, i) => (
                    <div key={i} className="w-3 h-3 text-amber-400">{Ic.star}</div>
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-slate-400">{r.date}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Fixed CTA */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-100 px-5 pt-4"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom,0px))" }}
      >
        {!isFull ? (
          <>
            <GateButton mode="entry" onOpened={handleStart} />
            <button className="btn-outline-gray w-full mt-2 py-2.5 text-sm" onClick={() => {}}>
              <div className="w-5 h-5">{Ic.navigate}</div>
              Chỉ đường đến đây
            </button>
          </>
        ) : (
          <div className="rounded-2xl p-4 text-center" style={{ background: "#fef2f2", border: "1.5px solid #fca5a5" }}>
            <p className="text-red-600 font-black text-sm">Bãi xe đã đầy</p>
            <p className="text-red-400 text-xs mt-0.5">Vui lòng chọn bãi xe khác</p>
          </div>
        )}
      </div>
    </div>
  );
}
