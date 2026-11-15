# FRONTEND IMPLEMENTATION TOOLKIT REFERENCE
*Evaluated libraries, rendering engines, asset pipelines, and performance budgets*

---

## 1. MOTION & ANIMATION LIBRARIES

| Technology | Best For | Bundle Size (gzipped) | Performance | Licensing | Implementation Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GSAP 3** | Complex multi-stage timelines, SVG morphing, ScrollTrigger pinning | ~28 KB (core) | 60/120fps GPU-accelerated tick | GreenSock License (Free for 99% sites; commercial license needed only if charging multiple customers for access) | The gold standard for Awwwards-style narrative scrubbing. Use `gsap.context()` in React/Next.js to avoid memory leaks. |
| **ScrollTrigger** | Scroll-driven timeline scrubbing, pinned sections, horizontal tracks | ~14 KB | Highly optimized intersection & scroll listeners | Bundled with GSAP | Pairs with Lenis. Always set `anticipatePin: 1` on pinned containers to eliminate jitter. |
| **Lenis** | Inertial smooth scrolling without browser scroll hijacking | ~4.5 KB | Zero jank, decoupled RAF tick | MIT | The essential engine for Awwwards fluidity. Syncs directly with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`. |
| **Motion (Framer Motion)** | React layout transitions, gestures, springs, popover exits | ~32 KB | Composite transforms & Web Animations API where supported | MIT | Best for micro-interactions, spring buttons, and `<AnimatePresence>` unmount animations. |
| **Theatre.js** | Complex cinematic 3D/DOM keyframing with visual timeline editor | ~80 KB | Excellent for scripted narrative cuts | Apache 2.0 | Use when choreography requires spatial 3D keyframe manipulation. |

---

## 2. 3D & CREATIVE WEBGL

| Technology | Best For | Bundle Size | Performance | Considerations |
| :--- | :--- | :--- | :--- | :--- |
| **Three.js** | Full 3D scenes, shaders, glTF model rendering, particle systems | ~160 KB | Heavy GPU load; needs FPS capping | Always implement `visibilitychange` listener and pause render loop when out of viewport. |
| **React Three Fiber (R3F)** | Declarative Three.js in React component trees | ~25 KB (+ Three.js) | Component unmount cleanup | Superb ecosystem: use `@react-three/drei` for loaders, cameras, and postprocessing. |
| **@react-three/drei** | Reusable shaders, Environment maps, Float, Html overlays | Variable (tree-shakable) | High | Essential helper library for R3F scenes. |
| **OGL** | Minimalist WebGL alternative when Three.js is too heavy | ~12 KB | Ultra-lightweight, high FPS | Ideal for simple shader backgrounds, liquid ripples, or cursor distortions. |

---

## 3. COMPONENT PRIMITIVES & STYLING

| System | Role | Visual Aesthetic | Accessibility | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Tailwind CSS v4** | Core styling utility | Bespoke; zero default styling | Developer controlled | Foundation for token ladders, fluid typography clamps, and responsive containers. |
| **Radix UI Primitives** | Headless accessible components | Unstyled functional DOM | WAI-ARIA compliant, full keyboard navigation | Always use for dialogs, popovers, dropdowns, and tabs. |
| **shadcn/ui** | Copy-paste Tailwind + Radix components | Clean modern neutral | WCAG AA compliant | Use as structural starting point; customize surfaces and typography to avoid looking like a generic template. |
| **Aceternity UI** | High-concept visual effects (Bento, Glowing borders, Sparkles) | Bold, modern dark tech | Variable | Extract specific interaction math (e.g. 3D card tilt); avoid piling too many simultaneous canvas effects. |
| **Magic UI** | Animated marketing components (Marquee, Orbit, Shimmer buttons) | High-polish SaaS/agency | Good | Great for interactive marketing CTAs and dynamic text gradients. |
| **21st.dev** | Community curated modern React components | Diverse | Review per component | Reference for cutting-edge interaction patterns. |

---

## 4. TYPOGRAPHY & ICONOGRAPHY

### Font Pairings
- **Editorial Luxury**: *Instrument Serif* or *Playfair Display* (Display) + *Geist Sans* or *Inter* (Body) + *JetBrains Mono* (Code/Metadata).
- **Industrial Neo-Brutalism**: *Syne* or *Cabinet Grotesk* (Display) + *Space Grotesk* (Subheadings) + *General Sans* (Body).
- **Contemporary Minimalist**: *Plus Jakarta Sans* (Display & Headings) + *Plus Jakarta Sans* with optical tracking (Body).

### Icons
- **Lucide Icons**: 1,400+ crisp, consistent 24x24 SVG vectors. Best default for general UI and dashboards.
- **Phosphor Icons**: Flexible weight system (thin, light, regular, bold, fill, duotone). Superb for high-end editorial experiences.
- **Rule**: Never use emojis as interface icons. Always render SVGs with explicit `aria-hidden="true"` or accessible labels.

---

## 5. ASSETS & IMAGE STRATEGY

- **Photography**: Source authentic photography from Unsplash or Pexels with consistent color temperatures and desaturated shadows.
- **SVG Graphics**: Prefer clean vector diagrams with thin strokes (`1px` to `1.5px`) over dense bitmap graphics.
- **Responsive Image Formats**: Always serve WebP or AVIF with `srcset` across 640w, 1080w, 1920w.
- **Lottie / Rive**: Use Rive for vector interactive state machines; keep Lottie JSON animations under 100 KB.

