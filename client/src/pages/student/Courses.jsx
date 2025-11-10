import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.jpg';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/courses')
      .then(data => setCourses(data.courses))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading courses...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Courses</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(c => {
          const cover = c.cover || Logo;
          const created = c.created_at ? new Date(c.created_at) : null;
          return (
            <Link key={c.course_id} to={`/courses/${c.course_id}`} className="group bg-white border border-gray-300 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="w-full h-40 bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img src={cover} alt="Course cover image" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-green-800 line-clamp-2">{c.title}</h2>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${c.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{c.is_published ? 'Published' : 'Draft'}</span>
                </div>
                {c.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{c.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  {created && <span>Created {created.toLocaleDateString()}</span>}
                  <span>ID: {c.course_id}</span>
                </div>
              </div>
            </Link>
          );
          })}
        </div>
      </div>
    </section>
    );
   }
