import { supabase, supabaseConfigured } from "../lib/supabase";
import { OWNER_LOTS, OWNER_TRANSACTIONS, WEEKLY_REVENUE } from "../data";
import type { OwnerLot, OwnerTransaction } from "../types";

function rowToOwnerLot(row: Record<string, unknown>): OwnerLot {
  return {
    id: row.id as number,
    name: row.name as string,
    address: (row.address as string) ?? "",
    total: row.total as number,
    occupied: (row.occupied as number) ?? 0,
    priceHour: row.price_hour as number,
    priceDay: row.price_day as number,
    status: (row.status as OwnerLot["status"]) ?? "open",
    todayRevenue: (row.today_revenue as number) ?? 0,
    monthRevenue: (row.month_revenue as number) ?? 0,
    rating: (row.rating as number) ?? 0,
  };
}

function rowToOwnerTx(row: Record<string, unknown>): OwnerTransaction {
  return {
    id: row.id as number,
    type: row.type as "income" | "withdrawal",
    label: row.label as string,
    sub: row.sub as string,
    amount: row.amount as number,
    plate: (row.plate as string) ?? "",
  };
}

export async function getOwnerLots(ownerId?: string): Promise<OwnerLot[]> {
  if (!supabaseConfigured || !supabase || !ownerId) return OWNER_LOTS;
  const { data, error } = await supabase
    .from("owner_lots")
    .select("*")
    .eq("owner_id", ownerId)
    .order("id");
  if (error) throw error;
  return (data ?? []).map(rowToOwnerLot);
}

export async function getOwnerTransactions(
  ownerId?: string
): Promise<OwnerTransaction[]> {
  if (!supabaseConfigured || !supabase || !ownerId) return OWNER_TRANSACTIONS;
  const { data, error } = await supabase
    .from("owner_transactions")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToOwnerTx);
}

export async function getWeeklyRevenue(
  ownerId?: string
): Promise<{ day: string; v: number; today?: boolean }[]> {
  if (!supabaseConfigured || !supabase || !ownerId) return WEEKLY_REVENUE;
  // Aggregate by day of week from owner_transactions (income only)
  const { data, error } = await supabase
    .from("owner_transactions")
    .select("amount, created_at")
    .eq("owner_id", ownerId)
    .eq("type", "income")
    .gte(
      "created_at",
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    );
  if (error) throw error;
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const buckets: Record<string, number> = {};
  for (const row of data ?? []) {
    const d = new Date(row.created_at as string);
    const label = days[d.getDay()];
    buckets[label] = (buckets[label] ?? 0) + (row.amount as number);
  }
  const today = days[new Date().getDay()];
  return days.map((d) => ({ day: d, v: buckets[d] ?? 0, today: d === today ? true : undefined }));
}

export async function updateLotStatus(
  lotId: number,
  status: OwnerLot["status"]
): Promise<void> {
  if (!supabaseConfigured || !supabase) return;
  const { error } = await supabase
    .from("owner_lots")
    .update({ status })
    .eq("id", lotId);
  if (error) throw error;
}

export async function createWithdrawal(
  ownerId: string,
  amount: number,
  bank: string
): Promise<void> {
  if (!supabaseConfigured || !supabase) return;
  const { error } = await supabase.from("owner_transactions").insert({
    owner_id: ownerId,
    type: "withdrawal",
    label: `Rút tiền → ${bank}`,
    sub: new Date().toLocaleString("vi-VN"),
    amount: -amount,
    plate: "",
  });
  if (error) throw error;
}
