import { Stethoscope, Baby, Thermometer } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const services = [
  {
    id: "naika",
    icon: Stethoscope,
    title: "内科",
    subtitle: "Internal Medicine",
    description: "風邪・インフルエンザ・胃腸炎などの急性疾患から、高血圧・糖尿病・脂質異常症などの生活習慣病まで、幅広く診療いたします。",
    details: [
      "かぜ、インフルエンザ、気管支炎などの呼吸器疾患",
      "胃炎、逆流性食道炎、過敏性腸症候群などの消化器疾患",
      "高血圧、糖尿病、脂質異常症などの生活習慣病",
      "健康診断・人間ドック後の精密検査",
      "各種予防接種（インフルエンザ・肺炎球菌など）",
    ],
  },
  {
    id: "shonika",
    icon: Baby,
    title: "小児科",
    subtitle: "Pediatrics",
    description: "お子様の健やかな成長をサポートいたします。発熱、咳、鼻水などの一般的な症状から、予防接種、乳幼児健診まで対応いたします。",
    details: [
      "発熱、咳、鼻水、下痢、嘔吐などの一般診療",
      "気管支喘息、アトピー性皮膚炎、食物アレルギーなどのアレルギー疾患",
      "乳幼児健診（1ヶ月、4ヶ月、10ヶ月、1歳6ヶ月など）",
      "定期予防接種・任意予防接種",
      "発達相談・育児相談",
    ],
  },
  {
    id: "hatsunetsu",
    icon: Thermometer,
    title: "発熱外来",
    subtitle: "Fever Outpatient",
    description: "発熱や呼吸器症状のある患者様を、一般の患者様と分離して診療いたします。完全予約制で安心して受診いただけます。",
    details: [
      "37.5℃以上の発熱がある方",
      "咳、息苦しさ、のどの痛みなどの呼吸器症状がある方",
      "新型コロナウイルス・インフルエンザの検査",
      "完全予約制・時間指定で密を回避",
      "専用の診察室・入口をご用意",
    ],
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 bg-card">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-4">診療案内</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            当院では、内科・小児科・発熱外来を中心に、
            地域の皆様の健康をサポートしております。
          </p>
        </div>

        {/* Services Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {services.map((service) => (
            <AccordionItem
              key={service.id}
              value={service.id}
              className="bg-background border border-border rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="py-6 hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.subtitle}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="pl-16">
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground mb-3">主な診療内容</p>
                    <ul className="space-y-2">
                      {service.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Additional note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            ※ 症状やご不明な点がございましたら、お気軽にお電話にてご相談ください。
          </p>
        </div>
      </div>
    </section>
  )
}
