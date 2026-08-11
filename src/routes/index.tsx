import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getHomeData } from "@/lib/catalog.functions";
import type { Product } from "@/lib/types";

import { ProductCard } from "@/components/ProductCard";
import { Stars } from "@/components/Stars";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velura — Wear What You Feel" },
      {
        name: "description",
        content:
          "Discover Velura's quietly luxurious collection of clothing and accessories — designed to last, made to feel.",
      },
    ],
  }),
  component: Home,
});

const heroImg =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1900&q=80";

const categories = [
  { label: "Men", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80" },
  { label: "Women", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" },
  { label: "Accessories", img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80" },
  { label: "Sale", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80" },
];

const testimonials = [
  { name: "Aisha M.", text: "The fabric, the fit, the quiet confidence — Velura nails the modern luxury feel without shouting.", rating: 5 },
  { name: "James K.", text: "I've never received so many compliments on a single coat. Worth every penny.", rating: 5 },
  { name: "Priya S.", text: "Shipping was fast, packaging was beautiful, and the silk blouse is even better in person.", rating: 5 },
];

function Home() {
  const trending = products.filter((p) => p.isTrending).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 6);

  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <Section title="Trending Now" subtitle="The pieces our community is loving this week.">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>
      <PromoBanner />
      <Section title="New Arrivals" subtitle="Just landed in the atelier.">
        <div className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-2 hide-scrollbar md:mx-0 md:px-0">
          {newArrivals.map((p) => (
            <div key={p.id} className="w-[260px] shrink-0 md:w-[280px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Section>
      <Testimonials />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
      <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/40 to-transparent" />
      <div className="container-luxe relative z-10 flex h-full flex-col justify-center text-primary-foreground">
        <span className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-gold)]">
          Autumn / Winter 2025
        </span>
        <h1 className="max-w-2xl font-display text-5xl font-bold leading-[1.05] md:text-7xl lg:text-8xl">
          Wear What <em className="text-[var(--color-gold)] not-italic">You Feel</em>
        </h1>
        <p className="mt-6 max-w-md text-base text-primary-foreground/85 md:text-lg">
          Considered design, ethical materials, and a quiet kind of luxury — built for the way you actually live.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 rounded-md bg-[var(--color-gold)] px-6 py-3.5 text-sm font-medium text-[var(--color-gold-foreground)] transition hover:brightness-105"
          >
            Shop Now
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
          <Link
            to="/shop"
            className="rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3.5 text-sm font-medium text-primary-foreground backdrop-blur transition hover:bg-primary-foreground/10"
          >
            Explore Collection
          </Link>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-primary-foreground/80">
        <ChevronDown size={22} />
      </div>
    </section>
  );
}

function FeaturedCategories() {
  return (
    <section className="container-luxe py-16 md:py-24">
      <div className="-mx-5 flex gap-4 overflow-x-auto px-5 hide-scrollbar md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:px-0">
        {categories.map((c) => (
          <Link
            key={c.label}
            to="/shop"
            className="group relative block aspect-[3/4] w-[230px] shrink-0 overflow-hidden rounded-lg md:w-auto"
          >
            <img
              src={c.img}
              alt={c.label}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
              <span className="font-display text-2xl text-primary-foreground">{c.label}</span>
              <ArrowRight className="text-primary-foreground transition group-hover:translate-x-1" size={18} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-luxe py-16 md:py-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-3xl font-semibold md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <Link
          to="/shop"
          className="text-sm font-medium text-foreground hover:text-[var(--color-gold)]"
        >
          View all →
        </Link>
      </div>
      {children}
    </section>
  );
}

function PromoBanner() {
  const [time, setTime] = useState(72 * 3600);
  useEffect(() => {
    const t = setInterval(() => setTime((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");

  return (
    <section className="bg-primary py-12 text-primary-foreground">
      <div className="container-luxe flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">Limited Time</p>
          <h3 className="mt-2 font-display text-2xl md:text-3xl">
            Complimentary shipping on orders over $99
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {[
            { l: "Hours", v: h },
            { l: "Mins", v: m },
            { l: "Secs", v: s },
          ].map((b) => (
            <div key={b.l} className="grid w-20 place-items-center rounded-md border border-primary-foreground/20 p-3">
              <span className="font-display text-3xl font-semibold text-[var(--color-gold)]">{b.v}</span>
              <span className="text-[10px] uppercase tracking-wider text-primary-foreground/60">{b.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[i];
  return (
    <section className="container-luxe py-20">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">Loved by our community</h2>
      </div>
      <div className="mx-auto max-w-2xl rounded-xl bg-card p-8 text-center shadow-soft md:p-12">
        <div className="flex justify-center"><Stars rating={t.rating} size={18} /></div>
        <p className="mt-5 font-display text-xl text-foreground md:text-2xl">"{t.text}"</p>
        <p className="mt-5 text-sm font-medium uppercase tracking-wider text-muted-foreground">— {t.name}</p>
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Show review ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-8 bg-[var(--color-gold)]" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
