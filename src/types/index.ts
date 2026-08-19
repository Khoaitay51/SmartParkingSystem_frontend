export type Page =
  | "splash" | "login" | "otp" | "role-select"
  | "home" | "search" | "parking-detail" | "active-parking"
  | "wallet" | "topup" | "history"
  | "vehicles" | "add-vehicle"
  | "profile" | "notifications"
  | "owner-home" | "owner-lots" | "owner-lot-detail"
  | "owner-register-lot" | "owner-earnings" | "owner-withdraw"
  | "owner-gate" | "owner-profile";

export type GateState = "closed" | "opening" | "open" | "closing";

export interface Lot {
  id: number;
  name: string;
  address: string;
  dist: string;
  total: number;
  free: number;
  price: number;
  priceDay: number;
  rating: number;
  reviews: number;
  open: string;
  features: string[];
}

export interface Transaction {
  id: number;
  type: "parking" | "topup";
  label: string;
  sub: string;
  amount: number;
  plate: string;
}

export interface AppState {
  isParking: boolean;
  activeLot: Lot | null;
  parkingStart: Date | null;
}

export interface OwnerLot {
  id: number;
  name: string;
  address: string;
  total: number;
  occupied: number;
  priceHour: number;
  priceDay: number;
  status: "open" | "closed" | "maintenance";
  todayRevenue: number;
  monthRevenue: number;
  rating: number;
}

export interface OwnerTransaction {
  id: number;
  type: "income" | "withdrawal";
  label: string;
  sub: string;
  amount: number;
  plate: string;
}
