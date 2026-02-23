"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function MonshinForm() {
  const searchParams = useSearchParams();
  const resId = searchParams.get("res_id") || "---";
  const type = searchParams.get("type"); // new / return / checkup
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      res_id: resId,
      visit_type: type,
    };

    const MONSHIN_WEBHOOK = "https://n8n.my-clinic-de.com/webhook/monshin-submit";

    try {
      const response = await fetch(MONSHIN_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("問診票を受理しました。ご協力ありがとうございました。");
        window.location.href = "https://my-clinic-de.com/"; // 完了後にトップへ
      }
    } catch (err) {
      alert("通信エラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-10 px-4 font-sans text-slate-800">
      <div className="max-w-xl mx-auto">
        
        {/* ヘッダー・進捗 */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold mb-2">
            STEP 2 / 2
          </span>
          <h1 className="text-3xl font-black text-emerald-800 tracking-tight">事前問診票</h1>
          <p className="text-slate-500 text-sm mt-2">受付での待ち時間を短縮するため、詳しくお聞かせください</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-emerald-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reservation ID</span>
            <span className="text-xs font-mono font-bold text-emerald-600">{resId}</span>
          </div>
        </div>

        {/* 問診カード */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-emerald-200/50 overflow-hidden border border-emerald-50">
          <div className="bg-emerald-600 h-2 w-full"></div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            
            {/* 1. 症状入力（全員共通） */}
            <section className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-bold text-slate-700">
                <span className="flex items-center justify-center w-6 h-6 bg-emerald-600 text-white rounded-md text-xs">Q1</span>
                {type === "checkup" ? "本日の体調はいかがですか？" : "詳しい症状を教えてください"}
              </label>
              <textarea 
                name="symptoms_detail" 
                required 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                rows={4}
                placeholder={type === "checkup" ? "例：特に変わりなし、最近疲れやすい等" : "例：昨日から38度の熱があり、喉が痛い"}
              ></textarea>
            </section>

            {/* 2. 初診の方限定の質問 */}
            {type === "new" && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="flex items-center gap-2 text-lg font-bold text-slate-700">
                  <span className="flex items-center justify-center w-6 h-6 bg-emerald-600 text-white rounded-md text-xs">Q2</span>
                  これまでに大きな病気をされましたか？
                </label>
                <textarea 
                  name="history" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  rows={2}
                  placeholder="例：高血圧、糖尿病、喘息など（なければ空欄可）"
                ></textarea>
              </section>
            )}

            {/* 3. 再診・健診限定の質問 */}
            {(type === "return" || type === "checkup") && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="flex items-center gap-2 text-lg font-bold text-slate-700">
                  <span className="flex items-center justify-center w-6 h-6 bg-emerald-600 text-white rounded-md text-xs">Q2</span>
                  現在お使いの薬の残量はありますか？
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['なし', '数日分あり', '十分ある'].map((option) => (
                    <label key={option} className="relative flex items-center justify-center p-4 border-2 border-slate-100 rounded-2xl cursor-pointer hover:bg-emerald-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 transition-all">
                      <input type="radio" name="medicine_stock" value={option} className="sr-only" />
                      <span className="font-bold text-slate-600">{option}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* 送信ボタン */}
            <div className="pt-6 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-5 rounded-2xl font-black text-white text-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 ${isSubmitting ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {isSubmitting ? "送信中..." : "問診票を送信して完了"}
              </button>
              <p className="text-center text-slate-400 text-xs mt-6">
                ※送信された情報は医師による診察の参考にさせていただきます。
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function MonshinPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-emerald-600 font-bold">Loading AI Form...</div>}>
      <MonshinForm />
    </Suspense>
  );
}
