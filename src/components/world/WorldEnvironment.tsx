"use client";

function Building({
  position,
  color,
  roofColor,
  height = 5,
}: {
  position: [number, number, number];
  color: string;
  roofColor: string;
  height?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, height, 7]} />
        <meshStandardMaterial color={color} roughness={0.92} />
      </mesh>
      <mesh position={[0, height + 0.16, 0]} castShadow>
        <boxGeometry args={[8.35, 0.32, 7.35]} />
        <meshStandardMaterial color={roofColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.55, 3.54]}>
        <boxGeometry args={[1.25, 2.25, 0.06]} />
        <meshStandardMaterial color="#70513d" roughness={0.85} />
      </mesh>
      {[-2.5, 2.5].map((x) => (
        <group key={x} position={[x, 2.45, 3.56]}>
          <mesh>
            <boxGeometry args={[1.25, 1.35, 0.05]} />
            <meshStandardMaterial color="#d3e3d2" roughness={0.6} />
          </mesh>
          <mesh>
            <boxGeometry args={[1.38, 0.09, 0.12]} />
            <meshStandardMaterial color="#70513d" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 3.4, 8]} />
        <meshStandardMaterial color="#40574d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.45, 0]}>
        <boxGeometry args={[0.62, 0.16, 0.36]} />
        <meshStandardMaterial color="#edc778" emissive="#9c6725" emissiveIntensity={0.16} />
      </mesh>
    </group>
  );
}

function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[2.1, 0.16, 0.5]} />
        <meshStandardMaterial color="#9e6845" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.88, -0.2]} castShadow>
        <boxGeometry args={[2.1, 0.62, 0.13]} />
        <meshStandardMaterial color="#9e6845" roughness={0.85} />
      </mesh>
      {[-0.74, 0.74].map((x) => (
        <mesh key={x} position={[x, 0.26, 0]}>
          <boxGeometry args={[0.12, 0.52, 0.14]} />
          <meshStandardMaterial color="#425449" />
        </mesh>
      ))}
    </group>
  );
}

export default function WorldEnvironment() {
  return (
    <>
      <color attach="background" args={["#b8d3cd"]} />
      <fog attach="fog" args={["#b8d3cd", 34, 72]} />
      <ambientLight intensity={1.7} color="#fff3dc" />
      <directionalLight position={[-12, 22, 10]} intensity={2.4} color="#fff0d2" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8da77d" roughness={1} />
      </mesh>

      {/* Intersecting neighborhood roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]} receiveShadow>
        <planeGeometry args={[100, 6.5]} />
        <meshStandardMaterial color="#69716b" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[6.5, 100]} />
        <meshStandardMaterial color="#69716b" roughness={1} />
      </mesh>
      {/* Painted road edges and broken center marks */}
      {[-3.05, 3.05].map((z) => (
        <mesh key={`edge-x-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, z]}>
          <planeGeometry args={[100, 0.1]} />
          <meshBasicMaterial color="#e7d7ae" />
        </mesh>
      ))}
      {[-3.05, 3.05].map((x) => (
        <mesh key={`edge-z-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
          <planeGeometry args={[0.1, 100]} />
          <meshBasicMaterial color="#e7d7ae" />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, index) => (
        <group key={index}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-28 + index * 8, 0.012, 0]}>
            <planeGeometry args={[3.8, 0.12]} />
            <meshBasicMaterial color="#d9d3bf" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -28 + index * 8]}>
            <planeGeometry args={[0.12, 3.8]} />
            <meshBasicMaterial color="#d9d3bf" />
          </mesh>
        </group>
      ))}

      {/* Sidewalks */}
      {[-5.2, 5.2].map((z) => (
        <mesh key={`walk-x-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, z]} receiveShadow>
          <planeGeometry args={[80, 2.6]} />
          <meshStandardMaterial color="#cfbfa0" roughness={1} />
        </mesh>
      ))}
      {[-5.2, 5.2].map((x) => (
        <mesh key={`walk-z-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]} receiveShadow>
          <planeGeometry args={[2.6, 80]} />
          <meshStandardMaterial color="#cfbfa0" roughness={1} />
        </mesh>
      ))}

      {/* Low-rise neighborhood buildings */}
      <Building position={[-15, 0, -13]} color="#e6c99f" roofColor="#bb7356" />
      <Building position={[-15, 0, 13]} color="#d8b6a0" roofColor="#8c6557" height={4.5} />
      <Building position={[15, 0, -13]} color="#d7d0a5" roofColor="#b77a52" height={5.5} />
      <Building position={[-15, 0, 0]} color="#c9d1b4" roofColor="#6f8975" height={4.8} />

      {/* Small paved plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12.2, 0.025, 12]} receiveShadow>
        <planeGeometry args={[13, 13]} />
        <meshStandardMaterial color="#c6b696" roughness={1} />
      </mesh>
      <mesh position={[12.2, 0.12, 12]} receiveShadow>
        <cylinderGeometry args={[1.35, 1.55, 0.22, 10]} />
        <meshStandardMaterial color="#a8af83" roughness={1} />
      </mesh>
      <mesh position={[12.2, 0.6, 12]} castShadow>
        <cylinderGeometry args={[0.25, 0.32, 0.8, 8]} />
        <meshStandardMaterial color="#80674b" roughness={1} />
      </mesh>
      <mesh position={[12.2, 1.08, 12]} castShadow>
        <sphereGeometry args={[0.95, 12, 8]} />
        <meshStandardMaterial color="#668666" roughness={1} />
      </mesh>
      <Bench position={[10.5, 0, 9.5]} />
      <Bench position={[16, 0, 9.5]} />
      <StreetLamp position={[7.2, 0, 6.8]} />
      <StreetLamp position={[17.2, 0, 16.8]} />
      <StreetLamp position={[-8.4, 0, 8.2]} />
      <StreetLamp position={[8.3, 0, -8.2]} />
    </>
  );
}
