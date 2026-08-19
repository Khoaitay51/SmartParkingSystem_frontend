# Kế hoạch: Chia nhỏ App.tsx + Tính năng điều khiển cổng IoT

## Context

Hiện tại toàn bộ app nằm trong một file `src/App.tsx` dài ~1385 dòng — không chuyên nghiệp, khó bảo trì, khó mở rộng. Người dùng yêu cầu:
1. **Tách file** thành cấu trúc component rõ ràng như dự án React thực tế
2. **Tính năng mở/đóng cổng bãi xe bằng một nút** — IoT gate control: tài xế bấm nút, cổng tự mở để vào hoặc ra

---

## Cấu trúc thư mục mới

```
src/
├── main.tsx                    (giữ nguyên)
├── index.css                   (giữ nguyên)
├── App.tsx                     (chỉ còn router + global state, ~80 dòng)
│
├── types/
│   └── index.ts                (Page, AppState, Lot, Transaction, GateState)
│
├── data/
│   └── index.ts                (LOTS[], TRANSACTIONS[])
│
├── utils/
│   └── index.ts                (fmt, pad)
│
├── components/
│   ├── icons/
│   │   └── index.tsx           (object Ic với tất cả SVG icons + thêm icon cổng/barrier)
│   ├── BottomNav.tsx
│   ├── LotCard.tsx
│   ├── TxRow.tsx
│   ├── BackBtn.tsx             (BackBtn dark + BackBtnLight)
│   └── GateButton.tsx          ← MỚI: nút IoT mở cổng với animation states
│
└── pages/
    ├── SplashPage.tsx
    ├── LoginPage.tsx
    ├── OTPPage.tsx
    ├── home/
    │   ├── HomePage.tsx
    │   ├── HomeIdleSection.tsx
    │   └── HomeActiveSection.tsx
    ├── SearchPage.tsx
    ├── ParkingDetailPage.tsx   ← tích hợp GateButton "Mở cổng vào"
    ├── ActiveParkingPage.tsx   ← tích hợp GateButton "Mở cổng ra"
    ├── WalletPage.tsx
    ├── TopupPage.tsx
    ├── HistoryPage.tsx
    ├── VehiclesPage.tsx
    ├── AddVehiclePage.tsx
    ├── ProfilePage.tsx
    └── NotificationsPage.tsx
```

---

## Chi tiết tính năng GateButton (IoT Cổng xe)

### States của cổng
```ts
// types/index.ts
type GateState = "closed" | "opening" | "open" | "closing";
```

### Component GateButton (`components/GateButton.tsx`)

Props:
- `mode: "entry" | "exit"` — vào bãi hoặc ra bãi
- `onOpened?: () => void` — callback khi cổng mở xong (dùng để startParking)

Luồng animation:
1. **closed** → User bấm nút → **opening** (1.5s, thanh progress animation)
2. **opening** → **open** (cổng mở, hiển thị countdown 10s tự đóng + icon barrier lifting)
3. Sau 10s hoặc user bấm "Đóng cổng" → **closing** (1s)
4. **closing** → **closed**

Visual design của GateButton:
- State `closed`: nút lớn xanh lá "Mở cổng vào / Mở cổng ra" + icon barrier
- State `opening`: spinner + text "Đang mở cổng..." + progress bar animation
- State `open`: nền xanh sáng, icon cổng mở, text "Cổng đang MỞ", countdown "Tự đóng sau Xs", nút phụ "Đóng ngay"  
- State `closing`: spinner nhỏ + "Đang đóng cổng..."

Khi `mode === "entry"` và cổng mở → gọi `onOpened()` → trigger `startParking(lot)` trong App

### Tích hợp vào trang

**ParkingDetailPage** (entry):
- Thay nút "Vào bãi xe" bằng `<GateButton mode="entry" onOpened={() => onStart()} />`
- Chỉ hiển thị khi `lot.free > 0`

**ActiveParkingPage** (exit):
- Thêm `<GateButton mode="exit" />` phía trên nút đỏ "Kết thúc gửi xe"
- Luồng: mở cổng → xe ra → bấm "Kết thúc gửi xe" → checkout

---

## Thay đổi App.tsx (file gốc)

Sau khi tách, `App.tsx` chỉ còn:
```tsx
import { useState } from "react";
import { Page, AppState } from "./types";
import { LOTS } from "./data";
// import tất cả pages...
// import BottomNav...

export default function App() {
  // state: page, history, lotDetail, appState
  // nav(), goBack(), switchTab(), startParking(), endParking()
  // render: phone-frame + conditional page + BottomNav
}
```

---

## Các file cần tạo mới (tất cả)

| File | Nguồn từ App.tsx hiện tại |
|---|---|
| `src/types/index.ts` | Lines 6-17: type Page, interface AppState + thêm GateState |
| `src/data/index.ts` | Lines 54-69: LOTS, TRANSACTIONS |
| `src/utils/index.ts` | Lines 71-72: fmt(), pad() |
| `src/components/icons/index.tsx` | Lines 22-49: object Ic + thêm gate icon |
| `src/components/BottomNav.tsx` | Lines 316-338: BottomNav + NAV + MAIN_TABS |
| `src/components/LotCard.tsx` | Lines 86-104: LotCard component |
| `src/components/TxRow.tsx` | Lines 106-120: TxRow component |
| `src/components/BackBtn.tsx` | Lines 75-85: BackBtn + BackBtnLight |
| `src/components/GateButton.tsx` | **MỚI** — viết mới hoàn toàn |
| `src/pages/SplashPage.tsx` | Lines 124-138 |
| `src/pages/LoginPage.tsx` | Lines 141-174 |
| `src/pages/OTPPage.tsx` | Lines 177-213 |
| `src/pages/home/HomePage.tsx` | Lines 259-310 |
| `src/pages/home/HomeIdleSection.tsx` | Lines 217-256 |
| `src/pages/home/HomeActiveSection.tsx` | Lines ~258+ |
| `src/pages/SearchPage.tsx` | Lines 340-398 |
| `src/pages/ParkingDetailPage.tsx` | Lines 401-470 + tích hợp GateButton |
| `src/pages/ActiveParkingPage.tsx` | Lines 473-540 + tích hợp GateButton |
| `src/pages/WalletPage.tsx` | Lines 543-600 |
| `src/pages/TopupPage.tsx` | Lines 603-660 |
| `src/pages/HistoryPage.tsx` | Lines 663-690 |
| `src/pages/VehiclesPage.tsx` | Lines 693-730 |
| `src/pages/AddVehiclePage.tsx` | Lines 733-770 |
| `src/pages/ProfilePage.tsx` | Lines 773-830 |
| `src/pages/NotificationsPage.tsx` | Lines 833-860 |
| `src/App.tsx` | Viết lại gọn ~80 dòng |

---

## Xác minh sau khi thực hiện

1. Mở app — Splash → Login → OTP → Home hoạt động bình thường
2. Từ Home bấm "Tìm bãi xe" → Search → chọn bãi → ParkingDetailPage
3. Trên ParkingDetailPage: bấm GateButton — thấy animation `opening` → `open` với countdown
4. Khi cổng open → app chuyển sang trạng thái đang gửi xe, Home hiển thị HomeActiveSection
5. Từ Home bấm vào banner đang gửi xe → ActiveParkingPage
6. Trên ActiveParkingPage: bấm GateButton exit — thấy animation cổng mở
7. Bấm "Kết thúc gửi xe" → màn hình receipt → về Home với HomeIdleSection
8. Kiểm tra các tab: Wallet, Vehicles, Profile hoạt động đúng
9. Kiểm tra back button trên tất cả sub-pages
