import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { APPS_SCRIPT_URL, SITE } from "@/lib/config";
import { isBackendConfigured } from "@/lib/admissions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SALU Shadadkot Campus" },
      { name: "description", content: "Get in touch with SALU Shadadkot — phone, email, address and contact form." },
      { property: "og:title", content: "Contact SALU Shadadkot" },
      { property: "og:description", content: "Phone, email, address and contact form." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill name, email and message.");
      setStatus("error");
      return;
    }
    if (!isBackendConfigured()) {
      setError("Contact backend not configured (APPS_SCRIPT_URL is empty).");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const fd = new FormData();
      fd.append("action", "contact");
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.ok === false) throw new Error(json.error || "Failed to send");
      setStatus("ok");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Contact the Campus"
        description="We're happy to answer questions about admissions, programs and campus life."
      />

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={submit} className="card-elev p-6 sm:p-8" noValidate>
            <h2 className="font-display text-xl font-bold text-primary">Send a message</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Item label="Full Name *"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Item>
              <Item label="Email *"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Item>
              <Item label="Subject" full><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Item>
              <Item label="Message *" full><Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Item>
            </div>

            {status === "ok" && (
              <p className="mt-5 flex items-start gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
                <CheckCircle2 className="mt-0.5 h-4 w-4" /> Message received. We'll respond shortly.
              </p>
            )}
            {status === "error" && error && (
              <p className="mt-5 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4" /> {error}
              </p>
            )}
            <Button type="submit" size="lg" variant="gold" className="mt-6" disabled={status === "loading"}>
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send Message
            </Button>
          </form>

          <aside className="space-y-6">
            <div className="card-elev p-6">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-gold">Reach Us</p>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 text-primary" /><span>{SITE.address}</span></li>
                <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 text-primary" /><span>{SITE.phone}</span></li>
                <li className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 text-primary" /><span>{SITE.email}</span></li>
              </ul>
            </div>
            <div className="card-elev p-6">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-gold">Department Contacts</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li><span className="font-semibold">Admissions Office</span> · {SITE.admissionsEmail}</li>
                <li><span className="font-semibold">Examination Cell</span> · exams@salu-shadadkot.edu.pk</li>
                <li><span className="font-semibold">Student Affairs</span> · students@salu-shadadkot.edu.pk</li>
                <li><span className="font-semibold">IT Support</span> · it@salu-shadadkot.edu.pk</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="gold-divider" />
            <h2 className="mt-3 font-display text-2xl font-bold text-primary">Frequently Asked</h2>
            <Accordion type="single" collapsible className="mt-6">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`f-${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <iframe
              src={SITE.mapEmbed}
              title="Campus location"
              className="h-full min-h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Item({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

const FAQS = [
  { q: "When do admissions open?", a: "Admissions for Fall 2026 are currently open. The deadline will be announced on the News page." },
  { q: "How can I track my application?", a: "Use the CNIC Search box on the home page or admissions page. Enter the same CNIC you used during application." },
  { q: "Can I edit my application after submitting?", a: "No, but you may contact the admissions office to correct an error. Please reference your Application ID." },
  { q: "Is the applicant card the admit card?", a: "No. The applicant card confirms your application was received. The admit card is issued before the entry test." },
];
