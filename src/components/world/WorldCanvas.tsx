"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Link from "next/link";
import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { movePlayer, type MovementInput } from "@/src/game/world/movement";
import PlayerAvatar from "./PlayerAvatar";
import WorldControls, { type Direction } from "./WorldControls";
import WorldEnvironment from "./WorldEnvironment";
import styles from "./WorldExperience.module.css";

type InputRef = { current: MovementInput };
const emptyInput = (): MovementInput => ({ forward: false, backward: false, left: false, right: false });
const keyDirections: Record<string, Direction> = {
  w: "forward", ArrowUp: "forward", s: "backward", ArrowDown: "backward",
  a: "left", ArrowLeft: "left", d: "right", ArrowRight: "right",
};

function PlayerController({
  input,
  position,
  direction,
  onModelError,
}: {
  input: InputRef;
  position: React.MutableRefObject<THREE.Vector3>;
  direction: React.MutableRefObject<THREE.Vector2>;
  onModelError: () => void;
}) {
  const [isMoving, setIsMoving] = useState(false);
  const movingState = useRef(false);

  useFrame((_, delta) => {
    const current = position.current;
    const next = movePlayer(current, input.current, delta);
    const moved = Math.abs(next.x - current.x) > 0.0001 || Math.abs(next.z - current.z) > 0.0001;
    if (movingState.current !== moved) {
      movingState.current = moved;
      setIsMoving(moved);
    }
    direction.current.set(
      Number(input.current.right) - Number(input.current.left),
      Number(input.current.backward) - Number(input.current.forward),
    );
    if (moved && direction.current.lengthSq() > 0) direction.current.normalize();
    else direction.current.set(0, 0);
    current.set(next.x, 0, next.z);
  });
  return <PlayerAvatar position={position} direction={direction} isMoving={isMoving} onModelError={onModelError} />;
}

function FollowingCamera({ target }: { target: React.MutableRefObject<THREE.Vector3> }) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());
  useFrame((_, delta) => {
    desired.current.set(target.current.x, 6.8, target.current.z + 10.5);
    camera.position.lerp(desired.current, 1 - Math.exp(-4.5 * delta));
    lookAt.current.set(target.current.x, 1.1, target.current.z - 1.8);
    camera.lookAt(lookAt.current);
  });
  return null;
}

function CanvasUnavailable({ onFailure }: { onFailure: () => void }) {
  useEffect(() => onFailure(), [onFailure]);
  return null;
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className={styles.sceneError} role="alert">
          <div className={styles.errorMark}>!</div>
          <h2>We couldn’t open the neighborhood</h2>
          <p>Your browser may have blocked 3D graphics. Try again or return to the menu.</p>
          <button className={styles.retryButton} type="button" onClick={this.props.onRetry}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function WorldCanvas() {
  const input = useRef<MovementInput>(emptyInput());
  const keyboard = useRef(new Set<Direction>());
  const touch = useRef(new Set<Direction>());
  const position = useRef(new THREE.Vector3(0, 0, 4));
  const direction = useRef(new THREE.Vector2());
  const [ready, setReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [avatarWarning, setAvatarWarning] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const refreshInput = useCallback(() => {
    input.current = {
      forward: keyboard.current.has("forward") || touch.current.has("forward"),
      backward: keyboard.current.has("backward") || touch.current.has("backward"),
      left: keyboard.current.has("left") || touch.current.has("left"),
      right: keyboard.current.has("right") || touch.current.has("right"),
    };
  }, []);

  useEffect(() => {
    const pressedKeys = keyboard.current;
    const pressedTouch = touch.current;
    const isTyping = (target: EventTarget | null) =>
      target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
    const onKeyChange = (event: KeyboardEvent, pressed: boolean) => {
      const direction = keyDirections[event.key] ?? keyDirections[event.key.toLowerCase()];
      if (!direction || isTyping(event.target)) return;
      event.preventDefault();
      if (pressed) keyboard.current.add(direction);
      else keyboard.current.delete(direction);
      refreshInput();
    };
    const onKeyDown = (event: KeyboardEvent) => onKeyChange(event, true);
    const onKeyUp = (event: KeyboardEvent) => onKeyChange(event, false);
    const clearKeys = () => {
      keyboard.current.clear();
      refreshInput();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
      pressedKeys.clear();
      pressedTouch.clear();
      input.current = emptyInput();
    };
  }, [refreshInput]);

  useEffect(() => {
    if (ready || sceneFailed) return;
    const timer = window.setTimeout(() => setSceneFailed(true), 12000);
    return () => window.clearTimeout(timer);
  }, [ready, sceneFailed, attempt]);

  const setTouchDirection = useCallback((value: Direction, pressed: boolean) => {
    if (pressed) touch.current.add(value);
    else touch.current.delete(value);
    refreshInput();
  }, [refreshInput]);

  const retry = useCallback(() => {
    setReady(false);
    setSceneFailed(false);
    position.current.set(0, 0, 4);
    setAttempt((value) => value + 1);
  }, []);

  const fail = useCallback(() => setSceneFailed(true), []);
  const flagAvatarFallback = useCallback(() => setAvatarWarning(true), []);

  return (
    <main className={styles.world} aria-label="THIRDPLACE neighborhood">
      <div className={styles.canvasWrap}>
        {!sceneFailed && (
          <SceneErrorBoundary key={attempt} onRetry={retry}>
            <Canvas
              key={attempt}
              camera={{ position: [0, 7, 14], fov: 46, near: 0.1, far: 110 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, powerPreference: "low-power" }}
              onCreated={({ gl }) => {
                if (gl.getContext().isContextLost()) setSceneFailed(true);
                else setReady(true);
              }}
              fallback={<CanvasUnavailable onFailure={fail} />}
            >
              <Suspense fallback={null}>
                <WorldEnvironment />
                <PlayerController input={input} position={position} direction={direction} onModelError={flagAvatarFallback} />
                <FollowingCamera target={position} />
              </Suspense>
            </Canvas>
          </SceneErrorBoundary>
        )}
        {!ready && !sceneFailed && (
          <div className={styles.loading} role="status" aria-live="polite">
            <span className={styles.loadingSpinner} aria-hidden="true" />
            <strong>Warming up the neighborhood</strong>
            <span>Getting the streets ready…</span>
          </div>
        )}
        {sceneFailed && (
          <div className={styles.sceneError} role="alert">
            <div className={styles.errorMark}>!</div>
            <h2>We couldn’t open the neighborhood</h2>
            <p>Your browser may have blocked 3D graphics. Try again or return to the menu.</p>
            <button className={styles.retryButton} type="button" onClick={retry}>Try again</button>
          </div>
        )}
      </div>

      <header className={styles.topBar}>
        <Link className={styles.brand} href="/" aria-label="THIRDPLACE home">
          <span className={styles.brandIcon} aria-hidden="true">t</span>
          <span>thirdplace<span className={styles.brandPeriod}>.</span></span>
        </Link>
        <div className={styles.location}><span className={styles.liveDot} /> ABUJA · THE NEIGHBOURHOOD</div>
        <Link className={styles.menuButton} href="/">Leave world <span aria-hidden="true">↗</span></Link>
      </header>

      <section className={styles.playerCard} aria-label="Player information">
        <div className={styles.playerPortrait} aria-hidden="true">✦</div>
        <div>
          <span className={styles.eyebrow}>EXPLORER</span>
          <strong>Local Explorer</strong>
        </div>
        <span className={styles.onlineBadge} aria-label="Playing locally" />
      </section>
      {avatarWarning && <p className={styles.avatarWarning} role="status">Avatar model could not load. Showing the local placeholder.</p>}

      <aside className={styles.hint} aria-label="Movement instructions">
        <span className={styles.hintIcon} aria-hidden="true">⌘</span>
        <div><strong>Take a little walk</strong><span>WASD or arrow keys to move</span></div>
      </aside>
      <WorldControls onDirection={setTouchDirection} />
      <div className={styles.coordinates} aria-hidden="true"><span /> A QUIETER KIND OF SOCIAL</div>
    </main>
  );
}
