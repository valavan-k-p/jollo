"use client";

import { useMemo, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import { ORB_VERT, ORB_FRAG, MOTE_VERT, MOTE_FRAG, GRADE_SHADER } from "./shaders";
import {
  buildAmount,
  maturityAmount,
  moteReveal,
  moteConverge,
  moteFade,
  orbFade,
  dockAmount,
  birthPulse,
  curve,
  easeInOutSine,
  COMPLETION,
} from "./chapters";

const GOLD = new THREE.Color("#e9e612");

/** The hero orb's radius. Same object, same scale. */
const ORB_RADIUS = 1.45;

/** How much of the mesh is mid-flight at any moment. */
const SPREAD = 0.2;

/** The hero orb's idle rotation rates, in rad/s. */
const HERO_SPIN_Y = 0.5;
const HERO_SPIN_X = 0.2;

export type Quality = "high" | "low";

type SceneProps = {
  progress: { current: number };
  quality: Quality;
};

/* ─── The orb ─────────────────────────────────────────────────────────────── */

function Orb({ progress, quality }: SceneProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const spin = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => {
    // Detail 4 = 5,120 shards: coarse enough that a single fragment reads as a
    // polygon in flight, fine enough that the hero's surface warp resolves
    // smoothly once maturity ramps in.
    const detail = quality === "high" ? 4 : 3;
    let geo: THREE.BufferGeometry = new THREE.IcosahedronGeometry(ORB_RADIUS, detail);
    if (geo.index) geo = geo.toNonIndexed();

    const pos = geo.attributes.position;
    const triCount = pos.count / 3;

    const centroid = new Float32Array(pos.count * 3);
    const scatter = new Float32Array(pos.count * 3);
    const axis = new Float32Array(pos.count * 3);
    const spinAttr = new Float32Array(pos.count);
    const birth = new Float32Array(pos.count);
    const rand = new Float32Array(pos.count);

    // Deterministic PRNG so the sequence is identical on every visit.
    let seed = 0x2f6e2b1;
    const rnd = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return ((seed >>> 0) % 100000) / 100000;
    };

    const raw = new Float32Array(triCount);
    const c = new THREE.Vector3();
    const centroids: THREE.Vector3[] = [];

    for (let t = 0; t < triCount; t++) {
      const i = t * 3;
      c.set(
        (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3,
        (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3,
        (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3
      );
      centroids.push(c.clone());

      // Mostly spatial, partly random: the orb crystallises in coherent
      // patches rather than as uniform static, but never in a visible band.
      const spatial =
        0.5 + 0.5 * Math.sin(c.x * 2.1) * Math.cos(c.y * 1.7) * Math.sin(c.z * 2.3);
      raw[t] = spatial * 0.62 + rnd() * 0.38;
    }

    // Rank-normalise birth order so shards land at a perfectly even rate.
    const order = Array.from({ length: triCount }, (_, i) => i);
    order.sort((a, b) => raw[a] - raw[b]);

    const dir = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const ax = new THREE.Vector3();

    for (let rank = 0; rank < triCount; rank++) {
      const t = order[rank];
      const i = t * 3;
      const cc = centroids[t];
      const b = triCount > 1 ? rank / (triCount - 1) : 0;

      dir.copy(cc).normalize();
      tangent
        .set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5)
        .normalize()
        .multiplyScalar(2.2 + rnd() * 3.2);
      const distance = 5.5 + rnd() * 6.5;
      const sx = dir.x * distance + tangent.x;
      const sy = dir.y * distance + tangent.y;
      const sz = dir.z * distance + tangent.z;

      ax.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize();
      const sp = 2.0 + rnd() * 5.0;
      const rv = rnd();

      for (let v = 0; v < 3; v++) {
        const k = (i + v) * 3;
        centroid[k] = cc.x;
        centroid[k + 1] = cc.y;
        centroid[k + 2] = cc.z;
        scatter[k] = sx;
        scatter[k + 1] = sy;
        scatter[k + 2] = sz;
        axis[k] = ax.x;
        axis[k + 1] = ax.y;
        axis[k + 2] = ax.z;
        spinAttr[i + v] = sp;
        birth[i + v] = b;
        rand[i + v] = rv;
      }
    }

    geo.setAttribute("aCentroid", new THREE.BufferAttribute(centroid, 3));
    geo.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    geo.setAttribute("aAxis", new THREE.BufferAttribute(axis, 3));
    geo.setAttribute("aSpin", new THREE.BufferAttribute(spinAttr, 1));
    geo.setAttribute("aBirth", new THREE.BufferAttribute(birth, 1));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return geo;
  }, [quality]);

  const uniforms = useMemo(
    () => ({
      uBuild: { value: 0 },
      uSpread: { value: SPREAD },
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uExpand: { value: 0 },
      uMaturity: { value: 0 },
      uFade: { value: 1 },
    }),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const p = progress.current;
    const mat = matRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh) return;

    const build = buildAmount(p);
    const maturity = maturityAmount(p);
    const pulse = birthPulse(p);
    const fade = orbFade(p);
    const dock = dockAmount(p);

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    // Range is 0 → 1+SPREAD so the last-ranked shard still completes.
    mat.uniforms.uBuild.value = build * (1 + SPREAD);
    mat.uniforms.uMaturity.value = maturity;
    mat.uniforms.uPulse.value = pulse;
    mat.uniforms.uFade.value = fade;
    // A slight condensing as it settles, not a dissolve.
    mat.uniforms.uExpand.value = -0.02 * dock;

    // Idle rotation accelerates toward the hero orb's exact rates. Integrated
    // rather than derived from elapsed time, so changing speed never jumps.
    const rate = 0.12 + (HERO_SPIN_Y - 0.12) * maturity;
    spin.current.y += delta * rate;
    spin.current.x += delta * (0.05 + (HERO_SPIN_X - 0.05) * maturity);
    mesh.rotation.set(spin.current.x, spin.current.y, 0);

    // The orb holds the centre of the frame. It settles very slightly as it
    // comes to rest, but it never moves off centre and never shrinks away —
    // it is the focal point of the closing chapter, not a footnote to it.
    // (An earlier version translated it downward to "make room" for the copy;
    // that pushed it to 67vh, straight behind the headline.)
    mesh.scale.setScalar(1 - dock * 0.15);
    mesh.position.y = 0;

    // Only blend when we need to; keeps depth honest the rest of the time.
    mat.depthWrite = fade > 0.98;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={ORB_VERT}
        fragmentShader={ORB_FRAG}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── The motes ───────────────────────────────────────────────────────────── */

function Motes({ progress, quality }: SceneProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const count = quality === "high" ? 1800 : 600;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const position = new Float32Array(count * 3);
    const start = new Float32Array(count * 3);
    const orbit = new Float32Array(count * 4);
    const rankAttr = new Float32Array(count);
    const scale = new Float32Array(count);

    let seed = 0x9e3779b;
    const rnd = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return ((seed >>> 0) % 100000) / 100000;
    };

    // Reveal order is shuffled so motes appear scattered across the field
    // rather than sweeping in from one side — except index 0, the first idea.
    const ranks = Array.from({ length: count }, (_, i) => (count > 1 ? i / (count - 1) : 0));
    for (let i = count - 1; i > 1; i--) {
      const j = 1 + Math.floor(rnd() * i);
      [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
    }
    ranks[0] = 0;

    for (let i = 0; i < count; i++) {
      const first = i === 0;

      if (first) {
        start[0] = 0;
        start[1] = 0;
        start[2] = 0.25;
      } else {
        const d = 9 + rnd() * 26;
        const theta = rnd() * Math.PI * 2;
        const phi = Math.acos(2 * rnd() - 1);
        start[i * 3] = Math.sin(phi) * Math.cos(theta) * d;
        start[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * d * 0.6;
        start[i * 3 + 2] = Math.cos(phi) * d;
      }

      orbit[i * 4] = first ? 0.28 : 2.1 + rnd() * 3.4;
      orbit[i * 4 + 1] = (rnd() * 0.16 + 0.05) * (rnd() > 0.5 ? 1 : -1);
      orbit[i * 4 + 2] = rnd() * Math.PI * 2;
      orbit[i * 4 + 3] = rnd() * Math.PI * 2;

      rankAttr[i] = ranks[i];
      scale[i] = first ? 3.4 : 0.45 + rnd() * 0.95;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
    geo.setAttribute("aOrbit", new THREE.BufferAttribute(orbit, 4));
    geo.setAttribute("aRank", new THREE.BufferAttribute(rankAttr, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);

    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uConverge: { value: 0 },
      uSize: { value: 5.5 },
      uPixelRatio: { value: 1 },
      uFade: { value: 1 },
      uGold: { value: GOLD },
    }),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    const p = progress.current;
    const mat = matRef.current;
    if (!mat) return;

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uReveal.value = moteReveal(p);
    mat.uniforms.uConverge.value = moteConverge(p);
    mat.uniforms.uPixelRatio.value = dpr;
    mat.uniforms.uFade.value = moteFade(p);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={MOTE_VERT}
        fragmentShader={MOTE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Camera ──────────────────────────────────────────────────────────────── */

function CameraRig({ progress }: { progress: { current: number } }) {
  const camera = useThree((s) => s.camera);

  useFrame((state) => {
    const p = progress.current;
    const t = state.clock.elapsedTime;

    // Long slow dolly in to the moment of completion, then easing back as the
    // orb docks and the page takes over.
    const dist = curve(p, [
      [0.0, 12.5],
      [0.3, 10.4],
      [0.55, 8.4],
      [COMPLETION, 6.2],
      [1.0, 6.6],
    ]);

    // A shallow arc — the orb is observed, never shown off.
    const az =
      -0.34 + easeInOutSine(Math.min(p / 0.95, 1)) * 0.78 + Math.sin(t * 0.06) * 0.03;
    const height =
      curve(p, [
        [0.0, 0.9],
        [0.5, 0.25],
        [1.0, -0.2],
      ]) + Math.sin(t * 0.11) * 0.08;

    camera.position.set(Math.sin(az) * dist * 0.34, height, Math.cos(az) * dist);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Post-processing ─────────────────────────────────────────────────────── */

/**
 * The hero's post chain. Bloom and grade both interpolate from a restrained
 * early state toward the homepage orb's exact settings, so the whole image —
 * not just the material — arrives at the hero's look by the final chapter.
 */
function Post({ progress }: { progress: { current: number } }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const { composer, bloom, grade } = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));

    const b = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.45, 0.55, 0.8);
    c.addPass(b);

    const g = new ShaderPass(GRADE_SHADER);
    c.addPass(g);

    return { composer: c, bloom: b, grade: g };
  }, [gl, scene, camera]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    composer.setSize(size.width, size.height);
    bloom.resolution.set(size.width, size.height);
    grade.uniforms.uResolution.value = [size.width, size.height];
  }, [composer, bloom, grade, size]);

  useEffect(() => () => composer.dispose(), [composer]);

  // Priority ≥ 1 takes the render loop away from R3F's default renderer.
  useFrame((state, delta) => {
    const p = progress.current;
    const maturity = maturityAmount(p);

    grade.uniforms.uTime.value = state.clock.elapsedTime;
    grade.uniforms.uMaturity.value = maturity;

    // Converges on the hero's bloom: strength 0.65, radius 0.35, threshold 0.88.
    bloom.strength = 0.45 + (0.65 - 0.45) * maturity + birthPulse(p) * 0.45;
    bloom.radius = 0.55 + (0.35 - 0.55) * maturity;
    bloom.threshold = 0.8 + (0.88 - 0.8) * maturity;

    composer.render(delta);
  }, 1);

  return null;
}

/* ─── Canvas ──────────────────────────────────────────────────────────────── */

export default function GenesisScene({
  progress,
  quality,
  active,
}: SceneProps & { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      gl={{
        antialias: quality === "high",
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0.9, 12.5], fov: 42, near: 0.1, far: 120 }}
    >
      <color attach="background" args={["#070707"]} />
      <CameraRig progress={progress} />
      <Motes progress={progress} quality={quality} />
      <Orb progress={progress} quality={quality} />
      {quality === "high" && <Post progress={progress} />}
    </Canvas>
  );
}
