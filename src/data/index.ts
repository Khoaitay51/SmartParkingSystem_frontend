import type { Lot, Transaction, OwnerLot, OwnerTransaction } from "../types";

export const LOTS: Lot[] = [
  { id: 1, name: "B7 Mỹ Đình", address: "Phạm Hùng, Nam Từ Liêm, Hà Nội", dist: "0.3 km", total: 120, free: 23, price: 5000, priceDay: 60000, rating: 4.8, reviews: 142, open: "06:00–23:00", features: ["Camera AI", "Mái che", "Bảo vệ 24/7"] },
  { id: 2, name: "P2 Cầu Giấy", address: "Trần Thái Tông, Cầu Giấy, Hà Nội", dist: "0.8 km", total: 60, free: 5, price: 6000, priceDay: 70000, rating: 4.5, reviews: 87, open: "00:00–24:00", features: ["Camera AI", "Bảo vệ 24/7"] },
  { id: 3, name: "A3 Hoàn Kiếm", address: "Hàng Bài, Hoàn Kiếm, Hà Nội", dist: "2.1 km", total: 200, free: 41, price: 8000, priceDay: 90000, rating: 4.9, reviews: 318, open: "07:00–22:00", features: ["Camera AI", "Mái che", "EV Charging"] },
  { id: 4, name: "Parking Thái Hà", address: "Thái Hà, Đống Đa, Hà Nội", dist: "1.5 km", total: 80, free: 0, price: 5500, priceDay: 65000, rating: 4.3, reviews: 54, open: "06:00–22:00", features: ["Mái che"] },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 1, type: "parking", label: "Gửi xe · B7 Mỹ Đình",      sub: "2 giờ 15 phút · Hôm nay 08:30",   amount: -22500,  plate: "30A-123.45" },
  { id: 2, type: "topup",   label: "Nạp tiền VNPAY",             sub: "Hôm nay 07:58",                    amount:  200000, plate: "" },
  { id: 3, type: "parking", label: "Gửi xe · P2 Cầu Giấy",      sub: "1 giờ 00 phút · Hôm qua 17:45",   amount:  -6000,  plate: "30A-123.45" },
  { id: 4, type: "topup",   label: "Nạp tiền MoMo",              sub: "19/08 11:00",                      amount:  500000, plate: "" },
  { id: 5, type: "parking", label: "Gửi xe · A3 Hoàn Kiếm",     sub: "4 giờ 30 phút · 18/08 14:00",     amount: -36000,  plate: "30A-123.45" },
  { id: 6, type: "parking", label: "Gửi xe · Parking Thái Hà",  sub: "0 giờ 45 phút · 17/08 09:15",     amount:  -6875,  plate: "51G-456.78" },
  { id: 7, type: "topup",   label: "Nạp tiền ZaloPay",           sub: "15/08 16:30",                      amount:  300000, plate: "" },
];

export const OWNER_LOTS: OwnerLot[] = [
  { id: 1, name: "Bãi xe Mỹ Đình A", address: "Phạm Hùng, Nam Từ Liêm, HN", total: 120, occupied: 97, priceHour: 5000, priceDay: 60000, status: "open", todayRevenue: 485000, monthRevenue: 12350000, rating: 4.8 },
  { id: 2, name: "Bãi xe Cầu Giấy", address: "Trần Thái Tông, Cầu Giấy, HN", total: 60, occupied: 55, priceHour: 6000, priceDay: 70000, status: "open", todayRevenue: 330000, monthRevenue: 8200000, rating: 4.5 },
  { id: 3, name: "Bãi xe Thái Hà", address: "Thái Hà, Đống Đa, Hà Nội", total: 80, occupied: 0, priceHour: 5500, priceDay: 65000, status: "closed", todayRevenue: 0, monthRevenue: 5100000, rating: 4.3 },
];

export const OWNER_TRANSACTIONS: OwnerTransaction[] = [
  { id: 1, type: "income",     label: "Gửi xe · 30A-123.45", sub: "Bãi Mỹ Đình A · Hôm nay 14:23",  amount:  22500,    plate: "30A-123.45" },
  { id: 2, type: "income",     label: "Gửi xe · 51G-456.78", sub: "Bãi Mỹ Đình A · Hôm nay 13:55",  amount:  30000,    plate: "51G-456.78" },
  { id: 3, type: "withdrawal", label: "Rút tiền → Vietcombank", sub: "Hôm nay 10:00",                amount: -5000000, plate: "" },
  { id: 4, type: "income",     label: "Gửi xe · 29A-789.01", sub: "Bãi Cầu Giấy · Hôm nay 09:40",   amount:  12000,    plate: "29A-789.01" },
  { id: 5, type: "income",     label: "Gửi xe · 30F-222.33", sub: "Bãi Mỹ Đình A · Hôm nay 09:15",  amount:  5000,     plate: "30F-222.33" },
  { id: 6, type: "income",     label: "Gửi xe · 34A-111.22", sub: "Bãi Cầu Giấy · Hôm qua 22:30",   amount:  42000,    plate: "34A-111.22" },
  { id: 7, type: "income",     label: "Gửi xe · 30A-654.32", sub: "Bãi Mỹ Đình A · Hôm qua 20:00",  amount:  15000,    plate: "30A-654.32" },
];

export const WEEKLY_REVENUE = [
  { day: "T2", v: 815000 },
  { day: "T3", v: 1240000 },
  { day: "T4", v: 990000 },
  { day: "T5", v: 1560000 },
  { day: "T6", v: 2100000 },
  { day: "T7", v: 2380000 },
  { day: "CN", v: 1620000, today: true },
];
