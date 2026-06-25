import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  Download, ExternalLink, FileText, Loader2, LogOut, RefreshCw, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { adminLogout, checkAdminSession } from "@/lib/admin-gate.functions";
import {
  fetchAllApplications, updateApplicationStatus, type ApplicantRecord,
} from "@/lib/admissions";
import { PROGRAMS } from "@/lib/config";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { unlocked } = await checkAdminSession();
    if (!unlocked) throw redirect({ to: "/admin-login" });
  },
  head: () => ({ meta: [{ title: "Admin — SALU Shadadkot" }] }),
  component: AdminPage,
});

const STATUSES = ["Submitted", "Under Review", "Shortlisted", "Test Scheduled", "Admitted", "Rejected"];

function AdminPage() {
  const router = useRouter();
  const logout = useServerFn(adminLogout);
  const [rows, setRows] = useState<ApplicantRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [programFilter, setProgramFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetchAllApplications();
    setLoading(false);
    if (res.ok) setRows(res.data);
    else setError(res.error);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (programFilter !== "all" && r.program !== programFilter) return false;
      if (!q) return true;
      const needle = q.toLowerCase();
      return (
        r.cnic.includes(q) ||
        r.fullName.toLowerCase().includes(needle) ||
        r.applicationId.toLowerCase().includes(needle) ||
        r.email.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, programFilter]);

  async function setStatus(id: string, status: string) {
    setRows((prev) => prev.map((r) => (r.applicationId === id ? { ...r, status } : r)));
    const res = await updateApplicationStatus(id, status);
    if (!res.ok) {
      setError(res.error);
      load();
    }
  }

  async function handleLogout() {
    await logout({});
    await router.navigate({ to: "/" });
  }

  return (
    <div className="bg-surface min-h-screen">
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="container-x flex items-center justify-between py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold">SALU Shadadkot</p>
            <h1 className="font-display text-2xl font-bold">Admissions Admin</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outlineLight" size="sm" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
            <Button variant="outlineLight" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="container-x py-8">
        <div className="card-elev p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, CNIC, application ID or email"
                className="pl-9"
              />
            </div>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="sm:w-64"><SelectValue placeholder="All programs" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {PROGRAMS.map((p) => (
                  <SelectItem key={p.slug} value={p.title}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Files</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No applications found.</TableCell></TableRow>
                )}
                {filtered.map((r) => (
                  <TableRow key={r.applicationId}>
                    <TableCell className="font-mono text-xs text-primary">{r.applicationId}</TableCell>
                    <TableCell className="font-medium">{r.fullName}<div className="text-xs text-muted-foreground">{r.fatherName}</div></TableCell>
                    <TableCell className="font-mono text-xs">{r.cnic}</TableCell>
                    <TableCell className="text-xs">{r.program}</TableCell>
                    <TableCell className="text-xs">{r.email}</TableCell>
                    <TableCell>
                      <Select value={r.status || "Submitted"} onValueChange={(v) => setStatus(r.applicationId, v)}>
                        <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {r.cardUrl && <IconLink href={r.cardUrl} Icon={Download} label="Card" />}
                        {r.photoUrl && <IconLink href={r.photoUrl} Icon={ExternalLink} label="Photo" />}
                        {r.documentsUrl && <IconLink href={r.documentsUrl} Icon={FileText} label="Docs" />}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconLink({ href, Icon, label }: { href: string; Icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" title={label} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary">
      <Icon className="h-4 w-4" />
    </a>
  );
}
