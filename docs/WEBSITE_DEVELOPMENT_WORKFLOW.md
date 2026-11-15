# AUTONOMOUS WEBSITE DEVELOPMENT WORKFLOW
*Step-by-step pipeline for end-to-end website generation and refinement*

---

## EXECUTION PIPELINE

```text
[Stage 1: Discovery] ──> [Stage 2: Creative Direction] ──> [Stage 3: Design System]
                                                                     │
[Stage 6: Visual QA] <── [Stage 5: Implementation] <── [Stage 4: Architecture]
         │
         ▼
[Stage 7: 5-Issue Polish Loop] ──> [Verified Completion]
```

---

### Step 1: Query Local Intelligence
Before writing any code or components, run:
```powershell
python .agents/skills/ui-ux-pro-max/scripts/search.py --domain product "<product_topic>" --design-system -p "<ProjectName>"
```
This extracts recommended color palettes, typography pairings, layout variance, and motion parameters.

### Step 2: Establish Creative Direction
Document the artistic vision:
- Target Aesthetic (e.g. Minimalist Editorial / Neo-Brutalist / Dark Luxury Cyberpunk)
- Typography Duo (Display font + Body font)
- Dominant surface colors and primary accent
- Key interactive hook (e.g. magnetic cursor, masked image reveal, scrubbed 3D canvas)

### Step 3: Implement Core Design Tokens
Define tokens in Tailwind (`tailwind.config.ts` or CSS variables) matching `DESIGN_SYSTEM_REFERENCE.md`.

### Step 4: Construct Modular Architecture
Build clean, decoupled components in `src/components/`:
- `ui/`: Atom-level primitives (Button, Badge, Card, Dialog)
- `sections/`: Page sections (Hero, Showcase, Narrative, Features, Pricing, Footer)
- `motion/`: Motion wrappers and Lenis scroll controllers

### Step 5: Start Local Server & Run Automated Visual QA
Start the Vite / Next.js development server:
```powershell
npm run dev
```
Execute automated screenshot capture across desktop, laptop, tablet, and mobile viewports using Playwright MCP or Chrome DevTools.

### Step 6: Execute the 5-Flaw Elimination Loop
Examine screenshots side-by-side:
1. Identify the top 5 visual issues (contrast, spacing, typography orphan, clunky animation, layout shift).
2. Apply targeted code corrections.
3. Re-capture and compare.
4. Stop only when the interface passes the Awwwards / human art-direction benchmark.

