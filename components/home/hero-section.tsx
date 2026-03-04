import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.03] blur-3xl" />
        <div className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Overline */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-gold/50" />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
            프리미엄 브랜드 스튜디오
          </span>
          <div className="h-px w-12 bg-gold/50" />
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-4xl font-light leading-tight tracking-tight text-cream md:text-6xl lg:text-7xl">
          <span className="text-balance">
            <span className="text-gold-gradient font-medium italic">특별한</span> 브랜드
            <br />
            경험을 창조합니다
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          비전을 프리미엄 브랜드 아이덴티티로 전환하여 안목 있는 고객에게
          깊은 인상을 남기고 의미 있는 비즈니스 성과를 이끌어냅니다.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/portfolio"
            className="group flex items-center gap-3 rounded-sm border border-gold bg-gold px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-all duration-300 hover:bg-gold-light"
          >
            포트폴리오 보기
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-3 rounded-sm border border-border px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-cream transition-all duration-300 hover:border-gold hover:text-gold"
          >
            프로젝트 시작하기
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-border/50 pt-12">
          {[
            { value: '150+', label: '완료 프로젝트' },
            { value: '98%', label: '고객 만족도' },
            { value: '12+', label: '년의 경험' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-2xl font-light text-gold md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
