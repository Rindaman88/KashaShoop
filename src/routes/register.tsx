import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthField, AuthLayout } from "@/components/site/AuthLayout";
import { useStore } from "@/lib/store";

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
  const { setUser } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState<Partial<typeof f>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const x: Partial<typeof f> = {};
    if (f.name.trim().length < 3) x.name = "Nama lengkap minimal 3 karakter";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Masukkan email yang valid";
    if (f.password.length < 6) x.password = "Password minimal 6 karakter";
    if (f.confirm !== f.password) x.confirm = "Konfirmasi password tidak sama";
    const accounts = JSON.parse(localStorage.getItem("kasha-accounts") || "{}");
    if (!x.email && accounts[f.email.toLowerCase()]) x.email = "Email sudah terdaftar";
    setErr(x);
    if (Object.keys(x).length) return;
    accounts[f.email.toLowerCase()] = { name: f.name.trim(), password: f.password };
    localStorage.setItem("kasha-accounts", JSON.stringify(accounts));
    setUser({ name: f.name.trim(), email: f.email.toLowerCase() });
    toast.success("Akun berhasil dibuat!");
    navigate({ to: "/" });
  };

  const bind = (k: keyof typeof f) => ({ value: f[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value }), error: err[k] });

  return (
    <AuthLayout title="Daftar" subtitle="Buat akun dan nikmati promo spesial">
      <form onSubmit={submit} noValidate className="space-y-4">
        <AuthField label="Nama lengkap" {...bind("name")} />
        <AuthField label="Email" type="email" {...bind("email")} />
        <AuthField label="Password" type="password" {...bind("password")} />
        <AuthField label="Konfirmasi password" type="password" {...bind("confirm")} />
        <Button size="lg" type="submit" className="w-full">Daftar</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Sudah punya akun? <Link to="/login" className="font-semibold text-primary hover:underline">Masuk</Link></p>
    </AuthLayout>
  );
}
