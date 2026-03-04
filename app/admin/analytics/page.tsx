import { createClient } from '@/lib/supabase/server'
import { DEFAULT_SITE_ID } from '@/lib/supabase/config'
import { BarChart3, Eye, MousePointer, FileText } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  // Event type counts
  const { data: events } = await supabase
    .from('events')
    .select('event_type, created_at')
    .eq('site_id', DEFAULT_SITE_ID)
    .order('created_at', { ascending: false })
    .limit(100)

  const allEvents = events || []

  // Group by event type
  const eventCounts = allEvents.reduce<Record<string, number>>((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1
    return acc
  }, {})

  // Recent 7 days events
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentEvents = allEvents.filter(
    (e) => new Date(e.created_at) >= sevenDaysAgo
  )

  const eventTypeIcons: Record<string, typeof BarChart3> = {
    click_portfolio: MousePointer,
    open_canva: Eye,
    download_pdf: FileText,
    submit_lead: BarChart3,
  }

  const eventTypeLabels: Record<string, string> = {
    click_portfolio: '포트폴리오 클릭',
    open_canva: '캔바 열기',
    download_pdf: 'PDF 다운로드',
    submit_lead: '리드 제출',
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-light text-cream">분석</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        사용자 인터랙션과 참여를 추적합니다
      </p>

      {/* Event Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(eventCounts).map(([type, count]) => {
          const Icon = eventTypeIcons[type] || BarChart3
          return (
            <div
              key={type}
              className="rounded-sm border border-border/50 bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gold/10">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-light text-cream">{count}</p>
                  <p className="text-xs text-muted-foreground">
                    {eventTypeLabels[type] || type}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        {Object.keys(eventCounts).length === 0 && (
          <div className="col-span-full rounded-sm border border-border/30 py-12 text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-gold/20" />
            <p className="mt-3 text-sm text-muted-foreground">
              아직 기록된 이벤트가 없습니다
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 rounded-sm border border-border/50 bg-card">
        <div className="border-b border-border/30 px-6 py-4">
          <h2 className="font-serif text-lg font-light text-cream">
            최근 활동 (지난 7일)
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {recentEvents.length}개 이벤트
          </p>
        </div>
        <div className="divide-y divide-border/20">
          {recentEvents.length > 0 ? (
            recentEvents.slice(0, 20).map((event) => {
              const Icon = eventTypeIcons[event.event_type] || BarChart3
              return (
                <div
                  key={`${event.event_type}-${event.created_at}`}
                  className="flex items-center gap-4 px-6 py-3"
                >
                  <Icon className="h-4 w-4 text-gold/60" />
                  <p className="flex-1 text-sm text-cream/80">
                    {eventTypeLabels[event.event_type] || event.event_type}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.created_at).toLocaleString('ko-KR')}
                  </span>
                </div>
              )
            })
          ) : (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              최근 활동이 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
