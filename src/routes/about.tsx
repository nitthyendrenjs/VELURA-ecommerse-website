import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Sparkles, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Velura" },
      { name: "description", content: "The story behind Velura — quiet luxury, considered design, and craft you can feel." },
    ],
  }),
  component: About,
});

const values = [
  { i: Leaf, t: "Sustainable", d: "Responsibly sourced materials, low-impact dyes, and packaging designed to compost." },
  { i: Sparkles, t: "Quality First", d: "We work directly with family-run ateliers who treat every garment like an heirloom." },
  { i: Heart, t: "Made with Love", d: "Small batches, fair wages, and the kind of detail that only comes from caring." },
];

const team = [
  { n: "Sofia Romano", r: "Founder & Creative Director", img: "https://i.pravatar.cc/300?img=47" },
  { n: "Daniel Park", r: "Head of Design", img: "https://i.pravatar.cc/300?img=12" },
  { n: "Amara Okafor", r: "Atelier Director", img: "https://i.pravatar.cc/300?img=49" },
];

function About() {
  return (
    <div>
      <section className="bg-primary py-24 text-primary-foreground">
        <div className="container-luxe max-w-3xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-gold)]">Our Story</span>
          <h1 className="mt-4 font-display text-5xl font-semibold md:text-6xl">A quieter kind of luxury</h1>
          <p className="mt-6 text-primary-foreground/80">
            Velura was born from a simple frustration: that great clothing had become loud, disposable,
            and increasingly impersonal. We set out to build the opposite.
          </p>
        </div>
      </section>

      <section className="container-luxe py-20">
        <div className="mx-auto max-w-3xl space-y-6 text-muted-foreground">
          <p>
            Founded in 2020 between Milan and Brooklyn, Velura is a small studio designing wardrobes for people
            who'd rather own a few perfect things than a closet of forgettable ones.
          </p>
          <p>
            We work with three multi-generational ateliers in Italy and Portugal — the kind of places where
            patterns are still cut by hand and seams are inspected by people who have been doing this for thirty years.
          </p>
          <p>
            Everything we make is designed to outlast trends. If it does need repair, we'll do it for you, for life.
            That's not a marketing line — it's the only way we know how to make clothes.
          </p>
        </div>
      </section>

      <section className="container-luxe py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="rounded-xl bg-card p-8 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--color-gold)]/15 text-[var(--color-gold)]">
                <v.i size={22} />
              </div>
              <h3 className="mt-5 font-display text-xl">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxe py-20">
        <h2 className="mb-10 text-center font-display text-3xl font-semibold md:text-4xl">The team behind Velura</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {team.map((t) => (
            <div key={t.n} className="overflow-hidden rounded-xl bg-card text-center shadow-soft">
              <img src={t.img} alt={t.n} className="aspect-square w-full object-cover" />
              <div className="p-5">
                <p className="font-display text-lg">{t.n}</p>
                <p className="text-sm text-muted-foreground">{t.r}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
