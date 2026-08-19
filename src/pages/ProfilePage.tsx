import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Ic } from "../components/icons";

const MENU_GROUPS = [
  {
    title: "Tài khoản",
    items: [
      { e: "👤", l: "Thông tin cá nhân",        badge: "" },
      { e: "🔒", l: "Bảo mật & Mật khẩu",       badge: "" },
      { e: "🔔", l: "Thông báo",                 badge: "3" },
      { e: "💳", l: "Phương thức thanh toán",    badge: "" },
    ],
  },
  {
    title: "Hỗ trợ",
    items: [
      { e: "❓", l: "Câu hỏi thường gặp",  badge: "" },
      { e: "💬", l: "Chat hỗ trợ",         badge: "" },
      { e: "📞", l: "Hotline: 1900 1234",  badge: "" },
    ],
  },
  {
    title: "Khác",
    items: [
      { e: "⭐", l: "Đánh giá ứng dụng",    badge: "" },
      { e: "📋", l: "Điều khoản dịch vụ",   badge: "" },
      { e: "🛡️", l: "Chính sách bảo mật",  badge: "" },
    ],
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { setRole } = useApp();
  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-brand-grad px-5 pt-14 pb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format"
              alt="avatar"
              className="rounded-2xl object-cover border-2 border-white/30"
              style={{ width: 72, height: 72 }}
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
              <span className="text-xs">✏️</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Nguyễn Văn An</h2>
            <p className="text-white/60 text-sm">+84 912 345 678</p>
            <div
              className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.18)", color: "#dcfce8" }}
            >
              <div className="w-3 h-3">{Ic.check}</div>
              Đã xác thực CCCD
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex bg-white border-b border-slate-100 divide-x divide-slate-100 flex-shrink-0">
        {[
          { v: "47",    l: "Lượt gửi" },
          { v: "4.9★",  l: "Đánh giá" },
          { v: "660K₫", l: "Số dư" },
        ].map((s) => (
          <div key={s.l} className="flex-1 py-3 text-center">
            <p className="text-sm font-black text-slate-800 mono">{s.v}</p>
            <p className="text-[10px] text-slate-400">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="flex-1 page-scroll px-4 pt-4 pb-24 space-y-4">
        {MENU_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-black text-slate-400 mb-2 px-1">{group.title}</p>
            <div className="card-sm overflow-hidden">
              {group.items.map((item, i) => (
                <div key={item.l}>
                  {i > 0 && <div className="sep mx-4" />}
                  <div
                    className="flex items-center gap-3 px-4 py-3.5 tap"
                    onClick={() => item.l.includes("Thông báo") && navigate("/driver/notifications")}
                  >
                    <span className="text-xl flex-shrink-0">{item.e}</span>
                    <span className="flex-1 text-sm font-semibold text-slate-700">{item.l}</span>
                    {item.badge && (
                      <span className="w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-black flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    <div className="w-4 h-4 text-slate-300">{Ic.chevron}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          className="w-full py-4 rounded-2xl text-sm font-black tap flex items-center justify-center gap-2"
          style={{ background: "#eff6ff", color: "#1d4ed8", border: "1.5px solid #bfdbfe" }}
          onClick={() => { setRole("owner"); navigate("/owner/home"); }}
        >
          🏢 Chuyển sang chế độ Chủ bãi xe
        </button>

        <button
          className="w-full py-4 rounded-2xl text-red-500 font-black text-sm border border-red-100 bg-red-50 tap"
          onClick={() => navigate("/login")}
        >
          Đăng xuất
        </button>
        <p className="text-center text-xs text-slate-300 pb-2">ParkIQ v2.4.1 · Build 2026.08</p>
      </div>
    </div>
  );
}
