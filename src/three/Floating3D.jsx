import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SHAPES = [
  { kind: "knot", color: "#8b5cf6", pos: [0, 0.1, 0], scale: 1, speed: 0.35 },
  { kind: "ico", color: "#2ee6d6", pos: [-2.1, 0.9, -0.6], scale: 0.62, speed: 0.6 },
  { kind: "torus", color: "#ff5fa2", pos: [2.1, -0.7, -0.4], scale: 0.62, speed: 0.5 },
  { kind: "octa", color: "#ffc53d", pos: [1.7, 1.25, -1], scale: 0.42, speed: 0.8 },
  { kind: "ico", color: "#ff5fa2", pos: [-1.6, -1.25, -0.8], scale: 0.34, speed: 0.9 },
];

function geometryFor(kind) {
  if (kind === "knot") return new THREE.TorusKnotGeometry(0.85, 0.28, 180, 24);
  if (kind === "ico") return new THREE.IcosahedronGeometry(1, 0);
  if (kind === "torus") return new THREE.TorusGeometry(0.85, 0.32, 24, 64);
  return new THREE.OctahedronGeometry(1, 0);
}

function Shape({ kind, color, pos, scale, speed, index, reduced }) {
  const ref = useRef();
  const geometry = useMemo(() => geometryFor(kind), [kind]);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.18,
        metalness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: new THREE.Color(color).multiplyScalar(0.18),
        flatShading: kind === "ico" || kind === "octa",
      }),
    [color, kind]
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material]
  );
  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const k = reduced ? 0 : 1;
    m.rotation.x += delta * speed * 0.6 * k;
    m.rotation.y += delta * speed * k;
    m.position.y = pos[1] + Math.sin(t * speed * 1.6 + index) * 0.18 * k;
  });
  return <mesh ref={ref} geometry={geometry} material={material} position={pos} scale={scale} />;
}

function Rig({ pointer }) {
  const group = useRef();
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = pointer.current;
    g.rotation.y += (p.x * 0.45 - g.rotation.y) * Math.min(delta * 3, 1);
    g.rotation.x += (-p.y * 0.3 - g.rotation.x) * Math.min(delta * 3, 1);
  });
  return (
    <group ref={group}>
      {SHAPES.map((s, i) => (
        <Shape key={i} index={i} {...s} reduced={pointer.current.reduced} />
      ))}
    </group>
  );
}

export default function Floating3D({ className = "", reduced = false }) {
  const wrap = useRef(null);
  const pointer = useRef({ x: 0, y: 0, reduced });
  const setFrameloop = useRef(null);
  pointer.current.reduced = reduced;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      pointer.current.y = Math.max(-1, Math.min(1, -(((e.clientY - r.top) / r.height) * 2 - 1)));
    };
    window.addEventListener("pointermove", move, { passive: true });
    const io = new IntersectionObserver(([entry]) => {
      if (setFrameloop.current) setFrameloop.current(entry.isIntersecting ? "always" : "never");
    });
    io.observe(el);
    return () => {
      window.removeEventListener("pointermove", move);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={(st) => {
          setFrameloop.current = st.setFrameloop;
        }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <pointLight position={[-4, 2, 3]} intensity={40} color="#2ee6d6" />
        <pointLight position={[4, -2, 3]} intensity={40} color="#ff5fa2" />
        <pointLight position={[0, 3, -3]} intensity={25} color="#8b5cf6" />
        <Rig pointer={pointer} />
      </Canvas>
    </div>
  );
}
