import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { PROGRAMS } from "@/lib/config";

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const program = PROGRAMS.find((p) => p.slug === params.slug);
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.program.title} — SALU Shadadkot Campus` },
      { name: "description", content: loaderData?.program.short },
      { property: "og:title", content: loaderData?.program.title },
      { property: "og:description", content: loaderData?.program.short },
    ],
  }),
  component: ProgramDetail,
  notFoundComponent: () => (
    <div className="container-x py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Program not found</h1>
      <Button asChild className="mt-6"><Link to="/programs">Back to Programs</Link></Button>
    </div>
  ),
});

function ProgramDetail() {
  const { program } = Route.useLoaderData();
  return (
    <>
      <PageHero eyebrow="Program" title={program.title} description={program.short} />

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-10">
            <Block title="Eligibility">
              <p className="text-muted-foreground">{program.eligibility}</p>
            </Block>

            <Block title="Fee Structure">
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    <Row k="Per Semester" v={program.fee} />
                    <Row k="Admission Processing" v="Rs. 2,000 (one-time)" />
                    <Row k="Security (refundable)" v="Rs. 5,000" />
                    <Row k="Library & ID Card" v="Rs. 1,500 / year" />
                  </tbody>
                </table>
              </div>
            </Block>

            <Block title="Curriculum Overview">
              <div className="space-y-3">
                {program.curriculum.map((s: { sem: string; courses: readonly string[] }) => (
                  <details key={s.sem} className="group rounded-xl border border-border bg-card p-4 open:shadow-soft">
                    <summary className="flex cursor-pointer items-center justify-between font-display font-semibold text-foreground">
                      {s.sem}
                      <span className="text-xs text-muted-foreground">{s.courses.length} courses</span>
                    </summary>
                    <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      {s.courses.map((c: string) => (
                        <li key={c} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />{c}</li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </Block>

            <Block title="Career Opportunities">
              <ul className="grid gap-3 sm:grid-cols-2">
                {program.careers.map((c: string) => (
                  <li key={c} className="card-elev flex items-center gap-3 p-4 text-sm">
                    <GraduationCap className="h-5 w-5 text-gold" /> {c}
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="card-elev p-6">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-gold">Quick Facts</p>
              <dl className="mt-4 space-y-3 text-sm">
                <Fact k="Duration" v={program.duration} />
                <Fact k="Credit Hours" v={program.credits} />
                <Fact k="Seats" v={`${program.seats} per intake`} />
                <Fact k="Fee" v={program.fee} />
              </dl>
              <Button asChild variant="gold" className="mt-6 w-full">
                <Link to="/admissions">Apply for {program.title.replace("BS ", "")} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="card-elev p-6">
              <p className="font-display text-base font-semibold">Need help choosing?</p>
              <p className="mt-1 text-sm text-muted-foreground">Talk to our admissions team — we'll guide you through eligibility and the application steps.</p>
              <Button asChild variant="outline" className="mt-4 w-full"><Link to="/contact">Contact Admissions</Link></Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <span className="gold-divider" />
      <h2 className="mt-3 font-display text-2xl font-bold text-primary">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <tr>
      <th scope="row" className="bg-surface px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</th>
      <td className="px-4 py-3 text-foreground">{v}</td>
    </tr>
  );
}
function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-semibold text-foreground">{v}</dd>
    </div>
  );
}
