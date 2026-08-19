# AuthFlow — Full-Stack Authentication & User Management System

A full-stack authentication and user management application built with **React, TypeScript, Node.js, Express, Prisma, and PostgreSQL**.

The project demonstrates a production-oriented authentication flow with JWT access and refresh tokens, protected routes, centralized authentication state, user profiles, form validation, API documentation, integration tests, database migrations, and cloud deployment.

##  Live Demo

https://dancing-fudge-7a530b.netlify.app

##  Features

- User registration
- User login and logout
- JWT access token authentication
- Refresh token support
- Password hashing with bcrypt
- Protected API endpoints
- Protected frontend routes
- Centralized authentication state with React Context
- User profile information
  - First name
  - Last name
  - Email
- Terms & Conditions acceptance
- Login and registration form validation
- Password confirmation validation
- Loading states and disabled form buttons
- API error handling
- PostgreSQL database
- Prisma ORM
- Prisma database migrations
- Swagger API documentation
- Jest integration tests
- Docker support
- Production deployment

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- React Router
- React Hook Form
- Zod
- Tailwind CSS
- Axios
- Rsbuild

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma
- PostgreSQL
- JWT
- bcrypt
- Swagger
- Jest

### Infrastructure

- Docker
- Docker Compose
- Neon PostgreSQL
- Cloud deployment

##  Architecture

```text
┌─────────────────────────────┐
│      React Frontend         │
│                             │
│ React + TypeScript          │
│ React Router                │
│ React Context               │
│ React Hook Form + Zod       │
└──────────────┬──────────────┘
               │
               │ REST API / JWT
               ▼
┌─────────────────────────────┐
│       Express API           │
│                             │
│ Controllers                 │
│ Services                    │
│ Middleware                  │
│ JWT Authentication          │
│ Validation                  │
└──────────────┬──────────────┘
               │
               │ Prisma ORM
               ▼
┌─────────────────────────────┐
│       PostgreSQL             │
│                             │
│ Users                        │
│ Refresh Tokens               │
│ Prisma Migrations            │
└─────────────────────────────┘
```

##  Authentication Flow

The application uses JWT-based authentication with short-lived access tokens and refresh tokens.

```text
Login
  │
  ▼
Express API
  │
  ├── Validate credentials
  │
  ├── Verify password with bcrypt
  │
  └── Generate tokens
        │
        ├── Access Token
        └── Refresh Token
                │
                ▼
          React Frontend
                │
                ▼
        AuthContext stores
        authentication state
```

Authenticated requests send the access token using the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

##  Project Structure

### Backend

```text
src/
├── config/
│   └── prisma.ts
│
├── controllers/
│   └── auth.controller.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
│
├── routes/
│   └── auth.routes.ts
│
├── services/
│   └── auth.service.ts
│
├── validation/
│   └── ...
│
├── app.ts
└── server.ts

prisma/
├── schema.prisma
└── migrations/
```

### Frontend

```text
src/
├── api/
│   └── axios.ts
│
├── context/
│   └── AuthContext.tsx
│
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
│
├── validation/
│   └── authSchemas.ts
│
├── components/
│   └── ...
│
├── App.tsx
└── main.tsx
```

##  API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate a user | No |
| `POST` | `/api/auth/refresh` | Refresh access token | Refresh token |
| `POST` | `/api/auth/logout` | Logout and invalidate refresh token | Yes |
| `GET` | `/api/auth/me` | Get authenticated user | Yes |

##  Registration

Registration requires:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "acceptedTerms": true
}
```

The frontend validates the form before sending the request.

Validation includes:

- Required fields
- Email format
- Password length
- Password confirmation
- First and last name length
- Terms & Conditions acceptance

The backend performs its own validation as well.

##  Testing

The backend includes Jest integration tests for authentication functionality.

Run tests with:

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

The tests cover authentication-related API behavior such as registration, login, validation, and error responses.

## 🗄️ Database

The project uses **PostgreSQL** with **Prisma ORM**.

Generate the Prisma client:

```bash
npx prisma generate
```

Create a development migration:

```bash
npx prisma migrate dev --name migration_name
```

Apply existing migrations:

```bash
npx prisma migrate deploy
```

Open Prisma Studio:

```bash
npx prisma studio
```

## ⚙️ Environment Variables

Create a `.env` file in the backend project:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=3000
```

For security, `.env` files are excluded from Git and should never be committed to the repository.

## 🐳 Docker

Start the development environment:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

View API logs:

```bash
docker compose logs -f api
```

Run Prisma commands inside the API container:

```bash
docker compose exec api npx prisma migrate dev
```

## 💻 Local Development

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and add the required variables.

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the backend

```bash
npm run dev
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend and backend ports depend on the project configuration.

##  API Documentation

The backend provides interactive API documentation using Swagger.

Swagger allows you to:

- View available endpoints
- Inspect request and response schemas
- Test API endpoints
- Review authentication requirements

##  Security

The project implements several security-related practices:

- Password hashing with bcrypt
- JWT authentication
- Separate access and refresh tokens
- Protected API endpoints
- Server-side validation
- Client-side validation for better UX
- Environment variables for secrets
- Refresh token invalidation on logout

Frontend validation is **not treated as a security mechanism**. All important validation is also performed by the backend.

##  Deployment

The application is configured for production deployment with:

- Cloud-hosted PostgreSQL
- Environment-based configuration
- Prisma production migrations
- Docker support

Production database migrations are applied with:

```bash
npx prisma migrate deploy
```

##  Project Goals

This project was created to demonstrate practical full-stack development skills, including:

- Building REST APIs with Express
- Designing authentication flows
- Working with relational databases
- Using Prisma ORM and migrations
- Building React applications with TypeScript
- Managing global authentication state
- Implementing frontend form validation
- Writing integration tests
- Documenting APIs with Swagger
- Containerizing applications with Docker
- Deploying a full-stack application to the cloud
