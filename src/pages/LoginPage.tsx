import { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "#f4f6fb" }}>
      {/* Top visual */}
      <div className="bg-brand-grad px-6 pt-16 pb-14 text-center relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/8" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/6" />
        <div className="relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" className="w-9 h-9">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="rgba(255,255,255,0.25)" />
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">ParkIQ</h1>
          <p className="text-white/60 text-sm mt-0.5">Đỗ xe thông minh — dễ dàng &amp; an toàn</p>
        </div>
      </div>

      {/* Form card */}
      <div className="flex-1 px-5 -mt-6 relative slide-up">
        <div className="card p-6">
          <h2 className="text-xl font-black text-slate-800 mb-0.5">Đăng nhập</h2>
          <p className="text-slate-400 text-sm mb-5">Nhập số điện thoại để tiếp tục</p>

          <div
            className="flex items-center mb-4 overflow-hidden"
            style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 14, transition: "border-color 0.18s, box-shadow 0.18s" }}
          >
            <div className="flex items-center gap-2 px-4 flex-shrink-0 border-r border-slate-200" style={{ paddingTop: 14, paddingBottom: 14 }}>
              <span className="text-base leading-none">🇻🇳</span>
              <span className="text-sm font-bold text-slate-600">+84</span>
            </div>
            <input
              className="flex-1 bg-transparent outline-none text-base font-semibold text-slate-800 placeholder:text-slate-400 px-4"
              style={{ paddingTop: 14, paddingBottom: 14 }}
              type="tel"
              placeholder="912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              inputMode="numeric"
            />
          </div>

          <button
            className="btn-brand w-full"
            style={{ opacity: phone.length >= 9 ? 1 : 0.45 }}
            onClick={() => phone.length >= 9 && navigate("/otp")}
          >
            Tiếp tục →
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 sep" />
            <span className="text-xs text-slate-400 font-medium">hoặc</span>
            <div className="flex-1 sep" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["🍎  Apple ID", "🔵  Google"].map((l) => (
              <button key={l} className="btn-outline-gray py-3" onClick={() => navigate("/otp")}>{l}</button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5 px-4 leading-relaxed">
          Bằng cách tiếp tục, bạn đồng ý với{" "}
          <span className="text-green-600 font-semibold">Điều khoản</span> và{" "}
          <span className="text-green-600 font-semibold">Chính sách bảo mật</span> của ParkIQ.
        </p>
      </div>
    </div>
  );
}
