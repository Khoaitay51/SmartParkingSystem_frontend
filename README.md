# Kế hoạch: Thay dữ liệu mock bằng API + Database thực tế

## Context

App hiện tại dùng dữ liệu tĩnh hardcode trong `src/data/index.ts` — 5 mảng mock (LOTS, TRANSACTIONS, OWNER_LOTS, OWNER_TRANSACTIONS, WEEKLY_REVENUE). 13 trang import trực tiếp từ file này. Không có HTTP client, không có backend, không có proxy.

Mục tiêu: thay toàn bộ dữ liệu mock bằng data thật từ database PostgreSQL qua REST API.

---

## Kiến trúc được chọn: Supabase + TanStack Query

### Tại sao Supabase?
- PostgreSQL quản lý sẵn (không cần tự dựng backend)
- REST API tự động sinh ra từ schema (không cần viết endpoint)
- Realtime subscription có thể dùng cho occupancy live update
- Auth tích hợp sẵn (JWT, phone OTP)
- Free tier đủ dùng cho demo/MVP

### Tại sao TanStack Query (React Query)?
- Tự động xử lý: loading state, error state, caching, refetch on focus
- `useQuery` → thay thế trực tiếp các chỗ đang import mảng tĩnh
- Không phải tự quản lý `useState` + `useEffect` cho mỗi fetch

---

## Bước 1: Thiết kế Database Schema (Supabase SQL)

Chạy trong Supabase SQL Editor:

```sql
-- Bãi xe công khai (tài xế xem)
create table lots (
  id          bigint primary key generated always as identity,
  name        text not null,
  address     text not null,
  lat         numeric,
  lng         numeric,
  total       int not null default 0,
  free        int not null default 0,
  price       int not null,       -- VND/giờ
  price_day   int not null,
  rating      numeric(3,1) default 0,
  reviews     int default 0,
  open_hours  text,               -- "06:00–23:00"
  features    text[],
  created_at  timestamptz default now()
);

-- Giao dịch của tài xế
create table transactions (
  id          bigint primary key generated always as identity,
  user_id     uuid references auth.users,
  type        text check (type in ('parking', 'topup')),
  label       text,
  sub         text,               -- mô tả phụ / timestamp
  amount      int,                -- âm = trừ tiền, dương = cộng tiền
  plate       text,
  created_at  timestamptz default now()
);

-- Bãi xe của chủ bãi
create table owner_lots (
  id             bigint primary key generated always as identity,
  owner_id       uuid references auth.users,
  lot_id         bigint references lots,
  name           text not null,
  address        text,
  total          int not null,
  occupied       int default 0,
  price_hour     int not null,
  price_day      int not null,
  status         text check (status in ('open','closed','maintenance')) default 'open',
  today_revenue  int default 0,
  month_revenue  int default 0,
  rating         numeric(3,1) default 0,
  created_at     timestamptz default now()
);

-- Giao dịch của chủ bãi (thu tiền / rút tiền)
create table owner_transactions (
  id          bigint primary key generated always as identity,
  owner_id    uuid references auth.users,
  lot_id      bigint references owner_lots,
  type        text check (type in ('income', 'withdrawal')),
  label       text,
  sub         text,
  amount      int,
  plate       text,
  created_at  timestamptz default now()
);

-- Phiên gửi xe đang chạy
create table parking_sessions (
  id             bigint primary key generated always as identity,
  driver_id      uuid references auth.users,
  lot_id         bigint references lots,
  plate          text,
  started_at     timestamptz default now(),
  ended_at       timestamptz,
  amount_charged int
);

-- RLS: mỗi user chỉ đọc data của mình
alter table transactions      enable row level security;
alter table owner_lots        enable row level security;
alter table owner_transactions enable row level security;
alter table parking_sessions  enable row level security;

create policy "own transactions" on transactions
  for all using (auth.uid() = user_id);
create policy "own owner_lots" on owner_lots
  for all using (auth.uid() = owner_id);
create policy "own owner_transactions" on owner_transactions
  for all using (auth.uid() = owner_id);
create policy "own sessions" on parking_sessions
  for all using (auth.uid() = driver_id);

-- lots là public (mọi người đọc được)
alter table lots enable row level security;
create policy "lots public read" on lots for select using (true);
```

---

## Bước 2: Cài đặt thư viện

```bash
pnpm add @supabase/supabase-js @tanstack/react-query
```

---

## Bước 3: Cấu hình Supabase Client

**File mới: `src/lib/supabase.ts`**
```ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

**File `.env.local`** (không commit):
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Bước 4: Service Layer — `src/api/`

Tách theo domain, mỗi file export async functions thuần tuý:

**`src/api/lots.ts`**
```ts
import { supabase } from "../lib/supabase";
import type { Lot } from "../types";

export async function getLots(): Promise<Lot[]> {
  const { data, error } = await supabase
    .from("lots")
    .select("*")
    .order("id");
  if (error) throw error;
  return data.map(row => ({
    id: row.id, name: row.name, address: row.address,
    dist: "–",         // tính từ geolocation sau
    total: row.total, free: row.free,
    price: row.price, priceDay: row.price_day,
    rating: row.rating, reviews: row.reviews,
    open: row.open_hours ?? "–",
    features: row.features ?? [],
  }));
}

export async function getLotById(id: number): Promise<Lot> {
  const { data, error } = await supabase
    .from("lots").select("*").eq("id", id).single();
  if (error) throw error;
  // ... map same as above
}
```

**`src/api/transactions.ts`**
```ts
export async function getTransactions(userId: string): Promise<Transaction[]>
export async function createTopup(userId: string, amount: number, method: string): Promise<void>
```

**`src/api/owner.ts`**
```ts
export async function getOwnerLots(ownerId: string): Promise<OwnerLot[]>
export async function getOwnerTransactions(ownerId: string): Promise<OwnerTransaction[]>
export async function getWeeklyRevenue(ownerId: string): Promise<{day: string, v: number}[]>
export async function updateLotStatus(lotId: number, status: OwnerLot["status"]): Promise<void>
export async function createWithdrawal(ownerId: string, amount: number, bankId: string): Promise<void>
```

**`src/api/parking.ts`**
```ts
export async function startSession(driverId: string, lotId: number, plate: string): Promise<void>
export async function endSession(sessionId: number): Promise<number>  // returns amount charged
```

---

## Bước 5: Custom Hooks — `src/hooks/`

Mỗi hook dùng `useQuery` của TanStack Query. Ví dụ:

**`src/hooks/useLots.ts`**
```ts
import { useQuery } from "@tanstack/react-query";
import { getLots, getLotById } from "../api/lots";

export function useLots() {
  return useQuery({ queryKey: ["lots"], queryFn: getLots, staleTime: 60_000 });
}

export function useLot(id: number) {
  return useQuery({ queryKey: ["lot", id], queryFn: () => getLotById(id) });
}
```

**`src/hooks/useTransactions.ts`** — `useTransactions(userId)`

**`src/hooks/useOwnerData.ts`** — `useOwnerLots(ownerId)`, `useOwnerTransactions(ownerId)`, `useWeeklyRevenue(ownerId)`

---

## Bước 6: Thêm QueryClientProvider vào App

**`src/App.tsx`** — wrap RouterProvider với QueryClientProvider:
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

---

## Bước 7: Cập nhật các trang (thay import mảng bằng hook)

Pattern lặp lại ở 13 trang:

**Trước:**
```tsx
import { LOTS } from "../../data";
// ...
{LOTS.slice(0, 3).map(lot => <LotCard ... />)}
```

**Sau:**
```tsx
import { useLots } from "../../hooks/useLots";
// ...
const { data: lots = [], isLoading } = useLots();
if (isLoading) return <SkeletonList />;
{lots.slice(0, 3).map(lot => <LotCard ... />)}
```

**Các trang cần cập nhật theo domain:**

| Domain | Trang | Hook thay thế |
|---|---|---|
| Driver lots | `SearchPage`, `HomeIdleSection`, `HomeActiveSection`, `ParkingDetailPage` | `useLots()`, `useLot(id)` |
| Driver transactions | `HomePage`, `WalletPage`, `HistoryPage` | `useTransactions(userId)` |
| Owner lots | `OwnerHomePage`, `OwnerLotsPage`, `OwnerLotDetailPage`, `OwnerGatePage`, `OwnerProfilePage` | `useOwnerLots(ownerId)` |
| Owner transactions | `OwnerHomePage`, `OwnerEarningsPage` | `useOwnerTransactions(ownerId)` |
| Weekly revenue | `OwnerHomePage`, `OwnerEarningsPage` | `useWeeklyRevenue(ownerId)` |

---

## Bước 8: Skeleton Loading Components

Thêm `src/components/Skeleton.tsx` — dùng trong mỗi trang khi `isLoading = true`:
```tsx
export function SkeletonCard() { /* animated gray block */ }
export function SkeletonList({ n = 3 }: { n?: number }) { ... }
```

---

## Bước 9: Xử lý Auth (userId)

Hiện `AppContext` chưa có `userId`. Cần thêm:
```ts
// src/context/AppContext.tsx
const [userId, setUserId] = useState<string | null>(null);
// Sau login thành công: setUserId(supabase.auth.getUser().id)
```

Truyền `userId` vào các hook:
```ts
const { appState, userId } = useApp();
const { data: transactions } = useTransactions(userId ?? "");
```

---

## Cấu trúc file cuối cùng

```
src/
├── lib/
│   └── supabase.ts          ← NEW
├── api/
│   ├── lots.ts              ← NEW
│   ├── transactions.ts      ← NEW
│   ├── owner.ts             ← NEW
│   └── parking.ts           ← NEW
├── hooks/
│   ├── useLots.ts           ← NEW
│   ├── useTransactions.ts   ← NEW
│   └── useOwnerData.ts      ← NEW
├── components/
│   └── Skeleton.tsx         ← NEW
├── context/
│   └── AppContext.tsx       ← EDIT (thêm userId)
├── App.tsx                  ← EDIT (thêm QueryClientProvider)
└── pages/                   ← EDIT 13 trang (thay import data → hook)
```

---

## Verification

1. Tạo Supabase project → chạy SQL schema → insert seed data
2. Thêm `.env.local` với URL + ANON_KEY
3. `pnpm dev` → SearchPage hiển thị lot từ DB
4. Thêm 1 lot mới trong Supabase dashboard → F5 app → thấy lot mới
5. Kiểm tra RLS: đổi userId → không thấy transaction của user khác
6. `pnpm exec tsc --noEmit` → zero errors
