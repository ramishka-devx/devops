const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const ctrl = require('./course.controller');
const router = express.Router();

// Public / student accessible (courses list)
router.get('/courses', ctrl.listCourses);

// Months listing can benefit from optional auth (to show paid badge) -> attach user if token provided
router.get('/courses/:courseId/months', (req, res, next) => {
  // optional auth: parse bearer if present
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    // naive optional decode; reuse requireAuth logic would send 401 so we manually decode
    const jwt = require('jsonwebtoken');
    try { req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET); } catch { /* ignore */ }
  }
  next();
}, ctrl.listMonthsForCourse);

// Paid lessons (must be authenticated + have access)
router.get('/lessons', requireAuth, ctrl.listLessonsForMonth);

// Admin routes
router.post('/admin/courses', requireAuth, requireRole('admin'), validate({
  title: { required: true, type: 'string', minLength: 1, maxLength: 150 },
  description: { type: 'string', maxLength: 1000 },
  cover: { type: 'string', maxLength: 255 },
  is_published: { type: 'number' }
}), ctrl.createCourse);

router.get('/admin/courses', requireAuth, requireRole('admin'), ctrl.listCoursesAdmin);

router.patch('/admin/courses/:courseId', requireAuth, requireRole('admin'), validate({
  title: { type: 'string', minLength: 1, maxLength: 150 },
  description: { type: 'string', maxLength: 1000 },
  cover: { type: 'string', maxLength: 255 },
  is_published: { type: 'number' }
}), ctrl.updateCourse);

router.delete('/admin/courses/:courseId', requireAuth, requireRole('admin'), ctrl.deleteCourse);

router.post('/admin/courses/:courseId/months', requireAuth, requireRole('admin'), validate({
  title: { required: true, type: 'string', minLength: 1, maxLength: 150 },
  month_index: { required: true, type: 'number' },
  price: { type: 'number' },
  is_published: { type: 'number' }
}), ctrl.createMonth);

router.patch('/admin/months/:monthId', requireAuth, requireRole('admin'), validate({
  title: { type: 'string', minLength: 1, maxLength: 150 },
  month_index: { type: 'number' },
  price: { type: 'number' },
  is_published: { type: 'number' }
}), ctrl.updateMonth);

router.delete('/admin/months/:monthId', requireAuth, requireRole('admin'), ctrl.deleteMonth);

router.post('/admin/months/:monthId/lessons', requireAuth, requireRole('admin'), validate({
  title: { required: true, type: 'string', minLength: 1, maxLength: 200 },
  content_url: { type: 'string', maxLength: 500 },
  content: { type: 'string' },
  display_order: { type: 'number' },
  is_published: { type: 'number' }
}), ctrl.createLesson);

router.patch('/admin/lessons/:lessonId', requireAuth, requireRole('admin'), validate({
  title: { type: 'string', minLength: 1, maxLength: 200 },
  content_url: { type: 'string', maxLength: 500 },
  content: { type: 'string' },
  display_order: { type: 'number' },
  is_published: { type: 'number' }
}), ctrl.updateLesson);

router.delete('/admin/lessons/:lessonId', requireAuth, requireRole('admin'), ctrl.deleteLesson);

module.exports = router;
