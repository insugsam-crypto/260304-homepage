'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface LeadNote {
  id: string
  note: string
  created_at: string
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string | null
  budget_range: string | null
  desired_start_date: string | null
  source: string | null
  spam_score: number
  status: string
  created_at: string
  lead_notes: LeadNote[]
}

interface LeadsManagerProps {
  initialLeads: Lead[]
}

const statusOptions = ['new', 'in_progress', 'won', 'lost', 'spam']

const statusColors: Record<string, string> = {
  new: 'border-gold/30 bg-gold/10 text-gold',
  in_progress: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  won: 'border-green-500/30 bg-green-500/10 text-green-400',
  lost: 'border-red-500/30 bg-red-500/10 text-red-400',
  spam: 'border-border bg-muted text-muted-foreground',
}

export function LeadsManager({ initialLeads }: LeadsManagerProps) {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const supabase = createClient()

  const filteredLeads = filterStatus === 'all'
    ? leads
    : leads.filter((l) => l.status === filterStatus)

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId)

      if (error) throw error

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      )
      toast.success('상태가 변경되었습니다')
    } catch {
      toast.error('상태 변경에 실패했습니다')
    }
  }

  const handleAddNote = async (leadId: string) => {
    if (!newNote.trim()) return

    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .insert({
          lead_id: leadId,
          note: newNote.trim(),
        })
        .select()
        .single()

      if (error) throw error

      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? { ...l, lead_notes: [...l.lead_notes, data] }
            : l
        )
      )
      setNewNote('')
      toast.success('메모가 추가되었습니다')
    } catch {
      toast.error('메모 추가에 실패했습니다')
    }
  }

  // Status counts
  const statusCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={cn(
            'rounded-sm border px-3 py-1.5 text-xs uppercase tracking-wider transition-all',
            filterStatus === 'all'
              ? 'border-gold bg-gold/20 text-gold'
              : 'border-border/50 text-muted-foreground hover:border-gold/50'
          )}
        >
          전체 ({leads.length})
        </button>
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              'rounded-sm border px-3 py-1.5 text-xs uppercase tracking-wider transition-all',
              filterStatus === status
                ? statusColors[status]
                : 'border-border/50 text-muted-foreground hover:border-gold/50'
            )}
          >
            {status.replace('_', ' ')} ({statusCounts[status] || 0})
          </button>
        ))}
      </div>

      {/* Leads list */}
      <div className="flex flex-col gap-3">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="overflow-hidden rounded-sm border border-border/50 bg-card"
          >
            {/* Lead Header */}
            <div
              onClick={() =>
                setExpandedId(expandedId === lead.id ? null : lead.id)
              }
              className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-cream">{lead.name}</p>
                  {lead.company && (
                    <span className="text-xs text-muted-foreground">
                      {lead.company}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {lead.email}
                  {lead.phone && ` / ${lead.phone}`}
                </p>
              </div>

              {lead.budget_range && (
                <span className="hidden text-xs text-muted-foreground md:block">
                  {lead.budget_range}
                </span>
              )}

              {/* Status selector */}
              <select
                value={lead.status}
                onChange={(e) => {
                  e.stopPropagation()
                  handleStatusChange(lead.id, e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'rounded-sm border px-2.5 py-1 text-[10px] uppercase tracking-wider focus:outline-none',
                  statusColors[lead.status]
                )}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s} className="bg-card text-cream">
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>

              <span className="text-xs text-muted-foreground">
                {new Date(lead.created_at).toLocaleDateString('ko-KR')}
              </span>

              {expandedId === lead.id ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {/* Expanded Details */}
            {expandedId === lead.id && (
              <div className="border-t border-border/30 p-6">
                {/* Message */}
                {lead.message && (
                  <div className="mb-6">
                    <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                      메시지
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-cream/80">
                      {lead.message}
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    메모 ({lead.lead_notes.length})
                  </p>

                  {lead.lead_notes.length > 0 && (
                    <div className="mb-4 flex flex-col gap-2">
                      {lead.lead_notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-sm bg-secondary px-4 py-3"
                        >
                          <p className="text-sm text-cream/80">{note.note}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {new Date(note.created_at).toLocaleString('ko-KR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Note */}
                  <div className="flex gap-2">
                    <Input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="메모를 입력하세요..."
                      className="rounded-sm border-border/50 bg-secondary text-sm text-cream"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddNote(lead.id)
                      }}
                    />
                    <Button
                      onClick={() => handleAddNote(lead.id)}
                      size="sm"
                      className="rounded-sm bg-gold/20 text-gold hover:bg-gold/30"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="rounded-sm border border-border/30 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              리드가 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
