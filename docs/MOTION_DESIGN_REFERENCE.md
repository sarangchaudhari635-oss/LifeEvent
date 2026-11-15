# MOTION DESIGN & ANIMATION ENGINEERING REFERENCE
*Principles, easing math, performance limits, and choreography*

---

## 1. THE THREE TIERS OF WEB MOTION

### Tier 1: Micro-Interactions (Utility & Feedback)
- **Target**: Buttons, links, toggles, badges, tooltips.
- **Duration**: `120ms - 220ms`.
- **Properties**: `transform`, `opacity`, `background-color`.
- **Curves**: Snappy cubic-bezier e.g. `cubic-bezier(0.16, 1, 0.3, 1)` or fast springs.
- **Rule**: Never delay user interaction. Instant response on pointerdown.

### Tier 2: Structural UI Transitions (Layout & Navigation)
- **Target**: Drawers, dialogs, accordion expands, page route view transitions.
- **Duration**: `300ms - 450ms`.
- **Curves**: Smooth deceleration on enter (`cubic-bezier(0.2, 0.8, 0.2, 1)`), crisp exit (`cubic-bezier(0.4, 0, 1, 1)`).
- **Rule**: Avoid animating `height` or `width` directly; use CSS Grid `grid-template-rows: 0fr -> 1fr` or FLIP techniques.

### Tier 3: Narrative & Scroll Storytelling (Awwwards Experience)
- **Target**: Hero entrance cascades, pinned scroll sections, horizontal scrub galleries.
- **Duration / Scrub**: Driven by Lenis smooth scroll + GSAP ScrollTrigger timeline.
- **Rule**: Lock scrubbing to viewport progress; never hijack user scroll velocity destructively.

---

## 2. PRODUCTION EASING & SPRING PRESETS

### Standard CSS Curves
```css
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1); /* Elegant deceleration */
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);  /* Snappy high-end UI */
--ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1); /* Smooth symmetric */
```

### Framer Motion / Motion Spring Configs
```typescript
// Snappy button press / switch
export const springSnappy = { type: "spring", stiffness: 400, damping: 30 };

// Fluid modal / card reveal
export const springGentle = { type: "spring", stiffness: 220, damping: 24 };

// High-end Apple-style drawer
export const springDrawer = { type: "spring", stiffness: 180, damping: 22 };
```

---

## 3. GPU COMPOSITING & ZERO-JANK RULES
- **Never animate layout triggers**: `top`, `left`, `margin`, `padding`, `width`, `height`.
- **Always animate composite triggers**: `transform: translate3d(...) scale(...)`, `opacity`.
- **Layer Promotion**: Use `will-change: transform` only during active animation cycles; remove on complete to save VRAM.
- **Respect Accessibility**: Always enforce `@media (prefers-reduced-motion: reduce)`.

