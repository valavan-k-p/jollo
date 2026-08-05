/**
 * GLSL for the Genesis orb.
 *
 * The orb is a single non-indexed icosahedron: every triangle is independent,
 * so each can be flown in from deep space and locked into place on its own
 * schedule. `aBirth` is rank-normalised on the CPU, which keeps the build rate
 * perfectly even — no clumping, no stalls, no seams in the assembly.
 *
 * Crucially, the *surface* is not its own invention. Displacement and shading
 * both come from `goldDNA`, the hero orb's material language. The only thing
 * that separates this orb from the homepage orb is `uMaturity`: at 0 it is an
 * unformed geometric shell, at 1 it is running the hero's exact maths.
 */

import {
  NOISE_GLSL,
  SURFACE_WARP_GLSL,
  PBR_GLSL,
  GOLD_SURFACE_GLSL,
} from "@/components/3d/goldDNA";

export const ORB_VERT = /* glsl */ `
  ${NOISE_GLSL}
  ${SURFACE_WARP_GLSL}

  uniform float uBuild;     // 0 → 1+uSpread, drives the whole assembly
  uniform float uSpread;    // how many triangles are mid-flight at once
  uniform float uTime;
  uniform float uPulse;     // the single birth pulse
  uniform float uExpand;    // late outward drift
  uniform float uMaturity;  // 0 unformed → 1 the hero orb

  attribute vec3  aCentroid;
  attribute vec3  aScatter;
  attribute vec3  aAxis;
  attribute float aSpin;
  attribute float aBirth;
  attribute float aRand;

  varying vec3  vWorldPos;
  varying vec2  vUv;
  varying float vForm;
  varying float vFacet;
  varying float vDisp;

  vec3 rotateAxis(vec3 v, vec3 axis, float angle){
    float c = cos(angle);
    float s = sin(angle);
    return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
  }

  void main(){
    vUv = uv;

    // This triangle's own 0→1 formation progress.
    float t = clamp((uBuild - aBirth) / max(uSpread, 0.0001), 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 3.0);   // easeOutCubic — arrives, never bounces
    vForm  = e;
    vFacet = aRand;

    // The hero's surface warp, evaluated in object space so neighbouring
    // triangles stay watertight. Scaled by maturity: a young orb is a clean
    // geometric shell, a mature one carries the homepage orb's skin.
    float disp = jolloWarp(position, uTime, uMaturity);
    vDisp = disp;

    vec3 surfaceN = normalize(position);
    vec3 formed = position + surfaceN * disp;

    // Shards read as recognisable polygons in flight, then shrink to fit
    // exactly as they lock in.
    vec3 rel = formed - aCentroid;
    rel *= mix(2.6, 1.0, e);
    rel = rotateAxis(rel, aAxis, aSpin * (1.0 - e));

    vec3 pos = aCentroid + rel + aScatter * (1.0 - e);

    vec3 n = normalize(aCentroid);

    // Micro breathing while young; the mature orb gets its life from the warp.
    float breathe = sin(uTime * 0.55 + aCentroid.y * 2.2 + aCentroid.x * 1.3) * 0.014;
    pos += n * breathe * (1.0 - uMaturity * 0.6) * e;

    pos += n * (uPulse * 0.15 + uExpand) * e;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const ORB_FRAG = /* glsl */ `
  precision highp float;

  ${PBR_GLSL}
  ${GOLD_SURFACE_GLSL}

  varying vec3  vWorldPos;
  varying vec2  vUv;
  varying float vForm;
  varying float vFacet;
  varying float vDisp;

  uniform float uTime;
  uniform float uFade;
  uniform float uPulse;
  uniform float uMaturity;

  void main(){
    // Derivative normals — the same technique the hero uses. Early on the
    // surface is undisplaced, so these resolve to crisp facet normals; as the
    // warp fades in they become the hero's organic normals. One code path,
    // and the transition falls out of the geometry rather than a style switch.
    vec3 N = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
    vec3 V = normalize(cameraPosition - vWorldPos);
    if (dot(N, V) < 0.0) N = -N;   // shards arrive at arbitrary angles

    vec3 col = jolloGoldSurface(N, V, vWorldPos, vUv, vDisp, uTime, uMaturity);

    // Per-facet tone variation, strongest while the orb is still raw stone.
    col *= mix(0.82 + 0.30 * vFacet, 1.0, uMaturity);

    // The rim blooms on the birth pulse.
    float NdV = saturate(dot(N, V));
    col += JOLLO_GOLD * pow(1.0 - NdV, 2.5) * uPulse * 0.85;

    // A shard flares as it locks into place, then settles.
    float flare = smoothstep(1.0, 0.55, vForm);
    col += vec3(1.0, 0.95, 0.78) * flare * 0.30;

    // Opaque almost immediately after birth so depth sorting stays honest.
    float alpha = smoothstep(0.0, 0.12, vForm) * uFade;
    if (alpha < 0.02) discard;

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ─── Motes ───────────────────────────────────────────────────────────────── */

export const MOTE_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;    // fraction of the field that has appeared
  uniform float uConverge;  // 0 = deep space, 1 = in orbit
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3  aStart;
  attribute vec4  aOrbit;   // x radius, y speed, z phase, w inclination
  attribute float aRank;    // reveal order, 0 → 1
  attribute float aScale;

  varying float vAlpha;
  varying float vGlow;

  void main(){
    float vis = smoothstep(aRank, aRank + 0.05, uReveal);

    float ang = aOrbit.z + uTime * aOrbit.y;
    float r   = aOrbit.x;
    vec3 home = vec3(
      cos(ang) * r,
      sin(ang * 0.7 + aOrbit.w) * r * 0.42,
      sin(ang) * r
    );
    home.y += sin(uTime * 0.5 + aOrbit.z * 3.0) * 0.12;

    float c = 1.0 - pow(1.0 - uConverge, 3.0);
    vec3 pos = mix(aStart, home, c);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mv.z;

    float size = uSize * aScale * uPixelRatio * (14.0 / max(dist, 0.001));

    // The first idea breathes on its own.
    if (aRank < 0.0001) {
      size *= 1.0 + 0.22 * sin(uTime * 1.15);
    }

    // Cheap depth of field: off-plane motes grow softer and dimmer.
    float defocus = clamp(abs(dist - 7.5) / 8.0, 0.0, 1.0);
    size *= 1.0 + defocus * 1.7;
    vGlow = 1.0 - defocus * 0.6;

    gl_PointSize = size;
    vAlpha = vis;
    gl_Position = projectionMatrix * mv;
  }
`;

export const MOTE_FRAG = /* glsl */ `
  precision highp float;

  varying float vAlpha;
  varying float vGlow;

  uniform vec3  uGold;
  uniform float uFade;

  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = exp(-d * d * 15.0) * smoothstep(0.5, 0.34, d);
    float alpha = a * vAlpha * vGlow * uFade;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(uGold * (0.70 + vGlow * 0.55), alpha);
  }
`;

/* ─── Final grade pass ────────────────────────────────────────────────────── */

/**
 * The hero's cinematic pass. Its two most recognisable signatures — radial
 * chromatic aberration and the warm/cool channel shift — are held back while
 * the orb is raw and ramp in with maturity, so the *grade itself* converges on
 * the homepage look alongside the material.
 */
export const GRADE_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uMaturity: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2  uResolution;
    uniform float uMaturity;

    float rand(vec2 co){
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    vec3 aces(vec3 x){
      float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }

    void main(){
      vec2 p = vUv - 0.5;
      float dist = length(p);
      vec2 dir = normalize(p + 1e-6);

      // Hero aberration strength is 0.0015; fade it in with maturity.
      vec2 off = dir * 0.0015 * dist * uMaturity;

      float r = texture2D(tDiffuse, vUv + off).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - off).b;
      vec3 col = vec3(r, g, b);

      col += (rand(vUv * uResolution + uTime * 60.0) - 0.5) * 0.016;

      col.r += 0.015 * uMaturity;
      col.b -= 0.010 * uMaturity;

      col = (col - 0.5) * 1.06 + 0.5;

      col *= mix(1.0, smoothstep(0.85, 0.25, dist), 0.38);

      col = aces(col);
      col = pow(col, vec3(1.0 / 2.2));

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
