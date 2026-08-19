import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { BackBtnLight } from "../components/BackBtn";
import { Ic } from "../components/icons";

export default function OTPPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cd, setCd] = useState(30);
  const [verified, setVerified] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cd > 0) {
      const t = setTimeout(() => setCd((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cd]);

  function change(i: number, v: string) {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
    if (next.every((d) => d)) {
      setTimeout(() => {
        setVerified(true);
        setTimeout(() => navigate("/role"), 700);
      }, 200);
    }
  }

  function keydown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white px-5">
      <div className="pt-14 pb-2">
        <BackBtnLight onPress={() => navigate(-1)} />
      </div>
      <div className="flex-1 pt-4">
        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
          <div className="w-7 h-7 text-green-600">{Ic.shield}</div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-1">Xác thực OTP</h2>
        <p className="text-slate-400 text-sm mb-7">
          Mã 6 chữ số vừa gửi đến<br />
          <span className="font-black text-slate-700">+84 912 345 678</span>
        </p>

        <div className="flex gap-2 justify-between mb-5">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              className="otp-input"
              maxLength={1}
              value={d}
              onChange={(e) => change(i, e.target.value)}
              onKeyDown={(e) => keydown(i, e)}
              inputMode="numeric"
              style={verified ? { borderColor: "#16a34a", background: "#f0fdf6" } : {}}
            />
          ))}
        </div>

        {verified ? (
          <div className="flex items-center gap-2 justify-center mb-5 fade-in">
            <div className="w-5 h-5 text-green-500">{Ic.check}</div>
            <span className="text-green-600 font-bold text-sm">Xác thực thành công!</span>
          </div>
        ) : (
          <p className="text-center text-sm text-slate-400 mb-5">
            {cd > 0 ? (
              <>Gửi lại sau <span className="font-black text-green-600 mono">{cd}s</span></>
            ) : (
              <span className="text-green-600 font-bold tap" onClick={() => setCd(30)}>
                Gửi lại mã OTP
              </span>
            )}
          </p>
        )}

        <button className="btn-brand w-full" onClick={() => navigate("/role")}>
          Xác nhận
        </button>
      </div>
    </div>
  );
}
