import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ContactForm } from '@/components/contact/contact-form'
import { Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: '문의하기 | 프리미엄 브랜드 스튜디오',
  description: '다음 프리미엄 브랜드 프로젝트에 대해 문의하세요.',
}

const contactInfo = [
  {
    icon: Mail,
    label: '이메일',
    value: 'hello@premiumstudio.com',
    href: 'mailto:hello@premiumstudio.com',
  },
  {
    icon: MapPin,
    label: '위치',
    value: '서울, 대한민국',
    href: null,
  },
  {
    icon: Clock,
    label: '업무 시간',
    value: '월 - 금, 10:00 - 18:00 KST',
    href: null,
  },
]

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-24">
        {/* Page Header */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
              문의하기
            </span>
            <h1 className="mt-4 font-serif text-4xl font-light text-cream md:text-5xl lg:text-6xl">
              연락처
            </h1>
            <div className="gold-line mx-auto mt-6 w-16" />
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              모든 위대한 브랜드는 대화에서 시작됩니다. 당신의 비전을 알려주시면
              함께 특별한 무언가를 만들어 드리겠습니다.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="px-6 pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="flex flex-col gap-8 lg:col-span-1">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-gold/20 bg-gold/5">
                      <info.icon className="h-4 w-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="mt-1 text-sm text-cream transition-colors hover:text-gold"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-cream">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Decorative element */}
                <div className="mt-4 rounded-sm border border-border/30 bg-card p-6">
                  <p className="font-serif text-lg font-light text-cream">
                    {'모든 문의에 24시간 이내 답변드립니다.'}
                  </p>
                  <div className="mt-3 h-px w-8 bg-gold/40" />
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="rounded-sm border border-border/30 bg-card p-8 md:p-10">
                  <h2 className="mb-8 font-serif text-2xl font-light text-cream">
                    메시지 보내기
                  </h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
