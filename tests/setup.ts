/** Default seed passwords so DB-backed stores work in unit tests. */
process.env.SEED_PASSWORD_LAURA ??= "laura-test-secret";
process.env.SEED_PASSWORD_DEMO ??= "demo-test-secret";
process.env.SESSION_SECRET ??= "test-session-secret-at-least-32-chars!!";
