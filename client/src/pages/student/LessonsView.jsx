import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGet } from '../../lib/api';

export default function LessonsView() {
  const [params] = useSearchParams();
  const monthId = params.get('monthId');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!monthId) { setError('monthId is required'); setLoading(false); return; }
    apiGet(`/api/lessons?monthId=${monthId}`)
      .then(data => setLessons(data.lessons || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [monthId]);

  if (loading) return <div className="p-6">Loading lessons...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Lessons</h1>
      <div className="space-y-3">
        {lessons.map(l => (
          <div key={l.lesson_id} className="bg-white border rounded-lg p-4">
            <div className="font-semibold text-green-800">{l.title}</div>
            {l.content_url && (
              <a href={l.content_url} target="_blank" rel="noreferrer" className="text-green-600 underline">Open Content</a>
            )}
            {l.content && (
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{l.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
