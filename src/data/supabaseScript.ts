export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- AhorraAI.com — Production Supabase / PostgreSQL Database Architecture
-- Multi-Tenant NFC & QR Dynamic Redirection & Neutral Die-Cut Batch System
-- Compatible with: Supabase, PostgreSQL 14+, Vercel & GitHub CI/CD
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerations
DO $$ BEGIN
    CREATE TYPE tag_status_enum AS ENUM ('unassigned', 'active', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE redirect_mode_enum AS ENUM ('direct', 'micropage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE scan_method_enum AS ENUM ('nfc', 'qr', 'direct_web');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_format_enum AS ENUM (
        'troquel_carteleria',
        'troquel_adhesivos',
        'troquel_suelo',
        'chapas_nfc',
        'imanes_troquelados',
        'llaveros_troquelados',
        'colgadores_pomos',
        'posavasos_troquelados',
        'electrostatico_cristal'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. Core Tables
-- ==============================================================================

-- 3.1 Negocios / Clientes B2B (Estructura de Base de Datos)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL, -- Subdominio único ahorraai.com/b/:slug
    category VARCHAR(100) NOT NULL DEFAULT 'Hostelería',
    niche VARCHAR(50) NOT NULL DEFAULT 'universal',
    logo_url TEXT,
    brand_color VARCHAR(10) NOT NULL DEFAULT '#059669',
    secondary_color VARCHAR(10) DEFAULT '#f8fafc',
    background_color VARCHAR(10) DEFAULT '#ffffff',
    
    -- Dirección física del negocio
    address_street VARCHAR(255),
    address_postal_code VARCHAR(20),
    address_city VARCHAR(100),
    address_province VARCHAR(100),
    
    -- Contacto comercial
    contact_person VARCHAR(150),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255) NOT NULL,
    website_url TEXT,
    instagram_handle VARCHAR(100),
    
    -- Credenciales de servicios en local
    google_place_id TEXT,
    google_review_url TEXT,
    wifi_ssid VARCHAR(100),
    wifi_password VARCHAR(100),
    
    contract_status VARCHAR(50) NOT NULL DEFAULT 'contracted', -- 'lead', 'contracted', 'delivered', 'active'
    notes TEXT,
    owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.2 Lotes de Fabricación Troquelados (Pre-corte en masa por silueta de nicho)
CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_code VARCHAR(80) UNIQUE NOT NULL,
    product_type product_format_enum NOT NULL,
    die_cut_shape VARCHAR(100) NOT NULL, -- ej. 'Muela Sonriente', 'Centollo Rojo', 'Taza de Café'
    total_units INT NOT NULL CHECK (total_units > 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.3 Tags Físicos NFC & QR (Identidad Neutra y Redirección Dinámica)
-- Cada soporte troquelado lleva la etiqueta neutra: https://ahorraai.com/t/[tag_uid]
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_uid VARCHAR(64) UNIQUE NOT NULL, -- Slug neutro: ahorraai.com/t/:tag_uid
    serial_number VARCHAR(80) UNIQUE NOT NULL,
    batch_id UUID REFERENCES public.batches(id) ON DELETE SET NULL,
    product_type product_format_enum NOT NULL,
    die_cut_shape VARCHAR(100) NOT NULL, -- Forma troquelada física
    status tag_status_enum NOT NULL DEFAULT 'unassigned',
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    redirect_mode redirect_mode_enum NOT NULL DEFAULT 'direct',
    direct_url TEXT, -- Usado cuando redirect_mode = 'direct' (p.ej. Google Reviews direct)
    nfc_chip_uid VARCHAR(100), -- Hardware UID del chip físico NTAG213/215
    claim_token VARCHAR(32) NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex'), -- Token secreto en la etiqueta
    scan_count INT NOT NULL DEFAULT 0,
    last_scanned_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.4 Micro-páginas Personalizadas de Negocio (Estilo Linktree de Marca)
CREATE TABLE IF NOT EXISTS public.micropages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    bio TEXT,
    banner_url TEXT,
    theme_config JSONB NOT NULL DEFAULT '{
        "backgroundStyle": "minimal",
        "cardRadius": "xl",
        "accentColor": "#0284c7",
        "textColor": "#0f172a",
        "fontFamily": "Outfit"
    }'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_business_micropage UNIQUE (business_id)
);

-- 3.5 Enlaces y Acciones de la Micro-página
CREATE TABLE IF NOT EXISTS public.micropage_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    micropage_id UUID NOT NULL REFERENCES public.micropages(id) ON DELETE CASCADE,
    title VARCHAR(120) NOT NULL,
    subtitle VARCHAR(180),
    url TEXT NOT NULL,
    icon_type VARCHAR(50) NOT NULL DEFAULT 'custom',
    is_highlighted BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    clicks INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.6 Métricas y Analíticas de Escaneo Físico (NFC vs QR)
CREATE TABLE IF NOT EXISTS public.scan_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    scan_method scan_method_enum NOT NULL DEFAULT 'qr',
    device_os VARCHAR(30) DEFAULT 'other',
    user_agent TEXT,
    referrer TEXT,
    city VARCHAR(100)
);

-- ==============================================================================
-- 4. Optimización de Índices (Resolución en < 150ms)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tags_tag_uid ON public.tags(tag_uid);
CREATE INDEX IF NOT EXISTS idx_tags_business_id ON public.tags(business_id);
CREATE INDEX IF NOT EXISTS idx_tags_status ON public.tags(status);
CREATE INDEX IF NOT EXISTS idx_analytics_tag_id ON public.scan_analytics(tag_id);
CREATE INDEX IF NOT EXISTS idx_analytics_business_id ON public.scan_analytics(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_scanned_at ON public.scan_analytics(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_links_micropage_id ON public.micropage_links(micropage_id);

-- ==============================================================================
-- 5. Stored Procedure Atómico para Resolución y Conteo
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.resolve_and_record_scan(
    p_tag_uid VARCHAR,
    p_scan_method scan_method_enum DEFAULT 'qr',
    p_device_os VARCHAR DEFAULT 'other',
    p_user_agent TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL
)
RETURNS TABLE (
    tag_id UUID,
    status tag_status_enum,
    redirect_mode redirect_mode_enum,
    direct_url TEXT,
    business_id UUID,
    business_name VARCHAR,
    business_slug VARCHAR,
    die_cut_shape VARCHAR,
    brand_color VARCHAR,
    scan_count INT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_tag public.tags%ROWTYPE;
    v_biz public.businesses%ROWTYPE;
BEGIN
    SELECT * INTO v_tag FROM public.tags WHERE tag_uid = p_tag_uid LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;

    UPDATE public.tags
    SET 
        scan_count = scan_count + 1,
        last_scanned_at = timezone('utc'::text, now())
    WHERE id = v_tag.id;

    INSERT INTO public.scan_analytics (
        tag_id,
        business_id,
        scan_method,
        device_os,
        user_agent,
        referrer
    ) VALUES (
        v_tag.id,
        v_tag.business_id,
        p_scan_method,
        p_device_os,
        p_user_agent,
        p_referrer
    );

    IF v_tag.business_id IS NOT NULL THEN
        SELECT * INTO v_biz FROM public.businesses WHERE id = v_tag.business_id LIMIT 1;
    END IF;

    RETURN QUERY
    SELECT 
        v_tag.id,
        v_tag.status,
        v_tag.redirect_mode,
        v_tag.direct_url,
        v_biz.id,
        v_biz.name,
        v_biz.slug,
        v_tag.die_cut_shape,
        v_biz.brand_color,
        v_tag.scan_count + 1;
END;
$$;

-- ==============================================================================
-- 6. Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micropages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micropage_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public tags can be resolved" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Public micropages are viewable" ON public.micropages FOR SELECT USING (is_published = true);
CREATE POLICY "Public micropage links are viewable" ON public.micropage_links FOR SELECT USING (is_active = true);
CREATE POLICY "Allow anonymous scan telemetry" ON public.scan_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can manage own business" ON public.businesses FOR ALL USING (auth.uid() = owner_user_id);

-- ==============================================================================
-- 7. Seed Data de Prueba (Siluetas Troqueladas Reales)
-- ==============================================================================

-- 7.1 Lote Troquelado de Muelas Dentales
INSERT INTO public.batches (id, batch_code, product_type, die_cut_shape, total_units, notes)
VALUES 
('11111111-1111-1111-1111-111111111111', 'LOTE-DENTAL-MUELA-01', 'troquel_carteleria', 'Muela / Diente Sonriente', 500, 'Peanas acrílicas en forma de muela con espacio 35x35mm para etiqueta')
ON CONFLICT (batch_code) DO NOTHING;

-- 7.2 Negocio Demo 1: Clínica Dental Sonrisas Sol
INSERT INTO public.businesses (
    id, name, slug, category, niche, brand_color, contact_email, contact_phone, 
    google_review_url, wifi_ssid, wifi_password
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Clínica Dental Sonrisas Sol',
    'dental-sonrisas-sol',
    'Odontología & Estética Dental',
    'dental',
    '#0284c7',
    'citas@dentalsonrisas.com',
    '+34 919 876 543',
    'https://search.google.com/local/writereview?placeid=dental-sol-demo',
    'Clinica_Dental_WiFi',
    'DientesSanos2026'
) ON CONFLICT (slug) DO NOTHING;

-- 7.3 Tag vinculado a la Muela Troquelada
INSERT INTO public.tags (
    id, tag_uid, serial_number, batch_id, product_type, die_cut_shape, status, 
    business_id, redirect_mode, direct_url, scan_count
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    'tag-dental-muela',
    'AAI-MUELA-0042',
    '11111111-1111-1111-1111-111111111111',
    'troquel_carteleria',
    'Muela / Diente Sonriente',
    'active',
    '22222222-2222-2222-2222-222222222222',
    'direct',
    'https://search.google.com/local/writereview?placeid=dental-sol-demo',
    684
) ON CONFLICT (tag_uid) DO NOTHING;

-- 7.4 Negocio Demo 2: Marisquería El Centollo & Cía
INSERT INTO public.businesses (
    id, name, slug, category, niche, brand_color, contact_email, contact_phone, 
    google_review_url, wifi_ssid, wifi_password
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    'Marisquería El Centollo & Cía',
    'marisqueria-el-centollo',
    'Mariscos & Arroces',
    'marisqueria',
    '#dc2626',
    'reservas@elcentollo.es',
    '+34 986 123 456',
    'https://search.google.com/local/writereview?placeid=centollo-demo',
    'Centollo_Clientes_5G',
    'MariscoFresco2026'
) ON CONFLICT (slug) DO NOTHING;

-- Tag Centollo
INSERT INTO public.tags (
    id, tag_uid, serial_number, batch_id, product_type, die_cut_shape, status, 
    business_id, redirect_mode, direct_url, scan_count
) VALUES (
    '55555555-5555-5555-5555-555555555555',
    'tag-marisco-centollo',
    'AAI-CENTOLLO-0012',
    '11111111-1111-1111-1111-111111111111',
    'troquel_carteleria',
    'Centollo / Cigala Roja',
    'active',
    '44444444-4444-4444-4444-444444444444',
    'micropage',
    NULL,
    423
) ON CONFLICT (tag_uid) DO NOTHING;

-- 7.5 Negocio Demo 3: Inmobiliaria Costa & City
INSERT INTO public.businesses (
    id, name, slug, category, niche, brand_color, contact_email, contact_phone, 
    google_review_url, wifi_ssid, wifi_password
) VALUES (
    '66666666-6666-6666-6666-666666666666',
    'Inmobiliaria Costa & City Living',
    'inmobiliaria-costa-city',
    'Agencia Inmobiliaria',
    'inmobiliaria',
    '#0f766e',
    'ventas@costacityliving.com',
    '+34 932 114 488',
    'https://search.google.com/local/writereview?placeid=inmo-costa-demo',
    'CostaCity_Guest_5G',
    'TuNuevaCasa2026'
) ON CONFLICT (slug) DO NOTHING;

-- Tag Inmo Casita
INSERT INTO public.tags (
    id, tag_uid, serial_number, batch_id, product_type, die_cut_shape, status, 
    business_id, redirect_mode, direct_url, scan_count
) VALUES (
    '77777777-7777-7777-7777-777777777777',
    'tag-inmo-casa',
    'AAI-INMO-CASA-0015',
    '11111111-1111-1111-1111-111111111111',
    'troquel_carteleria',
    'Casa / Hogar Minimalista',
    'active',
    '66666666-6666-6666-6666-666666666666',
    'micropage',
    NULL,
    341
) ON CONFLICT (tag_uid) DO NOTHING;

-- 7.6 Negocio Demo 4: Grand Belvoir Boutique Hotel & Suites
INSERT INTO public.businesses (
    id, name, slug, category, niche, brand_color, contact_email, contact_phone, 
    google_review_url, wifi_ssid, wifi_password
) VALUES (
    '88888888-8888-8888-8888-888888888888',
    'Grand Belvoir Boutique Hotel & Suites',
    'grand-belvoir-hotel',
    'Hotel Boutique & Suites',
    'hotel',
    '#065f46',
    'recepcion@grandbelvoirhotel.com',
    '+34 952 778 899',
    'https://search.google.com/local/writereview?placeid=grand-belvoir-demo',
    'Belvoir_Guest_HighSpeed',
    'SuiteLuxury2026'
) ON CONFLICT (slug) DO NOTHING;

-- Tag Hotel Colgador Pomo Suite
INSERT INTO public.tags (
    id, tag_uid, serial_number, batch_id, product_type, die_cut_shape, status, 
    business_id, redirect_mode, direct_url, scan_count
) VALUES (
    '99999999-9999-9999-9999-999999999999',
    'tag-hotel-suite',
    'AAI-HOTEL-POMO-0081',
    '11111111-1111-1111-1111-111111111111',
    'colgadores_pomos',
    'Colgador de Puerta / Llave Motel',
    'active',
    '88888888-8888-8888-8888-888888888888',
    'micropage',
    NULL,
    654
) ON CONFLICT (tag_uid) DO NOTHING;

-- 7.7 Negocio Demo 5: Joyería & Relojería Aurum
INSERT INTO public.businesses (
    id, name, slug, category, niche, brand_color, contact_email, contact_phone, 
    google_review_url, wifi_ssid, wifi_password
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Joyería & Alta Relojería Aurum',
    'joyeria-aurum',
    'Joyería Fina & Diamantes',
    'joyeria',
    '#ca8a04',
    'atencion@joyeriaaurum.es',
    '+34 915 224 890',
    'https://search.google.com/local/writereview?placeid=aurum-jewelry-demo',
    'Aurum_VIP_Guest',
    'DiamantesBrillantes2026'
) ON CONFLICT (slug) DO NOTHING;

-- Tag Joyería Diamante
INSERT INTO public.tags (
    id, tag_uid, serial_number, batch_id, product_type, die_cut_shape, status, 
    business_id, redirect_mode, direct_url, scan_count
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'tag-joyeria-diamante',
    'AAI-JOYERIA-DIAMANTE-0018',
    '11111111-1111-1111-1111-111111111111',
    'troquel_carteleria',
    'Diamante Talla Brillante Facetado',
    'active',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'micropage',
    NULL,
    387
) ON CONFLICT (tag_uid) DO NOTHING;

-- 7.8 Negocio Demo 6: Cervecería Artesanal HopCraft
INSERT INTO public.businesses (
    id, name, slug, category, niche, brand_color, contact_email, contact_phone, 
    google_review_url, wifi_ssid, wifi_password
) VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Cervecería Artesanal HopCraft',
    'hopcraft-taproom',
    'Craft Beer & Brewpub',
    'cerveceria',
    '#d97706',
    'info@hopcraftbeer.es',
    '+34 916 778 990',
    'https://search.google.com/local/writereview?placeid=hopcraft-demo',
    'HopCraft_Taproom_WiFi',
    'LupuloIPA2026'
) ON CONFLICT (slug) DO NOTHING;

-- Tag Cervecería Jarra
INSERT INTO public.tags (
    id, tag_uid, serial_number, batch_id, product_type, die_cut_shape, status, 
    business_id, redirect_mode, direct_url, scan_count
) VALUES (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'tag-beer-jarra',
    'AAI-BEER-STEIN-0091',
    '11111111-1111-1111-1111-111111111111',
    'troquel_carteleria',
    'Jarra Cervecera Bávara con Espuma',
    'active',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'micropage',
    NULL,
    654
) ON CONFLICT (tag_uid) DO NOTHING;
`;
