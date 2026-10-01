<div align="center">

# 🚀 YouLearn LMS API

### REST API for a modern Learning Management System

Built with Node.js, Express.js, MongoDB and Docker.

<br>

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI-Documentation-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)

</div>

---

## 📌 About

**YouLearn LMS API** is the backend foundation of a Learning Management System.

The API allows users to browse published courses, search and filter the catalog, view course modules and access learning resources.

This first version focuses on the core LMS architecture and API foundations.

---

## ✨ Features

- 📚 Browse published courses
- 🔎 Search courses by keyword
- 🎯 Filter by category and level
- ↕️ Sort courses by creation or publication date
- 📖 View course details
- 🧩 View modules of a course
- 🎥 View resources of a module
- 🌱 Seed development data
- ⚠️ Global error handling
- 🐳 MongoDB with Docker Compose
- 📑 OpenAPI documentation

---

## 🧰 Tech Stack

| Technology | Usage |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | HTTP API |
| **MongoDB** | Database |
| **Mongoose** | MongoDB ODM |
| **Docker** | Containerization |
| **Docker Compose** | MongoDB environment |
| **OpenAPI** | API documentation |
| **Nodemon** | Development server |

---

## 🏗️ Architecture

```text
Client
  │
  ▼
Express Routes
  │
  ▼
Controllers
  │
  ▼
Mongoose Models
  │
  ▼
MongoDB
```

Main learning content hierarchy:

```text
Course
  │
  ├── Module
  │     │
  │     └── Resource
  │
  └── Module
        │
        └── Resource
```

---

## 📂 Project Structure

```text
lms-api/
│
├── docs/
│   ├── analyse.md
│   ├── conception.md
│   ├── class-diagram.puml
│   ├── use-case-diagram.puml
│   ├── sequence-diagram.puml
│   └── openapi.yaml
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── courseController.js
│   │   ├── moduleController.js
│   │   └── resourceController.js
│   │
│   ├── middlewares/
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   ├── Course.js
│   │   ├── Module.js
│   │   └── Resource.js
│   │
│   ├── routes/
│   │   ├── courseRoutes.js
│   │   └── moduleRoutes.js
│   │
│   ├── seed/
│   │   └── seed.js
│   │
│   └── app.js
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── README.md
└── server.js
```

---

# ⚡ Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/bouhouchhamza/LMS_YouLearn.git
cd LMS_YouLearn
```

## 2. Install dependencies

```bash
npm install
```

## 3. Environment configuration

Create a `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/lms_db
```

You can use `.env.example` as reference.

---

## 🐳 Start MongoDB

```bash
docker compose up -d
```

Check the container:

```bash
docker compose ps
```

Stop MongoDB:

```bash
docker compose down
```

---

## 🌱 Seed Database

Populate the database with development data:

```bash
npm run seed
```

The seed creates:

```text
Courses
 ├── Node.js Fundamentals
 ├── Express.js API Development
 └── Advanced MongoDB (draft)

Modules
 ├── Introduction to Node.js
 ├── Node.js Modules
 └── Introduction to Express

Resources
 ├── Videos
 ├── PDFs
 ├── Links
 └── Text content
```

---

## ▶️ Run the API

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server:

```text
http://localhost:3000
```

---

# 🔌 API Reference

## Courses

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | Get published courses |
| `GET` | `/api/courses/:id` | Get course details |
| `GET` | `/api/courses/:courseId/modules` | Get course modules |
| `GET` | `/api/modules/:moduleId/resources` | Get module resources |

---

## 🔍 Course Search & Filters

### Search

```http
GET /api/courses?keyword=node
```

Searches inside:

```text
title
description
```

### Filter by category

```http
GET /api/courses?category=Backend
```

### Filter by level

```http
GET /api/courses?level=beginner
```

Supported levels:

```text
beginner
intermediate
advanced
```

### Sort

```http
GET /api/courses?sort=publishedAt
```

Supported values:

```text
createdAt
publishedAt
```

### Combine parameters

```http
GET /api/courses?keyword=node&category=Backend&level=beginner&sort=publishedAt
```

---

# 📚 Course Example

```http
GET /api/courses
```

Response:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "title": "Node.js Fundamentals",
      "category": "Backend",
      "level": "beginner",
      "status": "published"
    }
  ]
}
```

---

# 🧩 Course Modules

```http
GET /api/courses/:courseId/modules
```

Example response:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "title": "Introduction to Node.js",
      "order": 1
    },
    {
      "title": "Node.js Modules",
      "order": 2
    }
  ]
}
```

Modules are sorted by their `order`.

---

# 🎥 Module Resources

```http
GET /api/modules/:moduleId/resources
```

Example:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "title": "What is Node.js?",
      "type": "video",
      "order": 1
    },
    {
      "title": "Node.js Runtime Notes",
      "type": "pdf",
      "order": 2
    }
  ]
}
```

Supported resource types:

```text
video
pdf
link
text
```

---

# ⚠️ Error Handling

Invalid ID:

```json
{
  "success": false,
  "message": "Invalid course id"
}
```

Resource not found:

```json
{
  "success": false,
  "message": "Module not found"
}
```

Unknown API route:

```json
{
  "success": false,
  "message": "Route not found: /api/example"
}
```

---

# 🗃️ Data Models

### Course

```text
title
description
category
level
status
publishedAt
createdAt
updatedAt
```

### Module

```text
title
description
order
course
createdAt
updatedAt
```

### Resource

```text
title
type
url
content
order
module
createdAt
updatedAt
```

---

# 📐 UML & Design

Project design documentation is available inside:

```text
docs/
```

It includes:

```text
📄 Requirements Analysis
📊 Class Diagram
👥 Use Case Diagram
🔄 Sequence Diagram
🧠 Architecture Decisions
```

The global LMS conception contains:

```text
User
Course
Module
Resource
Enrollment
Progress
Quiz
QuizAttempt
Feedback
```

---

# 📑 API Documentation

OpenAPI specification:

```text
docs/openapi.yaml
```

It documents the public endpoints, query parameters and HTTP responses.

---

# 🧭 Scope

### ✅ Implemented

```text
Course Catalog
Course Details
Search
Filters
Sorting
Modules
Resources
MongoDB
Seed Data
Docker
Error Handling
OpenAPI Documentation
```

### 🔜 Future LMS Features

```text
Authentication
User Management
Enrollment
Progress Tracking
Quizzes
Quiz Attempts
Feedback
Trainer Management
Administration
```

---

## 👨‍💻 Author

<div align="center">

### Hamza Bouhouch

**Full-Stack Developer**

GitHub: **bouhouchhamza**

</div>