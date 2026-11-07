// REST client for snapshots populated by the backend MQTT subscriber.

export interface ParkingSlotStatus {
  [key: number]: boolean | null; // 1..N: true = có xe (occupied), false = trống (free)
}

export interface GateStatus {
  in: "open" | "closed";
  out: "open" | "closed";
}

export interface ParkingLotData {
  lotId: string;
  lotName: string;
  totalSlots: number;
  freeSlots: number;
  distance: number;
  lastHeartbeat: number;
  slots: ParkingSlotStatus;
  gates: GateStatus;
}

export interface LotItem {
  id: string;
  name: string;
  address: string;
  district?: string;
  city?: string;
  lat?: number;
  lng?: number;
  totalSlots: number;
  freeSlots: number;
  priceHour?: number;
  priceDay?: number;
  status: "open" | "maintenance" | "closed";
  features?: string[];
  image?: string;
}

export interface OcrEventData {
  lotId?: string;
  plate: string;
  direction: "in" | "out";
  timestamp?: number;
  fee?: number;
  slot?: number;
  vehicleName?: string;
}

// Cấu hình URL Backend TimescaleDB API
export const API_CONFIG = {
  baseURL: (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api").replace(/\/+$/, ""),
  defaultLotId: "lot_mydinh",
};

function pollSnapshot<T>(
  url: string,
  onUpdate: (data: T) => void,
  intervalMs: number,
  onError?: (error: unknown) => void,
): () => void {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout>;
  async function refresh() {
    try {
      const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const snapshot: T | null = await response.json();
      if (snapshot !== null && !controller.signal.aborted) onUpdate(snapshot);
    } catch (error) {
      if (!controller.signal.aborted) onError?.(error);
    } finally {
      if (!controller.signal.aborted) timer = setTimeout(refresh, intervalMs);
    }
  }
  void refresh();
  return () => {
    controller.abort();
    clearTimeout(timer);
  };
}

export function subscribeToParkingLot(
  onUpdate: (data: ParkingLotData) => void,
  onError?: (error: unknown) => void,
  lotId: string = API_CONFIG.defaultLotId,
): () => void {
  return pollSnapshot(`${API_CONFIG.baseURL}/lots/${encodeURIComponent(lotId)}/status`, onUpdate, 1000, onError);
}

export function subscribeToOcrEvents(
  onOcr: (data: OcrEventData) => void,
  lotId: string = API_CONFIG.defaultLotId,
): () => void {
  return pollSnapshot(`${API_CONFIG.baseURL}/lots/${encodeURIComponent(lotId)}/ocr`, onOcr, 1200);
}

/**
 * Gửi lệnh mở cổng từ xa đến Backend / TimescaleDB
 */
export async function sendGateOpenCommand(
  gate: "gateIn" | "gateOut",
  lotId: string = API_CONFIG.defaultLotId
): Promise<boolean> {
  const url = `${API_CONFIG.baseURL}/lots/${lotId}/commands`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gate, action: "open" }),
    });
    return res.ok;
  } catch (err) {
    console.error("[TimescaleDB API] Gửi lệnh mở cổng thất bại:", err);
    return false;
  }
}

/**
 * Cập nhật trạng thái một ô đỗ (manual toggle)
 */
export async function updateSlotOnBackend(
  slotNum: number,
  isOccupied: boolean,
  lotId: string = API_CONFIG.defaultLotId
): Promise<boolean> {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/lots/${lotId}/slots/${slotNum}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ occupied: isOccupied }),
    });
    return res.ok;
  } catch (err) {
    console.error("[TimescaleDB API] Cập nhật ô đỗ thất bại:", err);
    return false;
  }
}

/**
 * Cập nhật khoảng cách cảm biến siêu âm
 */
export async function updateDistanceOnBackend(
  dist: number,
  lotId: string = API_CONFIG.defaultLotId
): Promise<boolean> {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/lots/${lotId}/distance`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ distance: dist }),
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Lấy danh sách tất cả các bãi đỗ xe trong hệ thống (Hỗ trợ Scale nhiều bãi)
 */
export async function fetchAllLots(): Promise<LotItem[]> {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/lots`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("[TimescaleDB API] Không thể lấy danh sách bãi xe từ backend:", e);
  }
  return [];
}

/**
 * Đăng ký thêm bãi đỗ xe mới vào TimescaleDB (Chủ bãi scale nhiều bãi)
 */
export async function registerNewLot(lotData: Partial<LotItem>): Promise<boolean> {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/lots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lotData),
    });
    return res.ok;
  } catch (err) {
    console.error("[TimescaleDB API] Đăng ký bãi xe thất bại:", err);
    return false;
  }
}

/**
 * Kích hoạt sự kiện quét biển số xe AI OCR
 */
export async function triggerOcrScan(
  ocrData: OcrEventData,
  lotId: string = API_CONFIG.defaultLotId
): Promise<boolean> {
  try {
    const res = await fetch(`${API_CONFIG.baseURL}/lots/${lotId}/ocr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ocrData),
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
