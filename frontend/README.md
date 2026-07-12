# Tax Management Frontend (Angular 19)

Angular 19 frontend for the Tax Management and Filing System, integrated with the Spring Boot backend.

## Features

- Login & Signup with JWT token and role storage (ADMIN / TAXPAYER)
- Protected routes with auth guard and admin-only routes with role guard
- Dashboard with summary cards and activity chart
- CRUD screens: Users, Tax Types, Tax Filings, Payments, Documents
- Search, filter, and pagination on list views
- File upload metadata capture for documents
- Reports page with revenue summary (admin only)
- HTTP interceptor for Bearer token headers

## Prerequisites

- Node.js 20+
- npm 10+
- Spring Boot backend running on `http://localhost:8080`

## Test in VS Code

1. Open the `taxmanagement-ui` folder in VS Code
2. Run `npm install` then `npm start` in the terminal
3. Or use **Run and Debug** → **Angular: taxmanagement-ui** (starts dev server + Chrome)

Make sure the Spring Boot backend is running on `http://localhost:8080` before logging in.

## Setup

```bash
cd taxmanagement-ui
npm install
npm start
```

Open `http://localhost:4200`

## API Configuration

Backend URL is set in `src/app/core/constants/api.constants.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:8080/api';
```

## Default Roles

- **ADMIN**: Full access to Users, Tax Types, Reports
- **TAXPAYER**: Access to own tax filings, payments, documents, dashboard

Create an admin user via the backend API or database with `role = ADMIN`.

## Project Structure

```
src/app/
  core/          # services, models, guards, interceptors
  shared/        # layout components
  features/      # auth, dashboard, CRUD modules
```

## Build for Production

```bash
npm run build
```

Output: `dist/taxmanagement-ui`
