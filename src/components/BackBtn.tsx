import { Ic } from "./icons";

export function BackBtn({ onPress }: { onPress: () => void }) {
  return (
    <button
      className="w-10 h-10 rounded-full flex items-center justify-center tap flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.18)" }}
      onClick={onPress}
    >
      <div className="w-5 h-5 text-white">{Ic.back}</div>
    </button>
  );
}

export function BackBtnLight({ onPress }: { onPress: () => void }) {
  return (
    <button
      className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center tap flex-shrink-0"
      onClick={onPress}
    >
      <div className="w-5 h-5 text-slate-600">{Ic.back}</div>
    </button>
  );
}
