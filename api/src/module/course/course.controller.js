const Course = require('./course.model');
const Month = require('./month.model');
const Lesson = require('./lesson.model');
const Payment = require('../payment/payment.model');

// Admin controllers
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ course });
  } catch (err) {
    throw err; // Let error handler deal with it
  }
};

exports.listCoursesAdmin = async (_req, res) => {
  try {
    const courses = await Course.findAll();
    res.json({ courses });
  } catch (err) {
    throw err;
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.update(courseId, req.body);
    res.json({ course });
  } catch (err) {
    throw err;
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    await Course.remove(courseId);
    res.json({ success: true });
  } catch (err) {
    throw err;
  }
};

exports.createMonth = async (req, res) => {
  try {
    const { courseId } = req.params;
    const month = await Month.create({ course_id: courseId, ...req.body });
    res.status(201).json({ month });
  } catch (err) {
    throw err;
  }
};

exports.updateMonth = async (req, res) => {
  try {
    const { monthId } = req.params;
    const month = await Month.update(monthId, req.body);
    res.json({ month });
  } catch (err) {
    throw err;
  }
};

exports.deleteMonth = async (req, res) => {
  try {
    const { monthId } = req.params;
    await Month.remove(monthId);
    res.json({ success: true });
  } catch (err) {
    throw err;
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { monthId } = req.params;
    const lesson = await Lesson.create({ month_id: monthId, ...req.body });
    res.status(201).json({ lesson });
  } catch (err) {
    throw err;
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.update(lessonId, req.body);
    res.json({ lesson });
  } catch (err) {
    throw err;
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    await Lesson.remove(lessonId);
    res.json({ success: true });
  } catch (err) {
    throw err;
  }
};

// Student/public controllers
exports.listCourses = async (_req, res) => {
  try {
    const courses = await Course.findAll();
    res.json({ courses });
  } catch (err) {
    throw err;
  }
};

exports.listMonthsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const months = await Month.listByCourse(courseId);

    // Get enrollment counts for all months in this course
    const enrollmentCounts = await Payment.getEnrollmentCountsForCourse(courseId);

    // If user is authenticated, annotate paid status
    let paidSet = new Set();
    if (req.user && req.user.user_id) {
      const paid = await Payment.userPaidMonths(req.user.user_id);
      paidSet = new Set(paid);
    }
    const result = months.map(m => ({ 
      ...m, 
      is_paid: paidSet.has(m.month_id),
      enrollment_count: enrollmentCounts[m.month_id] || 0
    }));
    res.json({ months: result });
  } catch (err) {
    throw err;
  }
};

exports.listLessonsForMonth = async (req, res) => {
  try {
    const { monthId } = req.query;
    if (!monthId) throw new Error('monthId is required');
    // Only allow if paid
    const access = await Payment.findByUserAndMonth(req.user.user_id, monthId);
    if (!access || access.status !== 'paid') throw new Error('Payment required');
    const lessons = await Lesson.listByMonth(monthId);
    res.json({ lessons });
  } catch (err) {
    throw err;
  }
};
