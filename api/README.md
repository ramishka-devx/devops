# LMS API

Node.js Express API for Learning Management System.

## Features

- User authentication (JWT)
- Role-based access (student/admin)
- Course management
- Monthly modules with payment access
- Lesson content delivery

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (copy .env.example to .env and fill values)

3. Set up MySQL database and run schema.sql

4. Start server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/users/register
- POST /api/users/login
- GET /api/users/me (requires auth)

### Courses (Public)
- GET /api/courses

### Courses (Student)
- GET /api/courses/:courseId/months (optional auth for paid status)
- GET /api/lessons?monthId= (requires auth + payment)

### Payments
- POST /api/payments/months/:monthId (requires auth)
- GET /api/payments/months/:monthId (requires auth)

### Admin Courses
- POST /api/admin/courses (admin)
- GET /api/admin/courses (admin)
- PATCH /api/admin/courses/:courseId (admin)
- DELETE /api/admin/courses/:courseId (admin)

### Admin Months
- POST /api/admin/courses/:courseId/months (admin)
- PATCH /api/admin/months/:monthId (admin)
- DELETE /api/admin/months/:monthId (admin)

### Admin Lessons
- POST /api/admin/months/:monthId/lessons (admin)
- PATCH /api/admin/lessons/:lessonId (admin)
- DELETE /api/admin/lessons/:lessonId (admin)

## Database Schema

See db/schema.sql for full schema.