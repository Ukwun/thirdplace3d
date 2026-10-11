"use client";

import { Suspense, Component, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LOCAL_AVATAR_CONFIG, type AvatarAppearance } from "@/src/components/avatar/avatar-config";
import AvatarModel, { AvatarLoadingIndicator } from "./AvatarModel";

type PlayerAvatarProps = {
  position: React.MutableRefObject<THREE.Vector3>;
  direction: React.MutableRefObject<THREE.Vector2>;
  isMoving: boolean;
  onModelError?: () => void;
};

class AvatarAssetErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError?: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function PlaceholderAvatar({ appearance }: { appearance: AvatarAppearance }) {
  return (
    <group position={[0, 0.08, 0]}>
      <mesh position={[0, -0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.46, 24]} />
        <meshBasicMaterial color="#163c35" transparent opacity={0.22} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.27, 0.52, 5, 10]} />
        <meshStandardMaterial color={appearance.skinTone} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.29, 0.005]} castShadow>
        <capsuleGeometry args={[0.29, 0.34, 5, 10]} />
        <meshStandardMaterial color={appearance.clothingTone} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.205, 16, 12]} />
        <meshStandardMaterial color={appearance.skinTone} roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.925, 0.005]} castShadow>
        <sphereGeometry args={[0.205, 16, 10, 0, Math.PI * 2, 0, 1.1]} />
        <meshStandardMaterial color={appearance.hairTone} roughness={1} />
      </mesh>
      <mesh position={[0, 0.51, 0.265]}>
        <sphereGeometry args={[0.045, 10, 8]} />
        <meshStandardMaterial color="#f4d6a7" roughness={0.8} />
      </mesh>
    </group>
  );
}

function AvatarLoadingFallback() {
  return (
    <group>
      <PlaceholderAvatar appearance={LOCAL_AVATAR_CONFIG.appearance} />
      <AvatarLoadingIndicator />
    </group>
  );
}

export default function PlayerAvatar({ position, direction, isMoving, onModelError }: PlayerAvatarProps) {
  const avatar = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!avatar.current) return;
    const amount = 1 - Math.exp(-12 * delta);
    target.current.set(position.current.x, 0, position.current.z);
    avatar.current.position.lerp(target.current, amount);
    if (direction.current.lengthSq() > 0.001) {
      const angle = Math.atan2(direction.current.x, direction.current.y);
      avatar.current.rotation.y = THREE.MathUtils.damp(avatar.current.rotation.y, angle, 12, delta);
    }
  });

  return (
    <group ref={avatar}>
      {LOCAL_AVATAR_CONFIG.assetPath ? (
        <AvatarAssetErrorBoundary
          onError={onModelError}
          fallback={<PlaceholderAvatar appearance={LOCAL_AVATAR_CONFIG.appearance} />}
        >
          <Suspense fallback={<AvatarLoadingFallback />}>
            <AvatarModel config={LOCAL_AVATAR_CONFIG} isMoving={isMoving} />
          </Suspense>
        </AvatarAssetErrorBoundary>
      ) : (
        <PlaceholderAvatar appearance={LOCAL_AVATAR_CONFIG.appearance} />
      )}
    </group>
  );
}
