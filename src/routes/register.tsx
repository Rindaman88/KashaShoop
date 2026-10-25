import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AuthField, AuthLayout } from "@/components/site/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar — KashaShoop" },
      { name: "description", content: "Buat akun KashaShoop dan nikmati promo spesial." },
      { property: "og:title", content: "Daftar — KashaShoop" },
      { property: "og:description", content: "Gabung bersama KashaShoop." },
    ],
  }),
  component: Register,
});

function Register() {
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState<Partial<typeof f>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const x: Partial<typeof f> = {};
    if (f.name.trim().length < 3) x.name = "Nama lengkap minimal 3 karakter";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Masukkan email yang valid";
    if (f.password.length < 6) x.password = "Password minimal 6 karakter";
    if (f.confirm !== f.password) x.confirm = "Konfirmasi password tidak sama";
    setErr(x);
    if (Object.keys(x).length) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: f.email.toLowerCase(),
      password: f.password,
      options: { data: { full_name: f.name.trim() }, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) { setErr({ email: error.message.includes("already") ? "Email sudah terdaftar" : error.message }); return; }
    setSent(true);
  };

  const bind = (k: keyof typeof f) => ({ value: f[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value }), error: err[k] });

  if (sent)
    return (
      <AuthLayout title="Cek Email Kamu" subtitle="Satu langkah lagi">
        <p className="text-sm text-muted-foreground">
          Kami telah mengirim tautan konfirmasi ke <span className="font-semibold text-foreground">{f.email}</span>.
          Klik tautan di email tersebut untuk mengaktifkan akunmu, lalu masuk.
        </p>
        <Button size="lg" className="mt-6 w-full" asChild><Link to="/login">Ke halaman Masuk</Link></Button>
      </AuthLayout>
    );

  return (
    <AuthLayout title="Daftar" subtitle="Buat akun dan nikmati promo spesial">
      <form onSubmit={submit} noValidate className="space-y-4">
        <AuthField label="Nama lengkap" {...bind("name")} />
        <AuthField label="Email" type="email" {...bind("email")} />
        <AuthField label="Password" type="password" {...bind("password")} />
        <AuthField label="Konfirmasi password" type="password" {...bind("confirm")} />
        <Button size="lg" type="submit" className="w-full" disabled={loading}>{loading ? "Memproses..." : "Daftar"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Sudah punya akun? <Link to="/login" className="font-semibold text-primary hover:underline">Masuk</Link></p>
    </AuthLayout>
  );
}
