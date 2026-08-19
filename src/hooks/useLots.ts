import { useQuery } from "@tanstack/react-query";
import { getLots, getLotById } from "../api/lots";

export function useLots() {
  return useQuery({
    queryKey: ["lots"],
    queryFn: getLots,
    staleTime: 60_000,
  });
}

export function useLot(id: number) {
  return useQuery({
    queryKey: ["lot", id],
    queryFn: () => getLotById(id),
    staleTime: 60_000,
    enabled: id > 0,
  });
}
