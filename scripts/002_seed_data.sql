-- =============================================
-- Seed Data for Brand Homepage CMS
-- =============================================

-- Insert default site
INSERT INTO public.sites (id, name, domain, locale, timezone)
VALUES ('00000000-0000-0000-0000-000000000001', 'Premium Brand Studio', 'studio.example.com', 'ko', 'Asia/Seoul')
ON CONFLICT (id) DO NOTHING;

-- Insert pages
INSERT INTO public.pages (id, site_id, slug, title, status, sort_order, published_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'home', 'Home', 'published', 1, now()),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'portfolio', 'Portfolio', 'published', 2, now()),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'contact', 'Contact', 'published', 3, now())
ON CONFLICT DO NOTHING;

-- Insert page SEO
INSERT INTO public.page_seo (page_id, meta_title, meta_description)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Premium Brand Studio | Home', 'We create premium brand experiences that elevate your business.'),
  ('10000000-0000-0000-0000-000000000002', 'Portfolio | Premium Brand Studio', 'Explore our curated collection of premium brand projects.'),
  ('10000000-0000-0000-0000-000000000003', 'Contact | Premium Brand Studio', 'Get in touch for your next premium brand project.')
ON CONFLICT DO NOTHING;

-- Insert tags
INSERT INTO public.tags (id, site_id, name, tag_type)
VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Branding', 'category'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Web Design', 'category'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Print', 'category'),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Fashion', 'industry'),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Technology', 'industry'),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'F&B', 'industry'),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', '2024', 'year'),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', '2025', 'year')
ON CONFLICT DO NOTHING;

-- Insert portfolio items
INSERT INTO public.portfolio_items (id, site_id, title, summary, description, role, period_start, period_end, outcome_metric, status, featured, thumbnail_url, published_at)
VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
   'Luxe Fashion Brand Identity',
   'Complete brand identity redesign for a luxury fashion house',
   'A comprehensive rebrand including logo, typography system, color palette, brand guidelines, and digital touchpoints for a high-end fashion label.',
   'Lead Designer', '2024-03-01', '2024-06-30', 'Brand recognition +45%',
   'published', true,
   'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
   now()),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
   'Tech Startup Web Platform',
   'Modern web platform design for an AI startup',
   'End-to-end web design and development for a cutting-edge AI technology company, including responsive design and interactive elements.',
   'Creative Director', '2024-07-01', '2024-10-15', 'Conversion rate +32%',
   'published', true,
   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
   now()),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
   'Artisan Bakery Campaign',
   'Print and digital campaign for premium bakery brand',
   'Multi-channel marketing campaign including print materials, social media assets, and packaging design for an artisan bakery.',
   'Art Director', '2025-01-01', '2025-03-15', 'Sales +28%',
   'published', false,
   'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
   now())
ON CONFLICT DO NOTHING;

-- Link portfolio items to tags
INSERT INTO public.portfolio_item_tags (portfolio_item_id, tag_id)
VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004'),
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000007'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000005'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000006'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- Insert portfolio links
INSERT INTO public.portfolio_links (id, portfolio_item_id, link_type, url, label)
VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'canva_link', 'https://www.canva.com/design/example1', 'View on Canva'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'live_site', 'https://luxefashion.example.com', 'Visit Live Site'),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'canva_link', 'https://www.canva.com/design/example2', 'View on Canva'),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', 'live_site', 'https://techstartup.example.com', 'Visit Live Site'),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000003', 'canva_link', 'https://www.canva.com/design/example3', 'View on Canva')
ON CONFLICT DO NOTHING;

-- Insert sample leads
INSERT INTO public.leads (id, site_id, name, email, phone, company, message, budget_range, status, created_at)
VALUES
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
   'Kim Minjun', 'minjun@example.com', '010-1234-5678', 'Minjun Corp',
   'We need a complete brand identity for our new luxury skincare line.',
   '5000-10000', 'new', now() - interval '2 days'),
  ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
   'Park Soyeon', 'soyeon@example.com', '010-9876-5432', 'Soyeon Studios',
   'Looking for web design services for our art gallery.',
   '3000-5000', 'in_progress', now() - interval '5 days'),
  ('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
   'Lee Jihoon', 'jihoon@example.com', NULL, 'JH Ventures',
   'Interested in your print design services for our restaurant launch.',
   '1000-3000', 'won', now() - interval '10 days')
ON CONFLICT DO NOTHING;
