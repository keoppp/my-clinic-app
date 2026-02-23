"use client";
import { useState, useEffect } from "react";

export default function ReservationPage() {
  const [hasVisited, setHasVisited] = useState("no");
  const [appointmentType, setAppointmentType] = useState("new"); // 予約区分の状態管理
  const [isLoading, setIsLoading] = useState(false);

  // 「初めて」を選んだら強制的に「初診」にする連動ロジック
  useEffect(() => {
    if (hasVisited === "no") {
      setAppointmentType("new");
    }
  }, [hasVisited]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // --- 【重要】ここを実際のn8n Webhook URL（Production URL）に書き換えてください ---
    const WEBHOOK_URL = "https://n8n.my-clinic-de.com/webhook/new-appointment";

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();

      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        alert("予約を受付ました。次は問診票の記入をお願いします。");
      }
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました。n8nの接続（Tunnel）やURLが正しいか確認してください。");
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
              <select 
                name="type" 
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                disabled={hasVisited === "no"} // 「初めて」の場合は選択不可
                className={`w-full p-5 bg-slate-50 border-none rounded-2xl appearance-none focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-700 ${hasVisited === "no" ? 'opacity-60 cursor-not-allowed' : ''}`} 
                required
              >
                <option value="new">初診 (新しい悩み・症状がある)</option>
                <option value="return">再診 (いつものお薬・定期通院)</option>
                <option value="checkup">定期健診 (特定健診・自費検診)</option>
              </select>
              {hasVisited === "no" && <p className="text-[10px] text-blue-500 font-bold ml-2">※初めての方は「初診」のみとなります</p>}
              {/* disabledだと値が送信されないため、hiddenで送る */}
              {hasVisited === "no" && <input type="hidden" name="type" value="new" />}
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
