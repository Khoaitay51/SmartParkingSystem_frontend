import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { BackBtn } from "../components/BackBtn";
import { Ic } from "../components/icons";

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const { addVehicle } = useApp();
  const [form, setForm] = useState({ plate: "", type: "Ô tô con", brand: "", color: "" });
  const [done, setDone] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: key === "plate" ? value.toUpperCase() : value }));
  }

  function handleSubmit() {
    if (form.plate.length < 6) return;
    addVehicle({
      plate: form.plate,
      type: form.type,
      brand: form.brand || "Xe cá nhân",
      color: form.color || "Trắng",
      primary: false,
      ownerPhone: "",
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-white px-6 text-center slide-up">
        <div
          className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4"
          style={{ border: "3px solid #22c55e" }}
        >
          <div className="w-10 h-10 text-green-500">{Ic.check}</div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-1">Đăng ký thành công!</h2>
        <p className="text-slate-500 text-xs mb-1">Biển số xe đã lưu hệ thống</p>
        <p className="font-black text-2xl text-emerald-600 mono mb-4 tracking-wider">{form.plate}</p>
        <p className="text-slate-400 text-xs mb-8">
          Hệ thống camera AI OCR tại cổng bãi đỗ đã sẵn sàng nhận diện phương tiện này.
        </p>
        <button className="btn-brand w-full max-w-xs" onClick={() => navigate(-1 as unknown as string)}>
          Về danh sách xe
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="bg-brand-grad px-5 pt-14 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <BackBtn onPress={() => navigate(-1 as unknown as string)} />
          <h2 className="text-xl font-black text-white">Đăng ký biển số xe</h2>
        </div>
        <p className="text-white/70 text-xs ml-1">Đăng ký để tự động quét biển số và mở barrier</p>
      </div>

      <div className="flex-1 px-5 pt-5 page-scroll pb-28">
        <p className="text-xs font-black uppercase text-slate-400 mb-3 tracking-wider">LOẠI PHƯƠNG TIỆN</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[["Ô tô con", "🚗"], ["Xe máy", "🏍️"]].map(([l, e]) => (
            <button
              key={l}
              onClick={() => set("type", l)}
              className="py-3 rounded-2xl flex flex-col items-center gap-1 transition-all"
              style={{
                border: `2px solid ${form.type === l ? "#22c55e" : "#e2e8f0"}`,
                background: form.type === l ? "#f0fdf6" : "#f8fafc",
              }}
            >
              <span className="text-2xl">{e}</span>
              <span className="text-xs font-bold" style={{ color: form.type === l ? "#16a34a" : "#475569" }}>
                {l}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">BIỂN SỐ XE (VD: 30A-123.45)</label>
            <input
              className="input font-black text-xl mono uppercase tracking-widest"
              placeholder="30A-123.45"
              value={form.plate}
              onChange={(e) => set("plate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">HÃNG XE / DÒNG XE</label>
            <input
              className="input text-sm"
              placeholder="VinFast, Toyota, Honda, Mazda..."
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1.5 block">MÀU SẮC</label>
            <input
              className="input text-sm"
              placeholder="Trắng, Đen, Đỏ, Bạc..."
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-100 px-5 py-4"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom,0px))" }}
      >
        <button
          className="btn-brand w-full py-3 text-sm font-black"
          style={{ opacity: form.plate.length >= 6 ? 1 : 0.4 }}
          onClick={handleSubmit}
        >
          Xác nhận đăng ký xe
        </button>
      </div>
    </div>
  );
}
