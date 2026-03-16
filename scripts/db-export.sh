#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# db-export.sh — Export the Replit Postgres database
# Run this script FROM INSIDE the Replit Shell (Console tab)
# ─────────────────────────────────────────────────────────────────────────────

set -e

DUMP_FILE="10000_days_capital_$(date +%Y%m%d_%H%M%S).sql"

echo "==> Exporting database to ${DUMP_FILE}..."
pg_dump "$DATABASE_URL" \
  --no-owner \
  --no-acl \
  --format=plain \
  --file="${DUMP_FILE}"

echo "==> Export complete. Lines: $(wc -l < ${DUMP_FILE})"
echo ""
echo "==> Scanning for any remaining 'Capital Citadel' strings in the dump..."
grep -i "capital.citadel\|capital-citadel" "${DUMP_FILE}" || echo "    None found — clean!"
echo ""
echo "==> Upload this file to your new host or paste it to Manus."
echo "    File: $(pwd)/${DUMP_FILE}"
