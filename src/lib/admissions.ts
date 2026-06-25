import { z } from "zod";
import { APPS_SCRIPT_URL } from "./config";

export const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;

export const admissionSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  fatherName: z.string().trim().min(2, "Father's name is required").max(80),
  cnic: z.string().regex(CNIC_REGEX, "CNIC must look like 12345-1234567-1"),
  dob: z.string().min(4, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().trim().min(10, "Phone is required").max(20),
  email: z.string().trim().email("Invalid email").max(120),
  address: z.string().trim().min(5, "Address is required").max(200),
  program: z.string().min(2, "Please select a program"),
});

export type AdmissionInput = z.infer<typeof admissionSchema>;

export interface ApplicantRecord {
  applicationId: string;
  timestamp: string;
  fullName: string;
  fatherName: string;
  cnic: string;
  phone: string;
  email: string;
  program: string;
  photoUrl?: string;
  documentsUrl?: string;
  feeScreenshotUrl?: string;
  cardUrl?: string;
  qrUrl?: string;
  status: string;
}

export function isBackendConfigured(): boolean {
  return !!APPS_SCRIPT_URL && APPS_SCRIPT_URL.startsWith("http");
}

/**
 * Submit application as FormData (so files travel as-is) to the
 * Apps Script Web App. Apps Script `doPost(e)` reads
 * e.parameter.* (text fields) and e.files.* (uploaded blobs).
 */
export async function submitApplication(
  input: AdmissionInput,
  files: { photo?: File | null; documents?: File | null; fee?: File | null },
): Promise<{ ok: true; data: ApplicantRecord } | { ok: false; error: string }> {
  if (!isBackendConfigured()) {
    return {
      ok: false,
      error:
        "The admission backend is not configured yet. Add your Apps Script URL in src/lib/config.ts.",
    };
  }

  const fd = new FormData();
  fd.append("action", "submit");
  Object.entries(input).forEach(([k, v]) => fd.append(k, String(v)));
  if (files.photo) fd.append("photo", files.photo);
  if (files.documents) fd.append("documents", files.documents);
  if (files.fee) fd.append("feeScreenshot", files.fee);

  try {
    const res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok || json.ok === false) {
      return { ok: false, error: json.error || `Request failed (${res.status})` };
    }
    return { ok: true, data: json.data as ApplicantRecord };
  } catch (err) {
    return { ok: false, error: (err as Error).message || "Network error" };
  }
}

export async function searchByCnic(
  cnic: string,
): Promise<{ ok: true; data: ApplicantRecord } | { ok: false; error: string }> {
  if (!CNIC_REGEX.test(cnic)) {
    return { ok: false, error: "Enter CNIC in the format 12345-1234567-1" };
  }
  if (!isBackendConfigured()) {
    return { ok: false, error: "Backend not configured." };
  }
  try {
    const url = `${APPS_SCRIPT_URL}?action=search&cnic=${encodeURIComponent(cnic)}`;
    const res = await fetch(url, { method: "GET" });
    const json = await res.json();
    if (!res.ok || json.ok === false) {
      return { ok: false, error: json.error || "No application found for this CNIC." };
    }
    return { ok: true, data: json.data as ApplicantRecord };
  } catch (err) {
    return { ok: false, error: (err as Error).message || "Network error" };
  }
}

export async function fetchAllApplications(): Promise<
  { ok: true; data: ApplicantRecord[] } | { ok: false; error: string }
> {
  if (!isBackendConfigured()) return { ok: false, error: "Backend not configured." };
  try {
    const url = `${APPS_SCRIPT_URL}?action=list`;
    const res = await fetch(url, { method: "GET" });
    const json = await res.json();
    if (!res.ok || json.ok === false) {
      return { ok: false, error: json.error || "Failed to load applications" };
    }
    return { ok: true, data: (json.data as ApplicantRecord[]) ?? [] };
  } catch (err) {
    return { ok: false, error: (err as Error).message || "Network error" };
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isBackendConfigured()) return { ok: false, error: "Backend not configured." };
  try {
    const fd = new FormData();
    fd.append("action", "updateStatus");
    fd.append("applicationId", applicationId);
    fd.append("status", status);
    const res = await fetch(APPS_SCRIPT_URL, { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok || json.ok === false) return { ok: false, error: json.error || "Update failed" };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message || "Network error" };
  }
}

/** Build QR URL for client-side card preview (Apps Script also generates one). */
export function buildQrUrl(payload: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(
    payload,
  )}`;
}
