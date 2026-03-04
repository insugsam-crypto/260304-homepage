import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PortfolioGallery } from '@/components/portfolio/portfolio-gallery'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_SITE_ID } from '@/lib/supabase/config'

export const metadata: Metadata = {
  title: '포트폴리오 | 프리미엄 브랜드 스튜디오',
  description: '엄선된 프리미엄 브랜드 프로젝트 컬렉션을 살펴보세요.',
}

export default async function PortfolioPage() {
  const supabase = await createClient()

  // Fetch all published portfolio items with tags and links
  const { data: rawItems } = await supabase
    .from('portfolio_items')
    .select(`
      id,
      title,
      summary,
      description,
      role,
      period_start,
      period_end,
      outcome_metric,
      thumbnail_url,
      portfolio_links(id, link_type, url, label),
      portfolio_item_tags(
        tag_id,
        tags(id, name, tag_type)
      )
    `)
    .eq('site_id', DEFAULT_SITE_ID)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  // Fetch all tags for filtering
  const { data: allTags } = await supabase
    .from('tags')
    .select('id, name, tag_type')
    .eq('site_id', DEFAULT_SITE_ID)
    .order('tag_type')
    .order('name')

  // Transform items to flatten tags
  const items = (rawItems || []).map((item) => ({
    ...item,
    portfolio_links: item.portfolio_links || [],
    tags: (item.portfolio_item_tags as Array<{ tag_id: string; tags: { id: string; name: string; tag_type: string } }>)
      ?.map((pt) => pt.tags)
      .filter(Boolean) || [],
  }))

  return (
    <>
      <SiteHeader />
      <main className="pt-24">
        {/* Page Header */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
              작업 소개
            </span>
            <h1 className="mt-4 font-serif text-4xl font-light text-cream md:text-5xl lg:text-6xl">
              포트폴리오
            </h1>
            <div className="gold-line mx-auto mt-6 w-16" />
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              엄선된 대표 작업들로, 각 프로젝트는 탁월함과 창의적 혁신에 대한
              우리의 헌신을 보여줍니다.
            </p>
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section className="px-6 pb-32">
          <div className="mx-auto max-w-7xl">
            <PortfolioGallery items={items} tags={allTags || []} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
