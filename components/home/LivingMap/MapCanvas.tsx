"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MAP_CENTER } from "@/data/provinces";
import { MAP_WIDTH, MAP_HEIGHT } from "@/data/provinceShapes";
import { MAP_SCALE } from "./ProvincePiece";
import { provinces, fallIndex } from "@/data/provinces";
import type { Canton } from "@/data/cantons";
import { ProvincePiece } from "./ProvincePiece";
import { ParishMarker } from "./ParishMarker";

/**
 * Escena 3D del mapa.
 *
 * Estética: piezas extruidas color papel con aristas en verde musgo
 * (líneas finas, sin relleno visualmente dominante) sobre el mismo fondo
 * crema de la página → el mapa se lee como un boceto a línea.
 *
 * Estrategia mobile (decisión de diseño):
 * - Se conserva la MISMA escena 3D, pero con dpr limitado ([1, 1.75]) para
 *   no castigar GPUs móviles, geometría de baja densidad (polígonos de
 *   ~7 vértices) y OrbitControls con rotación táctil de un dedo, sin zoom
 *   ni paneo (el gesto de scroll vertical de la página no se secuestra:
 *   los controles solo capturan el arrastre horizontal significativo al
 *   estar limitado el ángulo polar). Los marcadores tienen un radio de
 *   golpeo generoso para el tacto. Esto mantiene una sola fuente de verdad
 *   visual en vez de duplicar un mapa 2D alternativo.
 *
 * Rendimiento:
 * - Con prefers-reduced-motion no hay animación continua, así que el
 *   frameloop pasa a "demand" (solo re-renderiza al interactuar).
 */

type Props = {
  triggered: boolean;
  reducedMotion: boolean;
  parishes: Canton[];
  selectedSlug: string | null;
  onSelectParish: (canton: Canton) => void;
};

// Retardo entre piezas (~100ms, dentro del rango 80–120ms del brief)
// y duración de caída por pieza (600ms).
export const FALL_STAGGER = 0.1;
export const FALL_DURATION = 0.6;

/**
 * Encuadre fit-to-bounds: calcula la distancia de cámara necesaria para
 * que el mapa completo (incl. Galápagos) quepa en el canvas, sea cual sea
 * su aspect ratio, y se recalcula al redimensionar. Corrige el recorte que
 * ocurría con una posición de cámara fija.
 */
function FitCamera() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    if (!("fov" in camera)) return;
    const halfW = (MAP_WIDTH / 2) * MAP_SCALE;
    const halfD = (MAP_HEIGHT / 2) * MAP_SCALE;
    // Radio de la esfera envolvente del mapa (con margen del 12%).
    const radius = Math.hypot(halfW, halfD) * 1.12;
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height));
    const dist = radius / Math.sin(Math.min(vFov, hFov) / 2);
    // Dirección de vista fija (elevada, ligeramente frontal).
    const dir = { x: 0, y: 1.25, z: 1 };
    const len = Math.hypot(dir.x, dir.y, dir.z);
    camera.position.set(
      (dir.x / len) * dist,
      (dir.y / len) * dist,
      (dir.z / len) * dist,
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

export default function MapCanvas({
  triggered,
  reducedMotion,
  parishes,
  selectedSlug,
  onSelectParish,
}: Props) {
  // Momento (en segundos de escena) en que todas las piezas ya asentaron:
  // los marcadores aparecen después de este punto.
  const totalFallTime =
    (provinces.length - 1) * FALL_STAGGER + FALL_DURATION + 0.2;

  return (
    <Canvas
      // dpr limitado: nitidez suficiente sin sobrecostos en mobile/retina.
      dpr={[1, 1.75]}
      frameloop={reducedMotion ? "demand" : "always"}
      camera={{ position: [0, 38, 27], fov: 36, near: 1, far: 260 }}
      // El canvas hereda el fondo crema de la página (alpha true por defecto).
      gl={{ antialias: true }}
      style={{ touchAction: "pan-y" }} // el scroll vertical sigue funcionando
    >
      <FitCamera />

      {/* Luz casi plana: las caras se quedan cerca del color papel y el
          dibujo lo hacen las aristas (estilo línea, como la referencia). */}
      <ambientLight intensity={1.65} />
      <directionalLight position={[20, 40, 25]} intensity={0.3} />

      {/* Las 24 provincias como piezas independientes. */}
      {provinces.map((province) => (
        <ProvincePiece
          key={province.id}
          province={province}
          triggered={triggered}
          reducedMotion={reducedMotion}
          delay={fallIndex[province.id] * FALL_STAGGER}
          duration={FALL_DURATION}
        />
      ))}

      {/* Los 10 marcadores de parroquias, tras ensamblarse el mapa. */}
      {parishes.map((parish, i) => (
        <ParishMarker
          key={parish.slug}
          parish={parish}
          appearAt={reducedMotion ? 0 : totalFallTime + i * 0.06}
          triggered={triggered}
          reducedMotion={reducedMotion}
          selected={selectedSlug === parish.slug}
          onSelect={() => onSelectParish(parish)}
        />
      ))}

      {/* Rotación limitada (sin zoom/paneo): en desktop con el mouse,
          en mobile con un dedo. El mapa nunca puede quedar "de cabeza". */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.6}
        minAzimuthAngle={-Math.PI / 7}
        maxAzimuthAngle={Math.PI / 7}
        rotateSpeed={0.5}
        makeDefault
      />
    </Canvas>
  );
}
