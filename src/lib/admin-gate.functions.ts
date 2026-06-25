/**
 * Server-side admin gate.
 * - Reads ADMIN_PASSWORD from env (server-only).
 * - Persists the unlocked flag in an encrypted session cookie.
 * - SESSION_SECRET (>=32 chars) encrypts the cookie.
 * Configure both via the Secrets panel.
 */
import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

interface GateSession {
  unlocked?: boolean;
}

function getSessionConfig() {
  return {
    password: process.env.SESSION_SECRET || "dev-only-secret-please-change-32chars",
    name: "salu-admin",
    maxAge: 60 * 60 * 8, // 8 hours
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function pwMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(getSessionConfig());
  return { unlocked: !!session.data.unlocked };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) return { ok: false as const, error: "ADMIN_PASSWORD is not set on the server." };
    if (!pwMatches(data.password, expected)) {
      return { ok: false as const, error: "Incorrect password." };
    }
    const session = await useSession<GateSession>(getSessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(getSessionConfig());
  await session.clear();
  return { ok: true as const };
});
