import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-gold bg-gold/10">
              <span className="font-serif text-sm font-bold text-gold">P</span>
            </div>
            <span className="font-serif text-lg tracking-wide text-cream">
              Premium<span className="text-gold">Studio</span>
            </span>
          </Link>

          {/* Gold Line */}
          <div className="gold-line w-24" />

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-8">
            {[
              { label: '홈', href: '/' },
              { label: '포트폴리오', href: '/portfolio' },
              { label: '문의하기', href: '/contact' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground">
            {new Date().getFullYear()} 프리미엄 브랜드 스튜디오. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
