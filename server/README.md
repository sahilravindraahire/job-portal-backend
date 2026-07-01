# Job Portal Backend
 
A RESTful API for a job portal built with Node.js, Express, and MongoDB. Supports two roles — **employees** (job seekers) and **employers** (companies posting jobs) — with JWT authentication, OTP email verification, file uploads via Cloudinary, and paginated search across all major resources.
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express v5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| File Storage | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| File Uploads | Multer (disk storage) |
 
---
 
## Project Structure
 
```
src/
├── controllers/
│   ├── user.controller.js
│   ├── job.controller.js
│   ├── application.controller.js
│   └── company.controller.js
├── middleware/
│   ├── auth.middleware.js
│   └── multer.middleware.js
├── models/
│   ├── user.model.js
│   ├── job.model.js
│   ├── application.model.js
│   ├── company.model.js
│   └── otp.model.js
├── routes/
│   ├── user.route.js
│   ├── job.route.js
│   ├── application.route.js
│   └── company.route.js
├── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asynchandler.js
│   ├── cloudinary.js
│   └── sendEmail.js
├── db/
│   └── dataBase.js
└── server.js
```
 
---
 
## Getting Started
 
### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled
### Installation
 
```bash
git clone <repo-url>
cd server
npm install
```
 
### Environment Variables
 
Create a `.env` file in the root:
 
```env
PORT=5000
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/jobportal
CORS_ORIGIN=http://localhost:3000
 
ACCESS_TOKEN_SECERET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
 
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
 
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_16_char_app_password
```
 
> **Note:** `EMAIL_PASS` must be a Gmail **App Password**, not your regular Gmail password. Regular passwords are blocked by Google since 2022.
 
### Run
 
```bash
# Development
npm run dev
 
# Production
npm start
```
 
---
 
## API Reference
 
Base URL: `/api/v1`
 
### Auth / Users — `/users`
 
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register with optional profile image + resume upload |
| POST | `/verify-otp` | No | Verify OTP → returns access + refresh tokens |
| POST | `/login` | No | Login with email + password |
| POST | `/logout` | ✓ | Logout and clear tokens |
| POST | `/refresh-token` | No | Get new access token via refresh token |
| PATCH | `/change-password` | ✓ | Change password |
| GET | `/profile` | ✓ | Get logged-in user's profile |
| PATCH | `/profile` | ✓ | Update profile, image, or resume |
 
**Register** accepts `multipart/form-data` with fields:
`fullName`, `email`, `password`, `phoneNumber`, `role` (`employe` / `employer`), `skills`, `bio`, `profileImage` (file), `resume` (file, required for employees)
 
---
 
### Jobs — `/jobs`
 
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | No | — | Get all jobs (filters + pagination) |
| GET | `/:jobId` | No | — | Get a single job |
| POST | `/` | ✓ | employer | Post a new job |
| PATCH | `/:jobId` | ✓ | employer | Update a job |
| DELETE | `/:jobId` | ✓ | employer | Delete job + cascade applications |
| GET | `/employer/my-jobs` | ✓ | employer | Get employer's own posted jobs |
 
**Query params for `GET /`:**
`keyword`, `location`, `jobType`, `minSalary`, `maxSalary`, `experienceLevel`, `page`, `limit`, `sortBy`, `order`
 
---
 
### Applications — `/applications`
 
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/:jobId/apply` | ✓ | employe | Apply for a job |
| DELETE | `/:applicationId/withdraw` | ✓ | employe | Withdraw a pending application |
| GET | `/my-applications` | ✓ | employe | Get own applications (filterable by status) |
| GET | `/job/:jobId/applicants` | ✓ | employer | Get all applicants for a job |
| PATCH | `/:applicationId/status` | ✓ | employer | Update application status |
| GET | `/job/:jobId/stats` | ✓ | employer | Get pending/accepted/rejected counts |
 
Updating status to `accepted` automatically sends a congratulatory email to the applicant.
 
---
 
### Companies — `/company`
 
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/` | No | — | List all companies (search + pagination) |
| GET | `/:companyId` | No | — | Get a company by ID |
| POST | `/register` | ✓ | employer | Register a company (one per employer) |
| PATCH | `/:companyId` | ✓ | employer | Update company details / image |
| DELETE | `/:companyId` | ✓ | employer | Delete company + all jobs + applications |
| GET | `/employer/my-company` | ✓ | employer | Get own company |
| GET | `/employer/dashboard` | ✓ | employer | Stats: jobs, vacancies, applications, recent applicants |
 
---
 
## Authentication Flow
 
```
Register → OTP sent to email → POST /verify-otp → receive tokens → use accessToken in requests
```
 
Tokens are sent as `httpOnly` cookies and also returned in the response body for mobile clients. Include as `Authorization: Bearer <token>` header or via cookies.
 
---
 
## Known Gotchas
 
- **Route order matters** — specific routes like `/employer/my-jobs` must be registered **before** `/:jobId` or Express will treat `"employer"` as a job ID.
- **MongoDB collection names** — Mongoose pluralizes model names to lowercase (`Company` → `companies`). Use `"companies"` in all `$lookup` `from` fields, not `"companys"`.
- **`multipart/form-data`** is only needed on routes with file uploads. Use `application/json` for all other endpoints.