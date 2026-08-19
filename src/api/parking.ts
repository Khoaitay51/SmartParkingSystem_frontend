import { supabase, supabaseConfigured } from "../lib/supabase";

export async function startSession(
  driverId: string,
  lotId: number,
  plate: string
): Promise<number | null> {
  if (!supabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from("parking_sessions")
    .insert({ driver_id: driverId, lot_id: lotId, plate })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as number;
}

export async function endSession(sessionId: number): Promise<number> {
  if (!supabaseConfigured || !supabase) return 0;
  const { data: session, error: fetchErr } = await supabase
    .from("parking_sessions")
    .select("started_at, lot_id")
    .eq("id", sessionId)
    .single();
  if (fetchErr) throw fetchErr;

  const { data: lotRow, error: lotErr } = await supabase
    .from("lots")
    .select("price")
    .eq("id", session.lot_id)
    .single();
  if (lotErr) throw lotErr;

  const hours = (Date.now() - new Date(session.started_at as string).getTime()) / 3_600_000;
  const charged = Math.round(hours * (lotRow.price as number));

  const { error } = await supabase
    .from("parking_sessions")
    .update({ ended_at: new Date().toISOString(), amount_charged: charged })
    .eq("id", sessionId);
  if (error) throw error;
  return charged;
}
