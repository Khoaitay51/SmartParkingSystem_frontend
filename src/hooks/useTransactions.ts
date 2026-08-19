import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, createTopup } from "../api/transactions";

export function useTransactions(userId?: string) {
  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => getTransactions(userId),
    staleTime: 30_000,
  });
}

export function useCreateTopup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, amount, method }: { userId: string; amount: number; method: string }) =>
      createTopup(userId, amount, method),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ["transactions", userId] });
    },
  });
}
