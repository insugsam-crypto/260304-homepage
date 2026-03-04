-- =============================================
-- Brand Homepage CMS + Portfolio DB Schema
-- =============================================

-- 1) Sites
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  locale TEXT DEFAULT 'ko',
  timezone TEXT DEFAULT 'Asia/Seoul',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sites_public_read" ON public.sites FOR SELECT USING (true);
CREATE POLICY "sites_auth_insert" ON public.sites FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "sites_auth_update" ON public.sites FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "sites_auth_delete" ON public.sites FOR DELETE USING (auth.uid() IS NOT NULL);

-- 2) Pages
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at TIMESTAMPTZ,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_public_read" ON public.pages FOR SELECT USING (true);
CREATE POLICY "pages_auth_insert" ON public.pages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "pages_auth_update" ON public.pages FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "pages_auth_delete" ON public.pages FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_site_slug ON public.pages(site_id, slug);

-- 3) Page SEO
CREATE TABLE IF NOT EXISTS public.page_seo (
  page_id UUID PRIMARY KEY REFERENCES public.pages(id) ON DELETE CASCADE,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT
);
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "page_seo_public_read" ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "page_seo_auth_insert" ON public.page_seo FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "page_seo_auth_update" ON public.page_seo FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "page_seo_auth_delete" ON public.page_seo FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4) Sections
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  sort_order INT DEFAULT 0,
  visibility BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sections_public_read" ON public.sections FOR SELECT USING (true);
CREATE POLICY "sections_auth_insert" ON public.sections FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "sections_auth_update" ON public.sections FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "sections_auth_delete" ON public.sections FOR DELETE USING (auth.uid() IS NOT NULL);

-- 5) Content Blocks
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  sort_order INT DEFAULT 0 CHECK (sort_order >= 0),
  data_json JSONB DEFAULT '{}',
  visibility BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_blocks_public_read" ON public.content_blocks FOR SELECT USING (true);
CREATE POLICY "content_blocks_auth_insert" ON public.content_blocks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "content_blocks_auth_update" ON public.content_blocks FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "content_blocks_auth_delete" ON public.content_blocks FOR DELETE USING (auth.uid() IS NOT NULL);

-- 6) Assets
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  asset_type TEXT DEFAULT 'image' CHECK (asset_type IN ('image','pdf','canva_file','video')),
  storage_provider TEXT DEFAULT 'supabase',
  file_url TEXT NOT NULL,
  file_name TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  width INT,
  height INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assets_public_read" ON public.assets FOR SELECT USING (true);
CREATE POLICY "assets_auth_insert" ON public.assets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "assets_auth_update" ON public.assets FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "assets_auth_delete" ON public.assets FOR DELETE USING (auth.uid() IS NOT NULL);

-- 7) Portfolio Items
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  role TEXT,
  period_start DATE,
  period_end DATE,
  outcome_metric TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  featured BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_items_public_read" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "portfolio_items_auth_insert" ON public.portfolio_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "portfolio_items_auth_update" ON public.portfolio_items FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "portfolio_items_auth_delete" ON public.portfolio_items FOR DELETE USING (auth.uid() IS NOT NULL);

-- 8) Portfolio Links
CREATE TABLE IF NOT EXISTS public.portfolio_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_item_id UUID NOT NULL REFERENCES public.portfolio_items(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('canva_link','live_site','github','notion','youtube','pdf')),
  url TEXT NOT NULL,
  label TEXT
);
ALTER TABLE public.portfolio_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_links_public_read" ON public.portfolio_links FOR SELECT USING (true);
CREATE POLICY "portfolio_links_auth_insert" ON public.portfolio_links FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "portfolio_links_auth_update" ON public.portfolio_links FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "portfolio_links_auth_delete" ON public.portfolio_links FOR DELETE USING (auth.uid() IS NOT NULL);

-- 9) Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tag_type TEXT DEFAULT 'category' CHECK (tag_type IN ('industry','category','year','result'))
);
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_public_read" ON public.tags FOR SELECT USING (true);
CREATE POLICY "tags_auth_insert" ON public.tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tags_auth_update" ON public.tags FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "tags_auth_delete" ON public.tags FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_site_name_type ON public.tags(site_id, name, tag_type);

-- 10) Portfolio Item Tags (Junction)
CREATE TABLE IF NOT EXISTS public.portfolio_item_tags (
  portfolio_item_id UUID NOT NULL REFERENCES public.portfolio_items(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (portfolio_item_id, tag_id)
);
ALTER TABLE public.portfolio_item_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_item_tags_public_read" ON public.portfolio_item_tags FOR SELECT USING (true);
CREATE POLICY "portfolio_item_tags_auth_insert" ON public.portfolio_item_tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "portfolio_item_tags_auth_delete" ON public.portfolio_item_tags FOR DELETE USING (auth.uid() IS NOT NULL);

-- 11) Leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  budget_range TEXT,
  desired_start_date DATE,
  source TEXT,
  spam_score INT DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','in_progress','won','lost','spam')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_auth_read" ON public.leads FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "leads_auth_update" ON public.leads FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "leads_auth_delete" ON public.leads FOR DELETE USING (auth.uid() IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_leads_site_created ON public.leads(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- 12) Lead Notes
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  admin_user_id UUID,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lead_notes_auth_read" ON public.lead_notes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "lead_notes_auth_insert" ON public.lead_notes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "lead_notes_auth_update" ON public.lead_notes FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "lead_notes_auth_delete" ON public.lead_notes FOR DELETE USING (auth.uid() IS NOT NULL);

-- 13) Events (Analytics)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  session_id TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_insert" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_auth_read" ON public.events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_events_site_created ON public.events(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_type_created ON public.events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_events_entity ON public.events(entity_type, entity_id);
