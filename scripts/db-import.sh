#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# db-import.sh — Import the exported dump into the new Railway Postgres
# Usage: DATABASE_URL="postgresql://..." bash scripts/db-import.sh dump.sql
# ─────────────────────────────────────────────────────────────────────────────

set -e

DUMP_FILE="${1:-}"

if [ -z "$DUMP_FILE" ]; then
  echo "ERROR: Please provide the dump file as an argument."
  echo "Usage: DATABASE_URL='postgresql://...' bash scripts/db-import.sh dump.sql"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set."
  exit 1
fi

echo "==> Importing ${DUMP_FILE} into new database..."
psql "$DATABASE_URL" < "${DUMP_FILE}"

echo ""
echo "==> Verifying table row counts..."
psql "$DATABASE_URL" -c "
SELECT
  'users' AS table_name, COUNT(*) AS rows FROM users
UNION ALL
SELECT 'document_uploads', COUNT(*) FROM document_uploads
UNION ALL
SELECT 'published_documents', COUNT(*) FROM published_documents
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'applications', COUNT(*) FROM applications;
"

echo ""
echo "==> Import complete!"
