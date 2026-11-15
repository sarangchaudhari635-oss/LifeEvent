# WORLD-CLASS AI WEB DESIGN & DEVELOPMENT ENVIRONMENT
*Comprehensive System Specification & Operational Manual*

---

## 1. ENVIRONMENT AUDIT SUMMARY

| Metric | Detected Value | Compatibility & Scope |
| :--- | :--- | :--- |
| **Agent Platform** | Google Antigravity (AGY) 2.0 | Native support for `.agents/skills`, `AGENTS.md`, `mcp_config.json`, Subagents, Reactive Wakeup |
| **Underlying Model** | Gemini 3.8 Flash | Compensated via external design intelligence skills, local datasets, and Context7 MCP |
| **Host OS** | Windows 11 Pro (Build 10.0.26200) | Full PowerShell, Cmd, and background tasks support |
| **Node.js** | v24.12.0 | Full ES module, npx, and modern frontend tooling support |
| **npm** | 11.6.2 | Package management and CLI runners |
| **Python** | 3.13.7 | Powers local search and design system scripts (`search.py`) |
| **Git** | 2.55.0.windows.3 | Version control checkpoints and repo discovery |
| **System RAM** | 12.0 GB (12,460,276 KB) | Sufficient for Node servers, browser automation, and local builds |
| **Disk Space** | 27.7 GB Free on Drive C: | Ample room for npm dependencies, builds, and artifacts |

---

## 2. INSTALLED SKILLS CATALOG (60 ACTIVE SKILLS)

All skills reside in `c:\Users\Captain\Desktop\Pytm2\.agents\skills\` and are dynamically discovered via progressive disclosure:

### A. Core UI/UX Intelligence & Design Systems
1. **ui-ux-pro-max**
   - **Purpose**: Generates design systems, typography scales, 192 product palettes, 120 UX rules, 80 styles, 105 icons, and 25 chart types. Includes local `scripts/search.py`.
   - **Repository**: [https://github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
   - **Location**: `.agents/skills/ui-ux-pro-max/`
2. **design-taste-frontend**
   - **Purpose**: Professional art direction, bespoke typography, anti-slop guidelines, and single-screen pacing.
   - **Repository**: [https://github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
   - **Location**: `.agents/skills/design-taste-frontend/`
3. **minimalist-ui**
   - **Purpose**: Warm monochrome palettes, strong typographic scale contrast, flat bento grid systems.
   - **Repository**: [https://github.com/Leonxlnx/taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics)
   - **Location**: `.agents/skills/minimalist-ui/`
4. **industrial-brutalist-ui**
   - **Purpose**: Swiss typography, rigid grids, stark contrast, visible border structures, utilitarian aesthetics.
   - **Repository**: [https://github.com/Leonxlnx/taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics)
   - **Location**: `.agents/skills/industrial-brutalist-ui/`
5. **gpt-taste**
   - **Purpose**: Strict AIDA page narrative structure, layout variance, anti-AI pattern detection.
   - **Repository**: [https://github.com/Leonxlnx/taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics)
   - **Location**: `.agents/skills/gpt-taste/`
6. **high-end-visual-design** (Soft UI Classic)
   - **Purpose**: Calm, polished luxury aesthetic, soft contrast, generous breathing room, spring motion.
   - **Repository**: [https://github.com/Leonxlnx/taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics)
   - **Location**: `.agents/skills/high-end-visual-design/`
7. **frontend-design** (Anthropic)
   - **Purpose**: Distinctive visual direction, avoiding generic AI layouts, intentional front-end aesthetics.
   - **Repository**: [https://github.com/anthropics/skills](https://github.com/anthropics/skills)
   - **Location**: `.agents/skills/frontend-design/`

### B. Motion Engineering & Animation
8. **emil-design-eng** — Emil Kowalski's core design engineering philosophy and interaction standards. ([https://github.com/emilkowalski/skills](https://github.com/emilkowalski/skills))
9. **animate** — Practical animation implementation for web interfaces.
10. **animation-performance** — 60/120fps GPU optimization, composite triggers, will-change lifecycle.
11. **animation-vocabulary** — Mathematical spring curves, damping, stiffness, easing curves.
12. **choreograph** — Multi-element entry cascades, staggered transitions, timing hierarchies.
13. **improve-animations** — Micro-interaction refinement and state transitions.
14. **find-animation-opportunities** — Contextual identification of where motion adds functional clarity.
15. **gestures** — Touch, drag, pull, and swipe physics.
16. **prototype** — Rapid interaction testing and feel validation.
17. **review-animations** — Visual audit for jank, excessive duration, or jarring ease curves.
18. **remove-animations** — Elimination of superfluous, distracting, or performance-degrading motion.
19. **break-ui** — Edge-case and stress testing animated elements.
20. **apple-design** — Apple-grade interaction refinement, optical curves, and tactile feedback.
21. **learn-taste** — Continuous taste calibration and visual hierarchy principles.
22. **pick-ui-library** — Objective framework selection (Motion vs GSAP vs CSS vs Theatre.js).

### C. Awwwards & Cinematic Web Experiences (Meng To Suite)
23. **build-awwwards-quality-sites** — Awwwards Site of the Day / Year architectural standards. ([https://github.com/MengTo/Skills](https://github.com/MengTo/Skills))
24. **cinematic-gsap-lenis-motion-system** — Inertial smooth scrolling + scrubbed GSAP timeline integration.
25. **cinematic-scroll-storytelling** — Story-driven pinned scroll scenes and multi-stage reveals.
26. **landing-page** — High-impact, art-directed conversion page architecture.
27. **gsap** — Comprehensive GSAP 3 timeline, morphing, split-text, and tween patterns.
28. **gsap-scrolltrigger-storytelling** — ScrollTrigger pin, scrub, toggleActions, and coordinate markers.
29. **threejs** — 3D scene setup, lighting, materials, camera choreography, and canvas rendering.
30. **webgl-landing-steering** — Interactive WebGL hero backgrounds with cursor physics.
31. **webgl-3d-object** — Loading, optimizing, and lighting glTF/GLB models in web environments.
32. **masked-reveal** — Image and text clip-path transition choreography.
33. **staggered-word-reveal** — Kinetic typography and headline entrance mechanics.
34. **scroll-world-storytelling** — Immersive multi-plane 3D/2.5D scroll journeys.
35. **scroll-progress-timeline** — Precision progress indicators and reactive milestones.
36. **scroll-scrubbed-visual-sequence** — Frame-by-frame scrubbed canvas sequences.
37. **scroll-scrubbed-word-reveal** — Scroll-bound text opacity and blur unmasking.
38. **interactive-magnetic-cursor** — Custom pointer physics with magnetic element attraction.
39. **interactive-cards** — 3D tilt, hover-expansion, and lighting card interactions.
40. **interactive-cta** — High-converting, reactive micro-interaction buttons.
41. **bento-grid-dark-mode** — Structured high-density bento grid layouts.
42. **liquid-metal-border** — Dynamic SVG and WebGL flowing border shaders.
43. **matterjs** — 2D rigid-body physics integration for interactive micro-moments.
44. **progressive-blur** — Multi-stop backdrop-filter blur gradients.
45. **reveal-hover-effect** — Floating image previews on cursor hover over text lists.
46. **shaders-cursor-ripples** — Interactive WebGL liquid ripple effects.
47. **skeuomorphic-ui** — Tactile lighting, bevels, and physical material finishes.

### D. Quality Assurance, Anti-Slop & Autonomous Workflows
48. **no-ai-design-slop** — Zero-tolerance heuristics against generic AI design tropes.
49. **audit-ai-design-slop** — Systematic codebase scanner for cliché purple gradients, floating spheres, and identical 3-card grids.
50. **audit-reference-originality** — Visual benchmark comparison against award-winning sites.
51. **design-first-ui-prompting** — Art direction and creative ideation prior to code execution.
52. **optimize-web-animations** — Rendering pipeline profiling, layer containment, and layout-shift prevention.
53. **performance-profiling** — Frame rate, memory leak, and paint count diagnostics.
54. **stitched-full-page-capture** — Seamless full-page screenshot stitching for visual QA.
55. **video-to-superprompt** — Deconstructing video references into precise animation specifications.
56. **html-to-interaction-prompts** — Translating DOM trees into interaction choreographies.
57. **daily-ui-inspiration-capture** — Deconstructing award-winning live sites into reusable patterns.
58. **workflow-score-to-target** — Iterative scoring of generated UI against visual target standards.
59. **workflow-progress-screenshots** — Automated multi-breakpoint capture loops.
60. **iterate-until-verified** — Enforcing that no feature is approved until verified in a running browser.

### E. Vercel Architecture & Guidelines
- **web-design-guidelines** — Accessibility standards (WCAG AAA/AA), contrast targets, touch boundaries. ([https://github.com/vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills))
- **react-best-practices** — Clean component composition, memoization, state colocation.
- **react-view-transitions** — Native multi-page View Transitions API integration.
- **composition-patterns** — Headless slot composition and compound components.
- **vercel-optimize** — Core Web Vitals (LCP, INP, CLS) optimization strategies.

---

## 3. CONFIGURED MCP SERVERS

Configured in `mcp_config.json` (project-level) and `~/.gemini/config/mcp_config.json` (global):

| Server | Type | Command / Endpoint | Capabilities | Status |
| :--- | :--- | :--- | :--- | :--- |
| **playwright** | Stdio | `npx -y @playwright/mcp@latest` | Multi-viewport screenshot capture, DOM navigation, user flow verification | Active / Verified |
| **chrome-devtools** | Stdio | `npx -y chrome-devtools-mcp@latest` | Performance traces, runtime console inspection, network monitoring | Active / Verified |
| **context7** | Remote HTTP | `https://mcp.context7.com/mcp` | Real-time React, Next.js, GSAP, Three.js, Tailwind v4 documentation | Active / Verified |
| **shadcn** | Stdio | `npx -y shadcn@latest mcp` | Searching registries and installing accessible component primitives | Active / Verified |
| **filesystem** | Stdio | `npx -y @modelcontextprotocol/server-filesystem` | Project-scoped file inspection (restricted to workspace root) | Active / Sandboxed |
| **figma** | Remote HTTP | `https://mcp.figma.com/mcp` | Inspecting variables, styles, and frames (requires user Figma account) | Ready for Auth |
| **supabase** | Stdio | `@supabase/mcp-server-supabase` | Database and backend migrations | Preserved / Active |

---

## 4. ESSENTIAL COMMANDS REFERENCE

### Query Design System & Styles
```powershell
# Search specific style attributes (e.g. brutalism, dark luxury, editorial)
python .agents/skills/ui-ux-pro-max/scripts/search.py --domain style "editorial minimalism"

# Generate complete design system tokens with high variance and motion
python .agents/skills/ui-ux-pro-max/scripts/search.py "AI Research Platform" --design-system -p "AuraAI" --variance 8 --motion 7 --persist

# Search recommended font pairings
python .agents/skills/ui-ux-pro-max/scripts/search.py --domain typography "luxury serif"

# Search curated GSAP motion presets
python .agents/skills/ui-ux-pro-max/scripts/search.py --domain gsap "text-reveal"
```

### Visual Verification & Development
```powershell
# Start local dev server
npm run dev

# Capture multi-viewport screenshots via Playwright MCP
# In agent turn, trigger Playwright MCP take_screenshot across 1440, 1280, 768, 390px
```

---

## 5. MAINTENANCE & TROUBLESHOOTING

- **Updating Skills**: Re-pull fresh changes from upstream GitHub repositories into `.agents/skills/`.
- **Node & npx Cache**: If any MCP server fails to launch, clear cache with `npx clear-npx-cache` or run `npm cache clean --force`.
- **Port Conflicts**: If the dev server port (e.g., 5173 or 3000) is occupied, specify `--port 3001` in the launch command.
- **MCP Reconnection**: In Antigravity, reload MCP tools via **Additional Options (...) > MCP Servers** or restart the session.

