# DESIGN SYSTEM REFERENCE MANUAL
*Architectural standards for world-class web interfaces*

---

## 1. COLOR TOKENS & SURFACE HIERARCHY
Avoid generic single-hex backgrounds. Create tactile depth through layered surfaces:

### Neutral Foundations (6-Level Surface Ladder)
```css
:root {
  /* Dark Luxe Theme */
  --bg-app:        #0c0d0e; /* Deep canvas base */
  --surface-1:     #141517; /* Card / container level */
  --surface-2:     #1b1d20; /* Raised elements / popovers */
  --surface-3:     #23262a; /* Hover states / active pills */
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-strong: rgba(255, 255, 255, 0.16);
  --text-primary:  #f4f4f5; /* High contrast reading */
  --text-muted:    #a1a1aa; /* Secondary metadata */
  --text-faint:    #52525b; /* Tertiary hints */
  
  /* Intentional Accent (Never default purple/cyan) */
  --accent-base:   #e2b714; /* Warm ochre gold OR Electric Lime #ccff00 OR International Klein Blue #002fa7 */
  --accent-hover:  #f5cf38;
  --accent-muted:  rgba(226, 183, 20, 0.12);
}
```

---

## 2. FLUID EDITORIAL TYPOGRAPHY
Never use fixed pixel typography for hero headers. Employ fluid clamps:

```css
/* Typography Scale */
--text-display: clamp(3.2rem, 8vw, 7.5rem); /* Giant statement headline */
--text-h1:      clamp(2.4rem, 5vw, 4.5rem); /* Major section headers */
--text-h2:      clamp(1.8rem, 3.5vw, 3rem);  /* Feature titles */
--text-h3:      clamp(1.25rem, 2vw, 1.75rem);/* Card titles */
--text-body:    clamp(1rem, 1.1vw, 1.125rem);/* Editorial body copy */
--text-small:   0.875rem;                   /* Metadata / badges */

/* Font Pairings (Editorial & High-Tech) */
/* Pairing 1 (Editorial Luxury): Instrument Serif (Display) + Inter / Geist (Body) */
/* Pairing 2 (Industrial Brutalist): Syne / Monument Extended + Space Grotesk / DM Sans */
/* Pairing 3 (Swiss Minimalist): Plus Jakarta Sans / General Sans + JetBrains Mono */
```

---

## 3. SPACING & LAYOUT GRID SYSTEM
Strict 8pt/4pt mathematical cadence:
- Grid: 12-column responsive grid with flexible gutter (`gap: clamp(1rem, 2.5vw, 2.5rem)`).
- Max Widths:
  - Reading width (prose): `68ch`
  - Compact container: `1080px`
  - Standard container: `1280px`
  - Ultra-wide hero: `1440px` - `1600px`

---

## 4. BUTTONS & INTERACTION STATES
- **Primary Button**: High visual weight, solid surface, optical padding (e.g. `py-3 px-6`), subtle border contrast.
- **Secondary Button**: Ghost/subtle outline with crisp hover state (surface shift, not garish glow).
- **Active State**: 0.98 scale micro-compression on `:active` with smooth spring recovery.

