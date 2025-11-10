const Course = require('./course.model');
const Month = require('./month.model');
const Lesson = require('./lesson.model');
const Payment = require('../payment/payment.model');

// Admin controllers
exports.createCourse = async (req, res) => {
  try {
    const { title, description, cover, is_published } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const course = await Course.create({ title, description, cover, is_published });
    res.status(201).json({ course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listCoursesAdmin = async (_req, res) => {
  try {
    const courses = await Course.findAll();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.update(courseId, req.body || {});
    res.json({ course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    await Course.remove(courseId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMonth = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, month_index, price, is_published } = req.body;
    if (!title || month_index == null) return res.status(400).json({ error: 'title and month_index are required' });
    const month = await Month.create({ course_id: courseId, title, month_index, price, is_published });
    res.status(201).json({ month });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMonth = async (req, res) => {
  try {
    const { monthId } = req.params;
    const month = await Month.update(monthId, req.body || {});
    res.json({ month });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMonth = async (req, res) => {
  try {
    const { monthId } = req.params;
    await Month.remove(monthId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { monthId } = req.params;
    const { title, content_url, content, display_order, is_published } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const lesson = await Lesson.create({ month_id: monthId, title, content_url, content, display_order, is_published });
    res.status(201).json({ lesson });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.update(lessonId, req.body || {});
    res.json({ lesson });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    await Lesson.remove(lessonId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Student/public controllers
exports.listCourses = async (_req, res) => {
  try {
    const courses = await Course.findAll();
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listMonthsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const months = await Month.listByCourse(courseId);

    // If user is authenticated, annotate paid status
    let paidSet = new Set();
    if (req.user && req.user.user_id) {
      const paid = await Payment.userPaidMonths(req.user.user_id);
      paidSet = new Set(paid);
    }
    const result = months.map(m => ({ ...m, is_paid: paidSet.has(m.month_id) }));
    res.json({ months: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listLessonsForMonth = async (req, res) => {
  try {
    const { monthId } = req.query;
    if (!monthId) return res.status(400).json({ error: 'monthId is required' });
    // Only allow if paid
    const access = await Payment.findByUserAndMonth(req.user.user_id, monthId);
    if (!access || access.status !== 'paid') return res.status(403).json({ error: 'Payment required' });
    const lessons = await Lesson.listByMonth(monthId);
    res.json({ lessons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
