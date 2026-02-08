"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, CheckCircle, CalendarDays, Clock, User, Mail, Phone, FileText, Stethoscope, HeartPulse, Brain, MapPin } from "lucide-react";

const WEBHOOK_URL = "http://localhost:5678/webhook-test/clinic";
const RESERVATION_YEAR = "2026";

const N8N_WAITING_STATUS_URL = "https://YOUR_N8N_URL/waiting-status"; // <<< あなたのn8nのURLに置き換えてください

/** 診療案内のアイコンキーと Lucide アイコンマッピング（CLINIC_DATA.services の iconKey 用） */
const SERVICE_ICONS = { stethoscope: Stethoscope, heartPulse: HeartPulse, brain: Brain } as const;

/** クリニック名・診療案内・お知らせ・規約をすべて集約。中身だけ書き換えて利用してください。 */
const CLINIC_DATA = {
  /** クリニック名（ヘッダー・ヒーロー・フッターで使用） */
  clinicName: "A Clinic",
  /** 住所 */
  address: "〒100-0001\n東京都千代田区1-1-1 医療ビル3F",
  /** 電話番号 */
  phone: "03-1234-5678",
  /** 診療時間 */
  hours: {
    weekdays: "9:00 - 18:00",
    saturday: "9:00 - 13:00",
    closed: "日曜・祝日",
  },
  /** フッターの説明文 */
  footerDescription:
    "地域の皆様の健康を守るパートナーとして、\n最新の医療技術と心のこもったケアで\n患者様に寄り添った診療を提供いたします。",
  /** 著作権表示（例: © 2024 A Clinic. All rights reserved.） */
  copyright: "© 2024 A Clinic. All rights reserved.",
  /** 診療案内（iconKey は "stethoscope" | "heartPulse" | "brain" のいずれか） */
  services: [
    {
      iconKey: "stethoscope" as const,
      title: "一般内科",
      description:
        "風邪や発熱、腹痛などの急性疾患から、高血圧・糖尿病などの生活習慣病まで幅広く対応いたします。丁寧な問診と検査で、適切な診断・治療を行います。",
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80",
      imageAlt: "聴診器を使用する医師",
    },
    {
      iconKey: "heartPulse" as const,
      title: "循環器内科",
      description:
        "心臓や血管の疾患を専門的に診療いたします。心電図、心エコー検査などの精密検査を通じて、心疾患の早期発見・治療に努めます。",
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80",
      imageAlt: "最新の医療機器",
    },
    {
      iconKey: "brain" as const,
      title: "健康診断・予防医療",
      description:
        "定期的な健康診断と予防医療で、病気の早期発見と健康維持をサポートいたします。各種検査や予防接種も実施しております。",
      image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&q=80",
      imageAlt: "清潔な診察室",
    },
  ],
  /** 私たちについての特徴リスト */
  features: [
    "最新の医療機器を完備",
    "経験豊富な医師・スタッフ",
    "駅から徒歩3分の好立地",
    "土曜日も診療対応",
    "オンライン予約可能",
    "バリアフリー対応",
  ],
  /** 病院からのお知らせ。{ date, title, content } を追加するだけでHPに反映されます。タイトルクリックで詳細がモーダル表示。 */
  notices: [
    {
      date: "2026.01.15",
      title: "年末年始の診療について",
      content: `年末年始の診療スケジュールをお知らせいたします。

【診療日】
・12月28日（土）まで通常診療
・12月29日（日）〜1月3日（金）休診
・1月4日（土）より通常診療再開

急な症状の場合は救急医療機関をご利用ください。`,
    },
    {
      date: "2026.01.01",
      title: "新年のご挨拶と診療日程",
      content: `新年あけましておめでとうございます。

本年も地域の皆様の健康をサポートしてまいりますので、よろしくお願いいたします。

1月4日（土）より通常診療を開始いたします。`,
    },
    {
      date: "2025.12.20",
      title: "冬期休診のお知らせ",
      content: `冬期の休診についてお知らせいたします。

【休診日】
12月29日（日）〜1月3日（金）

上記期間中は休診とさせていただきます。ご不便をおかけしますが、何卒ご了承ください。`,
    },
  ],
  /** プライバシーポリシー本文（モーダルで表示） */
  privacyPolicy: `プライバシーポリシー

A Clinic（以下「当院」）は、患者様の個人情報の保護を重要な責務と認識し、以下のとおりプライバシーポリシーを定め、これを遵守します。

1. 個人情報の定義
個人情報とは、氏名、生年月日、住所、電話番号、メールアドレス等、特定の個人を識別できる情報をいいます。

2. 個人情報の利用目的
当院は、収集した個人情報を以下の目的で利用いたします。
・診療および診療に付随する諸手続き
・予約の受付・確認・変更・キャンセル
・お知らせ・ご案内の送付
・医療サービスの向上のための分析（匿名化した場合を含む）

3. 個人情報の第三者提供
当院は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。

4. お問い合わせ
個人情報の取扱いに関するお問い合わせは、当院までご連絡ください。`,
  /** 利用規約本文（モーダルで表示） */
  termsOfUse: `利用規約

第1条（適用）
本規約は、A Clinic（以下「当院」）が提供するウェブサイトおよびオンライン予約サービス（以下「本サービス」）の利用条件を定めるものです。

第2条（利用登録）
本サービスをご利用いただくには、本規約に同意の上、当院所定の方法で必要事項をご登録ください。

第3条（禁止事項）
利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。
・虚偽の情報の登録
・第三者になりすます行為
・当院または第三者の権利を侵害する行為
・法令または公序良俗に反する行為

第4条（サービスの変更・中止）
当院は、必要に応じ本サービスの内容を変更し、または提供を中止することがあります。

第5条（お問い合わせ）
本規約に関するお問い合わせは、当院までご連絡ください。`,
};

const navItems = [
  { label: "ホーム", href: "#" },
  { label: "診療案内", href: "#services" },
  { label: "私たちについて", href: "#about" },
  { label: "ご予約", href: "#reservation" },
];

const months = [
  { value: "1", label: "1月" },
  { value: "2", label: "2月" },
  { value: "3", label: "3月" },
  { value: "4", label: "4月" },
  { value: "5", label: "5月" },
  { value: "6", label: "6月" },
  { value: "7", label: "7月" },
  { value: "8", label: "8月" },
  { value: "9", label: "9月" },
  { value: "10", label: "10月" },
  { value: "11", label: "11月" },
  { value: "12", label: "12月" },
];

const days = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}日`,
}));

const timeSlots = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState<string>(""); // n8nからのテキストレスポンスを保存
  const [modalOpen, setModalOpen] = useState<null | "privacy" | "terms">(null);
  const [selectedNotice, setSelectedNotice] = useState<{ date: string; title: string; content: string } | null>(null);
  const [waitingCount, setWaitingCount] = useState<number | null>(null);
  const [waitingLoading, setWaitingLoading] = useState(true);
  const [waitingError, setWaitingError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    symptoms: "",
    month: "",
    day: "",
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const fetchWaitingStatus = async () => {
      setWaitingLoading(true);
      setWaitingError(false);
      try {
        const res = await fetch(N8N_WAITING_STATUS_URL);
        const data = await res.json();
        if (typeof data.waitingCount === "number") {
          setWaitingCount(data.waitingCount);
        } else {
          setWaitingError(true);
        }
      } catch (err) {
        console.error("Failed to fetch waiting status:", err);
        setWaitingError(true);
      } finally {
        setWaitingLoading(false);
      }
    };

    fetchWaitingStatus(); // Initial fetch
    const intervalId = setInterval(fetchWaitingStatus, 30000); // Fetch every 30 seconds

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReservationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerMessage(""); // メッセージをリセット

    // 日付・時間の未選択チェック
    if (!formData.month || !formData.day || !selectedTime) {
       setServerMessage("日付と時間を選択してください。");
       setIsSubmitting(false);
       setIsSubmitted(true);
       return;
    }

    // データの準備（元のコードのロジックを維持）
    const month = formData.month.padStart(2, "0");
    const day = formData.day.padStart(2, "0");
    const preferredDate = `${RESERVATION_YEAR}-${month}-${day}`;

    const data = {
      name: formData.name,
      dateOfBirth: formData.dob,
      email: formData.email,
      phone: formData.phone,
      symptoms: formData.symptoms,
      preferredDate,
      preferredTime: selectedTime,
      preferredDateTime: `${preferredDate} ${selectedTime}`,
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const message = await response.text(); // n8nからの返信をテキストとして取得
      setServerMessage(message); // 返信内容を保存
    } catch (error) {
      console.error("Error submitting reservation:", error);
      setServerMessage("送信中にエラーが発生しました。"); // エラー時のメッセージ
    }
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <button
              type="button"
              onClick={() => handleNavClick("#")}
              className="text-xl font-medium tracking-wider text-foreground cursor-pointer"
            >
              <span className="font-serif">{CLINIC_DATA.clinicName}</span>
            </button>
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="hidden md:block">
              <button
                type="button"
                onClick={() => handleNavClick("#reservation")}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                ご予約
              </button>
            </div>
            <button
              type="button"
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item.href)}
                    className="py-3 px-4 text-left text-foreground hover:bg-muted rounded-md transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleNavClick("#reservation")}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  ご予約
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80"
            alt="清潔感のあるクリニック受付"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm tracking-[0.3em] text-primary mb-6 uppercase">{CLINIC_DATA.clinicName}</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight text-foreground mb-8 text-balance">
            あなたに寄り添う、
            <br />
            次世代の医療を。
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            最新の医療技術と心のこもったケアで、
            <br className="hidden md:block" />
            患者様一人ひとりに寄り添った診療を提供いたします。
          </p>
          {/* 待ち状況表示コンポーネント */}
          <div className="mb-12">
            {waitingLoading && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg shadow-md max-w-sm mx-auto animate-pulse">
                <p className="text-center font-medium">混雑状況を確認中...</p>
              </div>
            )}
            {!waitingLoading && waitingError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow-md max-w-sm mx-auto">
                <p className="text-center font-medium">混雑状況の取得に失敗しました。</p>
              </div>
            )}
            {!waitingLoading && !waitingError && waitingCount !== null && (
              <div
                className={`p-4 rounded-lg shadow-md max-w-sm mx-auto text-center
                  ${waitingCount <= 3 ? "bg-blue-50 text-blue-700"
                  : waitingCount <= 9 ? "bg-yellow-50 text-yellow-700"
                  : "bg-red-50 text-red-700"}
                `}
              >
                <p className="text-xl font-semibold mb-2">現在、{waitingCount}人待ち</p>
                <p className="text-sm">
                  {waitingCount <= 3
                    ? "現在、スムーズに診察可能です"
                    : waitingCount <= 9
                    ? "少し混み合っています。時間に余裕を持ってお越しください"
                    : "現在混雑しています。お急ぎの方はご注意ください"}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 rounded-md text-base font-medium h-12 px-10 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              ご予約はこちら
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 rounded-md text-base font-medium h-12 px-10 py-6 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
            >
              診療案内を見る
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer"
          aria-label="下にスクロール"
        >
          <ChevronDown className="w-8 h-8 text-primary" />
        </button>
      </section>

      {/* 病院からのお知らせ（タイトルクリックで詳細をモーダル表示） */}
      <section className="py-12 md:py-16 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-6">病院からのお知らせ</h2>
          <ul className="space-y-4">
            {CLINIC_DATA.notices.map((notice, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-3 py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground shrink-0">{notice.date}</span>
                <button
                  type="button"
                  onClick={() => setSelectedNotice(notice)}
                  className="text-left text-foreground hover:text-primary transition-colors underline underline-offset-2"
                >
                  {notice.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-sm tracking-[0.3em] text-primary mb-4 uppercase">Services</p>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-6">診療案内</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              患者様の症状やご要望に合わせて、
              <br className="hidden sm:block" />
              最適な医療サービスを提供いたします。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {CLINIC_DATA.services.map((service) => {
              const IconComponent = SERVICE_ICONS[service.iconKey];
              return (
                <div
                  key={service.title}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-medium text-card-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80"
                      alt="クリニックの受付エリア"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative h-32 md:h-40 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80"
                      alt="清潔な廊下"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-32 md:h-40 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80"
                      alt="待合室"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80"
                      alt="医師との相談"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-lg -z-10" />
            </div>
            <div>
              <p className="text-sm tracking-[0.3em] text-primary mb-4 uppercase">About Us</p>
              <h2 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-6">私たちについて</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                <p>
                  A Clinicは、地域の皆様の健康を守るパートナーとして、
                  2010年の開院以来、患者様一人ひとりに寄り添った医療を
                  提供してまいりました。
                </p>
                <p>
                  私たちは「患者様ファースト」を理念に掲げ、
                  最新の医療技術と温かいホスピタリティを融合させた
                  診療を心がけております。お気軽にご相談ください。
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {CLINIC_DATA.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation */}
      <section id="reservation" className="py-24 md:py-32 bg-secondary">
        <div className="max-w-4xl mx-auto px-6">
          {isSubmitted ? (
            <>
              <div className="border-0 shadow-xl rounded-lg bg-card">
                <div className="py-16 text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CalendarDays className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-medium text-card-foreground mb-4">
                    ご予約ありがとうございます
                  </h3>
                  {serverMessage ? (
                    <p className="text-foreground leading-relaxed mb-4 whitespace-pre-wrap">{serverMessage}</p>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      ご予約内容の確認メールをお送りいたしました。
                      <br />
                      ご不明な点がございましたら、お気軽にお問い合わせください。
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-12 md:mb-16">
                <p className="text-sm tracking-[0.3em] text-primary mb-4 uppercase">Reservation</p>
                <h2 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-6">ご予約</h2>
                <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  以下のフォームに必要事項をご入力の上、
                  <br className="hidden sm:block" />
                  ご予約をお申し込みください。
                </p>
              </div>
              <div className="border-0 shadow-xl rounded-lg bg-card overflow-hidden">
                <div className="border-b border-border/50 pb-6 pt-6 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">オンライン予約フォーム</h3>
                      <p className="text-sm text-muted-foreground">必須項目をすべてご入力ください</p>
                    </div>
                  </div>
                </div>
                <div className="pt-8 px-6 pb-8">
                  <form onSubmit={handleReservationSubmit} className="space-y-8">
                    <div className="space-y-6">
                      <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        患者様情報
                      </h4>
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm">
                          氏名 <span className="text-destructive">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="山田 太郎"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="dob" className="text-sm">
                          生年月日 <span className="text-destructive">*</span>
                        </label>
                        <input
                          id="dob"
                          name="dob"
                          type="date"
                          required
                          value={formData.dob}
                          onChange={(e) => setFormData((p) => ({ ...p, dob: e.target.value }))}
                          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          メールアドレス <span className="text-destructive">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="example@email.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          電話番号 <span className="text-destructive">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="090-1234-5678"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        ご症状・ご相談内容
                      </h4>
                      <div className="space-y-2">
                        <label htmlFor="symptoms" className="text-sm">
                          症状 <span className="text-destructive">*</span>
                        </label>
                        <textarea
                          id="symptoms"
                          name="symptoms"
                          placeholder="現在の症状やご相談内容をご記入ください"
                          rows={4}
                          required
                          value={formData.symptoms}
                          onChange={(e) => setFormData((p) => ({ ...p, symptoms: e.target.value }))}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        予約希望日
                      </h4>
                      <p className="text-xs text-muted-foreground">※西暦(202X年)は自動補完されます</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm">
                            月 <span className="text-destructive">*</span>
                          </label>
                          <select
                            required
                            value={formData.month}
                            onChange={(e) => setFormData((p) => ({ ...p, month: e.target.value }))}
                            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">月を選択</option>
                            {months.map((m) => (
                              <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm">
                            日 <span className="text-destructive">*</span>
                          </label>
                          <select
                            required
                            value={formData.day}
                            onChange={(e) => setFormData((p) => ({ ...p, day: e.target.value }))}
                            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">日を選択</option>
                            {days.map((d) => (
                              <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        予約時間帯 <span className="text-destructive">*</span>
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 px-4 rounded-md text-sm font-medium transition-all ${
                              selectedTime === time
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={!selectedTime || isSubmitting}
                        className="w-full h-14 inline-flex items-center justify-center gap-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            送信中...
                          </span>
                        ) : (
                          "予約を確定する"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-serif text-2xl font-medium mb-4">{CLINIC_DATA.clinicName}</h3>
              <p className="text-background/70 text-sm leading-relaxed whitespace-pre-line">
                {CLINIC_DATA.footerDescription}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">お問い合わせ</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-background/50 mt-0.5 shrink-0" />
                  <span className="text-background/70 whitespace-pre-line">{CLINIC_DATA.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-background/50 shrink-0" />
                  <span className="text-background/70">{CLINIC_DATA.phone}</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">診療時間</h4>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-background/50 mt-0.5 shrink-0" />
                <div className="text-background/70">
                  <p>月〜金: {CLINIC_DATA.hours.weekdays}</p>
                  <p>土曜日: {CLINIC_DATA.hours.saturday}</p>
                  <p className="mt-2 text-background/50">休診: {CLINIC_DATA.hours.closed}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm">{CLINIC_DATA.copyright}</p>
            <div className="flex gap-6 text-sm">
              <button
                type="button"
                onClick={() => setModalOpen("privacy")}
                className="text-background/50 hover:text-background transition-colors"
              >
                プライバシーポリシー
              </button>
              <button
                type="button"
                onClick={() => setModalOpen("terms")}
                className="text-background/50 hover:text-background transition-colors"
              >
                利用規約
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* お知らせ詳細モーダル */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedNotice(null)}
          role="dialog"
          aria-modal="true"
          aria-label="お知らせ詳細"
        >
          <div
            className="bg-card text-card-foreground rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground">{selectedNotice.date}</p>
                <h3 className="text-lg font-semibold text-foreground">{selectedNotice.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="p-2 rounded-md hover:bg-muted text-foreground"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1 whitespace-pre-wrap text-sm text-muted-foreground">
              {selectedNotice.content}
            </div>
          </div>
        </div>
      )}

      {/* 規約モーダル（プライバシーポリシー・利用規約） */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setModalOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={modalOpen === "privacy" ? "プライバシーポリシー" : "利用規約"}
        >
          <div
            className="bg-card text-card-foreground rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold">
                {modalOpen === "privacy" ? "プライバシーポリシー" : "利用規約"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(null)}
                className="p-2 rounded-md hover:bg-muted text-foreground"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1 whitespace-pre-wrap text-sm text-muted-foreground">
              {modalOpen === "privacy" ? CLINIC_DATA.privacyPolicy : CLINIC_DATA.termsOfUse}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
