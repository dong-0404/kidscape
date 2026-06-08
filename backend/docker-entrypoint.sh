#!/bin/sh
set -e

# Idempotent, create-only: creates the first admin if none exists, never
# overwrites an existing one. Safe to run on every container start.
echo "→ Seeding admin (create-only)…"
node seed/seed.js || echo "⚠ Seed skipped or failed — continuing to start the server."

echo "→ Starting KidScape API…"
exec node src/server.js
