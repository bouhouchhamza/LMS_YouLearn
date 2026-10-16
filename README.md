<div align="center">

# ðŸš€ YouLearn LMS API

### Secure REST API for a Modern Learning Management System

**Built with Node.js Â· Express 5 Â· MongoDB Â· Mongoose Â· JWT Â· Docker**

[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.3-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)](https://www.openapis.org/)

**Authentication Â· Authorization Â· Course Management Â· Enrollment Â· Progress Tracking Â· Secure Resources**

[Getting Started](#-getting-started) Â· [API Reference](#-api-reference) Â· [Docker](#-docker) Â· [Tests](#-testing) Â· [Documentation](#-documentation--design)

</div>

---

## ðŸ“Œ About

**YouLearn LMS API** is the backend of a Learning Management System (LMS). It exposes REST endpoints for learners, trainers, and administrators to manage courses and learning content securely.

The project was developed incrementally:

- **Brief 1 â€” API Foundations:** Published-course catalog, search, filters, sorting, modules, resources, MongoDB models, and initial OpenAPI specification.
- **Brief 2 â€” Secure LMS:** Account registration and login, JWT-based authentication, role-based authorization, course management, enrollment, learning progress, sequential module access, protected resources, trainer endpoints, and automated authentication tests.

The API is implemented with **Express 5** and **Mongoose**, and can run locally or in Docker containers.

---

## âœ¨ Features

### ðŸ” Authentication & Role-Based Access Control

- Register a user as a **learner** (the public registration route does not accept a privileged role).
- Login using email/password and receive a **JWT valid for 1 hour**.
- Read the authenticated profile via `GET /api/auth/me`.
- Protect routes using a Bearer token and role checks.
- Support `learner`, `trainer`, and `admin` roles.
- Reject inactive users during login; protected requests also require a valid authenticated account.
- Hash user passwords using **bcrypt**.

### ðŸ“š Course & Content Management

- Browse published courses and view their details.
- Search by keyword; filter by category and level; sort the catalog.
- Create, update, publish, and unpublish courses (trainer/admin routes).
- Create and update course modules.
- Create text/link/video/PDF resource records.
- Upload **PDF** and **MP4** learning resources.
- List module resources without directly exposing sensitive `url`, `content`, or `filePath` fields.
- Access resource content and download uploaded files through authenticated routes and access checks.

### ðŸŽ“ Enrollment & Learning Progress

- Enroll in a **published** course as a learner.
- Reject duplicate **active** enrollments.
- Cancel an active enrollment.
- Mark a resource complete; repeated completion returns `200` instead of inserting another completion record.
- Calculate progress from the number of completed resources and the total number of course resources.
- Require completion of earlier modules before accessing/completing resources in later modules.
- Resume learning at the next incomplete resource.

### ðŸ‘¨â€ðŸ« Trainer Endpoints

- View courses associated with the authenticated trainer.
- View active learners enrolled in a course.
- View a learner's completion count, completed resources, and progress percentage.
- Enforce ownership checks in trainer course/learner queries.

### ðŸ› ï¸ Engineering

- Express routes, controllers, Mongoose models, and reusable middlewares.
- Centralized error-handling middleware.
- Dockerfile and Docker Compose for API + MongoDB.
- Jest + Supertest integration tests for authentication and selected authorization cases.
- Initial OpenAPI 3.0.3 contract in `docs/openapi.yaml` (currently focused on public catalog endpoints).

---

## ðŸ§° Tech Stack

| Technology | Purpose |
|---|---|
| Node.js 22 | JavaScript runtime / Docker base image |
| Express.js 5 | REST API and HTTP routing |
| MongoDB 8 | Document database |
| Mongoose 9 | ODM, schemas, and MongoDB queries |
| JSON Web Token | Authentication via Bearer JWT |
| bcrypt | Password hashing and verification |
| Multer | Multipart file upload handling |
| Docker / Docker Compose | Container build and orchestration |
| Jest + Supertest | Automated HTTP tests |
| Nodemon | Development auto-restart |
| OpenAPI 3.0.3 | API contract / reference |

---

## ðŸ—ï¸ Architecture

```text
                         HTTP Client
                             â”‚
                             â–¼
                        Express App
                             â”‚
                 Routes / HTTP Endpoints
                             â”‚
                Authentication Middleware
                   + Role Authorization
                   + Resource Access
                             â”‚
                         Controllers
                             â”‚
                      Mongoose Models
                             â”‚
                          MongoDB

              Uploaded PDFs / MP4s â”€â”€â–º uploads/
```

**Learning content model:**

```text
User (learner / trainer / admin)
  â”‚
  â”œâ”€â”€ Course (trainer)
  â”‚     â””â”€â”€ Module (order)
  â”‚           â””â”€â”€ Resource (order / type / optional file)
  â”‚
  â””â”€â”€ Enrollment (learner + course + active status + progress)
           â””â”€â”€ ResourceProgress (completed resources)
```

### Main design choices

- **JWT** is verified by authentication middleware before protected operations.
- **RBAC** checks the user's role; ownership and enrollment checks add object-level access control where implemented.
- **Published course** is required for new learner enrollment.
- **Sequential progression** prevents completing or accessing resources from later modules until preceding modules are complete.
- **Completion tracking** uses an upsert operation so replaying the same completion request is intended to be idempotent.
- **Files** are kept on disk while metadata is stored in MongoDB; deployment must provide durable file storage.

---

## ðŸ“‚ Project Structure

```text
lms-api/
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ analyse.md
â”‚   â””â”€â”€ openapi.yaml
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ config/
â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â”œâ”€â”€ authController.js
â”‚   â”‚   â”œâ”€â”€ courseController.js
â”‚   â”‚   â”œâ”€â”€ enrollmentController.js
â”‚   â”‚   â”œâ”€â”€ moduleController.js
â”‚   â”‚   â”œâ”€â”€ progressController.js
â”‚   â”‚   â”œâ”€â”€ resourceController.js
â”‚   â”‚   â””â”€â”€ trainerController.js
â”‚   â”œâ”€â”€ middlewares/
â”‚   â”‚   â”œâ”€â”€ authMiddleware.js
â”‚   â”‚   â”œâ”€â”€ authorize.js
â”‚   â”‚   â”œâ”€â”€ checkCourseOwnership.js
â”‚   â”‚   â”œâ”€â”€ checkResourceAccess.js
â”‚   â”‚   â”œâ”€â”€ uploadMiddleware.js
â”‚   â”‚   â”œâ”€â”€ notFound.js
â”‚   â”‚   â””â”€â”€ errorHandler.js
â”‚   â”œâ”€â”€ models/
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ authRoutes.js
â”‚   â”‚   â”œâ”€â”€ courseRoutes.js
â”‚   â”‚   â”œâ”€â”€ enrollmentRoutes.js
â”‚   â”‚   â”œâ”€â”€ moduleRoutes.js
â”‚   â”‚   â”œâ”€â”€ progressRoutes.js
â”‚   â”‚   â””â”€â”€ trainerRoutes.js
â”‚   â”œâ”€â”€ seed/
â”‚   â”‚   â””â”€â”€ seed.js
â”‚   â””â”€â”€ app.js
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ auth.test.js
â”‚   â””â”€â”€ setup.js
â”œâ”€â”€ .dockerignore
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â”œâ”€â”€ Dockerfile
â”œâ”€â”€ docker-compose.yml
â”œâ”€â”€ jest.config.js
â”œâ”€â”€ package.json
â”œâ”€â”€ package-lock.json
â”œâ”€â”€ README.md
â””â”€â”€ server.js
```

> The diagram is a high-level overview. Actual model and middleware implementation details are defined in `src/`.

---

## âš¡ Getting Started

### Prerequisites

- **Node.js 22** recommended (matches the Docker image).
- **npm**.
- **MongoDB** accessible to the application, or **Docker Desktop** with Compose.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/bouhouchhamza/LMS_YouLearn.git
cd LMS_YouLearn
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and set a **new, private, strong** JWT secret.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

**Example of a local `.env` (Node.js running outside Docker):**

```dotenv
PORT=3100
MONGO_URI=mongodb://127.0.0.1:27017/lms_db
JWT_SECRET=replace-with-a-long-random-secret
```

**Important:** `JWT_SECRET` must never be committed. Use a securely generated random value. The public registration route always creates learner accounts; trainer/admin accounts require an authorized provisioning process.

### 4. Start MongoDB

Use an existing local MongoDB instance or a Docker-managed one. If you already have the project's MongoDB container and volume, **do not recreate it just to change a port mapping**.

With a clean Compose deployment (see [Docker](#-docker)), MongoDB runs as service `mongodb`. The supplied Compose file publishes its container port `27017` to host port `27018`.

If **Node.js runs on the host** and MongoDB is started using this Compose configuration, set:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27018/lms_db
```

If an existing local MongoDB is already published on host port `27017`, use `127.0.0.1:27017` instead.

### 5. Run the API locally

```bash
npm run dev
```

For a standard Node.js start:

```bash
npm start
```

Check the health endpoint:

```bash
curl http://localhost:3100/
```

Expected response:

```json
{
  "success": true,
  "message": "LMS API is running"
}
```

### 6. Optional development seed

```bash
npm run seed
```

**Warning:** Inspect `src/seed/seed.js` and ensure `MONGO_URI` points to a disposable development database before running it. Do not seed a database containing data that must be preserved.

---

## ðŸ³ Docker

The repository includes both:

- `Dockerfile`: builds the Node.js API image.
- `docker-compose.yml`: defines `api` and `mongodb` services.

### Docker Compose port mapping

| Component | Inside Docker | Exposed on host |
|---|---|---|
| Express API | `api:3000` | `localhost:3101` |
| MongoDB | `mongodb:27017` | `localhost:27018` on a fresh Compose deployment |

The **Docker API's database URI** is `mongodb://mongodb:27017/lms_db`. Containers resolve `mongodb` through the Compose network; **do not use `localhost` to refer to a different container**.

### Fresh setup (new, empty database only)

Create `.env` containing a secure `JWT_SECRET` before starting Compose. From the project directory:

```bash
docker compose config --quiet
docker compose up -d --build
```

Verify:

```bash
docker compose ps
docker compose logs --tail=30 api
curl http://localhost:3101/
```

Expected health response:

```json
{"success":true,"message":"LMS API is running"}
```

### Existing MongoDB container â€” do not recreate it

An existing development MongoDB container may already be running at host port `27017` using the **`lms-api_mongodb_data`** named volume, while the current Compose file advertises `27018`. Avoid a full `up` that could attempt to recreate that container.

If the existing container is attached to the same Compose network and accessible by DNS name `mongodb`, start **only** the API service:

```bash
docker compose build api
docker compose up -d --no-deps api
```

**Never run `docker compose down -v` or delete MongoDB volumes when data must be preserved.**

### Uploaded file persistence

The API stores uploaded PDF/MP4 files under `uploads/`. The current Compose configuration **does not mount a persistent uploads volume**. Files in the container filesystem may be lost if the API container is recreated. A production-ready deployment must attach durable storage or use object storage, and ensure backups cover both files and MongoDB records.

---

## ðŸ” Authentication & Authorization

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "fullName": "Demo Learner",
  "email": "learner@example.com",
  "password": "use-a-strong-password"
}
```

**Success:** `201 Created` â€” `{"message":"User created successfully"}`.

**Duplicate email:** `409 Conflict`.

Public registration always assigns role `learner`, irrespective of an extra `role` field sent by the client.

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "learner@example.com",
  "password": "use-a-strong-password"
}
```

**Success:** `200 OK` with `message` and `token`. The token expires after **1 hour**. Login is rejected for inactive accounts.

### Bearer token

For protected endpoints, send:

```http
Authorization: Bearer <your-jwt-token>
```

**Windows PowerShell example:**

```powershell
$body = @{ email = 'learner@example.com'; password = 'use-a-strong-password' } | ConvertTo-Json
$login = Invoke-RestMethod -Uri 'http://localhost:3100/api/auth/login' -Method Post -ContentType 'application/json' -Body $body
Invoke-RestMethod -Uri 'http://localhost:3100/api/auth/me' -Headers @{ Authorization = "Bearer $($login.token)" }
```

`GET /api/auth/me` returns `fullName`, `email`, `role`, and `status`.

### Roles

| Role | Typical permissions exposed by routes |
|---|---|
| **learner** | Enroll/cancel, complete resources, resume, get protected content and downloads |
| **trainer** | Course and content management, trainer reporting endpoints |
| **admin** | Course and content management; detailed learner-progress query |

> Role authorization is not the same as course ownership. Certain controllers/middlewares apply further ownership checks. See [Known Limitations](#-known-limitations--verification-notes).

---

## ðŸ”Œ API Reference

**Base URL (local Node.js):** `http://localhost:3100`
**Base URL (Docker Compose):** `http://localhost:3101`

`{courseId}`, `{moduleId}`, `{resourceId}`, and `{learnerId}` are MongoDB ObjectIds.

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a learner |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT |
| `GET` | `/api/auth/me` | Authenticated | Read current profile |

### Courses

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/courses` | Public | Published course catalog |
| `GET` | `/api/courses/{id}` | Public | Published course details |
| `POST` | `/api/courses` | Trainer / Admin | Create course |
| `PATCH` | `/api/courses/{id}` | Trainer / Admin | Update course |
| `PATCH` | `/api/courses/{id}/publish` | Trainer / Admin | Publish course |
| `PATCH` | `/api/courses/{id}/unpublish` | Trainer / Admin | Unpublish course |
| `GET` | `/api/courses/{courseId}/modules` | Public route | List course modules |
| `POST` | `/api/courses/{courseId}/modules` | Trainer / Admin | Create module |

**Catalog query parameters:**

| Parameter | Example | Purpose |
|---|---|---|
| `keyword` | `node` | Search titles/descriptions |
| `category` | `Backend` | Filter by category |
| `level` | `beginner` | `beginner`, `intermediate`, `advanced` |
| `sort` | `publishedAt` | `createdAt` or `publishedAt` |

Example:

```http
GET /api/courses?keyword=node&category=Backend&level=beginner&sort=publishedAt
```

### Modules & Resources

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `PATCH` | `/api/modules/{moduleId}` | Trainer / Admin | Update module |
| `GET` | `/api/modules/{moduleId}/resources` | Public route | List resource metadata |
| `POST` | `/api/modules/{moduleId}/resources` | Trainer / Admin | Create resource record |
| `POST` | `/api/modules/{moduleId}/resources/upload` | Trainer / Admin + ownership check | Upload PDF / MP4 |
| `GET` | `/api/resources/{resourceId}/content` | Learner + access check | Read allowed content |
| `GET` | `/api/resources/{resourceId}/download` | Learner + access check | Download uploaded file |

**Create-resource JSON fields:** `title`, `type`, `url`, `content`, `order` (module comes from the URL).

**Upload:** `multipart/form-data`, with fields `title`, `type` (`pdf` or `video`), `order`, and the uploaded file. Accepted MIME types in the controller are `application/pdf` and `video/mp4`. The exact multipart file field name is configured in `src/middlewares/uploadMiddleware.js`.

The content endpoint returns a JSON object containing safe content fields. The download endpoint sends the file rather than a JSON payload.

### Enrollments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/courses/{courseId}/enroll` | Learner | Enroll in published course |
| `DELETE` | `/api/courses/{courseId}/enroll` | Learner | Cancel active enrollment |

Typical responses:

- Enrollment created: `201`.
- Duplicate active enrollment: `409`.
- Draft/unpublished course: `403`.
- Course not found: `404`.
- Cancellation successful: `200`.
- No active enrollment to cancel: `404`.

### Progression

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/resources/{resourceId}/complete` | Learner | Complete resource; update course progress |
| `GET` | `/api/courses/{courseId}/resume` | Learner | Get progress and next resource |

**Complete resource:** first completion returns `201`; completing the same resource again returns `200` when the existing record is detected. Response includes `success`, `message`, `data`, and `progress`.

**Progress percentage:**

```text
progress = completedResources / totalCourseResources * 100
```

Progress is rounded to 2 decimal places; an empty course returns `0`.

**Resume example:**

```json
{
  "success": true,
  "progress": 50,
  "nextresource": {
    "_id": "<resourceObjectId>",
    "title": "Introduction to Express",
    "type": "video",
    "module": "<moduleObjectId>",
    "order": 2
  }
}
```

When all resources are completed, `nextresource` is `null`.

### Trainer reporting

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/trainer/courses` | Trainer | List own courses |
| `GET` | `/api/trainer/courses/{courseId}/learners` | Trainer | List active learners |
| `GET` | `/api/trainer/courses/{courseId}/learners/{learnerId}/progress` | Trainer / Admin | Detailed learner progression |

The detailed progress response includes `progress`, `totalResources`, `completedCount`, and `completedResources`.

---

## âš ï¸ Error Handling

The API uses HTTP status codes for validation, authentication, authorization, and resource errors.

| HTTP code | Meaning / typical usage |
|---|---|
| `200` | Successful GET / update / cancellation or repeated resource completion |
| `201` | Resource, enrollment, or user created; first completion |
| `400` | Invalid ObjectId or request values (where explicitly validated) |
| `401` | Missing/invalid JWT or authentication failure (middleware-dependent) |
| `403` | Forbidden role, inactive account, missing enrollment, or locked module |
| `404` | Course, module, resource, file, or enrollment not found |
| `409` | Duplicate email or existing active enrollment |
| `500` | Unhandled server error |

Some controllers use `{ "message": "..." }` and others use `{ "success": false, "message": "..." }`. **The response format is not yet fully standardized across all endpoints.**

---

## ðŸ§ª Testing

Automated tests use **Jest** and **Supertest**:

```bash
npm test
```

The current suite contains `tests/auth.test.js` and `tests/setup.js`. It covers registration, JWT login/profile, rejected credentials, inactive users, and selected authorization behavior. **The auth-focused suite passed 7/7 tests in the last reported local run.**

**Safety:** the test setup connects to a dedicated MongoDB database named `lms_test_db` and checks the test environment. Review the test URI in `tests/setup.js` before running in another environment. Never point automated cleanup at valuable data.

Recommended manual verification:

1. Register and login as learner; verify `/api/auth/me`.
2. Confirm a learner cannot create a course.
3. Verify unpublished courses cannot be enrolled in.
4. Enroll in a published course; retry to verify `409`.
5. Complete resources in order; verify progression and idempotent retry.
6. Try a resource in a locked module; verify `403`.
7. Download an allowed uploaded PDF/MP4; verify the returned file.
8. Test trainer views and ownership restrictions.

**Test coverage limitation:** enrollment, progression, resource download, and trainer endpoints do not yet have dedicated Jest/Supertest suites in the current `tests/` directory. A replayable Postman collection has not yet been confirmed in this repository.

---

## ðŸ“ Data Model Overview

| Model | Main responsibility |
|---|---|
| `User` | Profile, email, hashed password, role, account status |
| `Course` | Course content, category, level, status, trainer |
| `Module` | Ordered module inside a course |
| `Resource` | Ordered learning item, metadata/content/file reference |
| `Enrollment` | Learner-to-course relationship, active status, progress percentage |
| `ResourceProgress` | Completion records for resources in an enrollment |

The MongoDB schema is defined in `src/models/`, which is the reference for exact fields, indexes, and validations.

---

## ðŸ“‘ Documentation & Design

- [`docs/analyse.md`](docs/analyse.md) â€” initial analysis / project framing.
- [`docs/openapi.yaml`](docs/openapi.yaml) â€” **initial OpenAPI 3.0.3 specification**, currently covering the public course catalog and module/resource listing. It **does not yet fully describe all Brief 2 secure endpoints**.
- `src/routes/` â€” implemented routes and HTTP methods.
- `src/controllers/` â€” implemented request behavior and response codes.
- `src/models/` â€” authoritative data schema and constraints.

### UML / conception status

The original project planning considers broader LMS concepts (such as quizzes and feedback). These should be distinguished from implemented APIs. The current verified `docs/` directory contains `analyse.md` and `openapi.yaml`; UML files should only be linked once committed to the repository.

---

## ðŸ§­ Scope & Known Limitations

### âœ… Implemented in the current API

- Published course catalog, search, filters, and sorting.
- Authentication, JWT, account status checks, and role-protected routes.
- Course/module/resource operations and PDF/MP4 upload.
- Enrollment and cancellation.
- Resource completion, progress percentage, module sequencing, and learning resume.
- Protected resource content/download endpoints.
- Trainer course and learner-progress reporting.
- Docker build and Compose startup; successful local API/MongoDB connectivity and HTTP health check.
- Auth-focused Jest/Supertest tests.

### ðŸ” Known limitations / verification notes

- **OpenAPI coverage:** `docs/openapi.yaml` still needs Brief 2 paths and Bearer security definitions.
- **Test breadth:** enrollment, progress, trainer, and secure download need dedicated automated tests.
- **Enrollment reactivation:** the behavior when a learner reenrolls after cancellation must be verified against `Enrollment` schema indexes and model methods.
- **Concurrent enrollment:** `findOne` followed by `save` does not by itself guarantee uniqueness under concurrent requests; database constraints must be verified.
- **Uploaded files in Docker:** no persistent upload mount in the current Compose service; recreating the API container may lose uploaded files.
- **Port consistency:** Compose specifies host MongoDB port `27018`, while the existing development MongoDB container was already created with host port `27017`. A fresh Compose install and an existing developer machine therefore need different host connection settings.
- **Response consistency:** not all endpoints use a uniform error envelope.
- **Operational hardening:** this is an educational project, not a claimed production-ready LMS deployment.

### ðŸ”œ Future scope

- Quiz, quiz attempts, and learner feedback endpoints.
- Broader automated test coverage and a maintained Postman collection.
- Persistent/object storage and backup strategy for learning files.
- Complete OpenAPI coverage for protected endpoints.
- Additional administrative workflows and operational observability.

---

## ðŸ¤ Development Workflow & Contributions

Development follows a **feature-branch â†’ commit â†’ pull request â†’ review/merge into `main`** workflow. The assessed deliverable is the code available on `main`.

The implementation spans authentication, course management, enrollment, progression, resources, tests, Docker, and documentation. For the precise individual contribution breakdown, refer to the merged PRs and commits in Git history rather than assuming ownership from filenames.

**Selected merged milestones:**

- PR #20 â€” Secure resource download.
- PR #21 â€” Automated authentication tests.
- PR #22 â€” Docker API + Compose integration.

---

## ðŸ‘¨â€ðŸ’» Maintainer

<div align="center">

**YouLearn LMS API**

Project repository: [bouhouchhamza/LMS_YouLearn](https://github.com/bouhouchhamza/LMS_YouLearn)

**Hamza Bouhouch** Â· Full-Stack Development

</div>
