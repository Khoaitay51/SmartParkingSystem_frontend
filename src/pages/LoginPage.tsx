import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp, PRESET_USERS } from "../context/AppContext";

export default function LoginPage() {
  const [phone, setPhone] = useState("0912345678");
  const [password, setPassword] = useState("123456");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (credential?: string) => {
    const cred = credential || phone;
    login(cred);
    const user = PRESET_USERS.find((u) => u.phone === cred || u.email === cred);
    if (user && user.role === "owner") {
      navigate("/owner/home");
    } else {
      navigate("/driver/home");
    }
  };

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "#f4f6fb" }}>
      {/* Top visual */}
      <div className="bg-brand-grad px-6 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/8" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/6" />
        <div className="relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" className="w-9 h-9">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="rgba(255,255,255,0.25)" />
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">ParkIQ · SIC IoT</h1>
          <p className="text-white/70 text-xs mt-0.5">Bãi đỗ xe thông minh B7 Mỹ Đình</p>
        </div>
      </div>

      {/* Form card */}
      <div className="flex-1 px-5 -mt-4 relative slide-up pb-10">
        <div className="card p-6">
          <h2 className="text-xl font-black text-slate-800 mb-0.5">Đăng nhập hệ thống</h2>
          <p className="text-slate-400 text-xs mb-4">Nhập tài khoản để tiếp tục trải nghiệm</p>

          <div
            className="flex items-center mb-3 overflow-hidden"
            style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 14 }}
          >
            <div className="flex items-center gap-2 px-3 flex-shrink-0 border-r border-slate-200 py-3">
              <span className="text-base leading-none">📱</span>
            </div>
            <input
              className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400 px-3 py-3"
              type="text"
              placeholder="Số điện thoại / Email"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div
            className="flex items-center mb-4 overflow-hidden"
            style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 14 }}
          >
            <div className="flex items-center gap-2 px-3 flex-shrink-0 border-r border-slate-200 py-3">
              <span className="text-base leading-none">🔒</span>
            </div>
            <input
              className="flex-1 bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-400 px-3 py-3"
              type="password"
              placeholder="Mật khẩu (Mặc định: 123456)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn-brand w-full py-3 text-sm font-black"
            onClick={() => handleLogin()}
          >
            Đăng nhập ngay →
          </button>

          {/* Quick preset login buttons for instant demo */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-black uppercase text-slate-400 mb-2.5 tracking-wider">
              ⚡ TÀI KHOẢN MẪU (CLICK ĐĂNG NHẬP NHANH)
            </p>
            <div className="space-y-2">
              {PRESET_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setPhone(user.phone);
                    setPassword("123456");
                    handleLogin(user.phone);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-green-50 hover:border-green-300 transition-all flex items-center justify-between text-left tap"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-black text-slate-800">{user.name}</p>
                      <p className="text-[10px] text-slate-400 mono">
                        {user.phone} · {user.defaultPlate}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: user.role === "owner" ? "#eff6ff" : "#f0fdf6",
                      color: user.role === "owner" ? "#1d4ed8" : "#16a34a",
                    }}
                  >
                    {user.role === "owner" ? "Chủ bãi" : "Tài xế"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-4 leading-relaxed">
          Mật khẩu chung cho tất cả tài khoản mẫu: <span className="font-bold text-slate-600 mono">123456</span>
        </p>
      </div>
    </div>
  );
}
