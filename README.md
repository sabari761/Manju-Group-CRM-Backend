# Real Estate CRM Backend

Simple Node.js and Express backend for a Real Estate CRM.

## Technologies

- Node.js
- Express.js
- MongoDB and Mongoose
- JWT authentication
- bcryptjs password hashing
- express-validator validation
- Swagger API documentation

## Setup

Install dependencies:

```powershell
npm install
```

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
CLIENT_URL=http://localhost:3000
INITIAL_ADMIN_SETUP_KEY=your_one_time_setup_key
```

Never commit `.env` or real secrets.

## Start the Server

Development mode:

```powershell
npm run dev
```

Normal mode:

```powershell
npm start
```

The API runs at:

```text
http://localhost:5000
```

## Create the First Admin

The first account is a `SUPER_ADMIN`. It is needed because user-management APIs are protected and require an authenticated admin.

1. Set `INITIAL_ADMIN_SETUP_KEY` in `.env`.
2. Start the server.
3. Open Swagger:

```text
http://localhost:5000/api-docs/
```

4. Open `POST /api/auth/setup`.
5. Click **Authorize** and enter the value of `INITIAL_ADMIN_SETUP_KEY`.
6. Send this body with your own real values:

```json
{
  "name": "Your Name",
  "mobileNumber": "9876543210",
  "email": "admin@yourcompany.com",
  "password": "your-strong-password"
}
```

This endpoint can create the first account only once. After a user exists, it returns a conflict response. It does not create sample users or sample business data.

The command-line alternative is:

```powershell
$env:ADMIN_NAME="Your Name"
$env:ADMIN_MOBILE="9876543210"
$env:ADMIN_EMAIL="admin@yourcompany.com"
$env:ADMIN_PASSWORD="your-strong-password"
npm run create-admin
```

## Login

Use:

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "admin@yourcompany.com",
  "password": "your-strong-password"
}
```

Copy the returned JWT token. In Swagger, click **Authorize** and enter:

```text
Bearer YOUR_TOKEN
```

## Roles

Supported roles are:

- `SUPER_ADMIN`
- `ADMIN`
- `LIMITED_ADMIN`
- `SALES_EMPLOYEE`

There is no default role. A role is required whenever an admin creates a user.

## User APIs

The canonical user-management APIs are:

```http
POST   /api/users
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

Only `SUPER_ADMIN` and `ADMIN` can use these APIs.

Create a user:

```json
{
  "name": "Sales User",
  "mobileNumber": "9876543210",
  "email": "sales@yourcompany.com",
  "password": "your-strong-password",
  "role": "SALES_EMPLOYEE"
}
```

`GET /api/users` supports pagination and search:

```http
GET /api/users?page=1&limit=10&search=987
```

Search checks the name and mobile number. The old `/api/employees` path remains as a compatibility alias.

## Main API Endpoints

### Authentication

```http
POST /api/auth/setup
POST /api/auth/login
GET  /api/auth/me
```

### Leads

```http
GET    /api/leads
POST   /api/leads
GET    /api/leads/:id
PUT    /api/leads/:id
DELETE /api/leads/:id
```

Lead search and filters:

```http
GET /api/leads?page=1&limit=10&search=rahul&stage=Interested&assignedTo=USER_ID
```

Sales Employees see their assigned leads. Admin roles can view all leads and assign leads.

### Projects

```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Project search:

```http
GET /api/projects?page=1&limit=10&search=pune
```

Search checks project name, location, and description.

### Buildings

```http
GET    /api/projects/:projectId/buildings
POST   /api/projects/:projectId/buildings
PUT    /api/buildings/:id
DELETE /api/buildings/:id
```

Buildings are listed under a project without pagination.

### Units

```http
GET    /api/buildings/:buildingId/units
POST   /api/buildings/:buildingId/units
PUT    /api/units/:id
DELETE /api/units/:id
```

Units are listed under a building without pagination. Filter by availability:

```http
GET /api/buildings/:buildingId/units?status=AVAILABLE
```

Unit statuses are `AVAILABLE` and `BOOKED`.

### Bookings

```http
GET  /api/bookings
POST /api/bookings
GET  /api/bookings/:id
```

Booking search and pagination:

```http
GET /api/bookings?page=1&limit=10&search=customer-name
```

Search checks customer/lead name, phone, email, unit number, unit type, building name, project name, project location, and project description.

Only available units can be booked. The unit is reserved with an atomic database update, so two users cannot successfully book the same unit.

### Dashboard

```http
GET /api/dashboard
```

The dashboard returns lead, follow-up, and booking statistics. Admin roles see company-wide data. Sales Employees see their assigned data.

## Pagination Response

Paginated APIs return this format:

```json
{
  "success": true,
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 10,
  "totalPages": 0
}
```

The maximum page size is `100`.

## Security Notes

- Passwords are hashed with bcryptjs.
- Passwords are never returned in API responses.
- Protected APIs require `Authorization: Bearer TOKEN`.
- Admin permissions are checked by the backend.
- CORS is currently enabled for all origins for frontend development.
- Change `JWT_SECRET`, database credentials, and setup keys before production use.

## Useful Commands

```powershell
npm install
npm run dev
npm start
npm run create-admin
```

Swagger documentation:

```text
http://localhost:5000/api-docs/
```
