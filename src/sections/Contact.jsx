import { contact, links } from "../data/content";
import ParticleText from "../components/ParticleText";
import Magnetic from "../components/Magnetic";
import Icon from "../components/Icon";
import { useGlow } from "../hooks/useGlow";

export default function Contact({ reduced }) {
  const glow = useGlow();

  const channels = [
    links.email ? { icon: "mail", label: "Email", value: links.email, href: `mailto:${links.email}` } : null,
    links.linkedin ? { icon: "linkedin", label: "LinkedIn", value: links.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: links.linkedin } : null,
    links.github ? { icon: "github", label: "GitHub", value: links.github.replace(/^https?:\/\/(www\.)?/, ""), href: links.github } : null,
    links.resume ? { icon: "file", label: "Resume", value: "Download PDF", href: links.resume } : null,
  ].filter(Boolean);

  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-10 md:p-14">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo/20 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal/10 blur-[110px]" />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="min-w-0">
              <p className="reveal eyebrow flex items-center gap-3">
                <span className="text-teal">08</span>
                <span className="h-px w-10 bg-mist-400/40" />
                <span>Contact</span>
              </p>
              <h2 className="reveal mt-5 text-5xl font-semibold leading-[1] tracking-tight md:text-7xl">{contact.heading}</h2>
              <p className="reveal mt-6 max-w-xl text-base leading-relaxed text-mist-200 md:text-lg">{contact.text}</p>

              {links.email ? (
                <div className="reveal mt-8">
                  <Magnetic>
                    <a href={`mailto:${links.email}`} className="btn btn-primary">
                      <Icon name="mail" className="h-4 w-4" />
                      {links.email}
                    </a>
                  </Magnetic>
                </div>
              ) : null}
            </div>

            <ParticleText text="AV" reduced={reduced} className="reveal h-56 w-full sm:h-72 lg:h-80" />
          </div>

          <div className="relative mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                onMouseMove={glow}
                className="reveal glow-card group flex items-center gap-4 rounded-2xl border border-mist-400/10 bg-ink-950/50 p-5 transition-colors hover:border-teal/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-800 text-teal">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-mist-400">{c.label}</span>
                  <span className="block truncate text-sm font-medium text-mist-50">{c.value}</span>
                </span>
                <Icon name="arrowUpRight" className="ml-auto h-4 w-4 shrink-0 text-mist-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mist-50" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
