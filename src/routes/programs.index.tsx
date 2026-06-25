import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Briefcase, Cpu } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { PROGRAMS } from "@/lib/config";

const ICONS = { "bs-computer-science": Cpu, "bs-english": BookOpen, "bs-bba": Briefcase } as const;

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Programs — SALU Shadadkot Campus" },
      { name: "description", content: "BS Computer Science, BS English and BS BBA — four-year degree programs." },
      { property: "og:title", content: "Undergraduate Programs" },
      { property: "og:description", content: "BS Computer Science, BS English and BS BBA." },
    ],
  }),
  component: ProgramsIndex,
});

function ProgramsIndex() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Undergraduate Programs"
        description="Three flagship 4-year programs across computing, humanities and business — built around HEC-approved curricula and modern pedagogy."
      />
      <section className="section-y">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {PROGRAMS.map((p) => {
            const Icon = ICONS[p.slug];
            return (
              <div key={p.slug} className="card-elev flex flex-col p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.short}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  <Stat label="Duration" value={p.duration.split(" ")[0] + " yrs"} />
                  <Stat label="Seats" value={String(p.seats)} />
                  <Stat label="Credits" value={p.credits.split(" ")[0]} />
                  <Stat label="Fee" value={p.fee.split("/")[0].trim()} />
                </dl>
                <Button asChild className="mt-6">
                  <Link to="/programs/$slug" params={{ slug: p.slug }}>
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface p-3">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-display text-sm font-bold text-primary">{value}</dd>
    </div>
  );
}
