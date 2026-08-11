import { useState } from "react";
import { X, Loader as Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUI } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

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

function GoogleButton() {
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth("google", {
          redirectTo: window.location.origin,
        });
        if (error) {
          toast.error("Google sign-in failed", { description: error.message });
          setLoading(false);
        }
      }}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background py-3 text-sm font-medium hover:bg-secondary disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
        </svg>
      )}
      Continue with Google
    </button>
  );
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) err.email = "Enter a valid email";
    if (pwd.length < 6) err.pwd = "Password must be 6+ characters";
    setErrs(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    setLoading(false);
    if (error) {
      toast.error("Sign in failed", { description: error.message });
      return;
    }
    toast.success("Welcome back!");
    onDone();
  };

  return (
    <div className="space-y-4">
      <GoogleButton />
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} error={errs.email} />
        <Field label="Password" type="password" value={pwd} onChange={setPwd} error={errs.pwd} />
        <button
          type="button"
          onClick={async () => {
            if (!/^\S+@\S+\.\S+$/.test(email)) {
              toast.error("Enter your email first");
              return;
            }
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) {
              toast.error("Reset failed", { description: error.message });
            } else {
              toast.success("Password reset email sent");
            }
          }}
          className="block text-right text-xs text-muted-foreground hover:text-foreground"
        >
          Forgot password?
        </button>
        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Log In
        </button>
      </form>
    </div>
  );
}

function SignupForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) err.email = "Enter a valid email";
    if (pwd.length < 6) err.pwd = "Password must be 6+ characters";
    if (pwd !== pwd2) err.pwd2 = "Passwords don't match";
    setErrs(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (error) {
      toast.error("Sign up failed", { description: error.message });
      return;
    }
    toast.success("Account created. Welcome!");
    onDone();
  };

  return (
    <div className="space-y-4">
      <GoogleButton />
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-4">
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
        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Create Account
        </button>
      </form>
    </div>
  );
}
