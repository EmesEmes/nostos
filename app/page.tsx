import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Hero } from "@/components/home/Hero";
import { MapSection } from "@/components/home/LivingMap/MapSection";
import { TheProblem } from "@/components/home/TheProblem";
import { Statement } from "@/components/home/Statement";
import { Magnitude } from "@/components/home/Magnitude";
import { Numbers } from "@/components/home/Numbers";
import { CantonalStudy } from "@/components/home/CantonalStudy";
import { Findings } from "@/components/home/Findings";
import { CaseStudy } from "@/components/home/CaseStudy";
import { CantonsGrid } from "@/components/home/CantonsGrid";
import { Closing } from "@/components/home/Closing";
import { Participate } from "@/components/home/Participate";

/**
 * Home de NOSTOS — orden actualizado a pedido del cliente:
 *  1. Hero (con imagen de fondo)
 *  2. El Problema (de vuelta tras el hero, a pedido del cliente)
 *  3. El Mapa Vivo
 *  3b. Tesis central ("fenómeno predominantemente rural")
 *  4. La Magnitud
 *  5. Lo que Dicen los Números (scroll horizontal en desktop)
 *  6. Hallazgo territorial (estudio cantonal, scrollytelling)
 *  7. Principales hallazgos (hipótesis → veredicto)
 *  8. Estudio de Caso: Chavezpamba (pilotaje)
 *  9. Los diez cantones con mayor decrecimiento (datos reales)
 * 10. Sobre la investigación
 * 11. Participa (contacto + boletín + visitas)
 *
 * Nota: la sección de Metodología fue retirada del home a pedido del
 * cliente; el componente se conserva sin usar en components/home/ por si
 * se reubica (p. ej. como página propia enlazada desde el cierre).
 */
export default function HomePage() {
  return (
    <main>
      <LanguageSwitcher />
      <Hero />
      <TheProblem />
      <MapSection />
      <Statement />
      <Magnitude />
      <Numbers />
      <CantonalStudy />
      <Findings />
      <CaseStudy />
      <CantonsGrid />
      <Closing />
      <Participate />
    </main>
  );
}
