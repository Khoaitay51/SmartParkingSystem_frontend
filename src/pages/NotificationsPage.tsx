import { useState } from "react";
import { useNavigate } from "react-router";
import { BackBtnLight } from "../components/BackBtn";

const NOTIFS = [
  { e: "🚗", t: "Xe đã vào bãi",         b: "30A-123.45 vừa vào B7 Mỹ Đình · 08:30",            time: "5 phút trước",  unread: true },
  { e: "💰", t: "Nạp tiền thành công",   b: "200.000 ₫ đã được cộng vào ví ParkIQ",              time: "2 giờ trước",   unread: true },
  { e: "📢", t: "Khuyến mãi đặc biệt",  b: "Gửi xe miễn phí 30 phút tại A3 Hoàn Kiếm hôm nay!", time: "5 giờ trước",   unread: true },
  { e: "✅", t: "Hoàn tất giao dịch",    b: "Phí 6.000 ₫ · P2 Cầu Giấy · Hôm qua 18:45",        time: "Hôm qua",       unread: false },
  { e: "🔔", t: "Nhắc nhở ví tiền",     b: "Số dư ví sắp hết. Nạp thêm để không bị gián đoạn.", time: "2 ngày trước",  unread: false },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(NOTIFS);

  function markAllRead() {
    setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })));
  }

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      <div className="bg-white border-b border-slate-100 flex-shrink-0 px-4 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackBtnLight onPress={() => navigate(-1 as unknown as string)} />
            <h2 className="text-xl font-black text-slate-800">Thông báo</h2>
          </div>
          <span className="text-xs text-green-600 font-bold tap" onClick={markAllRead}>
            Đọc tất cả
          </span>
        </div>
      </div>

      <div className="flex-1 page-scroll px-4 pt-3 pb-6 space-y-2">
        {notifs.map((n, i) => (
          <div
            key={i}
            className="card-sm p-4 flex items-start gap-3 tap"
            style={{
              background: n.unread ? "#f0fdf6" : "#fff",
              borderLeft: `3px solid ${n.unread ? "#22c55e" : "transparent"}`,
            }}
            onClick={() => setNotifs((ns) => ns.map((x, j) => j === i ? { ...x, unread: false } : x))}
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm text-xl">
              {n.e}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-black text-slate-800">{n.t}</p>
                <p className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{n.time}</p>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.b}</p>
            </div>
            {n.unread && (
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
