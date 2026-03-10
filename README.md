# 10,000 Days Capital Management

A full-stack institutional investment firm platform built with React, Express, and PostgreSQL. Features a public-facing marketing site, secure investor portal, admin dashboard, document management system, and career/applicant tracking — all wrapped in a refined midnight navy and antique gold design language.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Pages & Routes](#pages--routes)
- [Authentication & Authorization](#authentication--authorization)
- [Document Management](#document-management)
- [Career & Applicant Tracking](#career--applicant-tracking)
- [Email Notifications](#email-notifications)
- [Design System](#design-system)

---

## Overview

10,000 Days Capital Management is a digital platform for an institutional investment firm. The site serves two audiences:

1. **Public visitors** — learn about the firm's philosophy, team, investment approach, and open career opportunities.
2. **Approved investors** — access a secure portal with quarterly letters, fund documents, and the ability to upload documents directly to the firm.

An admin dashboard provides full control over user approvals, document publishing, job postings, and applicant management.

---

## Features

### Public Site
- Cinematic hero with video background and animated transitions
- Investment philosophy with scroll-driven "Three Pillars" storytelling (Vision, Discipline, Patience)
- "The AIRS Revolution" framework presentation
- Team profiles and leadership bios
- Insights and commentary landing page
- Fully responsive design with Framer Motion page transitions

### Investor Portal
- Secure login with session-based authentication
- Access to published quarterly investor letters and fund documents
- Secure document upload for sending files directly to the firm
- Investor Relations contact information

### Admin Dashboard
- User management — approve, deny, ban, reactivate, and edit accounts
- Document publishing — upload and categorize investor letters and fund documents
- Job management — create, edit, and close job postings with detailed descriptions
- Applicant tracking — review applications, update statuses, view/download resumes
- Auto-archive system for rejected applications (14-day threshold)
- View all investor-uploaded documents

### Careers
- Public job board with accordion-style role details
- Role-specific and general application submissions
- Multi-file resume/cover letter uploads
- Branded confirmation emails to applicants

### Email System
- Admin notifications for new access requests, document uploads, and job applications
- Welcome emails on approval and polite denial emails on rejection
- Application confirmation and status update notifications
- HTML-templated emails with firm branding

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui + Radix UI | Accessible component primitives |
| Framer Motion | Animations and page transitions |
| TanStack React Query | Server state management |
| React Hook Form + Zod | Form handling and validation |
| Wouter | Lightweight client-side routing |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Express.js | HTTP server |
| Node.js + tsx | Runtime and dev execution |
| esbuild | Production bundling |
| Drizzle ORM | Type-safe database queries |
| PostgreSQL | Primary database |
| connect-pg-simple | Session storage |
| bcrypt | Password hashing |
| Nodemailer | Email delivery |
| Multer | File upload handling |
| Google Cloud Storage | Persistent document storage (via Replit Object Storage) |

### Fonts
- **Montserrat** — Display headings
- **Inter** — Body text

---

## Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components (layout, home sections, shared UI)
│   │   ├── pages/           # Route-level page components
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   └── auth/        # Login and registration pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities, API client, query helpers
│   │   └── assets/          # Static assets (videos, images)
│   └── index.html           # Entry HTML
├── server/                  # Express backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Database operations (IStorage interface + Drizzle implementation)
│   ├── email.ts             # Email templates and sending logic
│   └── static.ts            # Static file serving configuration
├── shared/                  # Shared types and schemas
│   └── schema.ts            # Drizzle database schema + Zod validation schemas
├── scripts/                 # Utility scripts (admin creation)
└── attached_assets/         # Static media assets
```

### Path Aliases
- `@/*` maps to `client/src/*`
- `@shared/*` maps to `shared/*`
- `@assets` maps to `attached_assets/`

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- SMTP credentials for email delivery

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts both the Vite dev server (frontend) and the Express server (backend) with hot module replacement.

### Production Build

```bash
npm run build
npm start
```

### Database Setup

Push the schema to your database:

```bash
npm run db:push
```

---

## Environment Variables

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret key for session encryption |
| `SMTP_USER` | SMTP username for outbound email |
| `SMTP_PASS` | SMTP password or app-specific password |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | Replit Object Storage bucket ID |
| `PRIVATE_OBJECT_DIR` | Base path for private file storage |
| `PUBLIC_OBJECT_SEARCH_PATHS` | Search paths for public assets |

### Optional

| Variable | Default | Description |
|---|---|---|
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP server port |
| `SMTP_FROM` | `noreply@10000dayscapital.com` | Sender address for outbound email |
| `APP_URL` | `https://10000dayscapital.com` | Base URL used in email links |

---

## Database

The application uses PostgreSQL with Drizzle ORM. Five core tables:

### `users`
Stores accounts with email/password auth, approval status, roles, and ban tracking.

### `document_uploads`
Tracks documents uploaded by investors through the secure portal.

### `published_documents`
Manages firm-published content (quarterly letters, fund documents) with categories and dates.

### `jobs`
Job postings with title, location, employment type, descriptions, responsibilities, requirements, and benefits.

### `applications`
Job applications with applicant info, resume paths, review status, and auto-archive support.

---

## Pages & Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home — hero video, firm overview, CTAs |
| `/who-we-are` | Public | Mission, vision, and "10,000 Days" philosophy |
| `/philosophy` | Public | Investment strategy and "The AIRS Revolution" |
| `/process` | Public | Investment process overview |
| `/about/what-we-do` | Public | Detailed firm capabilities |
| `/about/values` | Public | Core principles — Discipline, Vision, Patience |
| `/about/leadership` | Public | Leadership team profiles |
| `/about/locations` | Public | Office locations |
| `/about/careers` | Public | Job board and application form |
| `/team` | Public | Team member profiles |
| `/insights` | Public | Insights landing page |
| `/insights/commentary` | Public | Market commentary |
| `/insights/videos` | Public | Video content |
| `/insights/ai-revolution` | Public | AI Revolution thought leadership |
| `/insights/curated` | Public | Curated content and research |
| `/letters` | Public | Investor letter archive |
| `/terms` | Public | Terms of service |
| `/privacy` | Public | Privacy policy |
| `/auth/login` | Public | Secure login |
| `/auth/request-access` | Public | New investor registration |
| `/dashboard` | Authenticated | Investor portal — letters, documents, uploads |
| `/admin/approvals` | Admin | User management, publishing, careers, applicants |

---

## Authentication & Authorization

- **Session-based** authentication with PostgreSQL-backed session storage
- **Password hashing** with bcrypt
- **Two roles**: `user` (investor) and `admin`
- **Approval workflow**: New registrations require admin approval before portal access is granted
- **Account controls**: Admins can ban/reactivate accounts with recorded reasons
- **Denial tracking**: Denial count and dates are stored per user
- **Middleware guards**: `requireAuth` and `requireAdmin` protect API routes

---

## Document Management

All file storage uses Replit Object Storage (Google Cloud Storage-backed):

- **Investor uploads** — stored under `PRIVATE_OBJECT_DIR/user-uploads/`
- **Published documents** — stored under `PRIVATE_OBJECT_DIR/published-documents/`
- **Upload flow**: Files are received via Multer (memory storage), then streamed to GCS
- **Download flow**: Files are streamed directly from GCS to the client
- **Supported formats**: PDF, images (PNG, JPG)

---

## Career & Applicant Tracking

- Admins create job postings with full detail (description, responsibilities, requirements, benefits)
- Postings can be opened, closed, or edited at any time
- Applicants submit through a public form with multi-file upload support
- Review statuses: `new` → `reviewing` → `rejected`
- Rejected applications are automatically archived after 14 days
- Archived applications can be viewed and restored by admins
- 30-day cooldown between applications per email (admin accounts bypass this for testing)

---

## Email Notifications

Powered by Nodemailer with HTML-templated, firm-branded emails:

| Event | Recipient | Description |
|---|---|---|
| New access request | Admin | Alert when a prospective investor registers |
| Access approved | User | Welcome email with portal access confirmation |
| Access denied | User | Professional denial notification |
| Document uploaded | Admin | Alert when an investor uploads a document |
| New application | Admin | Alert when a job application is submitted |
| Application received | Applicant | Branded confirmation email |
| Status update | Applicant | Notification when application status changes |

---

## Design System

### Colors
- **Midnight Navy**: `#001F3F` — primary background and branding
- **Antique Gold**: `#C5A059` — accent color for CTAs, borders, and highlights

### Typography
- **Montserrat** — display headings and section titles
- **Inter** — body text and UI elements

### Design Principles
- Institutional, high-end aesthetic with generous whitespace
- Cinematic video backgrounds on key sections
- Scroll-driven animations and micro-interactions via Framer Motion
- Responsive design across all breakpoints
- Accessible components built on Radix UI primitives

---

## License

MIT License. See [package.json](package.json) for details.
