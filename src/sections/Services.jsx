import { Suspense, lazy } from "react";
import { services } from "../data/content";
import SectionHeading from "../components/SectionHeading";
import Icon from "../components/Icon";
import { useGlow } from "../hooks/useGlow";

const Floating3D = lazy(() => import("../three/Floating3D"));

const accents = ["text-teal", "text-indigo", "text-pink", "text-amber"];
const glows = ["rgba(46,230,214,0.22)", "rgba(139,92,246,0.25)", "rgba(255,95,162,0.22)", "rgba(255,197,61,0.2)"];

export default function Services({ reduced }) {
  const glow = useGlow();
  return (
    <section id="services" className="section">
      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_0.9fr]">
          <SectionHeading index="02" eyebrow="Services" title="What I Do" />
          <div className="reveal relative mx-auto -mt-6 mb-10 h-60 w-full max-w-lg sm:h-72 lg:mb-16 lg:mt-0 lg:h-80">
            <div className="pointer-events-none absolute inset-[15%] rounded-full bg-indigo/25 blur-3xl" />
            <Suspense fallback={null}>
              <Floating3D className="relative h-full w-full" reduced={reduced} />
            </Suspense>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <article
              key={s.title}
              onMouseMove={glow}
              style={{ "--glow": glows[i % glows.length] }}
              className="reveal glow-card glass group rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1 md:p-9"
            >
              <div className="flex items-start justify-between">
                <span className={`grad-border flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 ${accents[i % accents.length]}`}>
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <span className="font-mono text-xs text-mist-400">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-8 text-2xl font-semibold tracking-tight md:text-3xl">{s.title}</h3>
              <p className="mt-4 leading-relaxed text-mist-200">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
