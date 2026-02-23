"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function MonshinForm() {
  const searchParams = useSearchParams();
  const resId = searchParams.get("res_id") || "NEW-PATIENT";
  const type = searchParams.get("type"); 
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(formData.entries()), res_id: resId, type };

    try {
      await fetch("https://n8n.my-clinic-de.com/webhook/monshin-submit", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
      });
      setIsDone(true);
    } catch (err) {
      alert("送信に失敗しました。");
    }
  };

  if (isDone) return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4 text-center">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl max-w-sm">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-black text-emerald-800 mb-2">送信完了</h2>
        <p className="text-slate-500 mb-8">問診票を正しく受け付けました。ご来院をお待ちしております。</p>
        <a href="/" className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-full font-bold">トップへ戻る</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-emerald-50 py-12 px-4 font-sans text-slate-800">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-10">
          <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black tracking-widest mb-4">MEDICAL QUESTIONNAIRE</div>
          <h1 className="text-3xl font-black text-emerald-900">オンライン問診票</h1>
          <div className="mt-4 text-xs font-mono text-emerald-600 bg-white px-3 py-1 rounded-full inline-block border border-emerald-100 shadow-sm">ID: {resId}</div>
        </header>

        <main className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 p-8 border border-emerald-50">
          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-3">
              <label className="text-lg font-bold text-slate-700 block">
                {type === "checkup" ? "体調の変化はありますか？" : "詳しい症状を教えてください"}
              </label>
              <textarea name="symptoms" required className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-100 outline-none h-32" placeholder="いつから、どのような症状がありますか？" />
            </section>

            {type === "new" && (
              <section className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <label className="text-lg font-bold text-slate-700 block">既往歴 (過去にかかった病気)</label>
                <textarea name="history" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-100 outline-none h-20" placeholder="糖尿病、高血圧、アレルギーなど" />
              </section>
            )}

            {(type === "return" || type === "checkup") && (
              <section className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <label className="text-lg font-bold text-slate-700 block">現在お使いの薬の残量は？</label>
                <div className="grid grid-cols-1 gap-2">
                  {['なし', '数日分ある', '十分ある'].map(v => (
                    <label key={v} className="flex items-center p-4 bg-slate-50 rounded-2xl cursor-pointer has-[:checked]:bg-emerald-50 has-[:checked]:ring-2 has-[:checked]:ring-emerald-500 transition-all font-bold text-slate-600">
                      <input type="radio" name="medicine_stock" value={v} className="mr-3" /> {v}
                    </label>
                  ))}
                </div>
              </section>
            )}

            <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all">送信して完了</button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default function MonshinPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-emerald-600 font-bold">Connecting to AI...</div>}><MonshinForm /></Suspense>;
}
