import { Palette, Globe, Printer, Video, PenTool, BarChart3 } from 'lucide-react'

const services = [
  {
    icon: Palette,
    title: '브랜드 아이덴티티',
    description: '로고, 타이포그래피, 컬러 팔레트, 브랜드 가이드라인을 포함한 완벽한 브랜드 시스템을 구축합니다.',
  },
  {
    icon: Globe,
    title: '웹 디자인',
    description: '우아한 인터랙션과 비주얼 스토리텔링으로 고객을 사로잡는 맞춤형 디지털 경험을 제공합니다.',
  },
  {
    icon: Printer,
    title: '인쇄 디자인',
    description: '에디토리얼 레이아웃부터 패키지까지, 모든 접점에서 품격을 전달하는 프리미엄 인쇄물을 제작합니다.',
  },
  {
    icon: Video,
    title: '모션 & 영상',
    description: '세련된 애니메이션과 영상 제작을 통해 브랜드에 생동감을 불어넣는 다이나믹한 비주얼 콘텐츠입니다.',
  },
  {
    icon: PenTool,
    title: '크리에이티브 디렉션',
    description: '모든 채널과 매체에서 일관된 브랜드 표현을 보장하는 전략적 크리에이티브 리더십을 제공합니다.',
  },
  {
    icon: BarChart3,
    title: '브랜드 전략',
    description: '데이터 기반의 포지셔닝과 전략으로 경쟁 시장에서 차별화된 브랜드를 만들어냅니다.',
  },
]

export function ServicesSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
            서비스 소개
          </span>
          <h2 className="mt-4 font-serif text-3xl font-light text-cream md:text-4xl lg:text-5xl">
            <span className="text-balance">제공 서비스</span>
          </h2>
          <div className="gold-line mx-auto mt-6 w-16" />
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="card-hover group rounded-sm border border-border/50 bg-card p-8"
            >
              <service.icon className="h-6 w-6 text-gold transition-colors group-hover:text-gold-light" />
              <h3 className="mt-6 font-serif text-xl font-light text-cream">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
