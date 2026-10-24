import { createFileRoute, notFound } from "@tanstack/react-router";
import { INFO_PAGES } from "@/lib/info";

export const Route = createFileRoute("/info/$slug")({
  loader: ({ params }) => {
    const page = INFO_PAGES.find((p) => p.slug === params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.page.title} — KashaShoop` },
          { name: "description", content: loaderData.page.body[0] },
          { property: "og:title", content: `${loaderData.page.title} — KashaShoop` },
          { property: "og:description", content: loaderData.page.body[0] },
        ]
      : [{ title: "Tidak tersedia — KashaShoop" }, { name: "robots", content: "noindex" }],
  }),
  component: Info,
});

function Info() {
  const { page } = Route.useLoaderData();
  return (
    <div className="container-k max-w-3xl py-14">
      <h1 className="font-display text-4xl font-semibold">{page.title}</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        {page.body.map((t) => <p key={t}>{t}</p>)}
      </div>
    </div>
  );
}
