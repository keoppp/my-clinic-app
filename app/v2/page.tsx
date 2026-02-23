"use client";
import { useState } from "react";

export default function ReservationPage() {
  const [hasVisited, setHasVisited] = useState("no");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // --- ここをあなたのn8n Webhook URL（TunnelのURL）に書き換えてください ---
    const WEBHOOK_URL = "https://n8n.あなたのドメイン.com/webhook/new-appointment";

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
        alert("予約が完了しました。次は問診票の記入をお願いします。");
      }
    } catch (err) {
      alert("エラーが発生しました。n8nが動いているか確認してください。");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Web予約 (v2)</h1>
      <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
        
        {/* 受診歴の確認 */}
        <div className="bg-blue-50 p-4 rounded-md">
          <label className="block font-bold mb-2">当院を受診したことはありますか？</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="has_visited" value="no" checked={hasVisited === "no"} onChange={() => setHasVisited("no")} className="w-4 h-4" /> 
              初めて
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="has_visited" value="yes" checked={hasVisited === "yes"} onChange={() => setHasVisited("yes")} className="w-4 h-4" /> 
              受診したことがある
            </label>
          </div>
        </div>

        {/* 診察券番号 (「はい」の時だけ表示) */}
        {hasVisited === "yes" && (
          <div className="p-4 border-l-4 border-blue-400 bg-gray-50">
            <label className="block font-bold mb-1">診察券番号</label>
            <input type="text" name="patient_id" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none" placeholder="不明な場合は空欄でOK" />
          </div>
        )}

        {/* 区分選択 */}
        <div>
          <label className="block font-bold mb-2">予約の種類</label>
          <select name="type" className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400" required>
            <option value="new">初診（新しい悩み）</option>
            <option value="return">再診（いつもの相談）</option>
            <option value="checkup">定期健診</option>
          </select>
        </div>

        {/* 日時選択などの既存項目があればここに追加 */}

        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition">
          予約を確定する
        </button>
      </form>
    </div>
  );
}
