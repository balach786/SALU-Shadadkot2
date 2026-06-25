import { createFileRoute } from "@tanstack/react-router";
import { Award, Building2, Quote, Target, Eye, Network } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import director from "@/assets/director.jpg";
import { SITE } from "@/lib/config";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SALU Shadadkot Campus" },
      { name: "description", content: "History, mission, vision and leadership of Shah Abdul Latif University Shadadkot Campus." },
      { property: "og:title", content: "About — SALU Shadadkot Campus" },
      { property: "og:description", content: "Our history, mission, vision and leadership." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the Campus"
        title="Heritage, scholarship and service"
        description="The Shadadkot Campus extends SALU's legacy of academic excellence into upper Sindh — a community of scholars, learners and citizens."
      />

      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="gold-divider" />
            <h2 className="mt-3 font-display text-3xl font-bold text-primary">Our History</h2>
            <p className="mt-4 text-muted-foreground">
              Shah Abdul Latif University was founded in 1987 in Khairpur and has grown into one of Sindh's most respected
              public universities. The Shadadkot Campus was established to broaden access to high-quality higher education
              for students of Qambar-Shahdadkot district and the surrounding region. The campus brings the parent
              university's academic rigor closer to home, while preserving the cultural and intellectual values of Sindh.
            </p>
            <p className="mt-4 text-muted-foreground">
              Today the campus offers HEC-recognized undergraduate programs in Computer Science, English and Business
              Administration, with a steadily expanding research, faculty and student body.
            </p>
          </div>
          <div className="card-elev p-6">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold">Accreditation</p>
            <h3 className="mt-2 font-display text-xl font-bold">HEC Recognized</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3"><Award className="h-5 w-5 shrink-0 text-primary" /> Higher Education Commission, Pakistan</li>
              <li className="flex gap-3"><Building2 className="h-5 w-5 shrink-0 text-primary" /> Chartered Public Sector University</li>
              <li className="flex gap-3"><Network className="h-5 w-5 shrink-0 text-primary" /> Affiliated with SALU Main Campus, Khairpur</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Pillar icon={Target} title="Our Mission">
            To deliver inclusive, research-informed higher education that prepares students to lead with competence,
            integrity and a deep commitment to community service.
          </Pillar>
          <Pillar icon={Eye} title="Our Vision">
            To be a leading regional campus of national distinction, recognized for transformative teaching, applied
            research and ethical leadership.
          </Pillar>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative">
            <img src={director} alt="Campus Director" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-elev" width={768} height={896} loading="lazy" />
            <div className="absolute -right-4 bottom-6 hidden rounded-xl bg-gold px-4 py-3 text-gold-foreground shadow-gold sm:block">
              <p className="font-display text-xs font-semibold uppercase tracking-wider">Campus Director</p>
              <p className="font-display text-lg font-bold">Prof. Dr. Aijaz Ali</p>
            </div>
          </div>
          <div>
            <span className="gold-divider" />
            <h2 className="mt-3 font-display text-3xl font-bold text-primary">A message from the Director</h2>
            <Quote className="mt-6 h-8 w-8 text-gold" />
            <p className="mt-3 text-lg text-foreground/85">
              "At SALU Shadadkot, we believe that a university is more than classrooms — it is a community that nurtures
              character, curiosity and courage. We are committed to giving every student the academic foundation and the
              ethical compass they need to lead meaningful lives and serve their society."
            </p>
            <p className="mt-6 font-semibold text-foreground">— Prof. Dr. Aijaz Ali</p>
            <p className="text-sm text-muted-foreground">Campus Director, {SITE.shortName} {SITE.campus}</p>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="gold-divider" />
            <h2 className="mt-3 font-display text-3xl font-bold text-primary">Organizational Chart</h2>
            <p className="mt-3 text-muted-foreground">A clear, accountable structure for academic and administrative leadership.</p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <OrgNode title="Vice Chancellor" subtitle="SALU Main Campus, Khairpur" tone="primary" />
            <Branch />
            <OrgNode title="Campus Director" subtitle="SALU Shadadkot Campus" tone="gold" />
            <Branch />
            <div className="grid gap-4 sm:grid-cols-3">
              <OrgNode title="Director Academics" subtitle="Programs & Faculty" />
              <OrgNode title="Director Admissions" subtitle="Admissions & Registry" />
              <OrgNode title="Director Administration" subtitle="Operations & Finance" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Pillar({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="card-elev p-8">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 font-display text-2xl font-bold text-foreground">{title}</h3>
      <p className="mt-3 text-muted-foreground">{children}</p>
    </div>
  );
}

function OrgNode({ title, subtitle, tone = "default" }: { title: string; subtitle: string; tone?: "primary" | "gold" | "default" }) {
  const styles =
    tone === "primary"
      ? "bg-primary text-primary-foreground border-primary"
      : tone === "gold"
        ? "bg-gold text-gold-foreground border-gold"
        : "bg-card text-foreground border-border";
  return (
    <div className={`mx-auto max-w-xs rounded-xl border px-5 py-4 text-center shadow-soft ${styles}`}>
      <p className="font-display font-bold">{title}</p>
      <p className="text-xs opacity-80">{subtitle}</p>
    </div>
  );
}

function Branch() {
  return <div className="mx-auto my-4 h-8 w-px bg-border" />;
}
