import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthField, AuthLayout } from "@/components/site/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — KashaShoop" },
      { name: "description", content: "Masuk ke akun KashaShoop kamu." },
      { property: "og:title", content: "Masuk — KashaShoop" },
      { property: "og:description", content: "Masuk untuk belanja lebih mudah." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const x: typeof err = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) x.email = "Masukkan email yang valid";
    if (password.length < 6) x.password = "Password minimal 6 karakter";
    setErr(x);
    if (Object.keys(x).length) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.toLowerCase(), password });
    setLoading(false);
    if (error) { setErr({ password: "Email atau password salah" }); return; }
    toast.success("Selamat datang kembali!");
    navigate({ to: "/" });
  };

  return (
    <AuthLayout title="Masuk" subtitle="Selamat datang kembali di KashaShoop">
      <form onSubmit={submit} noValidate className="space-y-4">
        <AuthField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={err.email} />
        <AuthField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={err.password} />
        <Button size="lg" type="submit" className="w-full" disabled={loading}>{loading ? "Memproses..." : "Masuk"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Belum punya akun? <Link to="/register" className="font-semibold text-primary hover:underline">Daftar</Link></p>
    </AuthLayout>
  );
}
