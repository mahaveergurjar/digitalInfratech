# Harghar Backend

Harghar Backend is the API server for the Harghar platform. It handles authentication, catalog data, orders, partner workflows, admin operations, payment verification, and transactional email delivery.

This repository is backend only. The frontend is not included yet.

## What This Backend Provides

- Customer, partner, and admin authentication
- Email verification and password recovery
- JWT access and refresh session management
- Product and service catalog APIs
- Order creation and order status tracking
- Partner dashboard and job updates
- Admin dashboard, partner review, and allocation management
- Payment verification and rejection flows
- Transactional emails through Brevo API
- MongoDB persistence through Mongoose
- Health check endpoint for deployment monitoring

## User Roles

- `customer`
  - Can register, log in, place orders, and view personal orders
- `partner`
  - Can log in, view assigned jobs, and update job progress
- `admin`
  - Can manage catalog data, review partners, assign orders, and verify payments

## Core Product Flows

### Authentication

- Register with email and password
- Verify email through a link sent by Brevo
- Log in with password
- Complete login with a verification code sent by email
- Refresh JWT sessions
- Log out and revoke sessions
- Change password
- Recover password through email

### Catalog

- List products and services
- View a single product or service
- Admins can create, update, and delete catalog entries

### Orders

- Customers can create orders for either a product or a service
- Customers can view their own orders
- Admins can view all orders
- Admins can update order status

### Partner Workflows

- Partners can view their dashboard
- Partners can view assigned jobs
- Partners can update job status and notes

### Admin Workflows

- View overview metrics
- Review partner applications
- Assign orders to partners
- Update allocation status
- Review or suspend partners

### Payments

- Admins can view payments
- Admins can verify or reject payments

## Tech Stack

- Node.js
- Express
- MongoDB Atlas / MongoDB
- Mongoose
- JWT
- Brevo transactional email API
- express-validator

## Project Structure

- `src/index.js`
  - App startup entry point
- `src/app.js`
  - Express app setup, middleware, routes, health endpoint
- `src/config`
  - Environment and database configuration
- `src/controllers`
  - Route handlers
- `src/routes`
  - API route declarations
- `src/services`
  - Business logic and external integrations
- `src/models`
  - MongoDB schemas
- `src/middlewares`
  - Auth, validation, rate limiting, and error handling

## Requirements

- Node.js 18 or newer recommended
- MongoDB connection string
- Brevo API key
- Verified email sender in Brevo

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000
MONGO_URI=mongodb+srv://...
NODE_ENV=development

APP_BASE_URL=http://localhost:5000
API_BASE_URL=http://localhost:5000/api
APP_CORS_ORIGINS=*

JWT_SECRET=your-strong-access-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-strong-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

EMAIL_VERIFICATION_TTL_MINUTES=1440
LOGIN_CODE_TTL_MINUTES=10
LOGIN_CODE_MAX_ATTEMPTS=5
PASSWORD_RESET_TTL_MINUTES=30

MAIL_PROVIDER=brevo
BREVO_API_KEY=your-brevo-api-key
EMAIL_FROM=auth@yourdomain.com
EMAIL_FROM_NAME=Your Brand
```

### Environment Notes

- `APP_BASE_URL` is used for verification and password reset links.
- `APP_CORS_ORIGINS` controls which browser origins may call the API.
- `MAIL_PROVIDER=brevo` enables Brevo API sending.
- `EMAIL_FROM` should be a sender Brevo accepts for your account.
- `JWT_SECRET` and `JWT_REFRESH_SECRET` must be strong random values in production.

## Install

```bash
npm install
```

## Run Locally

```bash
npm start
```

For development:

```bash
npm run dev
```

## Tests

```bash
npm test
```

## API Overview

Base path:

```text
/api
```

Health:

```text
GET /health
```

Root:

```text
GET /
```

### Auth Routes

- `POST /api/auth/register`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/login`
- `POST /api/auth/login/verify-code`
- `POST /api/auth/login/resend-code`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `GET /api/auth/reset-password?token=...`
- `POST /api/auth/reset-password`
- `POST /api/auth/change-password`
- `GET /api/auth/me`

### Product Routes

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` `admin`
- `PATCH /api/products/:id` `admin`
- `DELETE /api/products/:id` `admin`

### Service Routes

- `GET /api/services`
- `GET /api/services/:id`
- `POST /api/services` `admin`
- `PATCH /api/services/:id` `admin`
- `DELETE /api/services/:id` `admin`

### Order Routes

- `POST /api/orders`
- `GET /api/orders/mine`
- `GET /api/orders/:id`
- `GET /api/orders` `admin`
- `PATCH /api/orders/:id/status` `admin`

### Partner Routes

- `GET /api/partner/dashboard`
- `GET /api/partner/jobs`
- `PATCH /api/partner/jobs/:id`

### Admin Routes

- `GET /api/admin/overview`
- `GET /api/admin/orders`
- `GET /api/admin/products`
- `GET /api/admin/services`
- `GET /api/admin/partners`
- `GET /api/admin/applications`
- `GET /api/admin/allocations`
- `POST /api/admin/orders/:id/assign`
- `PATCH /api/admin/allocations/:id`
- `PATCH /api/admin/partners/:id/review`

### Payment Routes

- `GET /api/payments`
- `PATCH /api/payments/:id/verify`
- `PATCH /api/payments/:id/reject`

### User Routes

- `GET /api/users`

## Important Behaviors

- Passwords are hashed with bcrypt before storage.
- Access and refresh tokens are JWT-based.
- Protected routes require authentication.
- Some routes require `admin` or `partner` authorization.
- Input validation is enforced with `express-validator`.
- Rate limiting is applied to sensitive auth endpoints.
- Emails are sent through Brevo API, not SMTP.
- Email verification and password reset links currently point to backend-hosted pages, so the app can run without a frontend.

## API Response Style

Most successful endpoints return JSON objects like:

```json
{
  "success": true,
  "message": "..."
}
```

Auth endpoints may also return:

- `user`
- `accessToken`
- `refreshToken`
- `challengeId`
- `expiresInSeconds`
- `developmentPreview`

## Deployment Notes

- Set `NODE_ENV=production`
- Use production values for `APP_BASE_URL` and `APP_CORS_ORIGINS`
- Store `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MONGO_URI`, and `BREVO_API_KEY` in your hosting provider secrets
- Use a MongoDB instance that is reachable from your deployment platform
- Keep the backend running behind HTTPS in production

## Health Check

The service exposes a health endpoint:

```text
GET /health
```

Response includes:

- API status
- MongoDB connection status
- uptime
- timestamp

## Operational Notes

- This backend is safe to deploy before the frontend is ready.
- The API can be used directly with tools like Postman or Insomnia.
- The backend provides enough functionality to support a frontend later without changing the core API structure.

