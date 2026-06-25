import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SAMPLE_NEWS } from "./index";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Announcements — SALU Shadadkot" },
      { name: "description", content: "Latest news, announcements and events from SALU Shadadkot Campus." },
      { property: "og:title", content: "News & Announcements" },
      { property: "og:description", content: "Stay updated with campus news." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        title="News & Announcements"
        description="Stay updated with the latest from the Shadadkot Campus — admissions, events and academic highlights."
      />
      <section className="section-y">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_NEWS.map((n) => (
            <article key={n.id} className="card-elev flex flex-col p-6">
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold">
                <Calendar className="h-3.5 w-3.5" /> {n.date}
              </span>
              <h2 className="mt-3 font-display text-lg font-semibold">{n.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{n.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
