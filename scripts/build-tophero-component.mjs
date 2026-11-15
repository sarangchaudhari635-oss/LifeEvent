// Generates frontend/src/components/TopHeroSection.tsx from TopHero/index.html
// Keeps the hero markup byte-identical (including the inline base64 SVG font),
// converting only what JSX requires (className, camelCase attrs, style-as-string).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "TopHero", "index.html"), "utf8");

// 1. Extract the hero block: <section class="section-w"> ... </section>
const start = html.indexOf('<section class="section-w">');
const stopMarker = html.indexOf("<!-- WebGL Three.js");
if (start === -1 || stopMarker === -1) throw new Error("Hero block markers not found");
const end = html.lastIndexOf("</section>", stopMarker);
let block = html.slice(start, end + "</section>".length).trim();

// 2. Pull out <style> contents (CSS contains braces -> must become template literals in JSX)
const styleChunks = [];
block = block.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => {
  styleChunks.push(css);
  return `__STYLE_CHUNK_${styleChunks.length - 1}__`;
});

// 3. JSX attribute conversions (content-only CSS is protected by placeholders)
block = block
  .replace(/<!--([\s\S]*?)-->/g, "{/*$1*/}")
  .replace(/\bclass="/g, 'className="')
  .replace(/\bautoplay(\s|=)/g, "autoPlay$1")
  .replace(/\bplaysinline(\s|=)/g, "playsInline$1")
  .replace(/\bcrossorigin="/g, 'crossOrigin="')
  .replace(/src="video\//g, 'src="/video/')
  // The single technical fix required for React: muted does not survive SSR
  // hydration (facebook/react#10389), so browser autoplay policy would block
  // the video. Force it via ref — no design or physics changes.
  .replace(
    /<video([\s\S]*?)className="video-hero-bg">/,
    '<video$1className="video-hero-bg"\n            ref={(el) => { if (el) { el.muted = true; const p = el.play(); if (p && typeof p.catch === "function") p.catch(() => {}); } }}>'
  );

// 4. Reinsert style contents as template literals
block = block.replace(/__STYLE_CHUNK_(\d+)__/g, (_, i) => {
  const css = styleChunks[Number(i)].replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  return "{`" + css + "`}";
});

// 5. Wrap into a client component with the stylesheet link and the fluid script
const component = `"use client";

import Script from "next/script";

// Drop-in top hero section, generated verbatim from TopHero/index.html
// (Three.js WebGL liquid hover-reveal over the background morph video).
export function TopHeroSection() {
  return (
    <>
      <link rel="stylesheet" href="/css/hero.css" />

${block
  .split("\n")
  .map((l) => (l.trim() ? "      " + l : ""))
  .join("\n")}

      <Script
        src="/js/hero-fluid.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && window.initHeroFluid) {
            window.initHeroFluid();
          }
        }}
      />
    </>
  );
}
`;

const outPath = join(root, "frontend", "src", "components", "TopHeroSection.tsx");
let final = component;

// Global window type augmentation for initHeroFluid
final = final.replace(
  `"use client";`,
  `"use client";

declare global {
  interface Window {
    initHeroFluid?: () => void;
  }
}`
);

writeFileSync(outPath, final, "utf8");
console.log("Wrote", outPath, "-", final.length, "chars");
