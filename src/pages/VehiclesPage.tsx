import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { BackBtn } from "../components/BackBtn";
import { Ic } from "../components/icons";

export default function VehiclesPage() {
  const navigate = useNavigate();
  const { vehicles, setPrimaryVehicle, currentUser } = useApp();
  const [tab, setTab] = useState<"my" | "all">("my");

  const myVehicles = vehicles.filter(
    (v) => v.ownerPhone === currentUser.phone || v.plate === currentUser.defaultPlate
  );
  const displayVehicles = tab === "my" ? (myVehicles.length > 0 ? myVehicles : vehicles) : vehicles;

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      <div className="bg-brand-grad px-5 pt-14 pb-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <BackBtn onPress={() => navigate(-1 as unknown as string)} />
          <h2 className="text-2xl font-black text-white">Quản lý xe</h2>
        </div>
        <p className="text-white/70 text-xs ml-1">
          {vehicles.length} phương tiện đã đăng ký nhận diện tự động qua AI Camera
        </p>

        {/* Tab switch */}
        <div className="mt-3 flex p-1 bg-white/15 rounded-xl border border-white/20">
          <button
            onClick={() => setTab("my")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${tab === "my" ? "bg-white text-blue-900 shadow-sm" : "text-white/80"}`}
          >
            Xe của tôi ({myVehicles.length})
          </button>
          <button
            onClick={() => setTab("all")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${tab === "all" ? "bg-white text-blue-900 shadow-sm" : "text-white/80"}`}
          >
            Tất cả xe hệ thống ({vehicles.length})
          </button>
        </div>
      </div>

      <div className="flex-1 page-scroll px-4 pt-4 pb-24 space-y-3">
        {displayVehicles.map((v) => (
          <div key={v.id} className="card p-4">
            <div className="flex items-start gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: v.type === "Ô tô con" ? "#eff6ff" : "#f0fdf6",
                  color: v.type === "Ô tô con" ? "#3b82f6" : "#16a34a",
                }}
              >
                <div className="w-6 h-6">{Ic.car}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-lg font-black text-slate-800 mono tracking-wider">{v.plate}</p>
                  {v.primary && (
                    <span className="chip bg-green-100 text-green-700 text-[10px] font-bold">Mặc định</span>
                  )}
                  {v.ownerPhone && (
                    <span className="text-[10px] font-mono text-slate-400 ml-auto">
                      SĐT: {v.ownerPhone}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-semibold">{v.brand} · {v.color}</p>
                <p className="text-[11px] text-slate-400">{v.type}</p>
              </div>
            </div>
            <div className="sep my-3" />
            <div className="flex gap-2 items-center">
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● AI Camera: Sẵn sàng nhận diện
              </span>
              {!v.primary && (
                <button
                  className="btn-ghost ml-auto py-1.5 px-3 text-xs"
                  onClick={() => setPrimaryVehicle(v.id)}
                >
                  Đặt mặc định
                </button>
              )}
            </div>
          </div>
        ))}

        <button className="btn-brand w-full py-3 text-sm font-bold flex items-center justify-center gap-2" onClick={() => navigate("/driver/vehicles/add")}>
          <div className="w-4 h-4">{Ic.plus}</div>
          Đăng ký thêm biển số xe mới
        </button>

        <div className="card-sm p-4 bg-blue-50 border border-blue-200">
          <div className="flex gap-2.5 items-start">
            <div className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5">{Ic.info}</div>
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Cơ chế tự động:</strong> Khi xe có biển số đã đăng ký tiến đến cổng bãi xe, camera OCR sẽ tự động quét biển số, mở barrier vào bãi và tự động trừ tiền ví khi xe rời cổng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
