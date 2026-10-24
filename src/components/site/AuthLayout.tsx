import type { ReactNode } from "react";
import hero from "@/assets/hero.jpg";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="container-k py-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border md:grid-cols-2">
        <img src={hero} alt="" className="hidden h-full w-full object-cover object-right md:block" />
        <div className="p-8 md:p-12">
          <h1 className="font-display text-4xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <p className="mt-4 rounded-lg bg-blush px-3 py-2 text-xs text-blush-foreground">Mode demo: akun hanya disimpan di browser ini, bukan autentikasi aman.</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AuthField({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input {...props} className={`mt-1 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary ${error ? "border-destructive" : "border-input"}`} />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
