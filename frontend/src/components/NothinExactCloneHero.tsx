"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";

// Exact Navier-Stokes GLSL Shaders extracted from noth.in
const K1_VERT = `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const Z1_VERT = `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const J1_SPLAT = `precision highp float;
uniform sampler2D uTarget;
uniform float uAspectRatio;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
varying vec2 vUv;

void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspectRatio;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}`;

const Q1_CURL = `precision highp float;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
varying vec2 vUv;

void main() {
  float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
  float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

const EA_VORTICITY = `precision highp float;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexelSize;
uniform float uCurlStrength;
uniform float uDt;
varying vec2 vUv;

void main() {
  float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
  float C = texture2D(uCurl, vUv).x;

  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  float len = length(force) + 0.0001;
  force = force / len * uCurlStrength * C;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * uDt;

  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

const J1_ADVECTION = `precision highp float;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDissipation;
varying vec2 vUv;

vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main() {
  vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
  vec4 result = uDissipation * bilerp(uSource, coord, uTexelSize);
  gl_FragColor = result;
}`;

const TA_DIVERGENCE = `precision highp float;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
varying vec2 vUv;

void main() {
  float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
  float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;

  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}`;

const NA_PRESSURE = `precision highp float;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;
varying vec2 vUv;

void main() {
  float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  float C = texture2D(uDivergence, vUv).x;

  float pressure = (L + R + B + T - C) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const IA_GRADIENT = `precision highp float;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
varying vec2 vUv;

void main() {
  float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity -= vec2(R - L, T - B) * 0.5;
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

// Reveal mask: Dissolves the solid white base to reveal the underlying video!
const RA_REVEAL = `uniform sampler2D uBaseTexture;
uniform sampler2D uRevealTexture;
uniform sampler2D uDye;

uniform float uRevealSize;
uniform float uEdgeSoftness;
uniform float uEdgeWidth;

uniform float uBaseImageAspect;
uniform float uRevealImageAspect;
uniform float uPlaneAspect;

varying vec2 vUv;

vec2 coverUv(vec2 uv, float imageAspect, float planeAspect) {
  vec2 ratio = vec2(
    min(planeAspect / imageAspect, 1.0),
    min(imageAspect / planeAspect, 1.0)
  );
  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

void main() {
  float dye = texture2D(uDye, vUv).r;

  vec2 baseUv = coverUv(vUv, uBaseImageAspect, uPlaneAspect);
  baseUv = clamp(baseUv, 0.001, 0.999);
  vec4 baseColor = texture2D(uBaseTexture, baseUv);

  vec2 revealUv = coverUv(vUv, uRevealImageAspect, uPlaneAspect);
  revealUv = clamp(revealUv, 0.001, 0.999);
  vec4 revealColor = texture2D(uRevealTexture, revealUv);

  float raw  = dye * uRevealSize;
  float mask = smoothstep(uEdgeSoftness, uEdgeSoftness + uEdgeWidth, raw);
  mask = clamp(mask, 0.0, 1.0);

  // Dissolves base (white) to completely transparent so video behind shines through
  gl_FragColor = vec4(baseColor.rgb, baseColor.a * (1.0 - mask));
}`;

interface DoubleFBO {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  swap: () => void;
}

export function NothinExactCloneHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Preloader state
  const [loadPercent, setLoadPercent] = useState(0);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Cursor state
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorTarget, setCursorTarget] = useState({ x: -100, y: -100 });
  const [isHoverInteractive, setIsHoverInteractive] = useState(false);

  // Pop-art images for preloader cycling
  const loaderImages = [
    "https://cdn.prod.website-files.com/6a0c501c42b9751b78a9d1a7/6a101bf4026551468ed05521_coeur-bulle-nb.webp",
    "https://cdn.prod.website-files.com/6a0c501c42b9751b78a9d1a7/6a101bf3288a762026817436_papier-froisse.webp",
    "https://cdn.prod.website-files.com/6a0c501c42b9751b78a9d1a7/6a101bf33377567d8f2bd507_asterix.webp",
    "https://cdn.prod.website-files.com/6a0c501c42b9751b78a9d1a7/6a3a7084cbb4dfa4268c289f_smiley.webp",
    "https://cdn.prod.website-files.com/6a0c501c42b9751b78a9d1a7/6a101bf4d60716b3d6959657_bonbon.webp",
    "https://cdn.prod.website-files.com/6a0c501c42b9751b78a9d1a7/6a101c34913dd6111b16324e_chwing.webp",
  ];

  // 1. PRELOADER ANIMATION SEQUENCE (0 -> 100 with image cycling)
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count += 2;
      if (count > 100) count = 100;
      setLoadPercent(count);
      setActiveImgIndex((prev) => (prev + 1) % loaderImages.length);

      if (count >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (loaderRef.current) {
            gsap.to(loaderRef.current, {
              yPercent: -100,
              duration: 1.1,
              ease: "power4.inOut",
              onComplete: () => setLoaderComplete(true),
            });
          }
          animateHeroEntrance();
        }, 200);
      }
    }, 28);

    return () => clearInterval(interval);
  }, []);

  // 2. HERO SVG LETTERS ENTRANCE ANIMATION (GSAP power4.inOut random stagger)
  const animateHeroEntrance = () => {
    if (!svgRef.current) return;
    const paths = Array.from(svgRef.current.querySelectorAll("path"));
    if (paths.length < 7) return;

    const letters = paths.slice(0, 6);
    const apos = paths[6];

    // Shuffle letters randomly as in noth.in source
    const shuffled = letters.slice().sort(() => Math.random() - 0.5);

    gsap.set(paths, { autoAlpha: 1 });
    gsap.fromTo(
      shuffled,
      { yPercent: 120 },
      {
        yPercent: 0,
        duration: 1.8,
        ease: "power4.inOut",
        stagger: 0.07,
        delay: 0.1,
      }
    );

    // Apostrophe elastic back.out pop
    gsap.fromTo(
      apos,
      { scale: 0, transformOrigin: "50% 50%" },
      {
        scale: 1,
        duration: 0.6,
        ease: "back.out(0.9)",
        delay: 1.3,
      }
    );
  };

  // 3. CURSOR FOLLOWER LERP
  useEffect(() => {
    let rafId: number;
    let currX = cursorTarget.x;
    let currY = cursorTarget.y;

    const loop = () => {
      currX += (cursorTarget.x - currX) * 0.12;
      currY += (cursorTarget.y - currY) * 0.12;
      setCursorPos({ x: currX, y: currY });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [cursorTarget]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorTarget({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // 4. REAL-TIME NAVIER-STOKES GPU FLUID MASK SIMULATION
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let rafId: number;

    const settings = {
      simResolution: 128,
      dyeResolution: 512,
      velocityDissipation: 0.962,
      dyeDissipation: 0.988,
      pressureIterations: 20,
      curlStrength: 3.5,
      splatRadius: 0.00015,
      splatForce: 6000,
      revealSize: 3.9,
      edgeSoftness: 0.2,
      edgeWidth: 0.2,
    };

    const mouse = { x: 0.5, y: 0.5 };
    const prevMouse = { x: 0.5, y: 0.5 };
    let mouseMoved = false;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0, 0);
    renderer.autoClear = false;

    // Scenes & Cameras
    const quadScene = new THREE.Scene();
    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const mainScene = new THREE.Scene();
    const mainCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    mainCamera.position.set(0, 0, 5);

    const createRT = (w: number, h: number, filter: THREE.MagnificationTextureFilter) => {
      return new THREE.WebGLRenderTarget(w, h, {
        minFilter: filter,
        magFilter: filter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        depthBuffer: false,
        stencilBuffer: false,
      });
    };

    const createDoubleFBO = (w: number, h: number, filter: THREE.MagnificationTextureFilter): DoubleFBO => {
      let r = createRT(w, h, filter);
      let wRT = createRT(w, h, filter);
      return {
        get read() {
          return r;
        },
        get write() {
          return wRT;
        },
        swap() {
          const tmp = r;
          r = wRT;
          wRT = tmp;
        },
      };
    };

    const simRes = settings.simResolution;
    const dyeRes = settings.dyeResolution;
    const velocity = createDoubleFBO(simRes, simRes, THREE.LinearFilter);
    const pressure = createDoubleFBO(simRes, simRes, THREE.NearestFilter);
    const dye = createDoubleFBO(dyeRes, dyeRes, THREE.LinearFilter);
    const curlRT = createRT(simRes, simRes, THREE.NearestFilter);
    const divergenceRT = createRT(simRes, simRes, THREE.NearestFilter);

    const simTexelSize = new THREE.Vector2(1 / simRes, 1 / simRes);
    const dyeTexelSize = new THREE.Vector2(1 / dyeRes, 1 / dyeRes);

    const quadGeo = new THREE.PlaneGeometry(2, 2);

    const makePassMat = (frag: string, uniforms: Record<string, any>) => {
      return new THREE.ShaderMaterial({
        vertexShader: K1_VERT,
        fragmentShader: frag,
        uniforms,
        depthTest: false,
        depthWrite: false,
      });
    };

    const splatMat = makePassMat(J1_SPLAT, {
      uTarget: { value: null },
      uAspectRatio: { value: 1 },
      uPoint: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Vector3() },
      uRadius: { value: settings.splatRadius },
    });

    const curlMat = makePassMat(Q1_CURL, {
      uVelocity: { value: null },
      uTexelSize: { value: simTexelSize },
    });

    const vorticityMat = makePassMat(EA_VORTICITY, {
      uVelocity: { value: null },
      uCurl: { value: null },
      uTexelSize: { value: simTexelSize },
      uCurlStrength: { value: settings.curlStrength },
      uDt: { value: 0.016 },
    });

    const advectionMat = makePassMat(J1_ADVECTION, {
      uVelocity: { value: null },
      uSource: { value: null },
      uTexelSize: { value: simTexelSize },
      uDt: { value: 1 },
      uDissipation: { value: settings.velocityDissipation },
    });

    const divergenceMat = makePassMat(TA_DIVERGENCE, {
      uVelocity: { value: null },
      uTexelSize: { value: simTexelSize },
    });

    const pressureMat = makePassMat(NA_PRESSURE, {
      uPressure: { value: null },
      uDivergence: { value: null },
      uTexelSize: { value: simTexelSize },
    });

    const gradientSubMat = makePassMat(IA_GRADIENT, {
      uPressure: { value: null },
      uVelocity: { value: null },
      uTexelSize: { value: simTexelSize },
    });

    const quadMesh = new THREE.Mesh(quadGeo, curlMat);
    quadScene.add(quadMesh);

    const renderPass = (mat: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget) => {
      quadMesh.material = mat;
      renderer.setRenderTarget(target);
      renderer.render(quadScene, quadCamera);
    };

    // Solid white base texture matching noth.in
    const createBaseWhiteTexture = () => {
      const c = document.createElement("canvas");
      c.width = 16;
      c.height = 16;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 16, 16);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    };

    const baseTexture = createBaseWhiteTexture();
    const revealTexture = createBaseWhiteTexture(); // Transparent reveal

    const maskMaterial = new THREE.ShaderMaterial({
      vertexShader: Z1_VERT,
      fragmentShader: RA_REVEAL,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uBaseTexture: { value: baseTexture },
        uRevealTexture: { value: revealTexture },
        uDye: { value: null },
        uRevealSize: { value: settings.revealSize },
        uEdgeSoftness: { value: settings.edgeSoftness },
        uEdgeWidth: { value: settings.edgeWidth },
        uBaseImageAspect: { value: 1.0 },
        uRevealImageAspect: { value: 1.0 },
        uPlaneAspect: { value: 1.0 },
      },
    });

    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const planeMesh = new THREE.Mesh(planeGeo, maskMaterial);
    mainScene.add(planeMesh);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      renderer.setSize(w, h, false);

      const aspect = w / h;
      mainCamera.aspect = aspect;
      mainCamera.fov = 50;
      mainCamera.updateProjectionMatrix();

      const dist = mainCamera.position.z;
      const fovRad = (mainCamera.fov * Math.PI) / 180;
      const planeH = 2 * Math.tan(fovRad / 2) * dist;
      const planeW = planeH * aspect;

      planeMesh.scale.set(planeW, planeH, 1);
      maskMaterial.uniforms.uPlaneAspect.value = aspect;
    };

    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseMoved = true;
    };

    const handleWindowMouseMove = (e: MouseEvent) => onPointerMove(e);
    const handleWindowTouchMove = (e: TouchEvent) => {
      if (e.touches.length) onPointerMove(e.touches[0]);
    };

    window.addEventListener("mousemove", handleWindowMouseMove, { passive: true });
    window.addEventListener("touchmove", handleWindowTouchMove, { passive: true });

    // Initial splash
    setTimeout(() => {
      if (disposed) return;
      splatMat.uniforms.uTarget.value = velocity.read.texture;
      splatMat.uniforms.uAspectRatio.value = canvas.width / canvas.height;
      splatMat.uniforms.uPoint.value.set(0.5, 0.5);
      splatMat.uniforms.uColor.value.set(160, -160, 0);
      splatMat.uniforms.uRadius.value = 0.0005;
      renderPass(splatMat, velocity.write);
      velocity.swap();

      splatMat.uniforms.uTarget.value = dye.read.texture;
      splatMat.uniforms.uColor.value.set(1.0, 1.0, 1.0);
      renderPass(splatMat, dye.write);
      dye.swap();
    }, 800);

    const step = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(step);

      const aspect = canvas.width / canvas.height;

      if (mouseMoved) {
        const dx = mouse.x - prevMouse.x;
        const dy = mouse.y - prevMouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq > 0.000001) {
          splatMat.uniforms.uTarget.value = velocity.read.texture;
          splatMat.uniforms.uAspectRatio.value = aspect;
          splatMat.uniforms.uPoint.value.set(mouse.x, mouse.y);
          splatMat.uniforms.uColor.value.set(
            dx * settings.splatForce,
            dy * settings.splatForce,
            0
          );
          splatMat.uniforms.uRadius.value = settings.splatRadius;
          renderPass(splatMat, velocity.write);
          velocity.swap();

          splatMat.uniforms.uTarget.value = dye.read.texture;
          splatMat.uniforms.uColor.value.set(1.0, 1.0, 1.0);
          splatMat.uniforms.uRadius.value = settings.splatRadius * 1.6;
          renderPass(splatMat, dye.write);
          dye.swap();
        }

        prevMouse.x = mouse.x;
        prevMouse.y = mouse.y;
      }

      // Curl
      curlMat.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(curlMat, curlRT);

      // Vorticity
      vorticityMat.uniforms.uVelocity.value = velocity.read.texture;
      vorticityMat.uniforms.uCurl.value = curlRT.texture;
      vorticityMat.uniforms.uCurlStrength.value = settings.curlStrength;
      vorticityMat.uniforms.uDt.value = 0.016;
      renderPass(vorticityMat, velocity.write);
      velocity.swap();

      // Velocity advection
      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = velocity.read.texture;
      advectionMat.uniforms.uTexelSize.value = simTexelSize;
      advectionMat.uniforms.uDissipation.value = settings.velocityDissipation;
      renderPass(advectionMat, velocity.write);
      velocity.swap();

      // Dye advection
      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = dye.read.texture;
      advectionMat.uniforms.uTexelSize.value = dyeTexelSize;
      advectionMat.uniforms.uDissipation.value = settings.dyeDissipation;
      renderPass(advectionMat, dye.write);
      dye.swap();

      // Divergence
      divergenceMat.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(divergenceMat, divergenceRT);

      // Clear pressure
      renderer.setRenderTarget(pressure.read);
      renderer.clear();
      renderer.setRenderTarget(null);

      // Pressure Poisson iterations
      pressureMat.uniforms.uDivergence.value = divergenceRT.texture;
      for (let i = 0; i < settings.pressureIterations; i++) {
        pressureMat.uniforms.uPressure.value = pressure.read.texture;
        renderPass(pressureMat, pressure.write);
        pressure.swap();
      }

      // Gradient subtraction
      gradientSubMat.uniforms.uPressure.value = pressure.read.texture;
      gradientSubMat.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(gradientSubMat, velocity.write);
      velocity.swap();

      // Final composite: Cut holes through white layer
      maskMaterial.uniforms.uDye.value = dye.read.texture;
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(mainScene, mainCamera);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("touchmove", handleWindowTouchMove);

      renderer.dispose();
      velocity.read.dispose();
      velocity.write.dispose();
      pressure.read.dispose();
      pressure.write.dispose();
      dye.read.dispose();
      dye.write.dispose();
      curlRT.dispose();
      divergenceRT.dispose();
      baseTexture.dispose();
      revealTexture.dispose();
      maskMaterial.dispose();
      quadGeo.dispose();
      planeGeo.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-black text-black select-none overflow-hidden font-sans cursor-default"
      style={{
        fontFamily: "Ppneuemontreal, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* 1. EXACT PRELOADER CURTAIN (.loader) */}
      {!loaderComplete && (
        <div
          ref={loaderRef}
          className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-6 sm:p-10"
        >
          {/* Top header inside preloader */}
          <div className="w-full flex items-center justify-between text-xs tracking-wider text-neutral-400 font-mono">
            <span>NOTHIN' STUDIO</span>
            <span>{loadPercent}%</span>
          </div>

          {/* Center cycling pop-art images with N and ' SVGs */}
          <div className="my-auto flex items-center justify-center gap-4 sm:gap-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="80"
              viewBox="0 0 99 120"
              fill="none"
              className="w-12 h-16 sm:w-20 sm:h-28 text-white"
            >
              <path
                d="M97.5773 0C98.5258 0 99 0.474199 99 1.42259V118.577C99 119.526 98.5258 120 97.5773 120H73.2249C72.6669 120 72.2764 119.805 72.0533 119.414L31.3821 62.3431C30.9358 61.7852 30.3779 61.6178 29.7084 61.841C29.0389 62.0084 28.7041 62.4547 28.7041 63.1799L29.2899 118.494C29.2899 119.498 28.8157 120 27.8673 120H1.50634C0.502113 120 0 119.526 0 118.577V1.42259C0 0.474199 0.502113 0 1.50634 0H25.5241C26.082 0 26.5004 0.223152 26.7794 0.669456L67.6179 62.092C68.0085 62.6499 68.5385 62.8452 69.2079 62.6778C69.9332 62.4547 70.2959 61.9805 70.2959 61.2552L69.7101 1.42259C69.7101 0.474199 70.1843 0 71.1327 0H97.5773Z"
                fill="currentColor"
              />
            </svg>

            {/* Pop-art image container */}
            <div className="w-24 h-24 sm:w-44 sm:h-44 relative flex items-center justify-center">
              <img
                src={loaderImages[activeImgIndex]}
                alt="Cycling loader element"
                className="max-w-full max-h-full object-contain filter drop-shadow-xl transition-all duration-75"
              />
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="40"
              viewBox="0 0 41 50"
              fill="none"
              className="w-6 h-10 sm:w-10 sm:h-16 text-white"
            >
              <path
                d="M39.5359 0C39.9821 0 40.3447 0.195095 40.6235 0.585285C40.9582 0.975474 41.0697 1.39353 40.9582 1.83947L20.9631 48.9967C20.7958 49.6656 20.3217 50 19.5409 50H1.47004C1.02385 50 0.633448 49.8328 0.298802 49.4983C0.0199315 49.1081 -0.0637449 48.6901 0.0478035 48.2441L11.3421 1.17057C11.5652 0.39019 12.0393 0 12.7643 0H39.5359Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Number counter bottom */}
          <div className="w-full flex items-center justify-end font-mono text-3xl sm:text-5xl font-black">
            {loadPercent}
          </div>
        </div>
      )}

      {/* 2. THE BACKGROUND VIDEO (Revealed through fluid holes) */}
      <video
        ref={videoRef}
        src="https://noth-in.b-cdn.net/nothin-sharp-high.mp4"
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-auto min-h-full object-cover z-0 pointer-events-none"
      />

      {/* 3. FLUID MASK CANVAS: Dissolves solid white surface on mouse movement */}
      <canvas
        ref={canvasRef}
        className="mask-reveal-canvas absolute inset-0 w-full h-full z-10 pointer-events-none"
      />

      {/* 4. SOLID WHITE HERO CONTAINER WITH EXACT VECTOR SVG */}
      <div className="relative z-20 min-h-screen flex flex-col justify-between p-4 sm:p-7 pointer-events-none">
        {/* TOP PERIMETER */}
        <div className="w-full flex items-start justify-between pointer-events-auto">
          {/* Top-Left: Statement + Black-Blend Pill Button */}
          <div className="max-w-md space-y-3">
            <div className="text-[15px] sm:text-[17px] font-medium leading-tight text-black">
              <p>Pas un style, une perspective.</p>
              <p>Parce que Nothin’ is Everythin’.</p>
            </div>

            <a
              href="/intake"
              onMouseEnter={() => setIsHoverInteractive(true)}
              onMouseLeave={() => setIsHoverInteractive(false)}
              className="group inline-flex items-center gap-4 bg-black text-white hover:bg-neutral-900 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95"
            >
              <span>RÉSERVER UN APPEL</span>
              <div className="w-3.5 h-3.5 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </div>
            </a>
          </div>

          {/* Top-Right: MENU :: */}
          <div className="flex items-center gap-3">
            <span
              onMouseEnter={() => setIsHoverInteractive(true)}
              onMouseLeave={() => setIsHoverInteractive(false)}
              className="text-xs font-bold tracking-widest uppercase cursor-pointer hover:opacity-70 transition-opacity"
            >
              MENU ::
            </span>
          </div>
        </div>

        {/* CENTER: EXACT NOTHIN' VECTOR SVG PATHS */}
        <div className="my-auto w-full flex items-center justify-center py-6 pointer-events-auto">
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            viewBox="0 0 1408 294"
            fill="none"
            className="w-full max-w-[1400px] h-auto text-black"
          >
            {/* 1. N */}
            <path
              d="M226.68 7.38751C228.884 7.38751 229.985 8.48916 229.985 10.6925V282.864C229.985 285.068 228.884 286.169 226.68 286.169H170.107C168.811 286.169 167.904 285.716 167.386 284.808L72.9032 152.222C71.8663 150.926 70.5703 150.537 69.015 151.055C67.4597 151.444 66.6821 152.481 66.6821 154.166L68.043 282.67C68.043 285.003 66.9413 286.169 64.738 286.169H3.49935C1.16645 286.169 0 285.068 0 282.864V10.6925C0 8.48916 1.16645 7.38751 3.49935 7.38751H59.2946C60.5906 7.38751 61.5627 7.90594 62.2107 8.94278L157.082 151.639C157.989 152.935 159.221 153.388 160.776 152.999C162.461 152.481 163.303 151.379 163.303 149.694L161.942 10.6925C161.942 8.48916 163.044 7.38751 165.247 7.38751H226.68Z"
              fill="currentColor"
            />
            {/* 2. O */}
            <path
              d="M330.643 11.6645C348.269 3.88817 366.803 0 386.244 0C405.685 0 424.218 3.88817 441.845 11.6645C459.471 19.4408 474.7 29.8741 487.531 42.9643C500.362 56.0544 510.536 71.6719 518.053 89.8167C525.7 107.832 529.523 126.754 529.523 146.584C529.523 166.414 525.7 185.401 518.053 203.546C510.536 221.561 500.362 237.113 487.531 250.204C474.7 263.294 459.471 273.727 441.845 281.503C424.218 289.28 405.685 293.168 386.244 293.168C366.803 293.168 348.269 289.28 330.643 281.503C313.017 273.727 297.788 263.294 284.957 250.204C272.126 237.113 261.887 221.561 254.241 203.546C246.723 185.401 242.965 166.414 242.965 146.584C242.965 126.754 246.723 107.832 254.241 89.8167C261.887 71.6719 272.126 56.0544 284.957 42.9643C297.788 29.8741 313.017 19.4408 330.643 11.6645ZM330.837 203.157C346.131 218.839 364.6 226.68 386.244 226.68C407.888 226.68 426.357 218.839 441.65 203.157C456.944 187.475 464.59 168.617 464.59 146.584C464.59 124.551 456.944 105.693 441.65 90.0111C426.357 74.3288 407.888 66.4877 386.244 66.4877C364.6 66.4877 346.131 74.3288 330.837 90.0111C315.544 105.693 307.897 124.551 307.897 146.584C307.897 168.617 315.544 187.475 330.837 203.157Z"
              fill="currentColor"
            />
            {/* 3. T */}
            <path
              d="M704.685 7.19312C706.888 7.19312 707.99 8.29476 707.99 10.4981V68.043C707.99 70.2463 706.888 71.3479 704.685 71.3479H655.11C652.907 71.3479 651.805 72.5144 651.805 74.8473V282.864C651.805 285.068 650.639 286.169 648.306 286.169H584.151C581.818 286.169 580.652 285.068 580.652 282.864V74.8473C580.652 72.5144 579.55 71.3479 577.347 71.3479H527.384C525.181 71.3479 524.079 70.2463 524.079 68.043V10.4981C524.079 8.29476 525.181 7.19312 527.384 7.19312H704.685Z"
              fill="currentColor"
            />
            {/* 4. H */}
            <path
              d="M952.793 7.97076C953.7 7.97076 954.478 8.35958 955.126 9.13721C955.904 9.78524 956.292 10.5629 956.292 11.4701V283.253C956.292 284.16 955.904 285.003 955.126 285.78C954.478 286.428 953.7 286.752 952.793 286.752H888.638C887.731 286.752 886.888 286.428 886.111 285.78C885.463 285.003 885.139 284.16 885.139 283.253V180.994C885.139 180.087 884.75 179.309 883.972 178.661C883.324 177.884 882.547 177.495 881.639 177.495H802.126C799.793 177.495 798.627 178.597 798.627 180.8V283.253C798.627 284.16 798.303 285.003 797.655 285.78C797.007 286.428 796.164 286.752 795.128 286.752H731.167C730.26 286.752 729.418 286.428 728.64 285.78C727.992 285.003 727.668 284.16 727.668 283.253V11.4701C727.668 10.5629 727.992 9.78524 728.64 9.13721C729.418 8.35958 730.26 7.97076 731.167 7.97076H795.128C796.164 7.97076 797.007 8.35958 797.655 9.13721C798.303 9.78524 798.627 10.5629 798.627 11.4701V110.23C798.627 112.433 799.793 113.535 802.126 113.535H881.639C882.547 113.535 883.324 113.211 883.972 112.562C884.75 111.914 885.139 111.072 885.139 110.035V11.4701C885.139 10.5629 885.463 9.78524 886.111 9.13721C886.888 8.35958 887.731 7.97076 888.638 7.97076H952.793Z"
              fill="currentColor"
            />
            {/* 5. I */}
            <path
              d="M1043.58 7.58191C1044.62 7.58191 1045.46 7.97072 1046.11 8.74836C1046.76 9.39639 1047.08 10.174 1047.08 11.0813V282.864C1047.08 283.772 1046.76 284.614 1046.11 285.392C1045.46 286.04 1044.62 286.364 1043.58 286.364H979.62C978.713 286.364 977.871 286.04 977.093 285.392C976.445 284.614 976.121 283.772 976.121 282.864V11.0813C976.121 10.174 976.445 9.39639 977.093 8.74836C977.871 7.97072 978.713 7.58191 979.62 7.58191H1043.58Z"
              fill="currentColor"
            />
            {/* 6. N */}
            <path
              d="M1293.78 7.38751C1295.99 7.38751 1297.09 8.48916 1297.09 10.6925V282.864C1297.09 285.068 1295.99 286.169 1293.78 286.169H1237.21C1235.92 286.169 1235.01 285.716 1234.49 284.808L1140.01 152.222C1138.97 150.926 1137.67 150.537 1136.12 151.055C1134.56 151.444 1133.79 152.481 1133.79 154.166L1135.15 282.67C1135.15 285.003 1134.05 286.169 1131.84 286.169H1070.6C1068.27 286.169 1067.1 285.068 1067.1 282.864V10.6925C1067.1 8.48916 1068.27 7.38751 1070.6 7.38751H1126.4C1127.7 7.38751 1128.67 7.90594 1129.32 8.94278L1224.19 151.639C1225.09 152.935 1226.32 153.388 1227.88 152.999C1229.57 152.481 1230.41 151.379 1230.41 149.694L1229.05 10.6925C1229.05 8.48916 1230.15 7.38751 1232.35 7.38751H1293.78Z"
              fill="currentColor"
            />
            {/* 7. ' (APOSTROPHE) */}
            <path
              d="M1404.6 7C1405.64 7 1406.48 7.45362 1407.13 8.36086C1407.9 9.2681 1408.16 10.2401 1407.9 11.277L1361.44 120.923C1361.05 122.479 1359.95 123.256 1358.13 123.256H1316.14C1315.11 123.256 1314.2 122.867 1313.42 122.09C1312.77 121.183 1312.58 120.211 1312.84 119.174L1339.08 9.72172C1339.6 7.90724 1340.7 7 1342.39 7H1404.6Z"
              fill="currentColor"
              className="nothin-apos"
            />
          </svg>
        </div>

        {/* BOTTOM PERIMETER */}
        <div className="w-full flex items-center justify-between text-xs font-semibold tracking-wider pointer-events-auto">
          {/* Bottom-Left */}
          <div>Studio créatif à Paris</div>

          {/* Bottom-Right */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setIsHoverInteractive(true)}
                onMouseLeave={() => setIsHoverInteractive(false)}
                className="hover:opacity-60 transition-opacity"
              >
                LINKEDIN
              </a>
              <span>/</span>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setIsHoverInteractive(true)}
                onMouseLeave={() => setIsHoverInteractive(false)}
                className="hover:opacity-60 transition-opacity"
              >
                INSTAGRAM
              </a>
            </div>

            {/* Language toggle pill */}
            <div className="inline-flex items-center bg-black text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
              <span className="opacity-100">FR</span>
              <span className="mx-1 text-neutral-500">|</span>
              <span className="opacity-60 hover:opacity-100 cursor-pointer">ENG</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MAGNETIC FOLLOWER CURSOR (.cursor-work) */}
      <div
        className="pointer-events-none absolute z-50 rounded-full transition-transform duration-75 ease-out hidden md:flex items-center justify-center font-bold text-[9px] uppercase tracking-wider text-black bg-white"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHoverInteractive ? 1.6 : 0.4})`,
          width: "48px",
          height: "48px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        {isHoverInteractive && <span>&rarr;</span>}
      </div>
    </div>
  );
}

