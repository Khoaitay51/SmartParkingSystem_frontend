import { useState } from "react";
import { useNavigate } from "react-router";

const FEATURES = ["Camera AI", "Mái che", "Bảo vệ 24/7", "Sạc EV", "Nhà vệ sinh", "Wi-Fi miễn phí"];

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all"
            style={{
              background: i < step ? "#1d4ed8" : i === step ? "#eff6ff" : "#f1f5f9",
              color: i < step ? "#fff" : i === step ? "#1d4ed8" : "#94a3b8",
              border: i === step ? "2px solid #1d4ed8" : "2px solid transparent",
            }}
          >
            {i < step ? "✓" : i + 1}
          </div>
          {i < total - 1 && (
            <div className="flex-1 h-0.5 rounded-full" style={{ background: i < step ? "#1d4ed8" : "#e2e8f0", width: 24 }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OwnerRegisterLotPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "", address: "", phone: "",
    carSlots: "80", motoSlots: "40",
    priceHour: "5000", priceDay: "60000",
    openTime: "06:00", closeTime: "22:00", open24: false,
    features: [] as string[],
  });

  const upd = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const toggleFeature = (feat: string) => {
    upd("features", form.features.includes(feat)
      ? form.features.filter((f) => f !== feat)
      : [...form.features, feat]);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center" style={{ background: "#f4f6fb" }}>
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 slide-up" style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)" }}>
          🎉
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Đăng ký thành công!</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-2">
          Bãi xe <strong className="text-slate-700">{form.name || "Bãi xe mới"}</strong> đã được gửi để xét duyệt.
        </p>
        <p className="text-slate-400 text-xs mb-8">Chúng tôi sẽ xác minh trong 1–2 ngày làm việc.</p>

        <div className="card w-full p-5 text-left mb-6">
          {[
            { l: "Tên bãi xe",       v: form.name || "—" },
            { l: "Địa chỉ",         v: form.address || "—" },
            { l: "Sức chứa ô tô",   v: `${form.carSlots} chỗ` },
            { l: "Sức chứa xe máy", v: `${form.motoSlots} chỗ` },
            { l: "Giá theo giờ",    v: `${Number(form.priceHour).toLocaleString()}₫/h` },
          ].map((r) => (
            <div key={r.l} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-400">{r.l}</span>
              <span className="text-xs font-bold text-slate-700">{r.v}</span>
            </div>
          ))}
        </div>

        <button className="btn-owner w-full" onClick={() => navigate(-1)}>Về trang bãi xe</button>
      </div>
    );
  }

  const steps = [
    { title: "Thông tin cơ bản", sub: "Tên & địa chỉ bãi xe" },
    { title: "Sức chứa",        sub: "Số lượng chỗ đỗ" },
    { title: "Giá & Giờ mở",   sub: "Biểu giá & giờ hoạt động" },
    { title: "Tiện ích",        sub: "Tính năng & xác nhận" },
  ];

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#f4f6fb" }}>
      {/* Header */}
      <div className="bg-owner-grad px-5 pt-14 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center tap"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={() => navigate(-1)}
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-blue-200 text-xs">{steps[step].sub}</p>
            <h2 className="text-white font-black text-lg">{steps[step].title}</h2>
          </div>
        </div>
      </div>

      <div className="flex-1 page-scroll px-4 pt-5 pb-8">
        <StepIndicator step={step} total={4} />

        {/* Step 1: Basic info */}
        {step === 0 && (
          <div className="space-y-4 slide-up">
            <div>
              <label className="text-xs font-black text-slate-500 mb-1.5 block">TÊN BÃI XE *</label>
              <input className="input" placeholder="Vd: Bãi xe Mỹ Đình A" value={form.name} onChange={(e) => upd("name", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 mb-1.5 block">ĐỊA CHỈ ĐẦY ĐỦ *</label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                value={form.address}
                onChange={(e) => upd("address", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 mb-1.5 block">SỐ ĐIỆN THOẠI LIÊN HỆ *</label>
              <input className="input" type="tel" placeholder="09xx xxx xxx" value={form.phone} onChange={(e) => upd("phone", e.target.value)} />
            </div>

            <div className="card-sm p-4 flex items-start gap-3" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <span className="text-xl mt-0.5">📍</span>
              <div>
                <p className="text-xs font-black text-blue-800">Xác định vị trí trên bản đồ</p>
                <p className="text-[11px] text-blue-600 mt-0.5">Sau khi đăng ký, đội ngũ ParkIQ sẽ liên hệ để xác minh vị trí thực tế và lắp đặt thiết bị IoT.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Capacity */}
        {step === 1 && (
          <div className="space-y-4 slide-up">
            <div className="card-sm p-4">
              <p className="text-xs font-black text-slate-500 mb-3">SỐ CHỖ ĐỖ Ô TÔ</p>
              <div className="flex items-center gap-4">
                <button
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold tap"
                  onClick={() => upd("carSlots", Math.max(0, Number(form.carSlots) - 10).toString())}
                >−</button>
                <input
                  className="flex-1 text-center text-2xl font-black text-slate-800 outline-none bg-transparent mono"
                  type="number"
                  value={form.carSlots}
                  onChange={(e) => upd("carSlots", e.target.value)}
                />
                <button
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black tap"
                  style={{ background: "#eff6ff", color: "#1d4ed8" }}
                  onClick={() => upd("carSlots", (Number(form.carSlots) + 10).toString())}
                >+</button>
              </div>
            </div>

            <div className="card-sm p-4">
              <p className="text-xs font-black text-slate-500 mb-3">SỐ CHỖ ĐỖ XE MÁY</p>
              <div className="flex items-center gap-4">
                <button
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold tap"
                  onClick={() => upd("motoSlots", Math.max(0, Number(form.motoSlots) - 10).toString())}
                >−</button>
                <input
                  className="flex-1 text-center text-2xl font-black text-slate-800 outline-none bg-transparent mono"
                  type="number"
                  value={form.motoSlots}
                  onChange={(e) => upd("motoSlots", e.target.value)}
                />
                <button
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black tap"
                  style={{ background: "#eff6ff", color: "#1d4ed8" }}
                  onClick={() => upd("motoSlots", (Number(form.motoSlots) + 10).toString())}
                >+</button>
              </div>
            </div>

            <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: "#f0fdf6", border: "1px solid #bbf7d2" }}>
              <span className="text-sm font-bold text-green-800">Tổng sức chứa</span>
              <span className="text-xl font-black text-green-700 mono">{Number(form.carSlots) + Number(form.motoSlots)} chỗ</span>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & hours */}
        {step === 2 && (
          <div className="space-y-4 slide-up">
            <div>
              <label className="text-xs font-black text-slate-500 mb-1.5 block">GIÁ THEO GIỜ (ô tô) — VND</label>
              <input
                className="input mono text-lg"
                type="number"
                placeholder="5000"
                value={form.priceHour}
                onChange={(e) => upd("priceHour", e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                {["4000","5000","6000","8000"].map((p) => (
                  <button
                    key={p}
                    className="flex-1 py-1.5 rounded-xl text-xs font-bold tap"
                    style={{ background: form.priceHour === p ? "#eff6ff" : "#f8fafc", color: form.priceHour === p ? "#1d4ed8" : "#94a3b8", border: `1.5px solid ${form.priceHour === p ? "#bfdbfe" : "#e2e8f0"}` }}
                    onClick={() => upd("priceHour", p)}
                  >
                    {Number(p).toLocaleString()}₫
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 mb-1.5 block">GIÁ THEO NGÀY (ô tô) — VND</label>
              <input
                className="input mono text-lg"
                type="number"
                placeholder="60000"
                value={form.priceDay}
                onChange={(e) => upd("priceDay", e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 mb-1.5 block">GIỜ HOẠT ĐỘNG</label>
              <div className="flex items-center gap-3">
                <input
                  className="input flex-1 text-center mono font-bold"
                  type="time"
                  value={form.openTime}
                  disabled={form.open24}
                  onChange={(e) => upd("openTime", e.target.value)}
                />
                <span className="text-slate-400 font-bold">→</span>
                <input
                  className="input flex-1 text-center mono font-bold"
                  type="time"
                  value={form.closeTime}
                  disabled={form.open24}
                  onChange={(e) => upd("closeTime", e.target.value)}
                />
              </div>
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-2xl tap"
              style={{ background: form.open24 ? "#eff6ff" : "#f8fafc", border: `1.5px solid ${form.open24 ? "#bfdbfe" : "#e2e8f0"}` }}
              onClick={() => upd("open24", !form.open24)}
            >
              <div>
                <p className="text-sm font-bold text-slate-700">Mở cửa 24/7</p>
                <p className="text-xs text-slate-400">Hoạt động liên tục không nghỉ</p>
              </div>
              <div
                className="w-11 h-6 rounded-full transition-all"
                style={{ background: form.open24 ? "#1d4ed8" : "#e2e8f0" }}
              >
                <div
                  className="w-4 h-4 bg-white rounded-full mt-1 transition-all"
                  style={{ marginLeft: form.open24 ? 26 : 4, boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Features + confirm */}
        {step === 3 && (
          <div className="space-y-4 slide-up">
            <div>
              <label className="text-xs font-black text-slate-500 mb-3 block">TIỆN ÍCH BÃI XE</label>
              <div className="grid grid-cols-2 gap-2">
                {FEATURES.map((feat) => {
                  const on = form.features.includes(feat);
                  return (
                    <button
                      key={feat}
                      className="flex items-center gap-2 p-3 rounded-2xl tap text-left"
                      style={{ background: on ? "#eff6ff" : "#f8fafc", border: `1.5px solid ${on ? "#bfdbfe" : "#e2e8f0"}` }}
                      onClick={() => toggleFeature(feat)}
                    >
                      <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: on ? "#1d4ed8" : "#e2e8f0" }}>
                        {on && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <span className="text-xs font-bold" style={{ color: on ? "#1d4ed8" : "#64748b" }}>{feat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 mb-2 block">TÀI LIỆU XÁC NHẬN</label>
              <button className="w-full border-2 border-dashed border-blue-200 rounded-2xl py-8 flex flex-col items-center gap-2 tap" style={{ background: "#f8fbff" }}>
                <span className="text-3xl">📄</span>
                <p className="text-sm font-bold text-blue-600">Tải lên Giấy phép kinh doanh</p>
                <p className="text-xs text-slate-400">JPG, PNG hoặc PDF · Tối đa 10MB</p>
              </button>
            </div>

            {/* Summary */}
            <div className="card-sm p-4" style={{ background: "#f0fdf6", border: "1px solid #bbf7d2" }}>
              <p className="text-xs font-black text-green-800 mb-3">TÓM TẮT ĐĂNG KÝ</p>
              {[
                { l: "Tên bãi xe",     v: form.name || "—" },
                { l: "Tổng sức chứa", v: `${Number(form.carSlots) + Number(form.motoSlots)} chỗ` },
                { l: "Giá theo giờ",  v: `${Number(form.priceHour).toLocaleString()}₫` },
                { l: "Giờ hoạt động", v: form.open24 ? "24/7" : `${form.openTime} – ${form.closeTime}` },
              ].map((r) => (
                <div key={r.l} className="flex justify-between py-1.5 border-b border-green-100 last:border-0">
                  <span className="text-xs text-green-700">{r.l}</span>
                  <span className="text-xs font-black text-green-800">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button className="btn-owner-ghost flex-1" onClick={() => setStep((s) => s - 1)}>
              ← Quay lại
            </button>
          )}
          <button
            className="btn-owner flex-1"
            onClick={() => {
              if (step < 3) setStep((s) => s + 1);
              else setDone(true);
            }}
          >
            {step < 3 ? "Tiếp theo →" : "Gửi đăng ký 🎉"}
          </button>
        </div>
      </div>
    </div>
  );
}
