"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { onScrollRealigned } from "@/lib/scroll";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

/* ─── Simplex noise GLSL (Ashima) ────────────────────────────────────────── */
const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.,i1.z,i2.z,1.))
      +i.y+vec4(0.,i1.y,i2.y,1.))
      +i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float fbm(vec3 p){float v=0.;float a=.5;for(int i=0;i<5;i++){v+=a*snoise(p);p*=2.;a*=.5;}return v;}
`;

/* ─── Vertex shader ──────────────────────────────────────────────────────── */
const VERT = /* glsl */ `
  ${NOISE_GLSL}
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vDisp;
  uniform float uTime;
  uniform float uScrollVelocity;

  void main(){
    vUv = uv;
    vec3 pos = position;
    vec3 p = pos * 1.1;
    float t = uTime * 0.22;
    float warp = fbm(p + vec3(t, -t, t*0.5)) * 0.3
               + snoise(p*2.0 + vec3(-t*0.7, t*0.9, t*0.2)) * 0.12;
    float ridge = max(0.0, 1.0 - abs(snoise(p * 1.5)));
    float disp = warp + ridge * 0.15;
    vDisp = disp;

    float twist = uScrollVelocity * 0.5;
    float angle = pos.y * twist;
    mat2 R = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    pos.xz = R * pos.xz;
    pos += normal * disp;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorldPos = world.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/* ─── Fragment shader ────────────────────────────────────────────────────── */
const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vDisp;
  uniform float uTime;
  uniform vec2  uMouse;

  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b * cos(6.28318 * (c * t + d));
  }
  float saturate(float x){ return clamp(x, 0.0, 1.0); }

  vec3 normalFromDerivatives(vec3 p){
    return normalize(cross(dFdx(p), dFdy(p)));
  }
  vec3 F_Schlick(float cosT, vec3 F0){
    return F0 + (1.0 - F0) * pow(1.0 - cosT, 5.0);
  }
  float D_GGX(float NdH, float r){
    float a2 = r*r*r*r;
    float d = (NdH*NdH)*(a2 - 1.0) + 1.0;
    return a2 / (3.14159 * d * d);
  }
  float G_Smith(float NdV, float NdL, float r){
    float k = ((r+1.0)*(r+1.0)) / 8.0;
    float g1 = NdV / (NdV*(1.0-k)+k);
    float g2 = NdL / (NdL*(1.0-k)+k);
    return g1 * g2;
  }

  void main(){
    vec3 N = normalFromDerivatives(vWorldPos);
    vec3 V = normalize(cameraPosition - vWorldPos);
    float t = uTime * 0.55;

    vec3 L1 = normalize(vec3(6.*sin(t*.7), 4., 6.*cos(t*.7)) - vWorldPos);
    vec3 L2 = normalize(vec3(-5.*cos(t*.5), -3., 5.*sin(t*.45)) - vWorldPos);
    vec3 L3 = normalize(vec3(0., 6.*sin(t*.25), -6.) - vWorldPos);

    float gp = sin(vUv.x*2.5+uTime*0.2)*0.3 + cos(vUv.y*3.0-uTime*0.15)*0.2 + 0.5 + vDisp*0.5;

    vec3 baseAlbedo = cosPalette(gp,
      vec3(0.58, 0.56, 0.08),
      vec3(0.42, 0.40, 0.08),
      vec3(0.90, 0.85, 0.30),
      vec3(0.00, 0.10, 0.20)
    );

    float metallic = 0.35 + 0.15*sin(uTime*0.2 + gp*3.0);
    float rough = clamp(0.18 + 0.12*sin(gp*6.283 + uTime*0.35), 0.06, 0.5);
    vec3 F0 = mix(vec3(0.04), baseAlbedo, metallic);

    vec3 H1 = normalize(V+L1), H2 = normalize(V+L2), H3 = normalize(V+L3);
    float NdV = saturate(dot(N,V));
    float NdL1 = saturate(dot(N,L1)), NdL2 = saturate(dot(N,L2)), NdL3 = saturate(dot(N,L3));
    float NdH1 = saturate(dot(N,H1)), NdH2 = saturate(dot(N,H2)), NdH3 = saturate(dot(N,H3));

    vec3 spec1 = (D_GGX(NdH1,rough)*G_Smith(NdV,NdL1,rough)*F_Schlick(saturate(dot(V,H1)),F0)) / max(4.*NdV*NdL1, 0.001);
    vec3 spec2 = (D_GGX(NdH2,rough)*G_Smith(NdV,NdL2,rough)*F_Schlick(saturate(dot(V,H2)),F0)) / max(4.*NdV*NdL2, 0.001);
    vec3 spec3 = (D_GGX(NdH3,rough)*G_Smith(NdV,NdL3,rough)*F_Schlick(saturate(dot(V,H3)),F0)) / max(4.*NdV*NdL3, 0.001);

    vec3 kS = F_Schlick(NdV, F0);
    vec3 kD = (vec3(1.0) - kS) * (1.0 - metallic);
    vec3 diffuse = baseAlbedo / 3.14159;

    vec3 c1 = vec3(1.0, 0.98, 0.9);
    vec3 c2 = vec3(0.914, 0.902, 0.071);
    vec3 c3 = vec3(1.0, 0.85, 0.4);

    vec3 direct =
      (kD*diffuse + spec1) * c1 * NdL1 * 0.9 +
      (kD*diffuse + spec2) * c2 * NdL2 * 0.65 +
      (kD*diffuse + spec3) * c3 * NdL3 * 0.5;

    vec3 R = reflect(-V, N);
    float h = R.y * 0.5 + 0.5;
    vec3 env = mix(vec3(0.01), mix(vec3(0.04,0.05,0.02), vec3(0.12,0.11,0.03), h), saturate(h*1.2));
    vec3 Fenv = F_Schlick(saturate(dot(N,V)), F0);
    vec3 envSpec = Fenv * env * (1.0 - rough) * 0.5;

    float rim = pow(1.0 - saturate(dot(N,V)), 2.5);
    vec3 rimCol = vec3(0.914, 0.902, 0.071) * rim * 0.4;
    vec3 glow = vec3(0.914, 0.902, 0.071) * abs(vDisp) * 0.3;

    vec3 color = direct + envSpec + rimCol + glow;
    color = clamp(color, 0.0, 4.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

/* ─── Cinematic post-processing pass ─────────────────────────────────────── */
const CINE_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uResolution;

    float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
    vec3 aces(vec3 x){
      float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
      return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.,1.);
    }
    void main(){
      vec2 p = vUv - 0.5;
      float dist = length(p);
      vec2 dir = normalize(p + 1e-6);
      vec2 off = dir * 0.0015 * dist;

      float r = texture2D(tDiffuse, vUv + off).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - off).b;
      vec3 col = vec3(r, g, b);

      float n = rand(vUv * uResolution + uTime * 60.0) - 0.5;
      col += n * 0.016;

      col.r += 0.015;
      col.b -= 0.01;

      col = (col - 0.5) * 1.06 + 0.5;

      float vig = smoothstep(0.85, 0.25, dist);
      col *= mix(1.0, vig, 0.38);

      float a = texture2D(tDiffuse, vUv).a;

      col = aces(col);
      col = pow(col, vec3(1.0/2.2));

      col = mix(vec3(0.0), col, a);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

/* ─── Exclamation body shaders ───────────────────────────────────────────── */
const EXCL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EXCL_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uReveal;
  uniform float uTime;

  void main(){
    vec2 uv = vUv;

    // Tapered shape: width matches dot proportions
    float halfWidth = mix(0.04, 0.22, pow(uv.y, 0.55));
    float xDist = abs(uv.x - 0.5);

    // Rounded-rectangle SDF for clean shape with rounded ends
    float capRadius = halfWidth;
    float py = clamp(uv.y, capRadius, 1.0 - capRadius);
    float d = length(vec2(xDist, uv.y - py)) - capRadius;
    float shape = 1.0 - smoothstep(-0.008, 0.008, d);

    // Reveal from bottom to top (driven by scroll)
    float reveal = smoothstep(0.0, 0.06, uReveal - (1.0 - uv.y));
    shape *= reveal;

    if(shape < 0.01) discard;

    // Solid yellow — kept below bloom threshold to avoid glow blowout
    vec3 color = vec3(0.914, 0.902, 0.071) * 0.75;

    gl_FragColor = vec4(color, shape);
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
const EXCL_X = -1.0;

export default function CinematicOrb({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Scene ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // ── Morphing orb (the dot of the exclamation mark) ────────────────────
    const geo = new THREE.IcosahedronGeometry(1.45, 5);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uScrollVelocity: { value: 0 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // ── Exclamation body ──────────────────────────────────────────────────
    const exclGeo = new THREE.PlaneGeometry(1.0, 2.2);
    const exclMat = new THREE.ShaderMaterial({
      uniforms: {
        uReveal: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: EXCL_VERT,
      fragmentShader: EXCL_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const exclMesh = new THREE.Mesh(exclGeo, exclMat);
    exclMesh.position.set(EXCL_X, 0.3, -0.05);
    scene.add(exclMesh);

    // ── Post-processing ───────────────────────────────────────────────────
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.65, 0.35, 0.88
    );
    composer.addPass(bloom);

    const cinePass = new ShaderPass(CINE_SHADER);
    cinePass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    composer.addPass(cinePass);

    // ── Mouse ─────────────────────────────────────────────────────────────
    const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // ── Scroll-driven animation state ─────────────────────────────────────
    const anim = { scale: 1, posX: 0, posY: 0, reveal: 0, velocity: 0 };

    const DOT_Y = -1.15;
    /** Scroll distance over which the orb docks into the logo mark. */
    const DOCK_DISTANCE = 500;

    /**
     * Docking progress at a given scroll offset — a pure function of the page
     * position, holding no state of its own.
     *
     * This was previously a GSAP timeline driven by ScrollTrigger. The problem
     * was never the animation, it was the *cache*: ScrollTrigger keeps its own
     * copy of the progress, that cache outlived every client-side navigation,
     * and `refresh()` does not clear it. So arriving on the homepage from a
     * scrolled page left the orb fully docked over a page sitting at the top —
     * exclamation body and watermark already revealed.
     *
     * Reading the live scroll position every frame makes that whole class of
     * bug impossible: there is no stored progress left to go stale.
     */
    const dockProgressAt = (scrollY: number) =>
      THREE.MathUtils.clamp(scrollY / DOCK_DISTANCE, 0, 1);

    const applyDock = (p: number) => {
      anim.scale = 1 + (0.12 - 1) * p;
      anim.posX = EXCL_X * p;
      anim.posY = DOT_Y * p;
      anim.reveal = p;
    };

    let dockEased = dockProgressAt(window.scrollY);
    let lastScrollY = window.scrollY;
    let lastFrameMs = performance.now();
    applyDock(dockEased);

    /**
     * Snap straight to the position the page is at, skipping the easing.
     * Used when navigation moves the page under us, so the orb is already
     * correct on the first painted frame rather than gliding into place.
     */
    const realignToScroll = () => {
      dockEased = dockProgressAt(window.scrollY);
      applyDock(dockEased);
      lastScrollY = window.scrollY;
      anim.velocity = 0;
      if (logoRef.current) {
        const opacity = Math.min(1, Math.max(0, (anim.reveal - 0.3) / 0.7));
        logoRef.current.style.opacity = String(opacity);
      }
    };
    const unsubscribeRealign = onScrollRealigned(realignToScroll);

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      cinePass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────────
    const startMs = performance.now();
    let raf = 0;
    let dockedLowRes = false;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const nowMs = performance.now();
      const t = (nowMs - startMs) / 1000;

      // Scroll → docking, recomputed from the live page position every frame.
      // Frame-rate independent easing, tuned to the feel of the 0.6s scrub this
      // replaced. Because nothing is cached, a route change cannot desync it.
      const dt = Math.min(0.05, (nowMs - lastFrameMs) / 1000);
      lastFrameMs = nowMs;
      const scrollY = window.scrollY;
      dockEased += (dockProgressAt(scrollY) - dockEased) * (1 - Math.exp(-dt / 0.18));
      applyDock(dockEased);

      // Scroll velocity, which warps the orb's surface. Eases back to zero on
      // its own once the page stops moving.
      const rawVelocity = THREE.MathUtils.clamp((scrollY - lastScrollY) * 0.008, -1, 1);
      lastScrollY = scrollY;
      anim.velocity += (rawVelocity - anim.velocity) * 0.2;

      // Once the orb has shrunk to its permanent corner-mark size, the full
      // multi-pass bloom pipeline is being computed across the entire
      // viewport for a few visible pixels. Drop resolution here — it's
      // visually identical at that size but far cheaper per frame, which
      // matters since this canvas keeps rendering on every route (e.g. the
      // Work page's own scroll-physics loop competes for the same frame).
      const shouldBeLowRes = anim.scale < 0.15;
      if (shouldBeLowRes !== dockedLowRes) {
        dockedLowRes = shouldBeLowRes;
        const ratio = dockedLowRes ? 1 : Math.min(window.devicePixelRatio, 2);
        renderer.setPixelRatio(ratio);
        composer.setSize(window.innerWidth, window.innerHeight);
        cinePass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      }

      // Smooth mouse
      mouse.sx += (mouse.x - mouse.sx) * 0.08;
      mouse.sy += (mouse.y - mouse.sy) * 0.08;

      // Orb uniforms
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.set(mouse.sx, mouse.sy);
      mat.uniforms.uScrollVelocity.value = anim.velocity;

      // Scroll-driven scale & position
      mesh.scale.setScalar(anim.scale);
      mesh.position.x = anim.posX;
      mesh.position.y = anim.posY;

      // Continuous scroll-driven rotation + idle spin
      const shrinkProgress = 1 - anim.scale;
      mesh.rotation.y = shrinkProgress * Math.PI * 4.0 + t * 0.5;
      mesh.rotation.x = shrinkProgress * Math.PI * 0.5 + t * 0.2;

      // Idle breathing only when orb is large
      if (Math.abs(anim.velocity) < 0.01 && anim.scale > 0.85) {
        mesh.position.y += Math.sin(t * 0.45) * 0.06;
      }

      // Exclamation body uniforms
      exclMat.uniforms.uReveal.value = anim.reveal;
      exclMat.uniforms.uTime.value = t;

      // Logo fades in as exclamation forms
      if (logoRef.current) {
        const logoOpacity = Math.min(1.0, Math.max(0, (anim.reveal - 0.3) / 0.7));
        logoRef.current.style.opacity = String(logoOpacity);
      }

      bloom.strength = 0.65;

      cinePass.uniforms.uTime.value = t;
      composer.render();
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      unsubscribeRealign();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      exclGeo.dispose();
      exclMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Cropped logo (without !) appears to the right of the exclamation mark */}
      <img
        ref={logoRef}
        src="/images/cropped-logo.png"
        alt=""
        className="fixed pointer-events-none"
        style={{
          opacity: 0,
          left: "calc(50% - 8vw)",
          top: "50%",
          transform: "translateY(-50%)",
          height: "clamp(240px, 68vh, 720px)",
          width: "auto",
        }}
      />
    </div>
  );
}
