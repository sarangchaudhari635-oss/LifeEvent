# VISUAL QUALITY ASSURANCE CHECKLIST
*Mandatory multi-viewport inspection protocol before claiming completion*

---

## 1. MULTI-VIEWPORT INSPECTION PROTOCOL
Execute visual captures across all 4 responsive tiers:
- [ ] **Desktop**: 1440 x 900 px (Primary art-direction layout)
- [ ] **Laptop**: 1280 x 800 px (Standard workspace viewport)
- [ ] **Tablet**: 768 x 1024 px (Breakpoint transition test)
- [ ] **Mobile**: 390 x 844 px (iPhone standard viewport)

---

## 2. STRUCTURAL & LAYOUT AUDIT
- [ ] **Horizontal Overflow**: Page has 0 horizontal scrollbar on mobile/tablet (`document.body.clientWidth === window.innerWidth`).
- [ ] **Baseline & Optical Alignment**: Icons are optically centered with adjacent typography; badges and text baselines align.
- [ ] **Spacing Rhythms**: Consistent vertical padding between major sections (e.g. `py-20` to `py-32` desktop, `py-12` to `py-16` mobile).
- [ ] **Container Bounds**: Content never exceeds max container width or clips awkwardly against viewport edges.

---

## 3. TYPOGRAPHIC CRAFT
- [ ] **Readability**: Minimum contrast ratio of 4.5:1 for body copy and 3.0:1 for large display titles.
- [ ] **Orphans & Widows**: Headers do not leave single orphan words trailing on a new line (`text-wrap: balance`).
- [ ] **Line Heights**: Display headlines have tight leading (`leading-[0.95]` to `leading-[1.1]`); body text has relaxed leading (`leading-[1.6]` to `leading-[1.75]`).

---

## 4. INTERACTION & CONSOLE HEALTH
- [ ] **Console Errors**: 0 unhandled JavaScript exceptions, 0 404 image/font requests.
- [ ] **Focus Visible**: All interactive elements display a clear, accessible keyboard focus indicator.
- [ ] **Hover / Tap States**: Every clickable component has an immediate, unmistakable visual feedback state.
- [ ] **Touch Targets**: All mobile buttons and links meet the minimum 44x44px touch target boundary.

