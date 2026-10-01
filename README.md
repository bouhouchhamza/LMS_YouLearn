# YouLearn LMS API

REST API for a Learning Management System built with **Node.js, Express.js and MongoDB**.

The project provides the backend foundations for browsing published courses, viewing course details, accessing modules and resources, filtering courses, and handling API errors.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker
- Docker Compose
- OpenAPI
- JavaScript

---

## Features

- Browse published courses
- View course details
- Search courses by keyword
- Filter courses by category
- Filter courses by level
- Sort courses by creation or publication date
- View modules of a course
- View resources of a module
- Seed the database with sample data
- Global API error handling
- 404 route handling
- OpenAPI documentation
- MongoDB container with Docker Compose

---

## Project Structure

```text
lms-api/
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
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/bouhouchhamza/LMS_YouLearn.git
```

Open the project:

```bash
cd LMS_YouLearn
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/lms_db
```

An example configuration is available in:

```text
.env.example
```

---

## MongoDB with Docker

Start MongoDB:

```bash
docker compose up -d
```

Check the container:

```bash
docker compose ps
```

Stop the container:

```bash
docker compose down
```

---

## Seed Database

The project includes seed data for courses, modules and resources.

Run:

```bash
npm run seed
```

The seed creates sample data such as:

- Node.js Fundamentals
- Express.js API Development
- Advanced MongoDB
- Course modules
- Learning resources

The draft course is stored in the database but is not returned by the public course catalog.

---

## Run the API

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API runs by default on:

```text
http://localhost:3000
```

---

# API Endpoints

## Get Published Courses

```http
GET /api/courses
```

Returns published courses only.

Example response:

```json
{
  "success": true,
  "count": 2,
  "data": []
}
```

---

## Search Courses

```http
GET /api/courses?keyword=node
```

Search is performed on course title and description.

---

## Filter by Category

```http
GET /api/courses?category=Backend
```

---

## Filter by Level

Available levels:

```text
beginner
intermediate
advanced
```

Example:

```http
GET /api/courses?level=beginner
```

Invalid values return:

```json
{
  "success": false,
  "message": "Invalid course level"
}
```

---

## Combine Search and Filters

```http
GET /api/courses?keyword=node&category=Backend&level=beginner
```

---

## Sort Courses

Courses can be sorted using:

```text
createdAt
publishedAt
```

Example:

```http
GET /api/courses?sort=publishedAt
```

The latest courses are returned first.

---

## Get Course Details

```http
GET /api/courses/:id
```

Example:

```http
GET /api/courses/6abe70bf6205c8d6d6ba42fb
```

If the ID format is invalid:

```json
{
  "success": false,
  "message": "Invalid course id"
}
```

If the course does not exist:

```json
{
  "success": false,
  "message": "Course not found"
}
```

Only published courses are accessible through this endpoint.

---

## Get Course Modules

```http
GET /api/courses/:courseId/modules
```

Example:

```http
GET /api/courses/6abe70bf6205c8d6d6ba42fb/modules
```

Modules are returned using their `order` value.

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

---

## Get Module Resources

```http
GET /api/modules/:moduleId/resources
```

Resources are returned using their `order` value.

Example response:

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

If the module ID is invalid:

```json
{
  "success": false,
  "message": "Invalid module id"
}
```

If the module does not exist:

```json
{
  "success": false,
  "message": "Module not found"
}
```

---

# Data Models

## Course

Main fields:

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

Possible statuses:

```text
draft
published
archived
```

Possible levels:

```text
beginner
intermediate
advanced
```

---

## Module

Main fields:

```text
title
description
order
course
createdAt
updatedAt
```

Each module belongs to one course.

Relationship:

```text
Course 1 ---- * Module
```

---

## Resource

Main fields:

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

Available resource types:

```text
video
pdf
link
text
```

Each resource belongs to one module.

Relationship:

```text
Module 1 ---- * Resource
```

---

# Error Handling

The API uses global error handling.

Unknown routes return:

```json
{
  "success": false,
  "message": "Route not found: /api/example"
}
```

Unexpected server errors return a JSON response using the same structure:

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

# API Documentation

The OpenAPI specification is available here:

```text
docs/openapi.yaml
```

It documents:

- Course catalog
- Course details
- Course modules
- Module resources
- Search parameters
- Filters
- Sorting
- HTTP responses

---

# UML & Conception

The project conception documents are stored inside:

```text
docs/
```

They include:

```text
analyse.md
conception.md
class-diagram.puml
use-case-diagram.puml
sequence-diagram.puml
```

The UML conception covers the broader LMS domain including:

- Users
- Courses
- Modules
- Resources
- Enrollments
- Progress
- Quizzes
- Quiz attempts
- Feedback

---

# NPM Scripts

Start the API:

```bash
npm start
```

Start development mode with Nodemon:

```bash
npm run dev
```

Seed the database:

```bash
npm run seed
```

---

# Current Scope

This first version focuses on the backend foundations of the LMS.

Implemented:

- Course catalog
- Course details
- Search
- Filters
- Sorting
- Course modules
- Module resources
- MongoDB connection
- Seed data
- Docker environment
- Error handling
- OpenAPI documentation

The following concepts are included in the global conception but are not implemented in this first version:

- Authentication
- User management
- Enrollment
- Progress tracking
- Quizzes
- Quiz attempts
- Feedback
- Trainer course management
- Administration

---

## Author

**Hamza Bouhouch**

GitHub: `bouhouchhamza`