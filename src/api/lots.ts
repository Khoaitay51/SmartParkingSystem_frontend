import { supabase, supabaseConfigured } from "../lib/supabase";
import { LOTS } from "../data";
import type { Lot } from "../types";

function rowToLot(row: Record<string, unknown>): Lot {
  return {
    id: row.id as number,
    name: row.name as string,
    address: row.address as string,
    dist: "–",
    total: row.total as number,
    free: row.free as number,
    price: row.price as number,
    priceDay: row.price_day as number,
    rating: (row.rating as number) ?? 0,
    reviews: (row.reviews as number) ?? 0,
    open: (row.open_hours as string) ?? "–",
    features: (row.features as string[]) ?? [],
  };
}

export async function getLots(): Promise<Lot[]> {
  if (!supabaseConfigured || !supabase) return LOTS;
  const { data, error } = await supabase.from("lots").select("*").order("id");
  if (error) throw error;
  return (data ?? []).map(rowToLot);
}

export async function getLotById(id: number): Promise<Lot | undefined> {
  if (!supabaseConfigured || !supabase) return LOTS.find((l) => l.id === id);
  const { data, error } = await supabase
    .from("lots")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return rowToLot(data);
}
