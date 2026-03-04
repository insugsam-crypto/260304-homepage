'use client'

import { ExternalLink, Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_SITE_ID } from '@/lib/supabase/config'

interface PortfolioLink {
  id: string
  link_type: string
  url: string
  label: string | null
}

interface Tag {
  name: string
  tag_type: string
}

interface PortfolioCardProps {
  item: {
    id: string
    title: string
    summary: string | null
    description: string | null
    role: string | null
    period_start: string | null
    period_end: string | null
    outcome_metric: string | null
    thumbnail_url: string | null
    portfolio_links: PortfolioLink[]
    tags: Tag[]
  }
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const trackClick = async (linkType: string, url: string) => {
    const supabase = createClient()
    await supabase.from('events').insert({
      site_id: DEFAULT_SITE_ID,
      event_type: linkType === 'canva_link' ? 'open_canva' : 'click_portfolio',
      entity_type: 'portfolio_item',
      entity_id: item.id,
      metadata_json: { link_type: linkType, url },
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const formatPeriod = () => {
    if (!item.period_start) return null
    const start = new Date(item.period_start).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
    })
    const end = item.period_end
      ? new Date(item.period_end).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'short',
        })
      : '현재'
    return `${start} - ${end}`
  }

  return (
    <div
      id={item.id}
      className="card-hover group overflow-hidden rounded-sm border border-border/50 bg-card"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Palette className="h-12 w-12 text-gold/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Outcome Badge */}
        {item.outcome_metric && (
          <div className="absolute bottom-4 left-4 rounded-sm bg-gold/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
            {item.outcome_metric}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag.name}
                className="rounded-sm bg-gold/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-gold"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-serif text-xl font-light text-cream">
          {item.title}
        </h3>

        {item.summary && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
        )}

        {/* Meta */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          {item.role && <span>{item.role}</span>}
          {formatPeriod() && (
            <>
              <span className="text-border">|</span>
              <span>{formatPeriod()}</span>
            </>
          )}
        </div>

        {/* Links */}
        {item.portfolio_links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-border/30 pt-6">
            {item.portfolio_links.map((link) => (
              <button
                key={link.id}
                onClick={() => trackClick(link.link_type, link.url)}
                className="group/link flex items-center gap-2 rounded-sm border border-border/50 px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground transition-all hover:border-gold hover:text-gold"
              >
                <ExternalLink className="h-3 w-3" />
                {link.label || link.link_type.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
