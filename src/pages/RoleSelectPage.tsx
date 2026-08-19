import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function RoleSelectPage() {
  const navigate = useNavigate();
  const { setRole } = useApp();

  function goDriver() {
    setRole("driver");
    navigate("/driver/home");
  }

  function goOwner() {
    setRole("owner");
    navigate("/owner/home");
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: "#f4f6fb" }}>
      <div
        className="px-6 pt-16 pb-20 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 50%, #22c55e 100%)" }}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />
        <div className="relative">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="w-9 h-9">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="rgba(255,255,255,0.25)" />
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Chào mừng đến ParkIQ</h1>
          <p className="text-white/60 text-sm mt-1">Bạn muốn sử dụng với tư cách nào?</p>
        </div>
      </div>

      <div className="px-5 -mt-8 space-y-4 slide-up">
        <div
          className="card p-5 tap flex items-center gap-4 border-2"
          style={{ borderColor: "#22c55e" }}
          onClick={goDriver}
        >
          <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl" style={{ background: "linear-gradient(135deg,#f0fdf6,#dcfce8)" }}>
            🚗
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-800 text-lg">Tài xế</h3>
            <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">Tìm bãi xe, gửi xe thông minh và quản lý chi phí.</p>
            <div className="flex items-center gap-2 mt-2">
              {["Tìm bãi xe", "Mở cổng IoT", "Ví điện tử"].map((t) => (
                <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#f0fdf6", color: "#16a34a" }}>{t}</span>
              ))}
            </div>
          </div>
          <svg className="w-5 h-5 text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>

        <div
          className="card p-5 tap flex items-center gap-4 border-2"
          style={{ borderColor: "#3b82f6" }}
          onClick={goOwner}
        >
          <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl" style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)" }}>
            🏢
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-800 text-lg">Chủ bãi xe</h3>
            <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">Quản lý bãi xe, điều khiển cổng IoT và theo dõi doanh thu.</p>
            <div className="flex items-center gap-2 mt-2">
              {["Quản lý bãi", "Cổng IoT", "Thu nhập"].map((t) => (
                <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#eff6ff", color: "#1d4ed8" }}>{t}</span>
              ))}
            </div>
          </div>
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6 px-6">
        Bạn có thể chuyển đổi vai trò bất kỳ lúc nào từ trang Hồ sơ.
      </p>
    </div>
  );
}
