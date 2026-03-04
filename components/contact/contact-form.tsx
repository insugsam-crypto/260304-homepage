'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_SITE_ID } from '@/lib/supabase/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Send } from 'lucide-react'

const budgetRanges = [
  { value: '', label: '예산 범위 선택' },
  { value: '100-300만', label: '100만 - 300만원' },
  { value: '300-500만', label: '300만 - 500만원' },
  { value: '500-1000만', label: '500만 - 1,000만원' },
  { value: '1000만+', label: '1,000만원 이상' },
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    try {
      const { error } = await supabase.from('leads').insert({
        site_id: DEFAULT_SITE_ID,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: (formData.get('phone') as string) || null,
        company: (formData.get('company') as string) || null,
        message: formData.get('message') as string,
        budget_range: (formData.get('budget_range') as string) || null,
        source: 'contact_form',
        status: 'new',
      })

      if (error) throw error

      // Track event
      await supabase.from('events').insert({
        site_id: DEFAULT_SITE_ID,
        event_type: 'submit_lead',
        entity_type: 'lead',
        metadata_json: { source: 'contact_form' },
      })

      setSubmitted(true)
      toast.success('메시지가 성공적으로 전송되었습니다!')
    } catch {
      toast.error('메시지 전송에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-sm border border-gold/20 bg-card p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <Send className="h-6 w-6 text-gold" />
        </div>
        <h3 className="font-serif text-2xl font-light text-cream">
          감사합니다
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          메시지가 접수되었습니다. 24시간 이내에 답변드리겠습니다.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 text-xs uppercase tracking-widest text-gold underline underline-offset-4 hover:text-gold-light"
        >
          다른 메시지 보내기
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">
            이름 *
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="성함을 입력해 주세요"
            className="rounded-sm border-border/50 bg-secondary text-cream placeholder:text-muted-foreground/50 focus:border-gold focus:ring-gold"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
            이메일 *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="rounded-sm border-border/50 bg-secondary text-cream placeholder:text-muted-foreground/50 focus:border-gold focus:ring-gold"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted-foreground">
            전화번호
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="010-0000-0000"
            className="rounded-sm border-border/50 bg-secondary text-cream placeholder:text-muted-foreground/50 focus:border-gold focus:ring-gold"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company" className="text-xs uppercase tracking-widest text-muted-foreground">
            회사명
          </Label>
          <Input
            id="company"
            name="company"
            placeholder="회사명을 입력해 주세요"
            className="rounded-sm border-border/50 bg-secondary text-cream placeholder:text-muted-foreground/50 focus:border-gold focus:ring-gold"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="budget_range" className="text-xs uppercase tracking-widest text-muted-foreground">
          예산 범위
        </Label>
        <select
          id="budget_range"
          name="budget_range"
          className="h-10 rounded-sm border border-border/50 bg-secondary px-3 text-sm text-cream focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        >
          {budgetRanges.map((range) => (
            <option key={range.value} value={range.value} className="bg-card text-cream">
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">
          메시지 *
        </Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="프로젝트에 대해 알려주세요..."
          className="rounded-sm border border-border/50 bg-secondary px-3 py-2.5 text-sm text-cream placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-sm border border-gold bg-gold py-6 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-gold-light disabled:opacity-50 md:w-auto md:px-12"
      >
        {isSubmitting ? '전송 중...' : '메시지 보내기'}
      </Button>
    </form>
  )
}
