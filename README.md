# Partner Directory

Small Nuxt 4 application for importing partner records from the provided Excel workbook and browsing them via a paginated, searchable API and UI.

## Requirements

- Node.js 20+
- npm
- Docker + Docker Compose (or an existing PostgreSQL database)

## Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run dev
```

Open http://localhost:3000. To use an existing PostgreSQL instance, set `DATABASE_URL` in `.env` and skip Docker Compose. Create the database `partners` before running migrations.

## API

`GET /api/partners?search=help&page=1` returns:

```json
{
  "items": [{ "id": 1, "code": "P200", "name": "Partner CSO #1", "type": "National NGO", "oblast": "Cherkaska", "eligibilityStatus": "Eligible" }],
  "pagination": { "page": 1, "pageSize": 10, "total": 1, "totalPages": 1 }
}
```

Search is case-insensitive and matches partner names. Page defaults to 1; page size is fixed at 10. Invalid page values return HTTP 400.

## Import behavior

The importer reads **only** `DataList (v6)` and the five required columns. It trims text, skips rows missing name or code, and uses `Partner Code` as the unique key. Re-importing the workbook **updates** matching partners instead of inserting duplicates. `Operational Footprint - by Oblast` is stored as supplied in one text field.

The actual spreadsheet header for the code column is `Partner Code- To be adjusted to CORE codes`. Importer uses this exact header and fails with a clear error if any required header is missing.

## Project structure

- `server/db/schema.ts`: PostgreSQL table schema
- `server/db/client.ts`: database connection
- `server/api/partners.get.ts`: paginated search endpoint
- `server/api/partners/import.post.ts`: Excel import and idempotent upsert
- `pages/index.vue`: partner list, search, loading and empty states
- `shared/types/parner.ts`: list of partners types
