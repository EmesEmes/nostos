"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import {
  getProvinceRings,
  MAP_CENTER,
  type ProvinceDef,
} from "@/data/provinces";
import { dynamicColors, provinceDynamics } from "@/data/provinceDynamics";

/**
 * Una provincia = una pieza independiente:
 * - Geometría extruida simple (forma plana con grosor EXTRUDE_DEPTH),
 *   sin texturas. Caras color papel + aristas en verde musgo → el conjunto
 *   se lee como un dibujo a línea.
 * - Caída desde arriba con leve rotación al asentarse, easing easeOutBack
 *   (overshoot suave, sin rebote gomoso). El retardo escalonado (prop
 *   `delay`) implementa el barrido diagonal noroeste → sureste calculado
 *   en data/provinces.ts (fallOrder / fallIndex).
 * - Con prefers-reduced-motion la pieza nace ya asentada (sin caída).
 */

/** Escala del espacio lógico (0–10) al espacio de escena. */
export const MAP_SCALE = 4;
/** Grosor de la extrusión: dentro del rango 2–4 unidades del brief. */
export const EXTRUDE_DEPTH = 2.5;
/** Altura desde la que caen las piezas. */
const DROP_HEIGHT = 26;

/** easeOutBack clásico: leve overshoot al final. */
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

type Props = {
  province: ProvinceDef;
  triggered: boolean;
  reducedMotion: boolean;
  delay: number; // segundos, según orden de caída
  duration: number; // segundos por pieza
};

export function ProvincePiece({
  province,
  triggered,
  reducedMotion,
  delay,
  duration,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  // Instante (reloj de escena) en que se disparó la secuencia.
  const startRef = useRef<number | null>(null);
  const settledRef = useRef(reducedMotion);

  // Inclinación inicial determinista por provincia (misma en cada visita),
  // derivada de un hash simple del id.
  const tilt = useMemo(() => {
    let h = 0;
    for (let i = 0; i < province.id.length; i++) {
      h = (h * 31 + province.id.charCodeAt(i)) >>> 0;
    }
    const r = (h % 1000) / 1000;
    return {
      x: (r - 0.5) * 0.5, // ±0.25 rad
      z: ((((h >> 10) % 1000) / 1000) - 0.5) * 0.5,
    };
  }, [province.id]);

  // Geometría: anillos 2D → THREE.Shape[] → extrusión.
  // ⚠️ Al integrar GeoJSON real solo cambia getProvinceRings (ver
  // data/provinces.ts); esta conversión a Shape se mantiene igual.
  const geometry = useMemo(() => {
    const shapes = getProvinceRings(province).map((ring) => {
      const shape = new THREE.Shape();
      ring.forEach(([x, y], i) => {
        const px = (x - MAP_CENTER[0]) * MAP_SCALE;
        const py = (y - MAP_CENTER[1]) * MAP_SCALE;
        if (i === 0) shape.moveTo(px, py);
        else shape.lineTo(px, py);
      });
      shape.closePath();
      return shape;
    });
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: EXTRUDE_DEPTH,
      bevelEnabled: false,
    });
    return geo;
  }, [province]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group || settledRef.current) return;

    // Antes del disparo, la pieza espera arriba y oculta.
    if (!triggered) {
      group.position.y = DROP_HEIGHT;
      group.visible = false;
      return;
    }

    if (startRef.current === null) startRef.current = clock.elapsedTime;
    const local = clock.elapsedTime - startRef.current - delay;

    if (local < 0) {
      group.visible = false;
      return;
    }

    group.visible = true;
    const t = Math.min(local / duration, 1);
    const eased = easeOutBack(t);

    group.position.y = DROP_HEIGHT * (1 - eased);
    // La rotación se corrige durante la caída y termina en 0 (asentada).
    group.rotation.x = -Math.PI / 2 + tilt.x * (1 - eased);
    group.rotation.z = tilt.z * (1 - eased);

    if (t >= 1) {
      group.position.y = 0;
      group.rotation.set(-Math.PI / 2, 0, 0);
      settledRef.current = true;
    }
  });

  return (
    <group
      ref={groupRef}
      // rotation -90° en X: el plano XY del shape queda horizontal,
      // con el norte (y lógico) apuntando al fondo de la escena.
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, reducedMotion ? 0 : DROP_HEIGHT, 0]}
      visible={reducedMotion}
    >
      <mesh geometry={geometry}>
        {/* Coropleto: la cara toma el color de su categoría de dinámica
            poblacional (rampa monocroma de la paleta; más oscuro = más
            despoblación). Ver data/provinceDynamics.ts. */}
        <meshStandardMaterial
          color={dynamicColors[provinceDynamics[province.id] ?? "normal"]}
          roughness={1}
          metalness={0}
        />
        {/* Aristas finas en el acento oscuro exacto (#5C6B45): contrasta
            sobre los tres niveles de la rampa. */}
        <Edges threshold={15} color="#5C6B45" />
      </mesh>
    </group>
  );
}
