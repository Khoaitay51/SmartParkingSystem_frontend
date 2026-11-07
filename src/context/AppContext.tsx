import { createContext, useContext, useState, useEffect } from "react";
import type { Lot, AppState, Transaction } from "../types";
import { TRANSACTIONS as INITIAL_TRANSACTIONS } from "../data";
import { API_CONFIG, subscribeToOcrEvents } from "../services/api";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "driver" | "owner";
  avatar: string;
  defaultPlate: string;
}

export interface Vehicle {
  id: number;
  plate: string;
  type: string;
  brand: string;
  color: string;
  primary: boolean;
  ownerPhone: string;
}

export interface OcrEvent {
  plate: string;
  direction: "in" | "out";
  timestamp: number;
  fee?: number;
  slot?: number;
  vehicleName?: string;
}

export const PRESET_USERS: User[] = [
  {
    id: "user_1",
    name: "Nguyễn Văn An",
    phone: "0912345678",
    email: "an.nguyen@parkiq.vn",
    role: "driver",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    defaultPlate: "30A-123.45",
  },
  {
    id: "user_2",
    name: "Trần Thị Bình",
    phone: "0987654321",
    email: "binh.tran@parkiq.vn",
    role: "driver",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    defaultPlate: "51G-456.78",
  },
  {
    id: "user_3",
    name: "Phạm Tuấn Anh",
    phone: "0933445566",
    email: "anh.pham@parkiq.vn",
    role: "driver",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format",
    defaultPlate: "30H-888.66",
  },
  {
    id: "user_4",
    name: "Lê Hoàng Nam (Chủ bãi)",
    phone: "0909999999",
    email: "nam.le@parkiq.vn",
    role: "owner",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
    defaultPlate: "29B-999.88",
  },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 1, plate: "30A-123.45", type: "Ô tô con", brand: "VinFast VF8", color: "Trắng", primary: true, ownerPhone: "0912345678" },
  { id: 2, plate: "29A-888.99", type: "Xe máy", brand: "Honda SH 150i", color: "Đen", primary: false, ownerPhone: "0912345678" },
  { id: 3, plate: "51G-456.78", type: "Ô tô con", brand: "Honda CR-V", color: "Đen", primary: true, ownerPhone: "0987654321" },
  { id: 4, plate: "59F-333.22", type: "Xe máy", brand: "Yamaha Grande", color: "Trắng", primary: false, ownerPhone: "0987654321" },
  { id: 5, plate: "30H-888.66", type: "Ô tô con", brand: "Toyota Corolla Cross", color: "Bạc", primary: true, ownerPhone: "0933445566" },
  { id: 6, plate: "29B-999.88", type: "Ô tô con", brand: "Mazda CX-5", color: "Đỏ", primary: true, ownerPhone: "0909999999" },
];

interface AppContextType {
  role: "driver" | "owner";
  setRole: (r: "driver" | "owner") => void;
  currentUser: User;
  setCurrentUser: (u: User) => void;
  login: (credential: string) => boolean;
  logout: () => void;
  appState: AppState;
  startParking: (lot: Lot) => void;
  endParking: (fee?: number) => void;
  balance: number;
  transactions: Transaction[];
  topup: (amount: number, method: string) => void;
  payParking: (amount: number, lotName: string, plate?: string) => boolean;
  withdraw: (amount: number) => boolean;
  vehicles: Vehicle[];
  addVehicle: (v: Omit<Vehicle, "id">) => void;
  setPrimaryVehicle: (id: number) => void;
  latestOcr: OcrEvent | null;
}

const AppContext = createContext<AppContextType | null>(null);

function getDefaultBalance(userId: string): number {
  switch (userId) {
    case "user_1": return 350000;
    case "user_2": return 500000;
    case "user_3": return 200000;
    case "user_4": return 1500000;
    default: return 200000;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Người dùng hiện tại
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem("parkiq_user");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PRESET_USERS[0];
  });

  const [role, setRole] = useState<"driver" | "owner">(currentUser.role);

  const [appState, setAppState] = useState<AppState>({
    isParking: false,
    activeLot: null,
    parkingStart: null,
  });

  // Số dư ví theo từng user
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem(`parkiq_balance_${currentUser.id}`);
    return saved !== null ? Number(saved) : getDefaultBalance(currentUser.id);
  });

  // Cập nhật số dư khi đổi user
  useEffect(() => {
    const saved = localStorage.getItem(`parkiq_balance_${currentUser.id}`);
    if (saved !== null) {
      setBalance(Number(saved));
    } else {
      setBalance(getDefaultBalance(currentUser.id));
    }
  }, [currentUser.id]);

  // Lịch sử giao dịch theo user
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`parkiq_transactions_${currentUser.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    const saved = localStorage.getItem(`parkiq_transactions_${currentUser.id}`);
    if (saved) {
      try { setTransactions(JSON.parse(saved)); } catch (e) {}
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  }, [currentUser.id]);

  // Danh sách xe đã đăng ký
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem("parkiq_vehicles");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_VEHICLES;
  });

  // Sự kiện OCR gần nhất
  const [latestOcr, setLatestOcr] = useState<OcrEvent | null>(null);

  useEffect(() => {
    localStorage.setItem("parkiq_user", JSON.stringify(currentUser));
    setRole(currentUser.role);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`parkiq_balance_${currentUser.id}`, balance.toString());
  }, [balance, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`parkiq_transactions_${currentUser.id}`, JSON.stringify(transactions));
  }, [transactions, currentUser.id]);

  useEffect(() => {
    localStorage.setItem("parkiq_vehicles", JSON.stringify(vehicles));
  }, [vehicles]);

  // Lắng nghe sự kiện OCR từ TimescaleDB Backend
  useEffect(() => {
    const handleOcr = (data: any) => {
      if (data && data.timestamp && (!latestOcr || data.timestamp > latestOcr.timestamp)) {
        setLatestOcr(data);

        const isUserVehicle =
          vehicles.some(
            (v) =>
              v.plate === data.plate &&
              (v.ownerPhone === currentUser.phone || currentUser.defaultPlate === data.plate)
          ) || currentUser.defaultPlate === data.plate;

        if (data.direction === "in") {
          if (isUserVehicle) {
            setAppState({
              isParking: true,
              activeLot: {
                id: 1,
                name: "B7 Mỹ Đình",
                address: "Đường Lê Đức Thọ, Mỹ Đình 2, Nam Từ Liêm, Hà Nội",
                dist: "Tại bãi",
                price: 15000,
                priceDay: 60000,
                total: 4,
                free: 3,
                rating: 4.9,
                reviews: 128,
                open: "24/7",
                features: ["Camera AI OCR", "Barrier Tự Động", "Cảm Biến Siêu Âm", "IoT ESP32"],
              },
              parkingStart: new Date(data.timestamp || Date.now()),
            });
          }
        } else if (data.direction === "out") {
          if (isUserVehicle) {
            setAppState({
              isParking: false,
              activeLot: null,
              parkingStart: null,
            });
            if (data.fee && data.fee > 0) {
              payParking(data.fee, "B7 Mỹ Đình", data.plate);
            }
          }
        }
      }
    };

    return subscribeToOcrEvents(handleOcr, API_CONFIG.defaultLotId);
  }, [latestOcr, vehicles, currentUser.phone, currentUser.defaultPlate]);

  function login(credential: string): boolean {
    const clean = credential.trim().toLowerCase();
    const found = PRESET_USERS.find(
      (u) => u.phone === clean || u.email.toLowerCase() === clean
    );
    if (found) {
      setCurrentUser(found);
      setRole(found.role);
      return true;
    }
    // Cho phép đăng nhập bất kỳ số điện thoại nào
    const newUser: User = {
      id: "user_" + clean,
      name: "Tài xế " + clean.slice(-4),
      phone: clean,
      email: clean + "@parkiq.vn",
      role: "driver",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
      defaultPlate: "30A-999.99",
    };
    setCurrentUser(newUser);
    setRole("driver");
    return true;
  }

  function logout() {
    setCurrentUser(PRESET_USERS[0]);
    setRole("driver");
  }

  function startParking(lot: Lot) {
    setAppState({ isParking: true, activeLot: lot, parkingStart: new Date() });
  }

  function endParking(fee: number = 15000) {
    if (appState.activeLot) {
      payParking(fee, appState.activeLot.name, currentUser.defaultPlate);
    }
    setAppState({ isParking: false, activeLot: null, parkingStart: null });
  }

  function topup(amount: number, method: string) {
    setBalance((prev) => prev + amount);
    const newTx: Transaction = {
      id: Date.now(),
      type: "topup",
      label: `Nạp tiền ví · ${method}`,
      sub: "Vừa xong",
      amount: amount,
      plate: "",
    };
    setTransactions((prev) => [newTx, ...prev]);
  }

  function payParking(amount: number, lotName: string, plate?: string): boolean {
    if (balance < amount) {
      alert("Số dư ví không đủ! Vui lòng nạp thêm tiền.");
      return false;
    }
    setBalance((prev) => prev - amount);
    const newTx: Transaction = {
      id: Date.now(),
      type: "parking",
      label: `Gửi xe · ${lotName}`,
      sub: "Vừa xong",
      amount: -amount,
      plate: plate || currentUser.defaultPlate,
    };
    setTransactions((prev) => [newTx, ...prev]);
    return true;
  }

  function withdraw(amount: number): boolean {
    if (balance < amount) {
      alert("Số dư không đủ để rút!");
      return false;
    }
    setBalance((prev) => prev - amount);
    const newTx: Transaction = {
      id: Date.now(),
      type: "parking",
      label: "Rút tiền về tài khoản ngân hàng",
      sub: "Vừa xong",
      amount: -amount,
      plate: "",
    };
    setTransactions((prev) => [newTx, ...prev]);
    return true;
  }

  function addVehicle(v: Omit<Vehicle, "id">) {
    const newVeh: Vehicle = {
      ...v,
      id: Date.now(),
      ownerPhone: currentUser.phone,
    };
    setVehicles((prev) => [...prev, newVeh]);
  }

  function setPrimaryVehicle(id: number) {
    setVehicles((prev) =>
      prev.map((v) => ({ ...v, primary: v.id === id }))
    );
  }

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        login,
        logout,
        appState,
        startParking,
        endParking,
        balance,
        transactions,
        topup,
        payParking,
        withdraw,
        vehicles,
        addVehicle,
        setPrimaryVehicle,
        latestOcr,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
