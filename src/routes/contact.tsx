import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Velura" },
      { name: "description", content: "Get in touch with the Velura team. We respond to every message within 24 hours." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  return (
    <div className="container-luxe py-12">
      <h1 className="font-display text-4xl font-semibold md:text-5xl">Get in touch</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Questions about a piece, an order, or a custom request? We'd love to hear from you.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent! We'll get back within 24 hours.");
            setF({ name: "", email: "", subject: "", message: "" });
          }}
          className="space-y-5 rounded-xl bg-card p-6 shadow-soft md:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
            <Field label="Email" type="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
          </div>
          <Field label="Subject" value={f.subject} onChange={(v) => setF({ ...f, subject: v })} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Message
            </span>
            <textarea
              required
              value={f.message}
              onChange={(e) => setF({ ...f, message: e.target.value })}
              rows={6}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
            />
          </label>
          <button className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Send Message
          </button>
        </form>

        <aside className="space-y-5">
          {[
            { i: MapPin, t: "Atelier", d: "Via Brera 22, Milan 20121" },
            { i: Phone, t: "Phone", d: "+1 (212) 555-0142" },
            { i: Mail, t: "Email", d: "hello@velura.shop" },
            { i: Clock, t: "Hours", d: "Mon–Fri · 9:00–18:00 CET" },
          ].map((b) => (
            <div key={b.t} className="flex gap-4 rounded-xl bg-card p-5 shadow-soft">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--color-gold)]/15 text-[var(--color-gold)]">
                <b.i size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{b.t}</p>
                <p className="mt-1 text-sm">{b.d}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
      />
    </label>
  );
}
