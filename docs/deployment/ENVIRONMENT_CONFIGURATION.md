# LifeEvent AI: Environment Configuration & Secret Management

**Document Version:** 2.0  
**Status:** Approved Architectural Baseline  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Backend Environment Variables (`backend/.env`)

```ini
# ==========================================
# LIFE EVENT AI: BACKEND CONFIGURATION
# ==========================================

# Application Environment
ENVIRONMENT=development                # 'development' | 'staging' | 'production'
LOG_LEVEL=INFO                         # 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR'
PORT=8000
HOST=0.0.0.0

# Security & CORS Whitelist
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,https://lifeevent.ai
API_SECRET_KEY=change_this_to_a_random_32_byte_hex_string_in_production

# Google Gemini AI Integration
GEMINI_API_KEY=AIzaSy...               # Google GenAI API key for Gemini 2.0
GEMINI_MODEL_FAST=gemini-2.0-flash     # Used for OCR and entity extraction
GEMINI_MODEL_REASONING=gemini-2.0-pro  # Used for deep clause cross-examination

# Supabase Persistence & Database
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # Service role key for backend queries
SUPABASE_JWT_SECRET=your-jwt-secret    # Used to verify user Bearer tokens
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

# Rate Limiting (slowapi)
RATE_LIMIT_INTAKE=30/minute
RATE_LIMIT_MUTATING=60/minute

# External Provider Modes ('simulated' | 'sandbox' | 'production')
PROVIDER_MODE=simulated

# Tier 2 Sandbox Credentials (Optional for hackathon demo)
PAYTM_MID=YOUR_STAGING_MID
PAYTM_MERCHANT_KEY=YOUR_STAGING_KEY
SETU_AA_CLIENT_ID=YOUR_SETU_ID
SETU_AA_SECRET=YOUR_SETU_SECRET
```

---

## 2. Frontend Environment Variables (`frontend/.env.local`)

```ini
# ==========================================
# LIFE EVENT AI: FRONTEND CONFIGURATION
# ==========================================

# Backend API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Client Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# App Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_DEFAULT_LOCALE=en          # 'en' | 'hi' | 'mr'
```

---

## 3. Secret Management & Compliance Rules

1. **Git Exclusion:** `.env` and `.env.local` files are strictly excluded from version control via `.gitignore`.
2. **Key Rotation Protocol:** In production, `GEMINI_API_KEY` and Supabase keys are rotated every 90 days.
3. **Zero Secrets in Code:** Hardcoded credentials in source files or fixtures are blocked by pre-commit hooks running automated entropy and regex scanners (`detect-secrets`).

