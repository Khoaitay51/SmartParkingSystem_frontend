import type { Lot, Transaction, OwnerLot, OwnerTransaction } from "../types";

// Danh sách bãi xe thực tế của hệ thống SIC IoT (Bãi xe B7 Mỹ Đình 4 ô đỗ)
export const LOTS: Lot[] = [
  {
    id: 1,
    name: "B7 Mỹ Đình",
    address: "Phạm Hùng, Nam Từ Liêm, Hà Nội",
    dist: "0.1 km",
    total: 4,
    free: 4,
    price: 5000,
    priceDay: 60000,
    rating: 4.9,
    reviews: 142,
    open: "00:00–24:00",
    features: ["Phần cứng ESP32", "Barrier Tự Động", "Cảm biến IR Realtime", "Bảo vệ 24/7"],
  },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 1, type: "parking", label: "Gửi xe · B7 Mỹ Đình (Ô 1)", sub: "Hôm nay 08:30", amount: -15000, plate: "30A-123.45" },
  { id: 2, type: "topup",   label: "Nạp tiền ví ParkIQ",        sub: "Hôm nay 07:58", amount: 200000,  plate: "" },
  { id: 3, type: "parking", label: "Gửi xe · B7 Mỹ Đình (Ô 3)", sub: "Hôm qua 17:45", amount: -10000, plate: "30A-123.45" },
];

export const OWNER_LOTS: OwnerLot[] = [
  {
    id: 1,
    name: "Bãi xe B7 Mỹ Đình",
    address: "Phạm Hùng, Nam Từ Liêm, Hà Nội",
    total: 4,
    occupied: 0,
    priceHour: 5000,
    priceDay: 60000,
    status: "open",
    todayRevenue: 185000,
    monthRevenue: 6200000,
    rating: 4.9,
  },
];

export const OWNER_TRANSACTIONS: OwnerTransaction[] = [
  { id: 1, type: "income", label: "Gửi xe · 30A-123.45", sub: "Bãi B7 Mỹ Đình · Hôm nay 14:23", amount: 20000, plate: "30A-123.45" },
  { id: 2, type: "income", label: "Gửi xe · 51G-456.78", sub: "Bãi B7 Mỹ Đình · Hôm nay 13:55", amount: 15000, plate: "51G-456.78" },
];

export const WEEKLY_REVENUE = [
  { day: "T2", v: 180000 },
  { day: "T3", v: 240000 },
  { day: "T4", v: 210000 },
  { day: "T5", v: 290000 },
  { day: "T6", v: 350000 },
  { day: "T7", v: 420000 },
  { day: "CN", v: 380000, today: true },
];
