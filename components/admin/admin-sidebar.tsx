'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  BarChart3,
  LogOut,
  Home,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/portfolio', label: '포트폴리오', icon: Briefcase },
  { href: '/admin/leads', label: '리드 관리', icon: MessageSquare },
  { href: '/admin/analytics', label: '분석', icon: BarChart3 },
]

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border/50 bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border/30 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-gold bg-gold/10">
          <span className="font-serif text-sm font-bold text-gold">P</span>
        </div>
        <div>
          <p className="text-sm font-medium text-cream">관리자 패널</p>
          <p className="text-[10px] text-muted-foreground">프리미엄 스튜디오</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-cream'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="my-4 h-px bg-border/30" />

        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-cream"
        >
          <Home className="h-4 w-4" />
          사이트 보기
        </Link>
      </nav>

      {/* User & Logout */}
      <div className="border-t border-border/30 px-3 py-4">
        <p className="mb-2 truncate px-3 text-xs text-muted-foreground">
          {userEmail}
        </p>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-cream"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
