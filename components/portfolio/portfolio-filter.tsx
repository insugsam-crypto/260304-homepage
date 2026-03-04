'use client'

import { cn } from '@/lib/utils'

interface Tag {
  id: string
  name: string
  tag_type: string
}

interface PortfolioFilterProps {
  tags: Tag[]
  selectedTags: string[]
  onToggleTag: (tagId: string) => void
  onClearAll: () => void
}

export function PortfolioFilter({
  tags,
  selectedTags,
  onToggleTag,
  onClearAll,
}: PortfolioFilterProps) {
  // Group tags by type
  const groupedTags = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
    if (!acc[tag.tag_type]) acc[tag.tag_type] = []
    acc[tag.tag_type].push(tag)
    return acc
  }, {})

  const typeLabels: Record<string, string> = {
    category: '카테고리',
    industry: '산업',
    year: '연도',
    result: '성과',
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(groupedTags).map(([type, typeTags]) => (
        <div key={type}>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            {typeLabels[type] || type}
          </p>
          <div className="flex flex-wrap gap-2">
            {typeTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onToggleTag(tag.id)}
                className={cn(
                  'rounded-sm border px-3 py-1.5 text-xs uppercase tracking-wider transition-all duration-300',
                  selectedTags.includes(tag.id)
                    ? 'border-gold bg-gold/20 text-gold'
                    : 'border-border/50 text-muted-foreground hover:border-gold/50 hover:text-cream'
                )}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedTags.length > 0 && (
        <button
          onClick={onClearAll}
          className="self-start text-xs uppercase tracking-widest text-gold/70 underline underline-offset-4 transition-colors hover:text-gold"
        >
          필터 초기화
        </button>
      )}
    </div>
  )
}
