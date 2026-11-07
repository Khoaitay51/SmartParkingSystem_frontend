import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

export function OcrNotificationBanner() {
  const { latestOcr } = useApp();
  const [visible, setVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(latestOcr);

  useEffect(() => {
    if (latestOcr && latestOcr.timestamp) {
      // Chỉ hiện thông báo nếu sự kiện mới xảy ra trong vòng 20 giây gần nhất
      const now = Date.now();
      if (Math.abs(now - latestOcr.timestamp) < 20000) {
        setCurrentEvent(latestOcr);
        setVisible(true);
        const timer = setTimeout(() => {
          setVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [latestOcr]);

  if (!visible || !currentEvent) return null;

  const isIn = currentEvent.direction === "in";

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-50 pointer-events-auto transition-all animate-bounce">
      <div
        className="p-3.5 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-3"
        style={{
          background: isIn ? "rgba(16, 185, 129, 0.95)" : "rgba(37, 99, 235, 0.95)",
          borderColor: isIn ? "#34d399" : "#60a5fa",
          color: "#ffffff",
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
          {isIn ? "🚗" : "🚙"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/25">
              AI CAMERA OCR
            </span>
            <span className="text-[10px] font-bold text-white/80">
              {isIn ? "CỔNG VÀO" : "CỔNG RA"}
            </span>
          </div>
          <p className="text-sm font-black mono tracking-wider mt-0.5">
            {currentEvent.plate} {currentEvent.vehicleName ? `(${currentEvent.vehicleName})` : ""}
          </p>
          <p className="text-xs text-white/90 font-semibold mt-0.5">
            {isIn ? (
              <>
                🟢 Xe đã vào bãi · <strong>Cổng Vào Barrier Mở</strong>
                {currentEvent.slot ? ` · Ô ${currentEvent.slot}` : ""}
              </>
            ) : (
              <>
                🔵 Xe đã rời bãi ·{" "}
                <strong>
                  {currentEvent.fee ? `Trừ ${currentEvent.fee.toLocaleString()} ₫` : "Đã thanh toán"}
                </strong>{" "}
                · Cổng Ra Mở
              </>
            )}
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-white/70 hover:text-white text-base leading-none p-1 tap"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
