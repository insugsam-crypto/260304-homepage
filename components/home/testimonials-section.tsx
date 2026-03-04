import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: '브랜드 존재감을 완전히 변화시켜 주셨습니다. 세밀한 디테일과 전략적 사고로 경쟁사들 사이에서 한 단계 도약할 수 있었습니다.',
    name: '김소희',
    title: '대표, Luxe Atelier',
  },
  {
    quote: '탁월한 수준의 장인정신을 경험했습니다. 모든 결과물이 기대를 뛰어넘었고, 브랜드의 본질을 완벽하게 담아냈습니다.',
    name: '박준우',
    title: 'CMO, Vertex Technologies',
  },
  {
    quote: '프리미엄 스튜디오와의 협업은 놀라운 경험이었습니다. 우리의 비전을 완벽히 이해하고 세련된 방식으로 실현해 주셨습니다.',
    name: '이유나',
    title: '대표, Maison Seoul',
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative px-6 py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
            고객 후기
          </span>
          <h2 className="mt-4 font-serif text-3xl font-light text-cream md:text-4xl lg:text-5xl">
            <span className="text-balance">고객의 이야기</span>
          </h2>
          <div className="gold-line mx-auto mt-6 w-16" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative rounded-sm border border-border/50 bg-card p-8"
            >
              <Quote className="mb-6 h-5 w-5 text-gold/40" />
              <blockquote className="text-sm leading-relaxed text-cream/80">
                {`"${testimonial.quote}"`}
              </blockquote>
              <div className="mt-8 border-t border-border/30 pt-6">
                <p className="font-serif text-sm text-cream">{testimonial.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
