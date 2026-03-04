'use client'

import { useState, useMemo } from 'react'
import { PortfolioFilter } from './portfolio-filter'
import { PortfolioCard } from './portfolio-card'

interface PortfolioItem {
  id: string
  title: string
  summary: string | null
  description: string | null
  role: string | null
  period_start: string | null
  period_end: string | null
  outcome_metric: string | null
  thumbnail_url: string | null
  portfolio_links: Array<{
    id: string
    link_type: string
    url: string
    label: string | null
  }>
  tags: Array<{
    id: string
    name: string
    tag_type: string
  }>
}

interface PortfolioGalleryProps {
  items: PortfolioItem[]
  tags: Array<{
    id: string
    name: string
    tag_type: string
  }>
}

export function PortfolioGallery({ items, tags }: PortfolioGalleryProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredItems = useMemo(() => {
    if (selectedTags.length === 0) return items
    return items.filter((item) =>
      selectedTags.some((tagId) =>
        item.tags.some((t) => t.id === tagId)
      )
    )
  }, [items, selectedTags])

  const handleToggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  return (
    <div>
      {/* Filter */}
      {tags.length > 0 && (
        <div className="mb-12 rounded-sm border border-border/30 bg-card p-6">
          <PortfolioFilter
            tags={tags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onClearAll={() => setSelectedTags([])}
          />
        </div>
      )}

      {/* Results count */}
      <p className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">
        {filteredItems.length}개 프로젝트
      </p>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {filteredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-border/30 py-20 text-center">
          <p className="font-serif text-xl text-cream/50">일치하는 프로젝트가 없습니다</p>
          <p className="mt-2 text-sm text-muted-foreground">
            필터를 조정해 보세요.
          </p>
        </div>
      )}
    </div>
  )
}
