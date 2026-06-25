import { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchByCnic, type ApplicantRecord, CNIC_REGEX } from "@/lib/admissions";
import { ApplicantCard } from "./ApplicantCard";

interface Props {
  compact?: boolean;
  title?: string;
}

export function CnicSearch({ compact = false, title = "Track Your Application" }: Props) {
  const [cnic, setCnic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApplicantRecord | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!CNIC_REGEX.test(cnic)) {
      setError("Enter CNIC in the format 12345-1234567-1");
      return;
    }
    setLoading(true);
    const res = await searchByCnic(cnic);
    setLoading(false);
    if (res.ok) setResult(res.data);
    else setError(res.error);
  }

  function reset() {
    setResult(null);
    setError(null);
    setCnic("");
  }

  return (
    <div id="search" className={compact ? "" : "section-y bg-surface"}>
      <div className={compact ? "" : "container-x"}>
        {!compact && (
          <div className="mx-auto max-w-2xl text-center">
            <span className="gold-divider" />
            <h2 className="mt-3 font-display text-3xl font-bold text-primary sm:text-4xl">{title}</h2>
            <p className="mt-3 text-muted-foreground">
              Enter the CNIC used during application to view your applicant card and status.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`${compact ? "" : "mx-auto mt-8 max-w-xl"} flex flex-col gap-3 sm:flex-row`}
        >
          <Input
            value={cnic}
            onChange={(e) => setCnic(e.target.value)}
            placeholder="e.g. 42101-1234567-1"
            className="h-12 flex-1 font-mono"
            inputMode="numeric"
            aria-label="CNIC"
          />
          <Button type="submit" size="lg" disabled={loading} className="h-12">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </form>

        {error && (
          <p className={`${compact ? "" : "mx-auto mt-4 max-w-xl"} flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive`}>
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </p>
        )}

        {result && (
          <div className="mt-8">
            <ApplicantCard data={result} onSearchAgain={reset} />
          </div>
        )}
      </div>
    </div>
  );
}
