import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/lib/admin-gate.functions";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Login — SALU Shadadkot" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const login = useServerFn(adminLogin);
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login({ data: { password: pw } });
    setLoading(false);
    if (res.ok) {
      await router.navigate({ to: "/admin" });
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elev">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="SALU" className="h-16 w-16" />
          <h1 className="mt-4 font-display text-2xl font-bold text-primary">Admin Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Restricted area — staff only.</p>
        </div>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
            <Input
              type="password"
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
            />
          </div>
          {error && (
            <p className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4" /> {error}
            </p>
          )}
          <Button type="submit" size="lg" variant="default" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
