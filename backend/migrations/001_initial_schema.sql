-- ====================================================================
-- LifeEvent AI - PostgreSQL Schema & Supabase Migrations
-- Hackathon: Paytm AI Hackathon (Build for India), Pune - PS-2
-- ====================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Profiles / Roles Table (for Users & Hospital Counselors)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'family', -- 'family' or 'hospital_counselor'
    hospital_id TEXT, -- set only for counselor role
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Journeys Table (User ownership is strictly enforced)
CREATE TABLE IF NOT EXISTS journeys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    relation TEXT NOT NULL DEFAULT 'father',
    hospital_name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Pune',
    urgency TEXT NOT NULL DEFAULT 'urgent',
    language TEXT NOT NULL DEFAULT 'en',
    total_estimate NUMERIC(12,2) DEFAULT 0,
    likely_covered NUMERIC(12,2) DEFAULT 0,
    gap_low NUMERIC(12,2) DEFAULT 0,
    gap_expected NUMERIC(12,2) DEFAULT 0,
    gap_high NUMERIC(12,2) DEFAULT 0,
    confidence TEXT NOT NULL DEFAULT 'Needs TPA Confirmation',
    current_stage TEXT NOT NULL DEFAULT 'intake_completed',
    next_best_action TEXT NOT NULL,
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    storage_path TEXT,
    confidence NUMERIC(4,2) DEFAULT 0.95,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Document Pages Table (Per-page text for strict citation validation)
CREATE TABLE IF NOT EXISTS document_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    page_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Document Chunks (pgvector semantic search)
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Verified Coverage Findings Table
CREATE TABLE IF NOT EXISTS coverage_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    estimated_cost NUMERIC(12,2) DEFAULT 0,
    likely_covered NUMERIC(12,2) DEFAULT 0,
    out_of_pocket NUMERIC(12,2) DEFAULT 0,
    confidence TEXT NOT NULL,
    evidence_doc TEXT NOT NULL,
    evidence_page INT NOT NULL DEFAULT 1,
    evidence_passage TEXT NOT NULL,
    clause_ref TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Checklist Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    is_critical BOOLEAN NOT NULL DEFAULT true,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Journey Timeline Events Table
CREATE TABLE IF NOT EXISTS journey_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    actor TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed'
);

-- 10. Partner Offers Table (Clearly labeled Demo Partners)
CREATE TABLE IF NOT EXISTS partner_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    badge TEXT NOT NULL DEFAULT 'Demo Partner, illustrative terms, not a real offer',
    type TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    tenure_months INT NOT NULL DEFAULT 12,
    monthly_emi NUMERIC(12,2) NOT NULL,
    interest_rate TEXT NOT NULL,
    approval_time TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Consent Records Table
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    user_consent BOOLEAN NOT NULL,
    consent_timestamp TIMESTAMPTZ DEFAULT now(),
    language TEXT NOT NULL DEFAULT 'en'
);

-- 12. Hospital Pilot Requests (B2B Lead Generation)
CREATE TABLE IF NOT EXISTS pilot_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    bed_count INT DEFAULT 100,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverage_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilot_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: users read and update their own profile
CREATE POLICY "Users access own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Journeys: users can only see and manipulate journeys they own
CREATE POLICY "Users access own journeys" ON journeys
    FOR ALL USING (auth.uid() = user_id);

-- Counselor Access Rule: Counselors can view journeys belonging to their assigned hospital
CREATE POLICY "Counselors view hospital journeys" ON journeys
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
              AND profiles.role = 'hospital_counselor' 
              AND profiles.hospital_id = journeys.hospital_name
        )
    );

-- Cascading RLS for all journey-related child tables
CREATE POLICY "Users access own documents" ON documents
    FOR ALL USING (EXISTS (SELECT 1 FROM journeys WHERE journeys.id = documents.journey_id AND journeys.user_id = auth.uid()));

CREATE POLICY "Users access own document_pages" ON document_pages
    FOR ALL USING (EXISTS (SELECT 1 FROM journeys WHERE journeys.id = document_pages.journey_id AND journeys.user_id = auth.uid()));

CREATE POLICY "Users access own document_chunks" ON document_chunks
    FOR ALL USING (EXISTS (SELECT 1 FROM journeys WHERE journeys.id = document_chunks.journey_id AND journeys.user_id = auth.uid()));

CREATE POLICY "Users access own coverage_findings" ON coverage_findings
    FOR ALL USING (EXISTS (SELECT 1 FROM journeys WHERE journeys.id = coverage_findings.journey_id AND journeys.user_id = auth.uid()));

CREATE POLICY "Users access own tasks" ON tasks
    FOR ALL USING (EXISTS (SELECT 1 FROM journeys WHERE journeys.id = tasks.journey_id AND journeys.user_id = auth.uid()));

CREATE POLICY "Users access own journey_events" ON journey_events
    FOR ALL USING (EXISTS (SELECT 1 FROM journeys WHERE journeys.id = journey_events.journey_id AND journeys.user_id = auth.uid()));

CREATE POLICY "Users access own partner_offers" ON partner_offers
    FOR ALL USING (EXISTS (SELECT 1 FROM journeys WHERE journeys.id = partner_offers.journey_id AND journeys.user_id = auth.uid()));

CREATE POLICY "Users access own consent_records" ON consent_records
    FOR ALL USING (EXISTS (SELECT 1 FROM journeys WHERE journeys.id = consent_records.journey_id AND journeys.user_id = auth.uid()));

CREATE POLICY "Anyone can submit pilot request" ON pilot_requests
    FOR INSERT WITH CHECK (true);

-- Storage bucket policies (Supabase storage.objects)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('medical-documents', 'medical-documents', false);
-- CREATE POLICY "Users access own folder in medical-documents" ON storage.objects
--     FOR ALL USING (bucket_id = 'medical-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
