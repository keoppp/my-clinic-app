import { MapPin, Phone, Clock, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer id="access" className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Clinic info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-lg">A</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">Aクリニック</span>
                <p className="text-xs text-muted-foreground">A CLINIC</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              地域の皆様の健康を第一に考え、安心と信頼の医療サービスを提供しております。
              お気軽にご来院ください。
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              お問い合わせ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  〒100-0001
                  <br />
                  東京都千代田区1-2-3
                  <br />
                  みらいビル2F
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">03-1234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">info@a-clinic.jp</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              診療時間
            </h3>
            <div className="flex items-start gap-3 mb-4">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  <span className="font-medium text-foreground">午前</span> 9:00〜12:30
                </p>
                <p>
                  <span className="font-medium text-foreground">午後</span> 14:00〜18:00
                </p>
              </div>
            </div>
            <div className="bg-background rounded-lg p-4 text-sm">
              <table className="w-full text-muted-foreground">
                <thead>
                  <tr>
                    <th className="font-medium text-foreground pb-2">曜日</th>
                    <th className="font-medium text-foreground pb-2">午前</th>
                    <th className="font-medium text-foreground pb-2">午後</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">月〜金</td>
                    <td className="py-1 text-center text-primary">●</td>
                    <td className="py-1 text-center text-primary">●</td>
                  </tr>
                  <tr>
                    <td className="py-1">土曜日</td>
                    <td className="py-1 text-center text-primary">●</td>
                    <td className="py-1 text-center">−</td>
                  </tr>
                  <tr>
                    <td className="py-1">日・祝</td>
                    <td className="py-1 text-center">−</td>
                    <td className="py-1 text-center">−</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Aクリニック. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                プライバシーポリシー
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                利用規約
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
