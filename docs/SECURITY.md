# Security notes

The original password scheme used SHA-256(password + one global salt). It was fast, had no per-user salt, and made offline guessing cheap. The fix uses versioned scrypt hashes with random salts. Existing seeded users remain compatible: successful legacy login is rehashed immediately, without needing plaintext passwords from a migration job.

The original web server also minted API JWTs using the API signing secret. A compromised web tier could therefore forge arbitrary API identities or roles. The API now owns JWT issuance; the web session stores and forwards the API-issued token. Production requires explicit GRPC_JWT_SECRET and SESSION_SECRET.