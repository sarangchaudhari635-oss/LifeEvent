"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Exact Navier-Stokes GLSL shaders extracted from noth.in
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

void main() {
  float dye = texture2D(uDye, vUv).r;
  float raw  = dye * uRevealSize;
  float mask = smoothstep(uEdgeSoftness, uEdgeSoftness + uEdgeWidth, raw);
  mask = clamp(mask, 0.0, 1.0);

  // Electric Paytm Cyan & Deep Emergency Navy liquid swirl
  vec3 deepNavy = vec3(0.0, 0.09, 0.239); // #00173d
  vec3 brightCyan = vec3(0.0, 0.729, 0.949); // #00baf2
  vec3 liquidColor = mix(deepNavy, brightCyan, clamp(raw * 0.7, 0.0, 1.0));

  // Organic liquid caustic glow on edges
  float edgeGlow = smoothstep(0.1, 0.4, raw) * (1.0 - smoothstep(0.4, 0.9, raw));
  liquidColor += brightCyan * edgeGlow * 0.4;

  gl_FragColor = vec4(liquidColor, mask * 0.55);
}`;

interface DoubleFBO {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  swap: () => void;
}

export function LiquidFluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    let disposed = false;
    let rafId: number;

    // Simulation settings matching noth.in
    const settings = {
      simResolution: 128,
      dyeResolution: 512,
      velocityDissipation: 0.965,
      dyeDissipation: 0.985,
      pressureIterations: 20,
      curlStrength: 4.0,
      splatRadius: 0.00015,
      splatForce: 6200,
      revealSize: 3.5,
      edgeSoftness: 0.15,
      edgeWidth: 0.35,
    };

    const mouse = { x: 0.5, y: 0.5 };
    const prevMouse = { x: 0.5, y: 0.5 };
    let mouseHasMoved = false;

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

    // Helpers
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

    // Textures: Create procedural Base (transparent) and Reveal (Electric Cyan & Navy Liquid Core)
    const createRevealCanvasTexture = () => {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 1024;
      const ctx = c.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(512, 512, 50, 512, 512, 512);
        grad.addColorStop(0, "rgba(0, 186, 242, 0.95)"); // Paytm cyan
        grad.addColorStop(0.4, "rgba(0, 23, 61, 0.85)"); // Paytm navy
        grad.addColorStop(0.8, "rgba(10, 40, 95, 0.5)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    };

    const createBaseCanvasTexture = () => {
      const c = document.createElement("canvas");
      c.width = 1;
      c.height = 1;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 1, 1);
      }
      return new THREE.CanvasTexture(c);
    };

    const baseTexture = createBaseCanvasTexture();
    const revealTexture = createRevealCanvasTexture();

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

    // Resize handling
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

    // Event listeners
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseHasMoved = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouse.x = (t.clientX - rect.left) / rect.width;
      mouse.y = 1.0 - (t.clientY - rect.top) / rect.height;
      mouseHasMoved = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Initial splash splat to introduce the liquid effect
    setTimeout(() => {
      if (disposed) return;
      splatMat.uniforms.uTarget.value = velocity.read.texture;
      splatMat.uniforms.uAspectRatio.value = canvas.width / canvas.height;
      splatMat.uniforms.uPoint.value.set(0.5, 0.5);
      splatMat.uniforms.uColor.value.set(120, -120, 0);
      splatMat.uniforms.uRadius.value = 0.0004;
      renderPass(splatMat, velocity.write);
      velocity.swap();

      splatMat.uniforms.uTarget.value = dye.read.texture;
      splatMat.uniforms.uColor.value.set(1.0, 1.0, 1.0);
      renderPass(splatMat, dye.write);
      dye.swap();
    }, 600);

    // Main animation loop
    const step = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(step);

      const aspect = canvas.width / canvas.height;

      // Splat on mouse movement
      if (mouseHasMoved) {
        const dx = mouse.x - prevMouse.x;
        const dy = mouse.y - prevMouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq > 0.000001) {
          // Velocity splat
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

          // Dye splat
          splatMat.uniforms.uTarget.value = dye.read.texture;
          splatMat.uniforms.uColor.value.set(1.0, 1.0, 1.0);
          splatMat.uniforms.uRadius.value = settings.splatRadius * 1.5;
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

      // Velocity Advection
      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = velocity.read.texture;
      advectionMat.uniforms.uTexelSize.value = simTexelSize;
      advectionMat.uniforms.uDissipation.value = settings.velocityDissipation;
      renderPass(advectionMat, velocity.write);
      velocity.swap();

      // Dye Advection
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

      // Pressure Jacobi iterations
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

      // Render final composite reveal
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
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);

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
    <canvas
      ref={canvasRef}
      className="mask-reveal-canvas absolute inset-0 w-full h-full pointer-events-none z-10 opacity-90"
    />
  );
}
