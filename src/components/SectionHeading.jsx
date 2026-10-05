export default function SectionHeading({ index, eyebrow, title, intro, align = "left" }) {
  const centered = align === "center";
  const words = String(title).split(" ");
  const tail = words.pop();
  const head = words.join(" ");
  return (
    <div className={`reveal mb-12 md:mb-16 ${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <p className={`eyebrow flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className="text-teal">{index}</span>
        <span className="h-px w-10 bg-mist-400/40" />
        <span>{eyebrow}</span>
      </p>
      <h2 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
        {head ? `${head} ` : ""}
        <span className="text-grad">{tail}</span>
      </h2>
      {intro ? <p className="mt-6 text-base leading-relaxed text-mist-200 md:text-lg">{intro}</p> : null}
    </div>
  );
}
