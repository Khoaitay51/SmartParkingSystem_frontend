import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOwnerLots,
  getOwnerTransactions,
  getWeeklyRevenue,
  updateLotStatus,
  createWithdrawal,
} from "../api/owner";
import type { OwnerLot } from "../types";

export function useOwnerLots(ownerId?: string) {
  return useQuery({
    queryKey: ["ownerLots", ownerId],
    queryFn: () => getOwnerLots(ownerId),
    staleTime: 30_000,
  });
}

export function useOwnerTransactions(ownerId?: string) {
  return useQuery({
    queryKey: ["ownerTransactions", ownerId],
    queryFn: () => getOwnerTransactions(ownerId),
    staleTime: 30_000,
  });
}

export function useWeeklyRevenue(ownerId?: string) {
  return useQuery({
    queryKey: ["weeklyRevenue", ownerId],
    queryFn: () => getWeeklyRevenue(ownerId),
    staleTime: 60_000,
  });
}

export function useUpdateLotStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lotId, status }: { lotId: number; status: OwnerLot["status"] }) =>
      updateLotStatus(lotId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ownerLots"] });
    },
  });
}

export function useCreateWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ownerId, amount, bank }: { ownerId: string; amount: number; bank: string }) =>
      createWithdrawal(ownerId, amount, bank),
    onSuccess: (_data, { ownerId }) => {
      qc.invalidateQueries({ queryKey: ["ownerTransactions", ownerId] });
    },
  });
}
