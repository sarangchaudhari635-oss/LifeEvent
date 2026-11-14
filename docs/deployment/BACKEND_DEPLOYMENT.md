# LifeEvent AI: Backend Deployment Specification (Render & Docker)

**Document Version:** 2.0  
**Status:** Approved Architectural Baseline  
**Hosting Platform:** Render / Docker Container Service  
**Region:** Singapore / Mumbai (`ap-south-1`)  
**Product:** LifeEvent AI — AI-Powered Financial Journey Operating System

---

## 1. Container Architecture & Dockerfile

The FastAPI backend is packaged as a lightweight, production-hardened Docker container based on `python:3.11-slim`:

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim as builder

WORKDIR /app

# Install system build dependencies for PyMuPDF and cryptography
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final runtime image
FROM python:3.11-slim

WORKDIR /app

# Copy installed python dependencies from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy backend application source code
COPY ./app /app/app

# Non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Production server execution using Uvicorn with 4 worker processes
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--proxy-headers"]
```

---

## 2. Render Blueprint Specification (`render.yaml`)

```yaml
services:
  - type: web
    name: lifeevent-backend
    env: docker
    region: singapore
    plan: standard
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
    healthCheckPath: /api/health
    numInstances: 2
    envVars:
      - key: ENVIRONMENT
        value: production
      - key: GEMINI_API_KEY
        sync: false # Set securely in Render dashboard
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: SUPABASE_JWT_SECRET
        sync: false
      - key: ALLOWED_ORIGINS
        value: https://lifeevent.ai,https://staging.lifeevent.ai
```

---

## 3. High-Availability & Health Monitoring

1. **Liveness Probe:** Render polls `GET /api/health` every 30 seconds. If an instance fails 3 consecutive checks, it is automatically terminated and replaced.
2. **Graceful Shutdown:** FastAPI handles `SIGTERM` signals, completing in-flight SSE streams and database transactions before closing sockets.

