import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { OWNER_LOTS } from "../../data";

const MENU_GROUPS = [
  {
    title: "Bãi xe",
    items: [
      { e: "🏢", l: "Quản lý bãi xe",       p: "/owner/lots" },
      { e: "➕", l: "Đăng ký bãi xe mới",    p: "/owner/lots/register" },
      { e: "🚦", l: "Điều khiển cổng IoT",   p: "/owner/gate" },
    ],
  },
  {
    title: "Tài chính",
    items: [
      { e: "💰", l: "Thu nhập & Doanh thu",  p: "/owner/earnings" },
      { e: "💸", l: "Rút tiền",              p: "/owner/withdraw" },
      { e: "📄", l: "Hóa đơn & Thuế",        p: null },
    ],
  },
  {
    title: "Tài khoản & Hỗ trợ",
    items: [
      { e: "👤", l: "Thông tin cá nhân",     p: null },
      { e: "🔒", l: "Bảo mật",              p: null },
      { e: "🔔", l: "Thông báo",            p: null },
      { e: "💬", l: "Hỗ trợ kỹ thuật",      p: null },
      { e: "📞", l: "Hotline: 1900 4321",   p: null },
    ],
  },
];

export default function OwnerProfilePage() {
  const navigate = useNavigate();
  const { setRole } = useApp();
  const totalSlots = OWNER_LOTS.reduce((s, l) => s + l.total, 0);
  const avgRating  = (OWNER_LOTS.reduce((s, l) => s + l.rating, 0) / OWNER_LOTS.length).toFixed(1);
  const monthRev   = OWNER_LOTS.reduce((s, l) => s + l.monthRevenue, 0);

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-owner-grad px-5 pt-14 pb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&auto=format"
              alt="avatar"
              className="rounded-2xl object-cover border-2 border-white/30"
              style={{ width: 72, height: 72 }}
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
              <span className="text-xs">✏️</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Nguyễn Minh Thành</h2>
            <p className="text-blue-200 text-sm">+84 912 345 678</p>
            <div
              className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.18)", color: "#bfdbfe" }}
            >
              🏢 Chủ bãi xe · Đã xác minh
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex bg-white border-b border-slate-100 divide-x divide-slate-100 flex-shrink-0">
        {[
          { v: OWNER_LOTS.length.toString(), l: "Bãi xe" },
          { v: totalSlots.toString(),        l: "Tổng chỗ" },
          { v: `${avgRating}★`,              l: "Đánh giá" },
          { v: monthRev >= 1_000_000 ? `${(monthRev / 1_000_000).toFixed(0)}M₫` : `${Math.round(monthRev / 1000)}K₫`, l: "Tháng này" },
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
                    onClick={() => item.p && navigate(item.p)}
                  >
                    <span className="text-xl flex-shrink-0">{item.e}</span>
                    <span className="flex-1 text-sm font-semibold text-slate-700">{item.l}</span>
                    <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Switch role */}
        <button
          className="w-full py-4 rounded-2xl text-sm font-black tap flex items-center justify-center gap-2"
          style={{ background: "#eff6ff", color: "#1d4ed8", border: "1.5px solid #bfdbfe" }}
          onClick={() => { setRole("driver"); navigate("/driver/home"); }}
        >
          🔄 Chuyển sang chế độ Tài xế
        </button>

        <button
          className="w-full py-4 rounded-2xl text-red-500 font-black text-sm border border-red-100 bg-red-50 tap"
          onClick={() => navigate("/login")}
        >
          Đăng xuất
        </button>

        <p className="text-center text-xs text-slate-300 pb-2">ParkIQ Owner v2.4.1 · Build 2026.08</p>
      </div>
    </div>
  );
}
