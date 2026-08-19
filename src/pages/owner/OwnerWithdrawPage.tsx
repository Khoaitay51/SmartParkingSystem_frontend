import { useState } from "react";
import { useNavigate } from "react-router";

const BANKS = [
  { id: "vcb",  name: "Vietcombank",  logo: "🟢", account: "1234567890" },
  { id: "tcb",  name: "Techcombank",  logo: "🔴", account: "0987654321" },
  { id: "mbv",  name: "MB Bank",      logo: "🔵", account: "5566778899" },
];

const PRESETS = [500_000, 1_000_000, 2_000_000, 5_000_000];

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

export default function OwnerWithdrawPage() {
  const navigate = useNavigate();
  const [step, setStep]       = useState<0 | 1 | 2>(0);
  const [amount, setAmount]   = useState("");
  const [bankId, setBankId]   = useState("vcb");

  const BALANCE = 18_750_000;
  const num     = Number(amount.replace(/\D/g, ""));
  const valid   = num >= 50_000 && num <= BALANCE;
  const bank    = BANKS.find((b) => b.id === bankId)!;

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center" style={{ background: "#f4f6fb" }}>
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 slide-up" style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)" }}>
          ✅
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Yêu cầu thành công!</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-1">
          <strong className="text-slate-700 mono">{fmt(num)}</strong> sẽ được chuyển vào
        </p>
        <p className="font-bold text-slate-700">{bank.logo} {bank.name} · {bank.account}</p>
        <p className="text-slate-400 text-xs mt-2 mb-8">Dự kiến nhận trong 1–2 giờ làm việc</p>

        <div className="card w-full p-5 text-left mb-6">
          {[
            { l: "Số tiền rút",     v: fmt(num) },
            { l: "Số dư còn lại",   v: fmt(BALANCE - num) },
            { l: "Ngân hàng",       v: `${bank.name}` },
            { l: "Số tài khoản",    v: bank.account },
            { l: "Mã giao dịch",    v: "PK-2026-08194382" },
          ].map((r) => (
            <div key={r.l} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-400">{r.l}</span>
              <span className="text-xs font-black text-slate-700 mono">{r.v}</span>
            </div>
          ))}
        </div>

        <button className="btn-owner w-full" onClick={() => navigate(-1)}>Về trang Thu nhập</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#f4f6fb" }}>
      {/* Header */}
      <div className="bg-owner-grad px-5 pt-14 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center tap"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={step === 1 ? () => setStep(0) : () => navigate(-1)}
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-blue-200 text-xs">Bước {step + 1} / 2</p>
            <h2 className="text-white font-black text-xl">{step === 0 ? "Rút tiền" : "Xác nhận rút"}</h2>
          </div>
        </div>

        {/* Balance badge */}
        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.12)" }}>
          <svg className="w-4 h-4 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          <span className="text-blue-200 text-xs font-semibold">Số dư khả dụng:</span>
          <span className="text-white font-black text-sm mono">{fmt(BALANCE)}</span>
        </div>
      </div>

      <div className="flex-1 page-scroll px-4 pt-5 pb-8">
        {step === 0 && (
          <div className="space-y-5 slide-up">
            {/* Amount */}
            <div>
              <label className="text-xs font-black text-slate-500 mb-2 block">SỐ TIỀN RÚT</label>
              <div className="relative">
                <input
                  className="input text-right text-2xl font-black pr-16 mono"
                  placeholder="0"
                  value={amount}
                  inputMode="numeric"
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setAmount(raw ? Number(raw).toLocaleString("vi-VN") : "");
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₫</span>
              </div>
              {num > 0 && !valid && (
                <p className="text-red-500 text-xs mt-1.5 font-semibold">
                  {num < 50_000 ? "Tối thiểu 50,000₫" : "Vượt quá số dư khả dụng"}
                </p>
              )}
            </div>

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  className="py-2.5 rounded-xl text-xs font-bold tap"
                  style={{
                    background: num === p ? "#eff6ff" : "#f8fafc",
                    color: num === p ? "#1d4ed8" : "#64748b",
                    border: `1.5px solid ${num === p ? "#bfdbfe" : "#e2e8f0"}`,
                  }}
                  onClick={() => setAmount(p.toLocaleString("vi-VN"))}
                >
                  {p >= 1_000_000 ? `${p / 1_000_000}M` : `${p / 1_000}K`}
                </button>
              ))}
            </div>

            {/* Bank selection */}
            <div>
              <label className="text-xs font-black text-slate-500 mb-2 block">TÀI KHOẢN NGÂN HÀNG</label>
              <div className="space-y-2">
                {BANKS.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-3 p-4 rounded-2xl tap"
                    style={{
                      background: bankId === b.id ? "#eff6ff" : "#fff",
                      border: `1.5px solid ${bankId === b.id ? "#bfdbfe" : "#e2e8f0"}`,
                    }}
                    onClick={() => setBankId(b.id)}
                  >
                    <span className="text-2xl">{b.logo}</span>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-800">{b.name}</p>
                      <p className="text-xs text-slate-400 mono">•••• {b.account.slice(-4)}</p>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: bankId === b.id ? "#1d4ed8" : "#cbd5e1" }}
                    >
                      {bankId === b.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-700" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn-owner w-full"
              style={{ opacity: valid ? 1 : 0.45 }}
              onClick={() => valid && setStep(1)}
            >
              Xem lại →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 slide-up">
            <div className="card-sm p-5">
              <p className="text-xs font-black text-slate-500 mb-4">CHI TIẾT GIAO DỊCH</p>
              {[
                { l: "Số tiền rút",         v: fmt(num), big: true },
                { l: "Phí giao dịch",       v: "Miễn phí" },
                { l: "Thực nhận",           v: fmt(num), big: true },
                { l: "Ngân hàng nhận",      v: `${bank.logo} ${bank.name}` },
                { l: "Số tài khoản",        v: bank.account },
                { l: "Thời gian xử lý",     v: "1–2 giờ làm việc" },
                { l: "Số dư sau rút",       v: fmt(BALANCE - num) },
              ].map((r) => (
                <div key={r.l} className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
                  <span className="text-xs text-slate-400">{r.l}</span>
                  <span className={`text-xs font-black mono ${r.big ? "text-blue-700 text-sm" : "text-slate-700"}`}>{r.v}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
              <span className="text-xl mt-0.5">⚠️</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                Sau khi xác nhận, giao dịch sẽ không thể hủy. Vui lòng kiểm tra kỹ thông tin trước khi tiến hành.
              </p>
            </div>

            <button className="btn-owner w-full" onClick={() => setStep(2)}>
              Xác nhận rút {fmt(num)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
