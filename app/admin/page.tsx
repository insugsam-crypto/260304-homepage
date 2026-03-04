import { createClient } from '@/lib/supabase/server'
import { DEFAULT_SITE_ID } from '@/lib/supabase/config'
import { Briefcase, MessageSquare, Eye, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts
  const { count: portfolioCount } = await supabase
    .from('portfolio_items')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', DEFAULT_SITE_ID)

  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', DEFAULT_SITE_ID)

  const { count: newLeadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', DEFAULT_SITE_ID)
    .eq('status', 'new')

  const { count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', DEFAULT_SITE_ID)

  // Recent leads
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('id, name, email, company, status, created_at')
    .eq('site_id', DEFAULT_SITE_ID)
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      icon: Briefcase,
      label: '포트폴리오 항목',
      value: portfolioCount || 0,
    },
    {
      icon: MessageSquare,
      label: '전체 리드',
      value: leadsCount || 0,
    },
    {
      icon: TrendingUp,
      label: '신규 리드',
      value: newLeadsCount || 0,
    },
    {
      icon: Eye,
      label: '전체 이벤트',
      value: eventsCount || 0,
    },
  ]

  const statusColors: Record<string, string> = {
    new: 'bg-gold/20 text-gold',
    in_progress: 'bg-blue-500/20 text-blue-400',
    won: 'bg-green-500/20 text-green-400',
    lost: 'bg-red-500/20 text-red-400',
    spam: 'bg-muted text-muted-foreground',
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-light text-cream">대시보드</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        브랜드 스튜디오 전체 현황
      </p>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-sm border border-border/50 bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/10">
                <stat.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-light text-cream">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="mt-8 rounded-sm border border-border/50 bg-card">
        <div className="border-b border-border/30 px-6 py-4">
          <h2 className="font-serif text-lg font-light text-cream">
            최근 리드
          </h2>
        </div>
        <div className="divide-y divide-border/20">
          {recentLeads && recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm text-cream">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.email}
                    {lead.company && ` - ${lead.company}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-sm px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                      statusColors[lead.status] || statusColors.new
                    }`}
                  >
                    {lead.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              아직 리드가 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
