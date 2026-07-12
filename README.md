# Tax Management and Filing System

A full-stack Tax Management and Filing System built with:
- **Backend:** Spring Boot (Java) + PostgreSQL
- **Frontend:** Angular 19

## Project Structure

```
/
├── taxmanagement-ui/   → Angular 19 frontend
└── src/                → Spring Boot backend
```

## Backend Setup

1. Make sure PostgreSQL is running with a database named `tax_management`
2. Update `src/main/resources/application.properties` with your DB credentials
3. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   The API will be available at `http://localhost:8080`

## Frontend Setup

```bash
cd taxmanagement-ui
npm install
npx ng serve
```
The UI will be available at `http://localhost:4200`

## Features

- **Tax Payer** role: Create individual/organisation filings, upload documents, submit for verification
- **Tax Verifier** role: Review, approve or reject submitted filings with feedback
- **Admin** role: Full access to all users, filings, documents, payments

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taxmanagement.com | Admin@123 |
