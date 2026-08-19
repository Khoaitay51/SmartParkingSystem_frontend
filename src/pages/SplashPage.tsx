import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/login"), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-brand-grad">
      <div className="fade-in text-center">
        <div
          className="w-24 h-24 bg-white/20 rounded-[28px] flex items-center justify-center mx-auto mb-5 backdrop-blur-sm"
          style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}
        >
          <svg viewBox="0 0 24 24" className="w-12 h-12">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="rgba(255,255,255,0.25)" />
            <path d="M9 17V7h4a3 3 0 0 1 0 6H9" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-white mb-1.5" style={{ letterSpacing: "-0.02em" }}>
          ParkIQ
        </h1>
        <p className="text-white/60 text-sm font-medium">Đỗ xe thông minh · IoT kết nối</p>
      </div>
      <div className="absolute bottom-14 flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-full bg-white/30" style={{ width: i === 0 ? 20 : 6, height: 6 }} />
          ))}
        </div>
        <p className="text-white/40 text-xs">v2.4.1</p>
      </div>
    </div>
  );
}
