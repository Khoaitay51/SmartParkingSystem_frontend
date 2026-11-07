import { useState, useEffect, useRef } from "react";
import { GateButton } from "../../components/GateButton";
import {
  API_CONFIG,
  fetchAllLots,
  subscribeToParkingLot,
  sendGateOpenCommand,
  triggerOcrScan,
  updateSlotOnBackend,
  updateDistanceOnBackend,
  type LotItem,
  type ParkingLotData,
} from "../../services/api";

interface LiveLogItem {
  id: string;
  time: string;
  type: "ocr" | "slot" | "gate" | "warning";
  title: string;
  detail: string;
  icon: string;
  bg: string;
}

const INITIAL_LOGS: LiveLogItem[] = [
  { id: "1", time: "Vừa xong", type: "slot", title: "Khởi động hệ thống IoT", detail: "Kết nối backend Realtime Database thành công", icon: "🟢", bg: "#f0fdf4" },
  { id: "2", time: "Hôm nay", type: "ocr", title: "AI OCR Cổng Vào", detail: "Biển số 30A-123.45 (VinFast VF8) đã vào bãi", icon: "📷", bg: "#eff6ff" },
];

export default function OwnerGatePage() {
  const [selectedLot, setSelectedLot] = useState(API_CONFIG.defaultLotId);
  const [lots, setLots] = useState<LotItem[]>([]);
  const lot = lots.find((item) => item.id === selectedLot);
  const [commandError, setCommandError] = useState("");
  const [commandNotice, setCommandNotice] = useState("");

  useEffect(() => {
    let active = true;
    void fetchAllLots().then((items) => {
      if (active) setLots(items);
    });
    return () => { active = false; };
  }, []);

  // Dữ liệu Realtime 100% từ backend Realtime Database
  const [realtimeData, setRealtimeData] = useState<ParkingLotData | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [liveLogs, setLiveLogs] = useState<LiveLogItem[]>(INITIAL_LOGS);

  // Tham chiếu để so sánh thay đổi
  const previous = useRef<ParkingLotData | null>(null);

  useEffect(() => {
    previous.current = null;
    const unsubscribe = subscribeToParkingLot((data) => {
      const prevSlots = previous.current?.slots;
      const prevGates = previous.current?.gates;
      previous.current = data;
      setRealtimeData(data);

      const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      // So sánh thay đổi ô đỗ
      if (prevSlots && data.slots) {
        for (let i = 1; i <= data.totalSlots; i++) {
          const sNum = i;
          if (data.slots[sNum] != null && prevSlots[sNum] != null && data.slots[sNum] !== prevSlots[sNum]) {
            const isOcc = Boolean(data.slots[sNum]);
            const newLog: LiveLogItem = {
              id: `${Date.now()}_slot_${i}`,
              time: nowStr,
              type: "slot",
              title: isOcc ? `Ô ${i}: Xe đã đỗ vào` : `Ô ${i}: Xe đã rời đi (Trống)`,
              detail: isOcc ? `Cảm biến IR phát hiện vật cản tại vị trí Ô ${i}` : `Ô ${i} đã được giải phóng`,
              icon: isOcc ? "🚗" : "🅿️",
              bg: isOcc ? "#fef2f2" : "#f0fdf4",
            };
            setLiveLogs((prev) => [newLog, ...prev.slice(0, 19)]);
          }
        }
      }

      // So sánh thay đổi cổng
      if (prevGates && data.gates) {
        if (data.gates.in !== prevGates.in && data.gates.in === "open") {
          setLiveLogs((prev) => [
            {
              id: `${Date.now()}_gate_in`,
              time: nowStr,
              type: "gate",
              title: "Cổng Vào: Barrier mở 90°",
              detail: "Lệnh điều khiển Servo Cổng Vào (GPIO 4)",
              icon: "🚪",
              bg: "#eff6ff",
            },
            ...prev.slice(0, 19),
          ]);
        }
        if (data.gates.out !== prevGates.out && data.gates.out === "open") {
          setLiveLogs((prev) => [
            {
              id: `${Date.now()}_gate_out`,
              time: nowStr,
              type: "gate",
              title: "Cổng Ra: Barrier mở 90°",
              detail: "Lệnh điều khiển Servo Cổng Ra (GPIO 13)",
              icon: "🚪",
              bg: "#eff6ff",
            },
            ...prev.slice(0, 19),
          ]);
        }
      }
    }, undefined, selectedLot);
    return () => unsubscribe();
  }, [selectedLot]);

  // Lấy trạng thái thật từ backend
  const live = realtimeData?.lotId === selectedLot ? realtimeData : null;
  const fresh = Boolean(live?.lastHeartbeat && Date.now() - live.lastHeartbeat <= 5000);
  const totalSlots = live?.totalSlots || lot?.totalSlots || 4;
  const currentSlots = live?.lastHeartbeat ? live.slots : {};
  const currentDistance = live?.distance ?? -1;
  const currentGates = live?.gates ?? { in: "closed", out: "closed" };
  const freeSlotsCount = Object.values(currentSlots).filter((slot) => slot === false).length;
  const occupiedSlotsCount = Object.values(currentSlots).filter((slot) => slot === true).length;

  // Xử lý khi người dùng bấm vào ô đỗ (Cho xe vào / Cho xe ra) -> CẬP NHẬT THẲNG LÊN BACKEND
  const handleToggleSlot = async (slotNum: number) => {
    setIsUpdating(true);
    const currentlyOccupied = Boolean(currentSlots[slotNum]);
    await updateSlotOnBackend(slotNum, !currentlyOccupied, selectedLot);
    setIsUpdating(false);
  };

  // Xử lý khi người dùng đổi khoảng cách siêu âm -> GHI LÊN BACKEND
  const handleSetDistance = async (dist: number) => {
    setIsUpdating(true);
    await updateDistanceOnBackend(dist, selectedLot);
    setIsUpdating(false);
  };

  // Xử lý bấm mở cổng -> GỬI LỆNH LÊN BACKEND
  const handleOpenGate = async (mode: "entry" | "exit") => {
    setCommandNotice("");
    const sent = await sendGateOpenCommand(mode === "entry" ? "gateIn" : "gateOut", selectedLot);
    setCommandError(sent ? "" : "Không gửi được lệnh mở cổng.");
    if (sent) setCommandNotice("Đã gửi lệnh. Xem trạng thái Park Node bên dưới.");
    return sent;
  };

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-owner-grad px-5 pt-14 pb-5 flex-shrink-0">
        <p className="text-blue-200 text-xs font-semibold mb-1">Hệ Thống SIC IoT · TimescaleDB</p>
        <h2 className="text-white font-black text-2xl">{lot?.name ?? selectedLot}</h2>

        {/* IoT signal status bar */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-end gap-0.5">
            {[3, 5, 7, 9].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-sm"
                style={{
                  height: h,
                  background: fresh ? "#4ade80" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
          <span className="text-blue-200 text-xs font-semibold">
            {fresh ? "Đang nhận dữ liệu Park Node" : "Chưa có dữ liệu Park Node mới"}
          </span>
          <div
            className="w-2.5 h-2.5 rounded-full ml-auto"
            style={{
              background: fresh ? "#22c55e" : "#eab308",
              boxShadow: fresh ? "0 0 8px #22c55e" : "none",
              animation: "blink 2s infinite",
            }}
          />
        </div>
      </div>

      <div className="flex-1 page-scroll pb-24">
        {commandError && <p role="alert" className="mx-4 mt-3 text-sm text-red-600">{commandError}</p>}
        {commandNotice && <p role="status" className="mx-4 mt-3 text-sm text-slate-600">{commandNotice}</p>}
        {/* Lot selector */}
        <div className="mx-4 mt-4">
          <p className="text-xs font-black text-slate-500 mb-2">CHỌN BÃI XE</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {lots.map((l) => (
              <button
                key={l.id}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black tap"
                style={{
                  background: selectedLot === l.id ? "#1d4ed8" : "#fff",
                  color: selectedLot === l.id ? "#fff" : "#64748b",
                  border: `1.5px solid ${selectedLot === l.id ? "#1d4ed8" : "#e2e8f0"}`,
                  boxShadow: selectedLot === l.id ? "0 4px 12px rgba(29,78,216,0.25)" : "none",
                }}
                onClick={() => setSelectedLot(l.id)}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lot status */}
        <div className="mx-4 mt-3 card-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-slate-800">{lot?.name ?? selectedLot}</p>
            <p className="text-xs text-slate-400">{lot?.address}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-black px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              ● Đang mở cửa
            </span>
            <p className="text-[10px] text-slate-500 font-bold mt-1">
              {occupiedSlotsCount}/{totalSlots} chỗ đã đỗ
            </p>
          </div>
        </div>

        {/* 4 REALTIME SLOTS (BẤM VÀO ĐỂ XE VÀO / XE RA THẬT TRÊN BACKEND) */}
        <div className="mx-4 mt-4 card-sm p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-sm">⚡</span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Trạng thái ô đỗ
              </span>
            </div>
            <span className="text-[11px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-bold">
              Còn trống: {freeSlotsCount}/{totalSlots}
            </span>
          </div>

          {/* 4 Interactive Realtime Slots */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: totalSlots }, (_, i) => i + 1).map((slotNum) => {
              const isOccupied = currentSlots[slotNum] === true;
              const unknown = currentSlots[slotNum] == null;
              return (
                <button
                  key={slotNum}
                  disabled={isUpdating}
                  onClick={() => handleToggleSlot(slotNum)}
                  className="p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all tap hover:scale-105"
                  style={{
                    background: isOccupied ? "rgba(239, 68, 68, 0.25)" : "rgba(34, 197, 94, 0.2)",
                    borderColor: isOccupied ? "#ef4444" : "#22c55e",
                  }}
                >
                  <span className="text-2xl mb-1">{isOccupied ? "🚗" : "🅿️"}</span>
                  <span className="text-[12px] font-black">Ô {slotNum}</span>
                  <span
                    className="text-[10px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded shadow-sm"
                    style={{
                      background: isOccupied ? "#ef4444" : "#22c55e",
                      color: "#fff",
                    }}
                  >
                    {unknown ? "Chưa rõ" : isOccupied ? "Có xe" : "Trống"}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-1">
                    {isOccupied ? "Bấm để ra" : "Bấm đỗ vào"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prompt */}
          <div className="mt-3 bg-slate-800/80 rounded-lg p-2 text-center border border-slate-700 text-[11px] text-slate-300">
            👉 <strong>Bấm trực tiếp vào Ô 1, 2, 3, 4 ở trên:</strong> Hệ thống sẽ ghi lệnh thẳng lên backend và đổi màu ngay lập tức!
          </div>

          {/* HC-SR04 Ultrasonic Sensor Monitor & Controller */}
          <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
            <span>
              Khoảng cách siêu âm (HC-SR04):{" "}
              <strong className={`font-mono text-sm ${currentDistance >= 0 && currentDistance <= 10 ? "text-red-400 font-black animate-pulse" : "text-amber-400"}`}>
                {currentDistance >= 0 ? `${currentDistance.toFixed(1)} cm` : "--"}
              </strong>
              {currentDistance >= 0 && currentDistance <= 10 && (
                <span className="ml-1.5 text-[9px] text-white font-black bg-red-600 px-1.5 py-0.5 rounded animate-bounce inline-block">
                  🚨 CÒI KÊU BÁO ĐỘNG!
                </span>
              )}
            </span>
          </div>

          {/* Distance adjust buttons */}
          <div className="mt-2.5 flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-700/50">
            <span className="text-[10px] text-slate-400 font-bold">Chỉnh khoảng cách xe lùi:</span>
            <div className="flex gap-1.5">
              {[
                { label: "Xa (45cm)", dist: 45.0 },
                { label: "Vừa (20cm)", dist: 20.0 },
                { label: "Sát tường (7cm)", dist: 7.0 },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSetDistance(item.dist)}
                  className="px-2 py-1 rounded text-[10px] font-bold font-mono bg-slate-700 hover:bg-blue-600 text-white transition-colors tap"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI CAMERA OCR SCANNER SIMULATION (QUÉT BIỂN SỐ & TỰ ĐỘNG TÍNH TIỀN) */}
        <div className="mx-4 mt-4 card-sm p-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-base">📷</span>
              <div>
                <p className="text-xs font-black uppercase text-slate-800 tracking-wider">
                  Camera AI OCR Nhận Diện Biển Số
                </p>
                <p className="text-[10px] text-slate-400">Tự động nhận diện biển số xe đã đăng ký và tính tiền</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              AI Ready
            </span>
          </div>

          {/* Quick OCR Simulation Triggers */}
          <p className="text-[11px] font-black text-slate-500 mb-2">QUÉT BIỂN SỐ XE THỰC TẾ:</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={async () => {
                const sent = await triggerOcrScan({
                  plate: "30A-123.45",
                  direction: "in",
                  vehicleName: "VinFast VF8",
                  fee: 0,
                  slot: 1,
                }, selectedLot);
                setCommandError(sent ? "" : "Không gửi được sự kiện OCR.");
              }}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-all tap"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs">🚗</span>
                <span className="text-xs font-black mono text-emerald-900">30A-123.45</span>
              </div>
              <p className="text-[10px] font-bold text-emerald-700">⬇️ Quét VÀO (Mở Cổng Vào)</p>
            </button>

            <button
              onClick={async () => {
                const sent = await triggerOcrScan({
                  plate: "30A-123.45",
                  direction: "out",
                  vehicleName: "VinFast VF8",
                  fee: 15000,
                  slot: 1,
                }, selectedLot);
                setCommandError(sent ? "" : "Không gửi được sự kiện OCR.");
              }}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-left transition-all tap"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs">🚗</span>
                <span className="text-xs font-black mono text-blue-900">30A-123.45</span>
              </div>
              <p className="text-[10px] font-bold text-blue-700">⬆️ Quét RA (Trừ 15.000 ₫)</p>
            </button>

            <button
              onClick={async () => {
                const sent = await triggerOcrScan({
                  plate: "51G-456.78",
                  direction: "in",
                  vehicleName: "Honda CR-V",
                  fee: 0,
                  slot: 2,
                }, selectedLot);
                setCommandError(sent ? "" : "Không gửi được sự kiện OCR.");
              }}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-all tap"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs">🚙</span>
                <span className="text-xs font-black mono text-emerald-900">51G-456.78</span>
              </div>
              <p className="text-[10px] font-bold text-emerald-700">⬇️ Quét VÀO (Mở Cổng Vào)</p>
            </button>

            <button
              onClick={async () => {
                const sent = await triggerOcrScan({
                  plate: "30H-888.66",
                  direction: "in",
                  vehicleName: "Toyota Cross",
                  slot: 3,
                  fee: 0,
                }, selectedLot);
                setCommandError(sent ? "" : "Không gửi được sự kiện OCR.");
              }}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-all tap"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs">🚘</span>
                <span className="text-xs font-black mono text-emerald-900">30H-888.66</span>
              </div>
              <p className="text-[10px] font-bold text-emerald-700">⬇️ Quét VÀO (Mở Cổng Vào)</p>
            </button>

            <button
              onClick={async () => {
                const sent = await triggerOcrScan({
                  plate: "30H-888.66",
                  direction: "out",
                  vehicleName: "Toyota Cross",
                  slot: 3,
                  fee: 15000,
                }, selectedLot);
                setCommandError(sent ? "" : "Không gửi được sự kiện OCR.");
              }}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-left transition-all tap"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs">🚘</span>
                <span className="text-xs font-black mono text-blue-900">30H-888.66</span>
              </div>
              <p className="text-[10px] font-bold text-blue-700">⬆️ Quét RA (Trừ 15.000 ₫)</p>
            </button>
          </div>

          {/* Custom Plate OCR Input */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase">
              Quét biển số tùy chọn (Test biển số vừa đăng ký):
            </p>
            <div className="flex gap-2">
              <input
                id="custom-ocr-input"
                placeholder="VD: 29A-686.88"
                defaultValue="29A-686.88"
                className="flex-1 px-2.5 py-1.5 text-xs font-mono uppercase font-black bg-white rounded-lg border border-slate-300 outline-none"
              />
              <button
                onClick={async () => {
                  const input = (document.getElementById("custom-ocr-input") as HTMLInputElement)?.value.trim().toUpperCase() || "29A-686.88";
                  const sent = await triggerOcrScan({
                    plate: input,
                    direction: "in",
                    vehicleName: "Xe test",
                    fee: 0,
                  }, selectedLot);
                  setCommandError(sent ? "" : "Không gửi được sự kiện OCR.");
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs tap"
              >
                Vào ⬇️
              </button>
              <button
                onClick={async () => {
                  const input = (document.getElementById("custom-ocr-input") as HTMLInputElement)?.value.trim().toUpperCase() || "29A-686.88";
                  const sent = await triggerOcrScan({
                    plate: input,
                    direction: "out",
                    vehicleName: "Xe test",
                    fee: 15000,
                  }, selectedLot);
                  setCommandError(sent ? "" : "Không gửi được sự kiện OCR.");
                }}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs tap"
              >
                Ra ⬆️ (15k)
              </button>
            </div>
          </div>
        </div>

        {/* Gate controls */}
        <div className="mx-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
              ĐIỀU KHIỂN CỔNG BARRIER (GỬI LỆNH QUA BACKEND)
            </p>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Realtime Sync
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="card-sm p-3 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs font-black text-slate-700">Cổng Vào A</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${currentGates.in === "open" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                  {!fresh ? "CHƯA RÕ" : currentGates.in === "open" ? "ĐANG MỞ" : "ĐÓNG"}
                </span>
              </div>
              <GateButton
                mode="entry"
                disabled={!fresh}
                onTrigger={() => handleOpenGate("entry")}
              />
            </div>

            <div>
              <div className="card-sm p-3 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs font-black text-slate-700">Cổng Ra B</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${currentGates.out === "open" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                  {!fresh ? "CHƯA RÕ" : currentGates.out === "open" ? "ĐANG MỞ" : "ĐÓNG"}
                </span>
              </div>
              <GateButton
                mode="exit"
                disabled={!fresh}
                onTrigger={() => handleOpenGate("exit")}
              />
            </div>
          </div>
        </div>

        {/* Realtime Live Activity Log */}
        <div className="mx-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                NHẬT KÝ HOẠT ĐỘNG THỜI GIAN THỰC (LIVE LOG)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {liveLogs.length} sự kiện
              </span>
              <button
                onClick={() => setLiveLogs([])}
                className="text-[10px] text-slate-400 hover:text-red-500 font-bold tap"
              >
                Xóa log
              </button>
            </div>
          </div>
          <div className="card-sm overflow-hidden bg-white">
            {liveLogs.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Chưa có sự kiện mới. Thao tác trên Web, ESP32 hoặc Terminal để xem log thời gian thực!
              </div>
            ) : (
              liveLogs.map((item, i) => (
                <div key={item.id}>
                  {i > 0 && <div className="sep mx-4" />}
                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      style={{ background: item.bg }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800">{item.title}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{item.detail}</p>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mono flex-shrink-0">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real Hardware Pinout Guide */}
        <div className="mx-4 mt-4 mb-4 card-sm p-4">
          <p className="text-xs font-black text-slate-700 mb-2">ĐỒNG BỘ PHẦN CỨNG ESP32 (SIC IoT)</p>
          <div className="space-y-1.5 text-[11px] text-slate-500">
            <p>• <strong>Ô 1 - 4:</strong> Nối cảm biến IR vào chân GPIO 32, 33, 25, 26</p>
            <p>• <strong>Barrier Vào/Ra:</strong> Nối Servo vào chân GPIO 4 và GPIO 13</p>
            <p>• <strong>Cảm biến siêu âm:</strong> Nối HC-SR04 vào GPIO 5 (Trig) và GPIO 18 (Echo)</p>
            <p>• <strong>Màn hình:</strong> OLED I2C nối SDA (GPIO 21), SCL (GPIO 22)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
