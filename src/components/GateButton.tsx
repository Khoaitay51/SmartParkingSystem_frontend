import { useState, useEffect } from "react";
import type { GateState } from "../types";
import { Ic } from "./icons";

interface GateButtonProps {
  mode: "entry" | "exit";
  disabled?: boolean;
  onOpened?: () => void;
}

const GATE_OPEN_DURATION = 12; // seconds gate stays open

export function GateButton({ mode, disabled = false, onOpened }: GateButtonProps) {
  const [gateState, setGateState] = useState<GateState>("closed");
  const [countdown, setCountdown] = useState(GATE_OPEN_DURATION);
  const [progress, setProgress] = useState(0);

  // Opening animation — progress bar over 1.5s
  useEffect(() => {
    if (gateState !== "opening") return;
    const start = Date.now();
    const duration = 1500;
    const frame = () => {
      const pct = Math.min(((Date.now() - start) / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) requestAnimationFrame(frame);
      else {
        setGateState("open");
        setCountdown(GATE_OPEN_DURATION);
        onOpened?.();
      }
    };
    requestAnimationFrame(frame);
  }, [gateState, onOpened]);

  // Countdown while open
  useEffect(() => {
    if (gateState !== "open") return;
    if (countdown <= 0) { setGateState("closing"); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [gateState, countdown]);

  // Closing animation
  useEffect(() => {
    if (gateState !== "closing") return;
    const t = setTimeout(() => { setGateState("closed"); setProgress(0); }, 900);
    return () => clearTimeout(t);
  }, [gateState]);

  function handlePress() {
    if (disabled || gateState !== "closed") return;
    setProgress(0);
    setGateState("opening");
  }

  const label = mode === "entry" ? "Mở cổng vào" : "Mở cổng ra";
  const labelAction = mode === "entry" ? "vào bãi" : "ra bãi";

  // ── CLOSED ──────────────────────────────────────────────────────────
  if (gateState === "closed") {
    return (
      <button
        onClick={handlePress}
        disabled={disabled}
        className="w-full rounded-2xl flex flex-col items-center gap-2 py-5 transition-all tap"
        style={{
          background: disabled ? "#f1f5f9" : "linear-gradient(135deg,#f0fdf6,#dcfce8)",
          border: `2px solid ${disabled ? "#e2e8f0" : "#86efac"}`,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {/* Barrier illustration */}
        <BarrierIllustration state="closed" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 text-green-600">{Ic.gate}</div>
          <span className="text-green-800 font-black text-base" style={{ fontFamily: "Nunito" }}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <div className="w-3.5 h-3.5">{Ic.wifi}</div>
          Kết nối IoT · Bấm để mở cổng {labelAction}
        </div>
      </button>
    );
  }

  // ── OPENING ──────────────────────────────────────────────────────────
  if (gateState === "opening") {
    return (
      <div
        className="w-full rounded-2xl flex flex-col items-center gap-3 py-5"
        style={{ background: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "2px solid #fde68a" }}
      >
        <BarrierIllustration state="opening" progress={progress} />
        <div className="flex items-center gap-2">
          <Spinner color="#d97706" />
          <span className="text-amber-700 font-black text-base" style={{ fontFamily: "Nunito" }}>
            Đang mở cổng...
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full max-w-[200px] progress-bar h-2">
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg,#f59e0b,#d97706)" }}
          />
        </div>
        <p className="text-xs text-amber-600 font-medium">Gửi tín hiệu IoT đến cổng bãi xe...</p>
      </div>
    );
  }

  // ── OPEN ──────────────────────────────────────────────────────────────
  if (gateState === "open") {
    return (
      <div
        className="w-full rounded-2xl flex flex-col items-center gap-3 py-5"
        style={{ background: "linear-gradient(135deg,#f0fdf6,#dcfce8)", border: "2px solid #4ade80" }}
      >
        <BarrierIllustration state="open" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 text-green-600">{Ic.gateOpen}</div>
          <span className="text-green-800 font-black text-lg" style={{ fontFamily: "Nunito" }}>
            CỔNG ĐANG MỞ
          </span>
        </div>
        {/* Countdown ring */}
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm mono"
            style={{
              background: countdown <= 5 ? "#fef2f2" : "#f0fdf6",
              color: countdown <= 5 ? "#dc2626" : "#16a34a",
              border: `2px solid ${countdown <= 5 ? "#fca5a5" : "#86efac"}`,
            }}
          >
            {countdown}
          </div>
          <p className="text-sm text-green-700 font-semibold">giây · Tự đóng</p>
        </div>
        <p className="text-xs text-green-600 font-medium">
          {mode === "entry" ? "🚗 Lái xe vào bãi ngay!" : "🚗 Lái xe ra khỏi bãi!"}
        </p>
        <button
          onClick={() => setGateState("closing")}
          className="text-xs text-green-700 font-bold underline tap"
        >
          Đóng cổng ngay
        </button>
      </div>
    );
  }

  // ── CLOSING ──────────────────────────────────────────────────────────
  return (
    <div
      className="w-full rounded-2xl flex flex-col items-center gap-3 py-5"
      style={{ background: "#f8fafc", border: "2px solid #e2e8f0" }}
    >
      <BarrierIllustration state="closing" />
      <div className="flex items-center gap-2">
        <Spinner color="#64748b" />
        <span className="text-slate-600 font-bold text-base" style={{ fontFamily: "Nunito" }}>
          Đang đóng cổng...
        </span>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function Spinner({ color }: { color: string }) {
  return (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function BarrierIllustration({
  state,
  progress = 0,
}: {
  state: GateState | "opening";
  progress?: number;
}) {
  // Barrier arm angle: 0° = horizontal (closed), -90° = vertical (open)
  const openAngle = state === "open" ? -88 : state === "opening" ? -(progress * 0.88) : state === "closing" ? -88 + (88 * 0.5) : 0;
  const armColor = state === "open" ? "#22c55e" : state === "opening" ? "#f59e0b" : state === "closing" ? "#94a3b8" : "#ef4444";

  return (
    <div className="relative flex items-end justify-center" style={{ width: 120, height: 56 }}>
      {/* Ground line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#cbd5e1" }} />

      {/* Left post */}
      <div className="absolute left-6 bottom-0" style={{ width: 8, height: 32, background: "#64748b", borderRadius: "4px 4px 0 0" }}>
        {/* Signal light */}
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{
            background: state === "open" ? "#22c55e" : state === "opening" ? "#f59e0b" : "#ef4444",
            boxShadow: `0 0 6px ${state === "open" ? "#22c55e" : state === "opening" ? "#f59e0b" : "#ef4444"}`,
            animation: state === "open" ? "blink 1s infinite" : "none",
          }}
        />
      </div>

      {/* Barrier arm — rotates from post pivot */}
      <div
        className="absolute"
        style={{
          left: 30,
          bottom: 32,
          transformOrigin: "0% 50%",
          transform: `rotate(${openAngle}deg)`,
          transition: "transform 0.05s linear",
          width: 80,
          height: 8,
          background: `repeating-linear-gradient(90deg, ${armColor} 0 12px, #fff 12px 16px)`,
          borderRadius: 4,
        }}
      />

      {/* Right post (sensor) */}
      <div className="absolute right-6 bottom-0" style={{ width: 8, height: 24, background: "#94a3b8", borderRadius: "4px 4px 0 0" }}>
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ background: state === "open" ? "#22c55e" : "#cbd5e1" }}
        />
      </div>
    </div>
  );
}
