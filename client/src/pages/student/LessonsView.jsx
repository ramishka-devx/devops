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

  const isPDF = (url) => {
    return url && (url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('pdf'));
  };

  const getFileIcon = (url) => {
    if (isPDF(url)) {
      return '📄'; // PDF icon
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return '📺'; // Video icon
    }
    return '🔗'; // Link icon
  };

  const getContentType = (url) => {
    if (isPDF(url)) return 'PDF Document';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'Video';
    if (url.includes('google.com') || url.includes('docs.google.com')) return 'Google Document';
    return 'External Link';
  };

  if (loading) return <div className="p-6">Loading lessons...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Course Lessons</h1>
      <div className="space-y-4">
        {lessons.map(l => (
          <div key={l.lesson_id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-800">{l.title}</h2>
              <span className="text-sm text-gray-500">Lesson {l.display_order}</span>
            </div>

            {/* Content URL */}
            {l.content_url && (
              <div className="mb-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-2xl">{getFileIcon(l.content_url)}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{getContentType(l.content_url)}</p>
                    <p className="text-xs text-gray-500 truncate">{l.content_url}</p>
                  </div>
                  <a
                    href={l.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    {isPDF(l.content_url) ? 'View PDF' : 'Open Link'}
                  </a>
                </div>
              </div>
            )}

            {/* Text Content */}
            {l.content && (
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Lesson Content</h3>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded border border-gray-200">
                  {l.content}
                </div>
              </div>
            )}

            {/* If no content */}
            {!l.content_url && !l.content && (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📚</span>
                <p>Lesson content will be available soon.</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📖</span>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No lessons available</h3>
          <p className="text-gray-500">Lessons for this month will be published soon.</p>
        </div>
      )}
    </div>
  );
}
