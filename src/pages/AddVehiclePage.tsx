import { useState } from "react";
import { useNavigate } from "react-router";
import { BackBtn } from "../components/BackBtn";
import { Ic } from "../components/icons";

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ plate: "", type: "car", brand: "", color: "" });
  const [done, setDone] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: key === "plate" ? value.toUpperCase() : value }));
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-white px-6 text-center slide-up">
        <div
          className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-5"
          style={{ border: "3px solid #22c55e" }}
        >
          <div className="w-10 h-10 text-green-500">{Ic.check}</div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-1">Đã thêm xe!</h2>
        <p className="text-slate-500 text-sm mb-0.5">Biển số</p>
        <p className="font-black text-xl text-slate-800 mono mb-6">{form.plate}</p>
        <p className="text-slate-400 text-xs mb-8">Camera AI đã ghi nhận và sẵn sàng nhận diện</p>
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
          <h2 className="text-xl font-black text-white">Thêm phương tiện</h2>
        </div>
        <p className="text-white/60 text-sm ml-1">Đăng ký biển số để tự động nhận diện</p>
      </div>

      <div className="flex-1 px-5 pt-5 page-scroll pb-28">
        <p className="text-sm font-bold text-slate-500 mb-3">Loại phương tiện</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[["car", "🚗", "Ô tô"], ["motorbike", "🏍️", "Xe máy"]].map(([v, e, l]) => (
            <button
              key={v}
              onClick={() => set("type", v)}
              className="py-4 rounded-2xl flex flex-col items-center gap-1.5 transition-all"
              style={{
                border: `2px solid ${form.type === v ? "#22c55e" : "#e2e8f0"}`,
                background: form.type === v ? "#f0fdf6" : "#f8fafc",
              }}
            >
              <span className="text-3xl">{e}</span>
              <span className="text-sm font-bold" style={{ color: form.type === v ? "#16a34a" : "#475569" }}>
                {l}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1.5 block">BIỂN SỐ XE</label>
            <input
              className="input font-black text-xl mono uppercase tracking-widest"
              placeholder="30A-123.45"
              value={form.plate}
              onChange={(e) => set("plate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1.5 block">HÃNG XE</label>
            <input
              className="input"
              placeholder="Toyota, Honda, Yamaha..."
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-1.5 block">MÀU SẮC</label>
            <input
              className="input"
              placeholder="Trắng, Đen, Bạc..."
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
          className="btn-brand w-full"
          style={{ opacity: form.plate.length >= 6 ? 1 : 0.4 }}
          onClick={() => form.plate.length >= 6 && setDone(true)}
        >
          Đăng ký xe
        </button>
      </div>
    </div>
  );
}
