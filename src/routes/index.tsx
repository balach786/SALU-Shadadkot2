import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Briefcase,
  ShieldCheck,
  QrCode,
  FileDown,
  Mail,
  Search,
  IdCard,
  CheckCircle2,
  Building2,
  GraduationCap,
  Sparkles,
  Library,
  FlaskConical,
  Presentation,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";
import libImg from "@/assets/facility-library.jpg";
import labImg from "@/assets/facility-lab.jpg";
import hallImg from "@/assets/facility-hall.jpg";
import studentsImg from "@/assets/facility-students.jpg";
import { PROGRAMS, SITE } from "@/lib/config";
import { CnicSearch } from "@/components/site/CnicSearch";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — SALU Shadadkot Campus" },
      {
        name: "description",
        content: `${SITE.tagline}. Apply online and receive your applicant card instantly.`,
      },
      { property: "og:title", content: "SALU Shadadkot Campus" },
      { property: "og:description", content: SITE.tagline },
    ],
  }),
  component: HomePage,
});

const PROGRAM_ICONS = {
  "bs-computer-science": Cpu,
  "bs-english": BookOpen,
  "bs-bba": Briefcase,
} as const;

function HomePage() {
  return (
    <>
      {/* ====================== HERO ====================== */}
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="SALU Shadadkot Campus at sunset"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="container-x flex min-h-[78vh] flex-col items-start justify-center py-24 text-primary-foreground sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Admissions Open · Fall 2026
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            Welcome to <span className="text-gradient-gold">Shah Abdul Latif University</span>
            <br />
            Shadadkot Campus
          </h1>
          <p className="mt-6 max-w-2xl text-base text-primary-foreground/85 sm:text-lg">
            {SITE.tagline}. A modern, research-driven campus shaping the next generation of leaders
            from upper Sindh.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="hero">
              <Link to="/admissions">
                Apply Online <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outlineLight">
              <Link to="/programs">Explore Programs</Link>
            </Button>
          </div>

          <dl className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-x-8 gap-y-4 border-t border-white/15 pt-6 sm:grid-cols-4">
            {[
              ["3", "BS Programs"],
              ["170+", "Seats Available"],
              ["4 Yrs", "Degree Duration"],
              ["100%", "Online Apply"],
            ].map(([num, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl font-bold text-gold sm:text-3xl">{num}</dt>
                <dd className="text-xs uppercase tracking-wider text-primary-foreground/75">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ====================== ABOUT SNAPSHOT ====================== */}
      <section className="section-y">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="gold-divider" />
            <h2 className="mt-3 font-display text-3xl font-bold text-primary sm:text-4xl">
              A campus rooted in heritage, built for the future
            </h2>
            <p className="mt-5 text-muted-foreground">
              The Shadadkot Campus of Shah Abdul Latif University extends the parent university's
              legacy of academic distinction into upper Sindh. We combine rigorous teaching, modern
              research infrastructure and a deeply supportive student community.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "HEC-recognized degree programs",
                "Modern computing & language labs",
                "Active research, sports and societies",
                "Digital admission, transparent and traceable",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8">
              <Link to="/about">
                Learn About the Campus <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <img
              src={studentsImg}
              alt="Students at SALU Shadadkot Campus"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-elev"
              loading="lazy"
              width={1024}
              height={768}
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card p-5 shadow-elev sm:block">
              <p className="font-display text-3xl font-bold text-primary">15+</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== PROGRAMS HIGHLIGHT ====================== */}
      <section className="section-y bg-surface">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="gold-divider" />
            <h2 className="mt-3 font-display text-3xl font-bold text-primary sm:text-4xl">
              Undergraduate Programs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three flagship 4-year programs designed to prepare you for industry, research and
              leadership.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PROGRAMS.map((p) => {
              const Icon = PROGRAM_ICONS[p.slug];
              return (
                <div key={p.slug} className="card-elev flex flex-col p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-foreground">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.short}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
                    <span className="text-muted-foreground">{p.duration}</span>
                    <span className="font-semibold text-gold">{p.seats} seats</span>
                  </div>
                  <Link
                    to="/programs/$slug"
                    params={{ slug: p.slug }}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-gold"
                  >
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================== ONLINE ADMISSION HIGHLIGHT ====================== */}
      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <span className="gold-divider" />
            <h2 className="mt-3 font-display text-3xl font-bold text-primary sm:text-4xl">
              Apply Online — fast, secure & fully digital
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our Smart Admission System eliminates paperwork. Submit your application from anywhere
              and receive a verifiable applicant card on the spot.
            </p>
            <ol className="mt-8 space-y-5">
              {[
                ["Fill the Online Form", "Personal info, program choice and contact details."],
                ["Upload Documents", "Photograph, CNIC, certificates and fee screenshot."],
                ["Receive Applicant Card", "Auto-generated card with unique ID and QR code."],
                ["Download PDF", "Save or print your card and receipt instantly."],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold font-display font-bold text-gold-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild variant="gold" size="lg" className="mt-8">
              <Link to="/admissions">Start Application <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Visual: mock applicant card */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card p-2 shadow-elev">
              <div className="rounded-xl bg-primary px-5 py-4 text-primary-foreground">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Applicant Card</p>
                <p className="font-display font-bold">ADM-2026-000145</p>
              </div>
              <div className="grid grid-cols-[80px_1fr_auto] gap-4 p-5">
                <div className="aspect-[4/5] rounded-md bg-secondary" />
                <div className="space-y-1.5 text-sm">
                  <p className="font-semibold">Ali Khan</p>
                  <p className="text-xs text-muted-foreground">BS Computer Science</p>
                  <p className="font-mono text-xs">42101-1234567-1</p>
                  <span className="mt-1 inline-flex items-center rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                    Submitted
                  </span>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-md border border-border bg-white">
                  <QrCode className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 hidden rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground shadow-gold sm:block">
              Generated instantly
            </div>
          </div>
        </div>
      </section>

      {/* ====================== SMART FEATURES ====================== */}
      <section className="section-y bg-surface">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="gold-divider" />
            <h2 className="mt-3 font-display text-3xl font-bold text-primary sm:text-4xl">
              Smart Admission Features
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every application is processed by an automated pipeline — no spreadsheets, no manual
              tracking.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [IdCard, "Auto Applicant ID", "ADM-2026-XXXXXX issued automatically on submit."],
              [FileDown, "Auto Admission Card", "PDF card generated and stored in Google Drive."],
              [QrCode, "QR Code Verification", "Each card has a unique scannable verification code."],
              [ShieldCheck, "Duplicate CNIC Check", "Prevents multiple applications from the same CNIC."],
              [Search, "CNIC Search", "Applicants and staff can look up status by CNIC instantly."],
              [Mail, "Email Notifications", "Automatic confirmation email after submission."],
            ].map(([Icon, title, body]) => (
              <div key={title as string} className="card-elev p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gold/15 text-gold">
                  
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title as string}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CAMPUS FACILITIES ====================== */}
      <section className="section-y">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <span className="gold-divider" />
              <h2 className="mt-3 font-display text-3xl font-bold text-primary sm:text-4xl">
                A campus built around the student
              </h2>
              <p className="mt-3 text-muted-foreground">
                Modern academic, residential and recreational facilities, designed for focused
                learning and meaningful connections.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/campus-life">Explore Campus Life <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Library, "Library", libImg, "Quiet halls, digital catalog and 50,000+ titles."],
              [FlaskConical, "Computer Labs", labImg, "High-end workstations with modern toolchains."],
              [Presentation, "Seminar Hall", hallImg, "Hosts lectures, guest talks and competitions."],
              [Users, "Student Support", studentsImg, "Counselling, mentoring and career services."],
            ].map(([Icon, title, img, body]) => (
              <div key={title as string} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elev">
                <img src={img as string} alt="" className="h-40 w-full object-cover" loading="lazy" width={1024} height={768} />
                <div className="p-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold">{title as string}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{body as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== NEWS ====================== */}
      <section className="section-y bg-surface">
        <div className="container-x">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="gold-divider" />
              <h2 className="mt-3 font-display text-3xl font-bold text-primary sm:text-4xl">
                News & Announcements
              </h2>
            </div>
            <Button asChild variant="ghost"><Link to="/news">All news <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SAMPLE_NEWS.slice(0, 3).map((n) => (
              <article key={n.id} className="card-elev flex flex-col p-6">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold">
                  <Calendar className="h-3.5 w-3.5" /> {n.date}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{n.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{n.summary}</p>
                <Link to="/news" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-gold">
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CNIC SEARCH ====================== */}
      <CnicSearch />

      {/* ====================== CTA STRIP ====================== */}
      <section className="bg-primary">
        <div className="container-x flex flex-col items-center justify-between gap-6 py-12 text-primary-foreground sm:flex-row sm:py-16">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Ready to begin your journey at SALU Shadadkot?
            </h2>
            <p className="mt-2 text-primary-foreground/80">
              Admissions are open. Complete your application in under 10 minutes.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="gold" size="lg">
              <Link to="/admissions">Apply Now</Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export const SAMPLE_NEWS = [
  {
    id: "1",
    date: "20 Jun 2026",
    title: "Fall 2026 admissions are now open",
    summary:
      "Applications are now open for BS Computer Science, English and BBA. Apply online and receive your applicant card instantly.",
  },
  {
    id: "2",
    date: "10 Jun 2026",
    title: "New computing lab inaugurated",
    summary:
      "A 60-workstation lab has been added to support our growing Computer Science cohort and research activities.",
  },
  {
    id: "3",
    date: "01 Jun 2026",
    title: "Annual literary festival announced",
    summary:
      "The English Department will host the third annual literary festival featuring readings, debates and workshops.",
  },
  {
    id: "4",
    date: "22 May 2026",
    title: "Career week at the Shadadkot Campus",
    summary:
      "Industry mentors visited the campus for talks, mock interviews and one-on-one mentoring sessions.",
  },
  {
    id: "5",
    date: "15 May 2026",
    title: "Sports gala 2026 concluded",
    summary:
      "The annual sports gala wrapped up with record participation across cricket, football and athletics.",
  },
];
