import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost } from '../../lib/api';
import toast from 'react-hot-toast';
import Logo from '../../assets/logo.jpg';

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ modules: 0 });

  useEffect(() => {
    async function load() {
      try {
        const coursesRes = await apiGet('/api/courses');
        const found = coursesRes.courses.find(c => c.course_id === Number(courseId));
        setCourse(found || null);
        const monthsRes = await apiGet(`/api/courses/${courseId}/months`);
        const ms = monthsRes.months || [];
        setMonths(ms);
        setStats({ modules: ms.length });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  const handlePay = async (m) => {
    try {
      await apiPost(`/api/payments/months/${m.month_id}`);
      toast.success('Payment successful');
      const monthsRes = await apiGet(`/api/courses/${courseId}/months`);
      setMonths(monthsRes.months || []);
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="p-6">Loading course...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!course) return <div className="p-6">Course not found.</div>;

  const coverSrc = course?.cover || Logo;
  const created = course?.created_at ? new Date(course.created_at) : null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header with cover image */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6 grid md:grid-cols-3">
        <div className="md:col-span-1 h-56 md:h-auto bg-gray-100">
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img src={coverSrc} alt="Course cover image" className="w-full h-full object-cover" />
        </div>
        <div className="md:col-span-2 p-5">
          <h1 className="text-3xl font-bold text-green-700 mb-2">{course.title}</h1>
          <p className="text-gray-700 mb-4 leading-relaxed">{course.description || 'No description provided.'}</p>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className={`px-3 py-1 rounded-full border ${course.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
              {course.is_published ? 'Published' : 'Draft'}
            </span>
            {created && (
              <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                Created {created.toLocaleDateString()}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {stats.modules} {stats.modules === 1 ? 'Module' : 'Modules'}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ID: {course.course_id}
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-green-800 mb-3">Modules</h2>
      <div className="space-y-3">
        {months.map(m => (
          <div key={m.month_id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-green-800">{m.title}</div>
              <div className="text-sm text-gray-600">Month {m.month_index} • LKR {Number(m.price).toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              {m.is_paid ? (
                <Link to={`/lessons?monthId=${m.month_id}`} className="px-4 py-2 bg-green-600 text-white rounded-lg">View Lessons</Link>
              ) : (
                <button onClick={() => handlePay(m)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Enroll</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
