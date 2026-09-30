const sections = [
  {
    title: "Investigaciones",
    description: "Textos de la investigación, en español e inglés.",
  },
  {
    title: "Lugares de estudio",
    description: "Ficha, audio, galería y testimonios de cada lugar.",
  },
];

export default function AdminHomePage() {
  return (
    <>
      <h1 className="font-serif text-3xl font-light text-ink">
        Panel administrativo
      </h1>
      <p className="mt-2 font-sans text-sm text-ink-soft">
        Desde aquí gestionas el contenido del sitio.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <li
            key={section.title}
            className="rounded-sm border border-hairline bg-paper p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-light text-ink">
                {section.title}
              </h2>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                Próximamente
              </span>
            </div>
            <p className="mt-2 font-sans text-sm text-ink-soft">
              {section.description}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
