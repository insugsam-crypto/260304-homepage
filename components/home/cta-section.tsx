import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative px-6 py-32">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-sm border border-gold/20 bg-card p-12 text-center md:p-20">
        {/* Decorative corners */}
        <div className="absolute left-0 top-0 h-16 w-px bg-gradient-to-b from-gold/50 to-transparent" />
        <div className="absolute left-0 top-0 h-px w-16 bg-gradient-to-r from-gold/50 to-transparent" />
        <div className="absolute bottom-0 right-0 h-16 w-px bg-gradient-to-t from-gold/50 to-transparent" />
        <div className="absolute bottom-0 right-0 h-px w-16 bg-gradient-to-l from-gold/50 to-transparent" />

        <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
          시작할 준비가 되셨나요?
        </span>
        <h2 className="mt-6 font-serif text-3xl font-light text-cream md:text-4xl lg:text-5xl">
          <span className="text-balance">
            {'함께 만들어요'}
            <br />
            <span className="italic text-gold">특별한 무언가를</span>
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
          모든 위대한 브랜드는 대화에서 시작됩니다. 당신의 비전을 알려주세요,
          그 비전에 걸맞은 탁월함으로 실현해 드리겠습니다.
        </p>
        <Link
          href="/contact"
          className="group mt-10 inline-flex items-center gap-3 rounded-sm border border-gold bg-gold px-10 py-4 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-all duration-300 hover:bg-gold-light"
        >
          프로젝트 시작하기
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
