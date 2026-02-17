"use client";

import { useState } from "react";
import { faqData } from "../lib/faq-data";

export default function FAQ() {
  // どの質問が開いているかを管理する（最初は全部閉じている状態＝null）
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">よくあるご質問</h2>
      
      <div className="space-y-4">
        {faqData.map((faq) => (
          <div 
            key={faq.id} 
            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
          >
            {/* 質問部分（クリックで開閉） */}
            <button
              className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition-colors"
              onClick={() => toggleFAQ(faq.id)}
            >
              <span className="font-semibold text-gray-700">{faq.question}</span>
              
              {/* 矢印アイコン（SVG）: 開いている時は180度回転する */}
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  openId === faq.id ? "rotate-180" : ""
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* 回答部分（openIdが一致した時だけ表示される） */}
            {openId === faq.id && (
              <div className="p-5 border-t border-gray-100 bg-blue-50/30">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}