import { Download, Printer, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { SITE } from "@/lib/config";
import { buildQrUrl, type ApplicantRecord } from "@/lib/admissions";

interface Props {
  data: ApplicantRecord;
  onSearchAgain?: () => void;
}

export function ApplicantCard({ data, onSearchAgain }: Props) {
  const dateStr = data.timestamp
    ? new Date(data.timestamp).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB");

  const qrPayload = data.qrUrl || `${data.applicationId}|${data.cnic}|${data.fullName}`;

  return (
    <div className="space-y-4">
      <div className="print-area mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-elev">
        {/* Brand band */}
        <div className="flex items-center gap-4 bg-primary px-6 py-5 text-primary-foreground">
          <img src={logo} alt="" className="h-14 w-14 rounded-md bg-white/10 p-1" />
          <div className="flex-1 leading-tight">
            <p className="font-display text-lg font-bold">{SITE.name}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/80">
              {SITE.campus}
            </p>
          </div>
          <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-foreground">
            Admission Card
          </span>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-[120px_1fr_auto]">
          {/* Photo */}
          <div className="h-[150px] w-[120px] overflow-hidden rounded-lg border-2 border-gold bg-secondary">
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt="Applicant"
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback: hide broken image and show placeholder text
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  (e.currentTarget.parentElement as HTMLElement).innerHTML =
                    '<div class="flex h-full items-center justify-center text-xs text-muted-foreground">Photo</div>';
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Photo
              </div>
            )}
          </div>

          {/* Details */}
          <dl className="grid grid-cols-1 gap-y-2 text-sm">
            <Row label="Application ID" value={<span className="font-mono font-semibold text-primary">{data.applicationId}</span>} />
            <Row label="Name" value={data.fullName} />
            <Row label="Father" value={data.fatherName} />
            <Row label="CNIC" value={<span className="font-mono">{data.cnic}</span>} />
            <Row label="Program" value={data.program} />
            <Row label="Date" value={dateStr} />
            <Row
              label="Status"
              value={
                <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                  {data.status || "Submitted"}
                </span>
              }
            />
          </dl>

          {/* QR */}
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              src={buildQrUrl(qrPayload)}
              alt="Verification QR"
              className="h-[120px] w-[120px] rounded-md border border-border bg-white p-1"
            />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Scan to verify</p>
          </div>
        </div>

        <div className="border-t border-border bg-surface px-6 py-3 text-center text-[11px] text-muted-foreground">
          This card is computer-generated. Bring the original CNIC and printed copy on the test day.
        </div>
      </div>

      <div className="no-print mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
        {data.cardUrl && (
          <Button asChild variant="default">
            <a href={data.cardUrl} target="_blank" rel="noreferrer">
              <Download className="h-4 w-4" /> Download PDF
            </a>
          </Button>
        )}
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print
        </Button>
        {onSearchAgain && (
          <Button variant="ghost" onClick={onSearchAgain}>
            <Search className="h-4 w-4" /> Search Another
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-baseline gap-3">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
