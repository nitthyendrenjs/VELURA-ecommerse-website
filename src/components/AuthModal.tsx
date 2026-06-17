import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useUI } from "@/lib/store";

export function AuthModal() {
  const open = useUI((s) => s.authOpen);
  const tab = useUI((s) => s.authTab);
  const setOpen = useUI((s) => s.setAuthOpen);
  const [active, setActive] = useState(tab);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-primary/40 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-xl bg-card p-6 shadow-luxe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl">Welcome to Velura</h3>
          <button onClick={() => setOpen(false)} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="mb-6 grid grid-cols-2 rounded-md bg-secondary p-1">
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`rounded py-2 text-sm font-medium capitalize transition ${
                active === t
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground"
              }`}
            >
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>
        {active === "login" ? <LoginForm onDone={() => setOpen(false)} /> : <SignupForm onDone={() => setOpen(false)} />}
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  ...rest
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        {...rest}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-gold)]"
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const err: Record<string, string> = {};
        if (!/^\S+@\S+\.\S+$/.test(email)) err.email = "Enter a valid email";
        if (pwd.length < 6) err.pwd = "Password must be 6+ characters";
        setErrs(err);
        if (Object.keys(err).length) return;
        toast.success("Welcome back!");
        onDone();
      }}
      className="space-y-4"
    >
      <Field label="Email" type="email" value={email} onChange={setEmail} error={errs.email} />
      <Field label="Password" type="password" value={pwd} onChange={setPwd} error={errs.pwd} />
      <a href="#" className="block text-right text-xs text-muted-foreground hover:text-foreground">
        Forgot password?
      </a>
      <button className="w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Log In
      </button>
    </form>
  );
}

function SignupForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const err: Record<string, string> = {};
        if (!name.trim()) err.name = "Name is required";
        if (!/^\S+@\S+\.\S+$/.test(email)) err.email = "Enter a valid email";
        if (pwd.length < 6) err.pwd = "Password must be 6+ characters";
        if (pwd !== pwd2) err.pwd2 = "Passwords don't match";
        setErrs(err);
        if (Object.keys(err).length) return;
        toast.success("Account created. Welcome!");
        onDone();
      }}
      className="space-y-4"
    >
      <Field label="Name" value={name} onChange={setName} error={errs.name} />
      <Field label="Email" type="email" value={email} onChange={setEmail} error={errs.email} />
      <Field label="Password" type="password" value={pwd} onChange={setPwd} error={errs.pwd} />
      <Field
        label="Confirm Password"
        type="password"
        value={pwd2}
        onChange={setPwd2}
        error={errs.pwd2}
      />
      <button className="w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Create Account
      </button>
    </form>
  );
}
