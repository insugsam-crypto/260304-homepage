import { createClient } from '@/lib/supabase/server'
import { DEFAULT_SITE_ID } from '@/lib/supabase/config'
import { PortfolioManager } from '@/components/admin/portfolio-manager'

export default async function AdminPortfolioPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
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
      status,
      featured,
      thumbnail_url,
      created_at,
      portfolio_links(id, link_type, url, label),
      portfolio_item_tags(
        tag_id,
        tags(id, name, tag_type)
      )
    `)
    .eq('site_id', DEFAULT_SITE_ID)
    .order('created_at', { ascending: false })

  const { data: allTags } = await supabase
    .from('tags')
    .select('id, name, tag_type')
    .eq('site_id', DEFAULT_SITE_ID)
    .order('name')

  const portfolioItems = (items || []).map((item) => ({
    ...item,
    portfolio_links: item.portfolio_links || [],
    tags: (item.portfolio_item_tags as Array<{ tag_id: string; tags: { id: string; name: string; tag_type: string } }>)
      ?.map((pt) => ({ ...pt.tags, pivot_tag_id: pt.tag_id }))
      .filter(Boolean) || [],
  }))

  return (
    <div>
      <h1 className="font-serif text-2xl font-light text-cream">
        포트폴리오 관리
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        포트폴리오 항목, 링크, 태그를 관리하세요
      </p>

      <div className="mt-8">
        <PortfolioManager
          initialItems={portfolioItems}
          allTags={allTags || []}
        />
      </div>
    </div>
  )
}
