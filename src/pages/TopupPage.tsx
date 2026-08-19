import { useState } from "react";
import { useNavigate } from "react-router";
import { BackBtn } from "../components/BackBtn";
import { Ic } from "../components/icons";

type Step = "form" | "confirm" | "done";

const METHODS: Record<string, string> = {
  vnpay: "VNPAY",
  momo: "Ví MoMo",
  zalopay: "ZaloPay",
  card: "Thẻ NH",
};

export default function TopupPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("vnpay");
  const [step, setStep] = useState<Step>("form");

  const parsedAmount = parseInt(amount || "0");
  const canProceed = parsedAmount >= 10000;

  function handleNext() {
    if (!canProceed) return;
    if (step === "form") setStep("confirm");
    else setStep("done");
  }

  if (step === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-white px-6 text-center slide-up">
        <div
          className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-5"
          style={{ border: "3px solid #22c55e" }}
        >
          <div className="w-10 h-10 text-green-500">{Ic.check}</div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-1">Nạp tiền thành công!</h2>
        <p className="text-slate-500 text-sm mb-1">
          Đã nạp <span className="font-black text-green-600 mono">{parsedAmount.toLocaleString()} ₫</span>
        </p>
        <p className="text-slate-400 text-xs mb-8">
          Số dư mới:{" "}
          <span className="font-black text-slate-700 mono">
            {(660000 + parsedAmount).toLocaleString()} ₫
          </span>
        </p>
        <button className="btn-brand w-full max-w-xs" onClick={() => navigate(-1 as unknown as string)}>
          Về ví tiền
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <div className="bg-brand-grad px-5 pt-14 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <BackBtn onPress={() => navigate(-1 as unknown as string)} />
          <h2 className="text-xl font-black text-white">Nạp tiền ví</h2>
        </div>
        <p className="text-white/60 text-sm ml-1">
          Số dư hiện tại: <span className="font-black text-white">660.000 ₫</span>
        </p>
      </div>

      <div className="flex-1 px-5 pt-5 page-scroll pb-28">
        {step === "form" ? (
          <>
            <p className="text-sm font-bold text-slate-500 mb-3">Chọn nhanh</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[50000, 100000, 200000, 500000].map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(String(p))}
                  className="py-3.5 rounded-2xl text-sm font-black transition-all mono"
                  style={{
                    background: amount === String(p) ? "#f0fdf6" : "#f8fafc",
                    border: `2px solid ${amount === String(p) ? "#22c55e" : "#e2e8f0"}`,
                    color: amount === String(p) ? "#16a34a" : "#475569",
                  }}
                >
                  {p.toLocaleString()} ₫
                </button>
              ))}
            </div>

            <p className="text-sm font-bold text-slate-500 mb-2">Hoặc nhập số tiền</p>
            <div className="relative mb-5">
              <input
                className="input text-xl font-black mono pr-12"
                placeholder="0"
                value={amount ? parsedAmount.toLocaleString() : ""}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₫</span>
            </div>

            <p className="text-sm font-bold text-slate-500 mb-3">Phương thức</p>
            <div className="space-y-2">
              {[
                { id: "vnpay",   l: "VNPAY",          s: "ATM, Internet Banking",   e: "🏦" },
                { id: "momo",    l: "Ví MoMo",         s: "Liên kết ví MoMo",        e: "🟣" },
                { id: "zalopay", l: "ZaloPay",          s: "Liên kết ví ZaloPay",     e: "🔵" },
                { id: "card",    l: "Thẻ ngân hàng",   s: "Visa, Mastercard, JCB",   e: "💳" },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="flex items-center gap-3 p-4 rounded-2xl tap"
                  style={{
                    border: `2px solid ${method === m.id ? "#22c55e" : "#e2e8f0"}`,
                    background: method === m.id ? "#f0fdf6" : "#fff",
                  }}
                >
                  <span className="text-2xl">{m.e}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{m.l}</p>
                    <p className="text-xs text-slate-400">{m.s}</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: method === m.id ? "#22c55e" : "#e2e8f0" }}
                  >
                    {method === m.id && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="slide-up space-y-4">
            <div className="card p-6 text-center">
              <p className="text-slate-400 text-sm mb-1">Số tiền nạp</p>
              <p className="text-4xl font-black text-green-600 mono">{parsedAmount.toLocaleString()} ₫</p>
            </div>
            <div className="card-sm overflow-hidden">
              {[
                ["Phương thức", METHODS[method] ?? ""],
                ["Phí giao dịch", "Miễn phí"],
                ["Thực nhận", `${parsedAmount.toLocaleString()} ₫`],
              ].map(([l, v], i) => (
                <div key={i}>
                  {i > 0 && <div className="sep mx-4" />}
                  <div className="flex justify-between px-4 py-3">
                    <span className="text-sm text-slate-500">{l}</span>
                    <span
                      className={`text-sm font-black ${l === "Thực nhận" ? "text-green-600" : "text-slate-800"}`}
                    >
                      {v}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-100 px-5 py-4"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom,0px))" }}
      >
        <button
          className="btn-brand w-full"
          style={{ opacity: canProceed ? 1 : 0.4 }}
          onClick={handleNext}
        >
          {step === "form" ? "Tiếp tục →" : "Xác nhận nạp tiền"}
        </button>
      </div>
    </div>
  );
}
