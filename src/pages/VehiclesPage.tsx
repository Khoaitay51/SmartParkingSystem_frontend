import { useState } from "react";
import { useNavigate } from "react-router";
import { Ic } from "../components/icons";

interface Vehicle {
  id: number;
  plate: string;
  type: string;
  brand: string;
  color: string;
  primary: boolean;
}

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 1, plate: "30A-123.45", type: "Ô tô con",  brand: "Toyota Camry", color: "Trắng", primary: true },
    { id: 2, plate: "51G-456.78", type: "Xe máy",    brand: "Honda Wave",   color: "Đen",   primary: false },
  ]);

  function setPrimary(id: number) {
    setVehicles((vs) => vs.map((v) => ({ ...v, primary: v.id === id })));
  }

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      <div className="bg-brand-grad px-5 pt-14 pb-6 flex-shrink-0">
        <h2 className="text-2xl font-black text-white mb-0.5">Xe của tôi</h2>
        <p className="text-white/60 text-sm">{vehicles.length} phương tiện đã đăng ký</p>
      </div>

      <div className="flex-1 page-scroll px-4 pt-4 pb-24 space-y-3">
        {vehicles.map((v) => (
          <div key={v.id} className="card p-5">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: v.type === "Ô tô con" ? "#eff6ff" : "#f0fdf6",
                  color: v.type === "Ô tô con" ? "#3b82f6" : "#16a34a",
                }}
              >
                <div className="w-7 h-7">{Ic.car}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xl font-black text-slate-800 mono">{v.plate}</p>
                  {v.primary && (
                    <span className="chip bg-green-100 text-green-700 text-[10px]">Mặc định</span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{v.brand} · {v.color}</p>
                <p className="text-xs text-slate-400">{v.type}</p>
              </div>
            </div>
            <div className="sep my-4" />
            <div className="flex gap-2">
              <button className="btn-outline-gray flex-1 py-2.5 text-xs">Chỉnh sửa</button>
              {!v.primary && (
                <button className="btn-ghost flex-1 py-2.5 text-xs" onClick={() => setPrimary(v.id)}>
                  Đặt mặc định
                </button>
              )}
            </div>
          </div>
        ))}

        <button className="btn-ghost w-full" onClick={() => navigate("/driver/vehicles/add")}>
          <div className="w-5 h-5">{Ic.plus}</div>
          Thêm phương tiện
        </button>

        <div className="card-sm p-4">
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5">{Ic.info}</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Biển số xe được camera AI tự động nhận diện khi vào/ra bãi — không cần quẹt thẻ hay thao tác thủ công.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
