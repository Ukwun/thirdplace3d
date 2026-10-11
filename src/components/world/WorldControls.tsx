"use client";

import styles from "./WorldExperience.module.css";

export type Direction = "forward" | "backward" | "left" | "right";

type WorldControlsProps = {
  onDirection: (direction: Direction, pressed: boolean) => void;
};

const controls: { direction: Direction; label: string; symbol: string; className: string }[] = [
  { direction: "forward", label: "Move forward", symbol: "↑", className: "up" },
  { direction: "left", label: "Move left", symbol: "←", className: "left" },
  { direction: "backward", label: "Move backward", symbol: "↓", className: "down" },
  { direction: "right", label: "Move right", symbol: "→", className: "right" },
];

export default function WorldControls({ onDirection }: WorldControlsProps) {
  return (
    <div className={styles.dpad} role="group" aria-label="Touch movement controls">
      {controls.map(({ direction, label, symbol, className }) => (
        <button
          className={`${styles.dpadButton} ${styles[className]}`}
          key={direction}
          type="button"
          aria-label={label}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            onDirection(direction, true);
          }}
          onPointerUp={() => onDirection(direction, false)}
          onPointerCancel={() => onDirection(direction, false)}
          onLostPointerCapture={() => onDirection(direction, false)}
          onContextMenu={(event) => event.preventDefault()}
        >
          {symbol}
        </button>
      ))}
    </div>
  );
}
