import { createFileRoute } from "@tanstack/react-router";
import { Activity, Coffee, HeartPulse, Library, Music, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import students from "@/assets/facility-students.jpg";
import library from "@/assets/facility-library.jpg";
import lab from "@/assets/facility-lab.jpg";
import hall from "@/assets/facility-hall.jpg";

export const Route = createFileRoute("/campus-life")({
  head: () => ({
    meta: [
      { title: "Campus Life — SALU Shadadkot" },
      { name: "description", content: "Sports, societies, hostels and student support at SALU Shadadkot Campus." },
      { property: "og:title", content: "Campus Life" },
      { property: "og:description", content: "A vibrant community of learners and leaders." },
    ],
  }),
  component: CampusLife,
});

function CampusLife() {
  return (
    <>
      <PageHero
        eyebrow="Campus Life"
        title="A community that lifts you up"
        description="More than classrooms — a vibrant ecosystem of clubs, sports, mentorship and lifelong friendships."
        image={students}
      />

      <section className="section-y">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [Users, "Student Societies", "Literary, debating, tech and entrepreneurship clubs led by students."],
            [Activity, "Sports & Athletics", "Cricket, football, badminton and athletics — facilities for every level."],
            [Music, "Cultural Events", "Annual literary festival, sports gala and cultural nights."],
            [HeartPulse, "Wellness & Counselling", "On-campus counsellors and a wellness program for every student."],
            [Library, "Quiet Study Spaces", "Reading rooms, digital library and 24-hour study lounges."],
            [Coffee, "Student Lounge & Cafe", "A relaxed space to recharge between classes."],
          ].map(([Icon, title, body]) => (
            <div key={title as string} className="card-elev p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gold/15 text-gold">
                {/* @ts-ignore */}
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{title as string}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-x">
          <span className="gold-divider" />
          <h2 className="mt-3 font-display text-3xl font-bold text-primary">Inside the campus</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[library, lab, hall, students].map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square w-full rounded-xl object-cover shadow-soft" loading="lazy" width={1024} height={1024} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
