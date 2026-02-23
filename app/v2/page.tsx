"use client";
import { useState } from "react";

export default function ReservationPage() {
  const [hasVisited, setHasVisited] = useState("no");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // あなたのn8n Webhook URL
    const WEBHOOK_URL = "https://n8n.my-clinic-de.com/webhook/new-appointment";

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        alert("予約を受付ました。次は問診票の記入をお願いします。");
      }
    } catch (err) {
      alert("通信エラーが発生しました。n8nの接続を確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight mb-3">Online Reservation</h1>
          <p className="text-slate-500">24時間いつでも、スマホから簡単予約</p>
        </header>

        {/* 進行度インジケーター */}
        <div className="flex justify-between items-center mb-12 px-8 relative">
          <div className="z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200">1</div>
            <span className="text-[10px] mt-2 font-bold text-blue-600">予約情報</span>
          </div>
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-200 -z-0"></div>
          <div className="z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center font-bold">2</div>
            <span className="text-[10px] mt-2 font-bold text-slate-400">事前問診</span>
          </div>
        </div>

        <main className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/60 p-8 md:p-12 border border-blue-50">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 受診歴セクション */}
            <div className="space-y-4">
              <label className="text-sm font-black text-blue-900 uppercase tracking-widest block">Patient Status / 受診歴</label>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setHasVisited("no")} className={`py-5 rounded-2xl border-2 font-bold transition-all ${hasVisited === 'no' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>初めて</button>
                <button type="button" onClick={() => setHasVisited("yes")} className={`py-5 rounded-2xl border-2 font-bold transition-all ${hasVisited === 'yes' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-inner' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>受診あり</button>
                <input type="hidden" name="has_visited" value={hasVisited} />
              </div>
            </div>

            {/* 診察券番号 (プランA) */}
            {hasVisited === "yes" && (
              <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                <label className="text-sm font-bold text-slate-600">診察券番号 (Patient ID)</label>
                <input type="text" name="patient_id" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-mono" placeholder="番号を入力してください" />
              </div>
            )}

            {/* 区分選択 */}
            <div className="space-y-4">
              <label className="text-sm font-black text-blue-900 uppercase tracking-widest block">Appointment Type / 予約区分</label>
              <select name="type" className="w-full p-5 bg-slate-50 border-none rounded-2xl appearance-none focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-700" required>
                <option value="new">初診 (新しい悩み・症状がある)</option>
                <option value="return">再診 (いつものお薬・定期通院)</option>
                <option value="checkup">定期健診 (特定健診・自費検診)</option>
              </select>
            </div>

            <button type="submit" disabled={isLoading} className={`w-full py-6 rounded-3xl font-black text-white text-xl shadow-xl transition-all active:scale-95 ${isLoading ? 'bg-slate-300' : 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-200 hover:brightness-110'}`}>
              {isLoading ? "処理中..." : "予約して問診票へ進む"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
