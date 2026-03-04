import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_SITE_ID } from '@/lib/supabase/config'

export async function PortfolioPreview() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('portfolio_items')
    .select(`
      id,
      title,
      summary,
      thumbnail_url,
      outcome_metric,
      portfolio_item_tags(
        tags(name, tag_type)
      )
    `)
    .eq('site_id', DEFAULT_SITE_ID)
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const portfolioItems = items || []

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
              대표 작업
            </span>
            <h2 className="mt-4 font-serif text-3xl font-light text-cream md:text-4xl lg:text-5xl">
              선별된 프로젝트
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-gold transition-colors hover:text-gold-light"
          >
            전체 작업 보기
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Portfolio Grid */}
        {portfolioItems.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map((item) => {
              const tags = (item.portfolio_item_tags as Array<{ tags: { name: string; tag_type: string } }>)
                ?.map((t) => t.tags)
                .filter(Boolean)

              return (
                <Link
                  key={item.id}
                  href={`/portfolio#${item.id}`}
                  className="card-hover group block overflow-hidden rounded-sm border border-border/50 bg-card"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-serif text-2xl text-gold/20">
                          {item.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-lg font-light text-cream">
                      {item.title}
                    </h3>
                    {item.summary && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {item.summary}
                      </p>
                    )}
                    {tags && tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.name}
                            className="rounded-sm bg-gold/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-gold"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="rounded-sm border border-border/30 py-20 text-center">
            <p className="font-serif text-xl text-cream/50">준비 중</p>
            <p className="mt-2 text-sm text-muted-foreground">
              대표 프로젝트가 곧 이곳에 표시됩니다.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
