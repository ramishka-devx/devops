# Admin Dashboard

Complete admin interface for managing the LMS system.

## Features

- **Course Management**: Create, edit, delete courses
- **Month Management**: Manage monthly modules within courses
- **Lesson Management**: Create and organize lesson content
- **Access Control**: Role-based admin access only

## Adding Lesson Content

Admins can add various types of content to lessons:

### **Content URL Types**
- **PDF Documents**: `https://example.com/lesson1.pdf` 📄
- **Videos**: `https://youtube.com/watch?v=...` or `https://youtu.be/...` 📺
- **Google Docs**: `https://docs.google.com/document/...` 📝
- **External Links**: Any valid URL 🔗

### **Text Content**
- Plain text content can be added directly in the "Content Text" field
- Supports formatting with line breaks and paragraphs

### **Best Practices**
1. Use descriptive lesson titles
2. Set appropriate display order for lesson sequencing
3. Test all links to ensure they work
4. Use published status to control content visibility
5. PDFs and documents should be hosted on reliable services

## Navigation Structure

```
Admin Dashboard (/admin/courses)
├── Courses List
│   ├── Manage Months → (/admin/courses/:courseId/months)
│   │   ├── Months List
│   │   │   ├── Manage Lessons → (/admin/months/:monthId/lessons)
│   │   │   │   └── Lessons List
```

## API Endpoints Used

### Courses
- `GET /api/admin/courses` - List all courses
- `POST /api/admin/courses` - Create course
- `PATCH /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course

### Months
- `GET /api/courses/:courseId/months` - List months for course
- `POST /api/admin/courses/:courseId/months` - Create month
- `PATCH /api/admin/months/:id` - Update month
- `DELETE /api/admin/months/:id` - Delete month

### Lessons
- `GET /api/lessons?monthId=:id` - List lessons for month
- `POST /api/admin/months/:monthId/lessons` - Create lesson
- `PATCH /api/admin/lessons/:id` - Update lesson
- `DELETE /api/admin/lessons/:id` - Delete lesson

## Components

- `AdminCourses.jsx` - Main dashboard, course CRUD
- `AdminMonths.jsx` - Month management within a course
- `AdminLessons.jsx` - Lesson management within a month
- `Modal.jsx` - Reusable modal for forms

## Security

- All admin routes require authentication and admin role
- Input validation on all forms
- Confirmation dialogs for destructive actions