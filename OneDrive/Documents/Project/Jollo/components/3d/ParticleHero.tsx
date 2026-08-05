"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const SPHERE_N = 3000;
const AMBIENT_N = 800;

export default function ParticleHero({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 4.8;

    // ── Yellow sphere particles (Fibonacci — evenly distributed on surface) ──
    const sPos = new Float32Array(SPHERE_N * 3);
    const sScale = new Float32Array(SPHERE_N);

    for (let i = 0; i < SPHERE_N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / SPHERE_N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.0 + (Math.random() - 0.5) * 0.4;
      sPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      sPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sPos[i * 3 + 2] = r * Math.cos(phi);
      sScale[i] = 0.2 + Math.random() * 0.8;
    }

    const geoSphere = new THREE.BufferGeometry();
    geoSphere.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    geoSphere.setAttribute("aScale",   new THREE.BufferAttribute(sScale, 1));

    const matSphere = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 2.2 * renderer.getPixelRatio() },
      },
      vertexShader: /* glsl */`
        attribute float aScale;
        uniform float uTime;
        uniform float uSize;
        void main() {
          vec3 p = position;
          float t = uTime * 0.16;
          p.x += sin(t + position.y * 1.8) * 0.05;
          p.y += cos(t + position.x * 1.8) * 0.05;
          p.z += sin(t * 0.7 + position.z * 2.0) * 0.04;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * aScale * (240.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float a = 1.0 - smoothstep(0.38, 0.5, d);
          if (a < 0.01) discard;
          // Pure yellow — low opacity keeps additive blend yellow, not white
          gl_FragColor = vec4(0.914, 0.902, 0.071, a * 0.38);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const ptsSphere = new THREE.Points(geoSphere, matSphere);
    scene.add(ptsSphere);

    // ── Sparse ambient bokeh — dim, stays out of center ──────────────────────
    const aPos = new Float32Array(AMBIENT_N * 3);
    const aScale = new Float32Array(AMBIENT_N);
    for (let i = 0; i < AMBIENT_N; i++) {
      aPos[i * 3]     = (Math.random() - 0.5) * 16;
      aPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      aPos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2;
      aScale[i] = Math.random();
    }

    const geoAmbient = new THREE.BufferGeometry();
    geoAmbient.setAttribute("position", new THREE.BufferAttribute(aPos, 3));
    geoAmbient.setAttribute("aScale",   new THREE.BufferAttribute(aScale, 1));

    const matAmbient = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uSize: { value: 1.2 * renderer.getPixelRatio() } },
      vertexShader: /* glsl */`
        attribute float aScale;
        uniform float uTime;
        uniform float uSize;
        void main() {
          vec3 p = position;
          p.x += cos(uTime * 0.07 + position.z) * 0.03;
          p.y += sin(uTime * 0.07 + position.x) * 0.03;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * aScale * (160.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float a = 1.0 - smoothstep(0.3, 0.5, d);
          if (a < 0.01) discard;
          gl_FragColor = vec4(1.0, 1.0, 1.0, a * 0.10);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const ptsAmbient = new THREE.Points(geoAmbient, matAmbient);
    scene.add(ptsAmbient);

    // ── Mouse parallax ────────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const camLerp = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 1.4;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const startMs = performance.now();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - startMs) / 1000;
      matSphere.uniforms.uTime.value  = t;
      matAmbient.uniforms.uTime.value = t;

      camLerp.x += (mouse.x * 0.12 - camLerp.x) * 0.04;
      camLerp.y += (mouse.y * 0.08 - camLerp.y) * 0.04;
      camera.rotation.y = camLerp.x;
      camera.rotation.x = camLerp.y;

      ptsSphere.rotation.y += 0.0006;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      geoSphere.dispose();  matSphere.dispose();
      geoAmbient.dispose(); matAmbient.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
