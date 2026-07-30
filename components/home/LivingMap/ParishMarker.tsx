"use client";

import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { MAP_CENTER } from "@/data/provinces";
import type { Canton } from "@/data/cantons";
import { MAP_SCALE, EXTRUDE_DEPTH } from "./ProvincePiece";

/**
 * Marcador de parroquia:
 * - Aparece (scale-in) una vez ensamblado el mapa (prop `appearAt`).
 * - Bounce sutil y continuo (amplitud ~0.3 unidades, no distrae);
 *   desactivado con prefers-reduced-motion.
 * - Click/tap → abre el panel lateral (onSelect). Una esfera invisible
 *   más grande hace de zona de golpeo generosa para el tacto en mobile.
 */

type Props = {
  parish: Canton;
  appearAt: number; // segundos desde el disparo de la sección
  triggered: boolean;
  reducedMotion: boolean;
  selected: boolean;
  onSelect: () => void;
};

const BASE_Y = EXTRUDE_DEPTH + 0.9; // apoyado sobre la cara superior

export function ParishMarker({
  parish,
  appearAt,
  triggered,
  reducedMotion,
  selected,
  onSelect,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const startRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);

  const x = (parish.position[0] - MAP_CENTER[0]) * MAP_SCALE;
  const z = -(parish.position[1] - MAP_CENTER[1]) * MAP_SCALE; // norte → fondo

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    if (!triggered) {
      group.visible = false;
      return;
    }
    if (startRef.current === null) startRef.current = clock.elapsedTime;
    const local = clock.elapsedTime - startRef.current;

    if (local < appearAt) {
      group.visible = false;
      return;
    }
    group.visible = true;

    // Entrada: scale-in de 300ms con ease-out.
    const enter = Math.min((local - appearAt) / 0.3, 1);
    const scale = 1 - Math.pow(1 - enter, 3);
    group.scale.setScalar(scale * (hovered || selected ? 1.25 : 1));

    // Bounce continuo, amplitud pequeña. Nada de bounce con reduced motion.
    const bounce = reducedMotion
      ? 0
      : Math.abs(Math.sin(local * 2.2)) * 0.35;
    group.position.y = BASE_Y + bounce;
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect();
  };

  return (
    <group
      ref={groupRef}
      position={[x, BASE_Y, z]}
      visible={false}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Punto visible. Acento oscuro al pasar el cursor o estar activo. */}
      <mesh>
        <sphereGeometry args={[0.45, 20, 20]} />
        {/* Carbón cálido (#2E2C28, texto principal de la paleta): destaca
            sobre los tres niveles del coropleto. El hover/selección se
            comunica con la escala (1.25×) además del cambio de tono. */}
        <meshStandardMaterial
          color={hovered || selected ? "#5C6B45" : "#2E2C28"}
          roughness={0.8}
        />
      </mesh>
      {/* Zona de golpeo invisible y generosa (tacto en mobile). */}
      <mesh visible={false}>
        <sphereGeometry args={[1.4, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
