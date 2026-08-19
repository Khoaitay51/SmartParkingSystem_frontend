import { supabase, supabaseConfigured } from "../lib/supabase";
import { TRANSACTIONS } from "../data";
import type { Transaction } from "../types";

function rowToTx(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as number,
    type: row.type as "parking" | "topup",
    label: row.label as string,
    sub: row.sub as string,
    amount: row.amount as number,
    plate: (row.plate as string) ?? "",
  };
}

export async function getTransactions(userId?: string): Promise<Transaction[]> {
  if (!supabaseConfigured || !supabase || !userId) return TRANSACTIONS;
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToTx);
}

export async function createTopup(
  userId: string,
  amount: number,
  method: string
): Promise<void> {
  if (!supabaseConfigured || !supabase) return;
  const { error } = await supabase.from("transactions").insert({
    user_id: userId,
    type: "topup",
    label: `Nạp tiền ${method}`,
    sub: new Date().toLocaleString("vi-VN"),
    amount,
    plate: "",
  });
  if (error) throw error;
}
