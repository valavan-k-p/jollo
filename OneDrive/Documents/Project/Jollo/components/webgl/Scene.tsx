"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import RouteController from "@/components/webgl/RouteController";

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
  float mySaturate(float x){ return clamp(x, 0.0, 1.0); }

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

    // Yellow/gold cosine palette for Jollo brand
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
    float NdV = mySaturate(dot(N,V));
    float NdL1 = mySaturate(dot(N,L1)), NdL2 = mySaturate(dot(N,L2)), NdL3 = mySaturate(dot(N,L3));
    float NdH1 = mySaturate(dot(N,H1)), NdH2 = mySaturate(dot(N,H2)), NdH3 = mySaturate(dot(N,H3));

    vec3 spec1 = (D_GGX(NdH1,rough)*G_Smith(NdV,NdL1,rough)*F_Schlick(mySaturate(dot(V,H1)),F0)) / max(4.*NdV*NdL1, 0.001);
    vec3 spec2 = (D_GGX(NdH2,rough)*G_Smith(NdV,NdL2,rough)*F_Schlick(mySaturate(dot(V,H2)),F0)) / max(4.*NdV*NdL2, 0.001);
    vec3 spec3 = (D_GGX(NdH3,rough)*G_Smith(NdV,NdL3,rough)*F_Schlick(mySaturate(dot(V,H3)),F0)) / max(4.*NdV*NdL3, 0.001);

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
    vec3 env = mix(vec3(0.01), mix(vec3(0.04,0.05,0.02), vec3(0.12,0.11,0.03), h), mySaturate(h*1.2));
    vec3 Fenv = F_Schlick(mySaturate(dot(N,V)), F0);
    vec3 envSpec = Fenv * env * (1.0 - rough) * 0.5;

    float rim = pow(1.0 - mySaturate(dot(N,V)), 2.5);
    vec3 rimCol = vec3(0.914, 0.902, 0.071) * rim * 0.4;
    vec3 glow = vec3(0.914, 0.902, 0.071) * abs(vDisp) * 0.3;

    vec3 color = direct + envSpec + rimCol + glow;
    color = clamp(color, 0.0, 4.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function Scene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, pointer } = useThree();

  const scale = useMemo(() => {
    return Math.min(viewport.width / 5, 1.5);
  }, [viewport.width]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScrollVelocity: { value: 0 },
    }),
    []
  );

  const targetRotation = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Update mouse tracking
      materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.x,
        (pointer.x + 1) / 2,
        0.08
      );
      materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.y,
        (pointer.y + 1) / 2,
        0.08
      );
    }

    if (!meshRef.current) return;

    // Follow cursor rotation slightly
    targetRotation.current.x = THREE.MathUtils.damp(
      targetRotation.current.x,
      (pointer.y * Math.PI) / 4,
      4,
      delta
    );
    targetRotation.current.y = THREE.MathUtils.damp(
      targetRotation.current.y,
      (pointer.x * Math.PI) / 4,
      4,
      delta
    );

    meshRef.current.rotation.x = targetRotation.current.x * 0.05;
    meshRef.current.rotation.y = targetRotation.current.y * 0.05;
  });

  return (
    <>
      <RouteController />
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1, 5]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
