---
name: security-audit
description: Structured security review of the codebase and configuration. Use before /ship on standard and full tier projects, after adding auth/payments/uploads/user data features, or when the user asks for a security review. Findings flow into STATUS.md and the risks table.
---

# Security Audit — pre-ship review

## Scope by tier
- lite: quick pass (secrets, input handling, dependency check) — only on request.
- standard: run before first public /ship and after any auth/data feature.
- full: run before EVERY /ship; privacy alignment section is mandatory.

## Checklist (report per item: pass / finding / n-a)
1. **Secrets & config**: no credentials, tokens, or connection strings in
   code, git history, docs vault, or client bundles; .env gitignored and
   .env.example current; 07-credentials.md contains references only.
2. **Input & injection**: all external input validated at the boundary;
   parameterized queries only; output encoding against XSS; file-upload
   type/size limits; no user input reaching shell/eval/paths unsanitized.
3. **AuthN/AuthZ**: every non-public route/action checks authorization
   server-side (object-level too — can user A reach user B's data by ID?);
   session/token expiry and logout actually invalidate; passwords hashed
   with a modern KDF.
4. **Data protection**: TLS assumed everywhere; personal data collected
   matches the 04-privacy data inventory EXACTLY — anything collected but
   not listed is a finding; deletion semantics implemented as documented.
5. **Dependencies**: run the ecosystem's audit tool (npm audit / pip-audit
   / cargo audit); flag known-vulnerable and unmaintained packages.
6. **Platform hardening**: security headers/CSP for web; rate limiting on
   auth and expensive endpoints; errors never leak stack traces or
   internals to users (and error copy follows 42-copy-deck).
7. **Abuse cases**: for each primary journey, one paragraph: how would a
   hostile user abuse this? Anything plausible becomes a finding.

## Output protocol (do not just chat)
- Write findings to docs/30-state/STATUS.md blockers (severity-tagged:
  critical/high/medium/low) and add systemic ones to the risks table in
  06-decisions-risks-roadmap.md.
- Critical/high findings BLOCK /ship until fixed (each fix via the normal
  loop: failing test where testable, then fix) or explicitly accepted by
  the user in the decision log.
- Append an audit entry (date, scope, result) to CHANGELOG.md.
- Never write exploit code; verify fixes with tests, not attacks against
  third parties.
