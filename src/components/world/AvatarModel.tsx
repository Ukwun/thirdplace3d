"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { clone as cloneSkinnedScene } from "three/addons/utils/SkeletonUtils.js";
import type { LocalAvatarConfig } from "@/src/components/avatar/avatar-config";

type GlbAvatarProps = {
  config: LocalAvatarConfig;
  isMoving: boolean;
};

function normalizeClipName(name: string) {
  return name.toLowerCase().replace(/[\s_-]/g, "");
}

function findAnimation(
  actions: Record<string, THREE.AnimationAction | null>,
  names: string[],
) {
  const requested = new Set(names.map(normalizeClipName));
  return Object.entries(actions).find(([name, action]) => action && requested.has(normalizeClipName(name)))?.[1] ?? null;
}

export default function AvatarModel({ config, isMoving }: GlbAvatarProps) {
  if (!config.assetPath) return null;
  return <LoadedAvatar path={config.assetPath} config={config} isMoving={isMoving} />;
}

function LoadedAvatar({
  path,
  config,
  isMoving,
}: GlbAvatarProps & { path: string }) {
  const gltf = useGLTF(path);
  // SkeletonUtils gives each avatar its own bones while reusing immutable geometry/material assets.
  const instance = useMemo(() => cloneSkinnedScene(gltf.scene), [gltf.scene]);
  const { actions } = useAnimations(gltf.animations, instance);
  const actionTable = actions as Record<string, THREE.AnimationAction | null>;
  const idleAction = useMemo(
    () => findAnimation(actionTable, config.animationClips.idle),
    [actionTable, config.animationClips.idle],
  );
  const walkAction = useMemo(
    () => findAnimation(actionTable, config.animationClips.walk),
    [actionTable, config.animationClips.walk],
  );
  const fitted = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(instance);
    const size = bounds.getSize(new THREE.Vector3());
    const scale = size.y > 0 ? config.targetHeightMeters / size.y : 1;
    const center = bounds.getCenter(new THREE.Vector3());
    return {
      scale,
      position: [
        -center.x * scale,
        -bounds.min.y * scale,
        -center.z * scale,
      ] as [number, number, number],
    };
  }, [config.targetHeightMeters, instance]);

  useEffect(() => {
    const action = isMoving ? walkAction : idleAction;
    if (!action) return;
    action.reset().fadeIn(0.18).play();
    return () => { action.fadeOut(0.16); };
  }, [idleAction, isMoving, walkAction]);

  return (
    <group position={fitted.position} scale={fitted.scale}>
      <primitive
        object={instance}
        rotation-y={config.yawCorrectionRadians}
        dispose={null}
      />
    </group>
  );
}

export function AvatarLoadingIndicator() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.y += delta * 2.6;
  });
  return (
    <mesh ref={ring} position={[0, 1.48, 0]}>
      <torusGeometry args={[0.11, 0.025, 6, 18]} />
      <meshBasicMaterial color="#ddb56a" />
    </mesh>
  );
}
