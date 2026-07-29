import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * Stylized abstract "mannequin" — lathe geometry forms a torso silhouette,
 * wrapped in slowly-rotating gold thread rings. Reads as a tailoring bust.
 */
function MannequinBust() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  // Silhouette curve: neck -> shoulders -> chest -> waist -> hem
  const points = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const profile: [number, number][] = [
      [0.0, 2.2], [0.35, 2.15], [0.42, 2.0],
      [0.55, 1.85], [0.95, 1.7], [1.1, 1.55],
      [1.15, 1.3], [1.12, 1.0], [1.05, 0.6],
      [1.0, 0.2], [0.95, -0.2], [0.9, -0.6],
      [0.85, -1.0], [0.7, -1.3], [0.5, -1.45], [0.0, -1.5],
    ];
    for (const [x, y] of profile) pts.push(new THREE.Vector2(x, y));
    return pts;
  }, []);

  useFrame((_, dt) => {
    if (groupRef.current) {
      // Auto-rotate + mouse parallax
      groupRef.current.rotation.y += dt * 0.12;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * -0.12,
        0.05,
      );
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        pointer.x * 0.15,
        0.05,
      );
    }
    if (ring1.current) ring1.current.rotation.z += dt * 0.4;
    if (ring2.current) ring2.current.rotation.x += dt * 0.3;
    if (ring3.current) {
      ring3.current.rotation.y += dt * 0.5;
      ring3.current.rotation.x += dt * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Bust */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[points, 96]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          metalness={0.35}
          roughness={0.42}
          clearcoat={0.6}
          clearcoatRoughness={0.35}
          sheen={0.6}
          sheenColor={"#3a2a12"}
        />
      </mesh>

      {/* Neck cap detail */}
      <mesh position={[0, 2.25, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.08, 48]} />
        <meshPhysicalMaterial color="#c9a84c" metalness={1} roughness={0.25} />
      </mesh>

      {/* Gold measuring rings orbiting */}
      <mesh ref={ring1} position={[0, 0.4, 0]}>
        <torusGeometry args={[1.45, 0.008, 16, 128]} />
        <meshStandardMaterial color="#e8c977" metalness={1} roughness={0.2} emissive="#c9a84c" emissiveIntensity={0.25} />
      </mesh>
      <mesh ref={ring2} position={[0, 1.1, 0]}>
        <torusGeometry args={[1.25, 0.007, 16, 128]} />
        <meshStandardMaterial color="#e8c977" metalness={1} roughness={0.25} emissive="#c9a84c" emissiveIntensity={0.2} />
      </mesh>
      <mesh ref={ring3} position={[0, -0.5, 0]}>
        <torusGeometry args={[1.35, 0.007, 16, 128]} />
        <meshStandardMaterial color="#e8c977" metalness={1} roughness={0.25} emissive="#c9a84c" emissiveIntensity={0.2} />
      </mesh>

      {/* Pedestal */}
      <mesh position={[0, -1.7, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 12]} />
        <meshStandardMaterial color="#c9a84c" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.95, 0]}>
        <cylinderGeometry args={[0.9, 1.0, 0.1, 48]} />
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.9} roughness={0.25} clearcoat={1} />
      </mesh>
    </group>
  );
}

function VolumetricLight() {
  return (
    <>
      <spotLight
        position={[3, 6, 3]}
        angle={0.35}
        penumbra={0.9}
        intensity={45}
        distance={20}
        color="#f0d78c"
        castShadow
      />
      <spotLight
        position={[-4, 4, -2]}
        angle={0.4}
        penumbra={1}
        intensity={18}
        distance={15}
        color="#c9a84c"
      />
      <ambientLight intensity={0.08} color="#c9a84c" />
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.4, 5.2], fov: 38 }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 6, 14]} />

      <VolumetricLight />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
        <MannequinBust />
      </Float>

      <Sparkles
        count={140}
        scale={[6, 8, 4]}
        size={2}
        speed={0.25}
        opacity={0.55}
        color="#f0d78c"
      />
      <Sparkles
        count={60}
        scale={[10, 6, 6]}
        size={4}
        speed={0.1}
        opacity={0.2}
        color="#c9a84c"
      />

      <Environment preset="warehouse" environmentIntensity={0.35} />
    </Canvas>
  );
}
