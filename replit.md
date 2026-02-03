# 10,000 Days Capital Management

## Overview

10,000 Days Capital Management is an institutional investment firm website built as a full-stack TypeScript application. The project presents a high-end, institutional aesthetic with a midnight navy and gold color scheme, clean typography, and plenty of whitespace. The site serves as both a public-facing marketing presence and a secure investor portal with authentication and admin approval workflows.

The application follows a monorepo structure with separate client (React/Vite) and server (Express) directories, sharing types and schemas through a common shared folder.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for meta images and Replit integration
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with CSS variables for theming, custom design tokens for institutional branding
- **UI Components**: shadcn/ui (New York style) built on Radix UI primitives
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Animation**: Framer Motion for page transitions and micro-interactions
- **Fonts**: Inter (sans-serif body) and Montserrat (display headings)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for development, esbuild for production bundling
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage
- **Authentication**: Custom session-based auth with bcrypt password hashing
- **API Pattern**: RESTful endpoints under `/api` prefix

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization

### Authentication & Authorization
- **User Model**: Email/password authentication with approval workflow
- **Roles**: User and Admin roles with middleware guards (`requireAuth`, `requireAdmin`)
- **Session Storage**: PostgreSQL-backed sessions for persistence across restarts
- **Access Control**: Admin approval required for new user registration

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components (layout, home, ui library)
│   │   ├── pages/       # Route components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and API client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations
│   └── static.ts     # Static file serving
├── shared/           # Shared types and schemas
│   └── schema.ts     # Drizzle database schema
├── scripts/          # Utility scripts (admin creation)
└── attached_assets/  # Static assets (images, videos)
```

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### UI Framework
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, forms, etc.)
- **shadcn/ui**: Pre-built component library using Radix + Tailwind
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Production server bundling
- **tsx**: TypeScript execution for development

### Authentication
- **bcrypt**: Password hashing
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator