'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_SITE_ID } from '@/lib/supabase/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  ExternalLink,
  X,
  Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PortfolioLink {
  id: string
  link_type: string
  url: string
  label: string | null
}

interface Tag {
  id: string
  name: string
  tag_type: string
}

interface PortfolioItem {
  id: string
  title: string
  summary: string | null
  description: string | null
  role: string | null
  period_start: string | null
  period_end: string | null
  outcome_metric: string | null
  status: string
  featured: boolean
  thumbnail_url: string | null
  created_at: string
  portfolio_links: PortfolioLink[]
  tags: Tag[]
}

interface PortfolioManagerProps {
  initialItems: PortfolioItem[]
  allTags: Tag[]
}

const linkTypes = ['canva_link', 'live_site', 'github', 'notion', 'youtube', 'pdf']
const statusOptions = ['draft', 'published', 'archived']

export function PortfolioManager({ initialItems, allTags }: PortfolioManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState<PortfolioItem[]>(initialItems)
  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newLink, setNewLink] = useState({ link_type: 'canva_link', url: '', label: '' })
  const [editLinks, setEditLinks] = useState<PortfolioLink[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  const supabase = createClient()

  const openEditor = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem({ ...item })
      setEditLinks([...item.portfolio_links])
      setSelectedTagIds(item.tags.map((t) => t.id))
      setIsCreating(false)
    } else {
      setEditingItem({
        title: '',
        summary: '',
        description: '',
        role: '',
        outcome_metric: '',
        thumbnail_url: '',
        status: 'draft',
        featured: false,
      })
      setEditLinks([])
      setSelectedTagIds([])
      setIsCreating(true)
    }
  }

  const closeEditor = () => {
    setEditingItem(null)
    setEditLinks([])
    setSelectedTagIds([])
    setIsCreating(false)
  }

  const handleSave = async () => {
    if (!editingItem?.title) {
      toast.error('제목은 필수입니다')
      return
    }

    try {
      if (isCreating) {
        // Create new item
        const { data: newItem, error } = await supabase
          .from('portfolio_items')
          .insert({
            site_id: DEFAULT_SITE_ID,
            title: editingItem.title,
            summary: editingItem.summary || null,
            description: editingItem.description || null,
            role: editingItem.role || null,
            period_start: editingItem.period_start || null,
            period_end: editingItem.period_end || null,
            outcome_metric: editingItem.outcome_metric || null,
            status: editingItem.status || 'draft',
            featured: editingItem.featured || false,
            thumbnail_url: editingItem.thumbnail_url || null,
            published_at: editingItem.status === 'published' ? new Date().toISOString() : null,
          })
          .select()
          .single()

        if (error) throw error

        // Add links
        if (editLinks.length > 0) {
          await supabase.from('portfolio_links').insert(
            editLinks.map((l) => ({
              portfolio_item_id: newItem.id,
              link_type: l.link_type,
              url: l.url,
              label: l.label,
            }))
          )
        }

        // Add tags
        if (selectedTagIds.length > 0) {
          await supabase.from('portfolio_item_tags').insert(
            selectedTagIds.map((tagId) => ({
              portfolio_item_id: newItem.id,
              tag_id: tagId,
            }))
          )
        }

        toast.success('포트폴리오 항목이 생성되었습니다')
      } else if (editingItem.id) {
        // Update existing item
        const { error } = await supabase
          .from('portfolio_items')
          .update({
            title: editingItem.title,
            summary: editingItem.summary || null,
            description: editingItem.description || null,
            role: editingItem.role || null,
            period_start: editingItem.period_start || null,
            period_end: editingItem.period_end || null,
            outcome_metric: editingItem.outcome_metric || null,
            status: editingItem.status || 'draft',
            featured: editingItem.featured || false,
            thumbnail_url: editingItem.thumbnail_url || null,
            published_at: editingItem.status === 'published' ? new Date().toISOString() : null,
          })
          .eq('id', editingItem.id)

        if (error) throw error

        // Update links: delete old, insert new
        await supabase
          .from('portfolio_links')
          .delete()
          .eq('portfolio_item_id', editingItem.id)

        if (editLinks.length > 0) {
          await supabase.from('portfolio_links').insert(
            editLinks.map((l) => ({
              portfolio_item_id: editingItem.id!,
              link_type: l.link_type,
              url: l.url,
              label: l.label,
            }))
          )
        }

        // Update tags
        await supabase
          .from('portfolio_item_tags')
          .delete()
          .eq('portfolio_item_id', editingItem.id)

        if (selectedTagIds.length > 0) {
          await supabase.from('portfolio_item_tags').insert(
            selectedTagIds.map((tagId) => ({
              portfolio_item_id: editingItem.id!,
              tag_id: tagId,
            }))
          )
        }

        toast.success('포트폴리오 항목이 수정되었습니다')
      }

      closeEditor()
      router.refresh()
    } catch {
      toast.error('저장에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 항목을 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id)
      if (error) throw error
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success('포트폴리오 항목이 삭제되었습니다')
      router.refresh()
    } catch {
      toast.error('삭제에 실패했습니다')
    }
  }

  const addLink = () => {
    if (!newLink.url) return
    setEditLinks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...newLink },
    ])
    setNewLink({ link_type: 'canva_link', url: '', label: '' })
  }

  const removeLink = (id: string) => {
    setEditLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-muted text-muted-foreground',
    published: 'bg-gold/20 text-gold',
    archived: 'bg-secondary text-muted-foreground',
  }

  // Editor Modal
  if (editingItem) {
    return (
      <div className="rounded-sm border border-border/50 bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-light text-cream">
            {isCreating ? '포트폴리오 항목 생성' : '포트폴리오 항목 수정'}
          </h2>
          <button onClick={closeEditor} className="text-muted-foreground hover:text-cream">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">제목 *</Label>
              <Input
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="rounded-sm border-border/50 bg-secondary text-cream"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">역할</Label>
              <Input
                value={editingItem.role || ''}
                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                className="rounded-sm border-border/50 bg-secondary text-cream"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">요약</Label>
            <textarea
              value={editingItem.summary || ''}
              onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
              rows={2}
              className="rounded-sm border border-border/50 bg-secondary px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">성과</Label>
              <Input
                value={editingItem.outcome_metric || ''}
                onChange={(e) => setEditingItem({ ...editingItem, outcome_metric: e.target.value })}
                placeholder="예: +45% 성장"
                className="rounded-sm border-border/50 bg-secondary text-cream"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">썸네일 URL</Label>
              <Input
                value={editingItem.thumbnail_url || ''}
                onChange={(e) => setEditingItem({ ...editingItem, thumbnail_url: e.target.value })}
                className="rounded-sm border-border/50 bg-secondary text-cream"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">상태</Label>
              <select
                value={editingItem.status || 'draft'}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                className="h-10 rounded-sm border border-border/50 bg-secondary px-3 text-sm text-cream focus:border-gold focus:outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s} className="bg-card">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={editingItem.featured || false}
              onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
              className="h-4 w-4 rounded border-border accent-gold"
            />
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              홈페이지 대표 노출
            </Label>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">태그</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    'rounded-sm border px-3 py-1.5 text-xs transition-all',
                    selectedTagIds.includes(tag.id)
                      ? 'border-gold bg-gold/20 text-gold'
                      : 'border-border/50 text-muted-foreground hover:border-gold/50'
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">링크</Label>
            {editLinks.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {editLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 rounded-sm bg-secondary px-3 py-2">
                    <span className="text-xs text-gold">{link.link_type}</span>
                    <span className="flex-1 truncate text-xs text-muted-foreground">{link.url}</span>
                    <button onClick={() => removeLink(link.id)} className="text-muted-foreground hover:text-cream">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <select
                value={newLink.link_type}
                onChange={(e) => setNewLink({ ...newLink, link_type: e.target.value })}
                className="h-9 rounded-sm border border-border/50 bg-secondary px-2 text-xs text-cream focus:border-gold focus:outline-none"
              >
                {linkTypes.map((t) => (
                  <option key={t} value={t} className="bg-card">{t}</option>
                ))}
              </select>
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://..."
                className="h-9 flex-1 rounded-sm border-border/50 bg-secondary text-xs text-cream"
              />
              <Input
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                placeholder="라벨"
                className="h-9 w-32 rounded-sm border-border/50 bg-secondary text-xs text-cream"
              />
              <Button onClick={addLink} size="sm" className="h-9 rounded-sm bg-gold/20 text-gold hover:bg-gold/30">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-border/30 pt-5">
            <Button
              onClick={handleSave}
              className="rounded-sm border border-gold bg-gold text-xs uppercase tracking-widest text-primary-foreground hover:bg-gold-light"
            >
              <Save className="mr-2 h-4 w-4" />
              {isCreating ? '생성' : '변경사항 저장'}
            </Button>
            <Button
              onClick={closeEditor}
              variant="outline"
              className="rounded-sm border-border/50 text-xs uppercase tracking-widest text-muted-foreground hover:text-cream"
            >
              취소
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // List View
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {items.length}개 항목
        </p>
        <Button
          onClick={() => openEditor()}
          className="rounded-sm border border-gold bg-gold text-xs uppercase tracking-widest text-primary-foreground hover:bg-gold-light"
        >
          <Plus className="mr-2 h-4 w-4" />
          새 항목
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-sm border border-border/50 bg-card p-4"
          >
            {/* Thumbnail */}
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-secondary">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  이미지 없음
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-cream">{item.title}</p>
                {item.featured && <Star className="h-3 w-3 fill-gold text-gold" />}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.tags.map((t) => t.name).join(', ') || '태그 없음'}
              </p>
            </div>

            {/* Status */}
            <span
              className={`rounded-sm px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                statusColors[item.status] || statusColors.draft
              }`}
            >
              {item.status}
            </span>

            {/* Links count */}
            {item.portfolio_links.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                {item.portfolio_links.length}
              </span>
            )}

            {/* Actions */}
            <div className="flex gap-1">
              <button
                onClick={() => openEditor(item)}
                className="rounded-sm p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-cream"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-sm p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-sm border border-border/30 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              아직 포트폴리오 항목이 없습니다. 첫 번째 항목을 생성하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
