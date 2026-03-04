import { createClient } from '@/lib/supabase/server'
import { DEFAULT_SITE_ID } from '@/lib/supabase/config'
import { LeadsManager } from '@/components/admin/leads-manager'

export default async function AdminLeadsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select(`
      id,
      name,
      email,
      phone,
      company,
      message,
      budget_range,
      desired_start_date,
      source,
      spam_score,
      status,
      created_at,
      lead_notes(id, note, created_at)
    `)
    .eq('site_id', DEFAULT_SITE_ID)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-serif text-2xl font-light text-cream">
        리드 관리
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        수신된 문의를 확인하고 관리하세요
      </p>

      <div className="mt-8">
        <LeadsManager initialLeads={leads || []} />
      </div>
    </div>
  )
}
