/**
 * Smart Parking System - Database Service Adapter
 *
 * Đã thay thế hoàn toàn Firebase RTDB bằng Docker TimescaleDB Backend!
 * File này hoạt động như một compatibility adapter kết nối tới TimescaleDB REST API.
 */

import {
  subscribeToParkingLot as subscribeToApi,
  sendGateOpenCommand as sendGateOpenApi,
  updateSlotOnBackend,
  updateDistanceOnBackend,
  API_CONFIG,
  type ParkingLotData,
  type ParkingSlotStatus,
  type GateStatus,
} from "./api";

export type { ParkingLotData, ParkingSlotStatus, GateStatus };

// Giữ lại FIREBASE_CONFIG trỏ tới TimescaleDB Backend
export const FIREBASE_CONFIG = {
  databaseURL: API_CONFIG.baseURL,
  lotId: API_CONFIG.defaultLotId,
};

export function subscribeToParkingLot(
  onUpdate: (data: ParkingLotData) => void,
  onError?: (err: any) => void
): () => void {
  return subscribeToApi(onUpdate, onError, FIREBASE_CONFIG.lotId);
}

export async function sendGateOpenCommand(gate: "gateIn" | "gateOut"): Promise<boolean> {
  return sendGateOpenApi(gate, FIREBASE_CONFIG.lotId);
}

export async function updateSlotOnFirebase(slotNum: number, isOccupied: boolean): Promise<boolean> {
  return updateSlotOnBackend(slotNum, isOccupied, FIREBASE_CONFIG.lotId);
}

export async function updateDistanceOnFirebase(dist: number): Promise<boolean> {
  return updateDistanceOnBackend(dist, FIREBASE_CONFIG.lotId);
}
