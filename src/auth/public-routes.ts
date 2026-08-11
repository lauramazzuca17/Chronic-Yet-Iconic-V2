/**
 * Public auth surfaces for v1 — sign-in only.
 * No /signup or /register (NFR / REQ: seeded accounts only).
 */
export function listPublicAuthRoutes(): string[] {
  return ["/login"];
}
