"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * Participa — contacto + boletín (cierra la página, después de
 * "Sobre la investigación").
 *
 * Backend: ambos formularios llaman a rutas API propias
 * (app/api/contact y app/api/subscribe), que hoy son STUBS con las
 * instrucciones exactas para conectar Supabase (tablas `contact_messages`
 * y `newsletter_subscribers`) o un proveedor de boletines (Buttondown /
 * Brevo). Ver comentarios en cada route.ts.
 *
 * El contador de visitas consulta app/api/visits (stub con fallback y
 * comentarios para la tabla `site_visits` + RPC en Supabase).
 */

type FormStatus = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full rounded-sm border border-hairline bg-paper px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink-soft/60 focus:border-moss-dark focus:outline-none";

function VisitCounter() {
  const { t } = useLanguage();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Registra la visita y recupera el total (una vez por carga).
    fetch("/api/visits", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(null)); // sin backend, el contador se omite
  }, []);

  if (count === null) return null;
  return (
    <p className="font-sans text-xs text-ink-soft">
      {new Intl.NumberFormat("es-EC").format(count)} {t.participate.visitsLabel}
    </p>
  );
}

export function Participate() {
  const { t } = useLanguage();

  // ── Contacto ─────────────────────────────────────────────────────────
  const [contact, setContact] = useState({
    name: "",
    email: "",
    reason: "suggestion",
    message: "",
    website: "", // honeypot anti-spam: los humanos no lo ven ni lo llenan
  });
  const [contactStatus, setContactStatus] = useState<FormStatus>("idle");

  const submitContact = async () => {
    if (!contact.name || !contact.email || !contact.message) return;
    setContactStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      setContactStatus(res.ok ? "success" : "error");
    } catch {
      setContactStatus("error");
    }
  };

  // ── Boletín ──────────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<FormStatus>("idle");

  const submitSubscribe = async () => {
    if (!email || !consent) return;
    setSubscribeStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribeStatus(res.ok ? "success" : "error");
    } catch {
      setSubscribeStatus("error");
    }
  };

  return (
    <section id="participa" className="border-t border-hairline px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-serif text-3xl font-light text-ink sm:text-4xl">
          {t.participate.title}
        </h2>
        <p className="mx-auto mt-4 max-w-prose text-center font-sans text-base leading-relaxed text-ink-soft">
          {t.participate.intro}
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          {/* ── Formulario de contacto ─────────────────────────────────── */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-xl font-medium text-ink">
              {t.participate.contact.title}
            </h3>
            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block font-sans text-xs uppercase tracking-[0.15em] text-ink-soft">
                    {t.participate.contact.name}
                  </span>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    className={inputClass}
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-sans text-xs uppercase tracking-[0.15em] text-ink-soft">
                    {t.participate.contact.email}
                  </span>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className={inputClass}
                    autoComplete="email"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block font-sans text-xs uppercase tracking-[0.15em] text-ink-soft">
                  {t.participate.contact.reason}
                </span>
                <select
                  value={contact.reason}
                  onChange={(e) => setContact({ ...contact, reason: e.target.value })}
                  className={inputClass}
                >
                  <option value="suggestion">
                    {t.participate.contact.reasonSuggestion}
                  </option>
                  <option value="collaboration">
                    {t.participate.contact.reasonCollab}
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block font-sans text-xs uppercase tracking-[0.15em] text-ink-soft">
                  {t.participate.contact.message}
                </span>
                <textarea
                  rows={5}
                  value={contact.message}
                  onChange={(e) => setContact({ ...contact, message: e.target.value })}
                  className={inputClass}
                />
              </label>

              {/* Honeypot: oculto para humanos, los bots suelen llenarlo. */}
              <input
                type="text"
                value={contact.website}
                onChange={(e) => setContact({ ...contact, website: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={submitContact}
                disabled={contactStatus === "sending"}
                className="border border-moss px-6 py-2.5 font-sans text-sm text-moss-dark transition-colors duration-300 hover:bg-moss hover:text-paper disabled:opacity-50"
              >
                {contactStatus === "sending"
                  ? t.participate.contact.sending
                  : t.participate.contact.submit}
              </button>

              {contactStatus === "success" && (
                <p className="font-sans text-sm text-moss-dark" role="status">
                  {t.participate.contact.success}
                </p>
              )}
              {contactStatus === "error" && (
                <p className="font-sans text-sm text-ink" role="status">
                  {t.participate.contact.error}
                </p>
              )}
            </div>
          </div>

          {/* ── Boletín ────────────────────────────────────────────────── */}
          <div className="rounded-sm border border-hairline bg-paper-alt p-7 lg:col-span-2">
            <h3 className="font-serif text-xl font-medium text-ink">
              {t.participate.subscribe.title}
            </h3>
            <p className="mt-3 font-sans text-sm leading-relaxed text-ink-soft">
              {t.participate.subscribe.body}
            </p>
            <div className="mt-6 space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.participate.subscribe.email}
                className={inputClass}
                autoComplete="email"
                aria-label={t.participate.subscribe.email}
              />
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-[#5C6B45]"
                />
                <span className="font-sans text-xs leading-relaxed text-ink-soft">
                  {t.participate.subscribe.consent}
                </span>
              </label>
              <button
                type="button"
                onClick={submitSubscribe}
                disabled={subscribeStatus === "sending" || !consent}
                className="w-full bg-moss px-6 py-2.5 font-sans text-sm text-paper transition-colors duration-300 hover:bg-moss-dark disabled:opacity-50"
              >
                {subscribeStatus === "sending"
                  ? t.participate.subscribe.sending
                  : t.participate.subscribe.submit}
              </button>
              {subscribeStatus === "success" && (
                <p className="font-sans text-sm text-moss-dark" role="status">
                  {t.participate.subscribe.success}
                </p>
              )}
              {subscribeStatus === "error" && (
                <p className="font-sans text-sm text-ink" role="status">
                  {t.participate.subscribe.error}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cierre final: derechos + contador de visitas. */}
        <div className="mt-20 flex flex-col items-center gap-2 border-t border-hairline pt-8 text-center">
          <p className="font-sans text-xs text-ink-soft">{t.closing.rights}</p>
          <VisitCounter />
        </div>
      </div>
    </section>
  );
}
