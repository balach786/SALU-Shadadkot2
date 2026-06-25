import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicantCard } from "@/components/site/ApplicantCard";
import { CnicSearch } from "@/components/site/CnicSearch";
import { PROGRAMS } from "@/lib/config";
import {
  admissionSchema,
  submitApplication,
  type AdmissionInput,
  type ApplicantRecord,
  isBackendConfigured,
} from "@/lib/admissions";

export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "Online Admissions — SALU Shadadkot Campus" },
      { name: "description", content: "Apply online for Fall 2026. Smart admission system with auto applicant card and QR verification." },
      { property: "og:title", content: "Apply Online — SALU Shadadkot Campus" },
      { property: "og:description", content: "Submit your application in minutes. Receive your applicant card instantly." },
    ],
  }),
  component: AdmissionsPage,
});

type FormState = Partial<Record<keyof AdmissionInput, string>>;

function AdmissionsPage() {
  const [values, setValues] = useState<FormState>({ gender: "Male" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [docs, setDocs] = useState<File | null>(null);
  const [fee, setFee] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<ApplicantRecord | null>(null);

  const set = (k: keyof AdmissionInput) => (e: { target: { value: string } } | string) => {
    const v = typeof e === "string" ? e : e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setErrors({});
    const parsed = admissionSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    if (!photo) {
      setErrors({ photo: "Photograph is required" });
      return;
    }
    setSubmitting(true);
    const res = await submitApplication(parsed.data, { photo, documents: docs, fee });
    setSubmitting(false);
    if (res.ok) {
      setResult(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setServerError(res.error);
    }
  }

  if (result) {
    return (
      <>
        <section className="bg-success/10 py-3 text-center text-sm font-medium text-success no-print">
          <CheckCircle2 className="mr-2 inline h-4 w-4" /> Application submitted successfully.
        </section>
        <PageHero
          eyebrow="Application Received"
          title="Welcome to SALU Shadadkot"
          description="Your application has been received. Save this card — you'll need it on the test day."
        />
        <section className="section-y">
          <div className="container-x">
            <ApplicantCard data={result} onSearchAgain={() => setResult(null)} />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Admissions Fall 2026"
        title="Online Admission Form"
        description="Complete your application in under 10 minutes. Receive your applicant card and QR code immediately."
      />

      {!isBackendConfigured() && (
        <div className="container-x mt-6">
          <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
            <AlertCircle className="mt-0.5 h-5 w-5 text-gold" />
            <div>
              <p className="font-semibold">Backend not yet configured</p>
              <p className="mt-1 text-muted-foreground">
                Set <code className="rounded bg-secondary px-1 py-0.5 text-xs">APPS_SCRIPT_URL</code> in{" "}
                <code className="rounded bg-secondary px-1 py-0.5 text-xs">src/lib/config.ts</code> after deploying
                <code className="ml-1 rounded bg-secondary px-1 py-0.5 text-xs">docs/apps-script.gs</code> to Google
                Apps Script. See <strong>docs/SETUP.md</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <form onSubmit={onSubmit} className="card-elev p-6 sm:p-8" noValidate>
            <h2 className="font-display text-xl font-bold text-primary">Applicant Information</h2>
            <p className="mt-1 text-sm text-muted-foreground">All fields marked * are required.</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Full Name *" error={errors.fullName}>
                <Input value={values.fullName ?? ""} onChange={set("fullName")} placeholder="e.g. Ali Khan" />
              </Field>
              <Field label="Father's Name *" error={errors.fatherName}>
                <Input value={values.fatherName ?? ""} onChange={set("fatherName")} placeholder="e.g. Ahmed Khan" />
              </Field>
              <Field label="CNIC * (00000-0000000-0)" error={errors.cnic}>
                <Input value={values.cnic ?? ""} onChange={set("cnic")} placeholder="42101-1234567-1" className="font-mono" inputMode="numeric" />
              </Field>
              <Field label="Date of Birth *" error={errors.dob}>
                <Input type="date" value={values.dob ?? ""} onChange={set("dob")} />
              </Field>
              <Field label="Gender *" error={errors.gender}>
                <Select value={values.gender ?? "Male"} onValueChange={(v) => setValues((s) => ({ ...s, gender: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Phone *" error={errors.phone}>
                <Input value={values.phone ?? ""} onChange={set("phone")} placeholder="+92 3XX XXXXXXX" inputMode="tel" />
              </Field>
              <Field label="Email *" error={errors.email}>
                <Input type="email" value={values.email ?? ""} onChange={set("email")} placeholder="you@example.com" />
              </Field>
              <Field label="Program Applied *" error={errors.program}>
                <Select value={values.program ?? ""} onValueChange={(v) => setValues((s) => ({ ...s, program: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    {PROGRAMS.map((p) => (
                      <SelectItem key={p.slug} value={p.title}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Postal Address *" error={errors.address} full>
                <Textarea rows={3} value={values.address ?? ""} onChange={set("address")} placeholder="House / Street / City / District" />
              </Field>
            </div>

            <h3 className="mt-10 font-display text-lg font-bold text-primary">Uploads</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <FileField label="Photograph * (JPG/PNG)" file={photo} onChange={setPhoto} accept="image/*" error={errors.photo} />
              <FileField label="Documents (PDF)" file={docs} onChange={setDocs} accept="application/pdf,image/*" />
              <FileField label="Fee Screenshot" file={fee} onChange={setFee} accept="image/*" />
            </div>

            {serverError && (
              <p className="mt-6 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {serverError}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button type="submit" size="lg" variant="gold" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
              <p className="text-xs text-muted-foreground">By submitting you agree to provide accurate information.</p>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="card-elev p-6">
              <FileText className="h-7 w-7 text-gold" />
              <h3 className="mt-3 font-display text-lg font-semibold">What happens after I apply?</h3>
              <ol className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li>1. Your applicant card is generated instantly with a unique ID and QR code.</li>
                <li>2. A confirmation email is sent to your provided address.</li>
                <li>3. The Admissions Office reviews documents and notifies you of the test date.</li>
                <li>4. Track your status anytime using the CNIC search below.</li>
              </ol>
            </div>
            <div className="card-elev p-6">
              <p className="font-display text-base font-semibold">Need help?</p>
              <p className="mt-1 text-sm text-muted-foreground">Email or call the admissions office during working hours.</p>
              <Button asChild variant="outline" className="mt-3 w-full"><Link to="/contact">Contact Admissions</Link></Button>
            </div>
          </aside>
        </div>
      </section>

      <CnicSearch />
    </>
  );
}

function Field({ label, error, children, full }: { label: string; error?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function FileField({
  label, file, onChange, accept, error,
}: { label: string; file: File | null; onChange: (f: File | null) => void; accept: string; error?: string }) {
  return (
    <label className="group flex cursor-pointer flex-col items-start rounded-xl border border-dashed border-border bg-surface p-4 transition hover:border-primary">
      <Upload className="h-5 w-5 text-primary" />
      <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="mt-1 text-sm font-medium text-foreground line-clamp-1">{file ? file.name : "Click to upload"}</span>
      <input type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </label>
  );
}
