import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../lib/api';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';

export default function AdminLessons() {
  const { monthId } = useParams();
  const [month, setMonth] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [createForm, setCreateForm] = useState({ title: '', content_url: '', content: '', display_order: '', is_published: true });
  const [editForm, setEditForm] = useState({ title: '', content_url: '', content: '', display_order: '', is_published: true });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      // First get all courses to find the course for this month
      const coursesData = await apiGet('/api/admin/courses');
      const allCourses = coursesData.courses || [];

      // Get all months to find the month info
      let allMonths = [];
      for (const course of allCourses) {
        const monthsData = await apiGet(`/api/courses/${course.course_id}/months`);
        allMonths = [...allMonths, ...(monthsData.months || [])];
      }

      const foundMonth = allMonths.find(m => m.month_id === Number(monthId));
      setMonth(foundMonth);

      if (foundMonth) {
        const foundCourse = allCourses.find(c => c.course_id === foundMonth.course_id);
        setCourse(foundCourse);

        // Load lessons for this month
        const lessonsData = await apiGet(`/api/lessons?monthId=${monthId}`);
        setLessons(lessonsData.lessons || []);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => { load(); }, [monthId]);

  const openEdit = (lesson) => {
    setSelectedLesson(lesson);
    setEditForm({
      title: lesson.title || '',
      content_url: lesson.content_url || '',
      content: lesson.content || '',
      display_order: lesson.display_order || '',
      is_published: lesson.is_published === 1 || lesson.is_published === true
    });
    setShowEdit(true);
  };

  const create = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost(`/api/admin/months/${monthId}/lessons`, {
        ...createForm,
        display_order: Number(createForm.display_order) || 1,
        is_published: createForm.is_published ? 1 : 0
      });
      toast.success('Lesson created');
      setCreateForm({ title: '', content_url: '', content: '', display_order: '', is_published: true });
      setShowCreate(false);
      load();
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const update = async (e) => {
    e.preventDefault();
    if (!selectedLesson) return;
    setLoading(true);
    try {
      await apiPatch(`/api/admin/lessons/${selectedLesson.lesson_id}`, {
        ...editForm,
        display_order: Number(editForm.display_order) || 1,
        is_published: editForm.is_published ? 1 : 0
      });
      toast.success('Lesson updated');
      setShowEdit(false);
      setSelectedLesson(null);
      load();
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const getFileIcon = (url) => {
    if (!url) return '';
    if (url.toLowerCase().includes('.pdf')) return '📄';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return '📺';
    return '🔗';
  };

  const getContentType = (url) => {
    if (!url) return 'Text Only';
    if (url.toLowerCase().includes('.pdf')) return 'PDF';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'Video';
    if (url.includes('google.com') || url.includes('docs.google.com')) return 'Google Doc';
    return 'Link';
  };

  if (!month) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Manage Lessons</h1>
          <p className="text-gray-600">Month: {month.title} {course && `| Course: ${course.title}`}</p>
          <p className="text-sm text-gray-500 mt-1">
            Add PDF links, videos, or text content for students to access
          </p>
        </div>
        <div className="flex gap-3">
          <Link to={`/admin/courses/${month.course_id}/months`} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Months
          </Link>
          <button onClick={() => setShowCreate(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Lesson
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lessons.map(lesson => (
              <tr key={lesson.lesson_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {lesson.display_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lesson.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <span>{getFileIcon(lesson.content_url)}</span>
                    <span>{getContentType(lesson.content_url)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    lesson.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {lesson.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => openEdit(lesson)} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </button>
                  <button onClick={() => remove(lesson.lesson_id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal
        open={showCreate}
        title="Create Lesson"
        onClose={() => setShowCreate(false)}
        footer={(
          <>
            <button onClick={() => setShowCreate(false)} disabled={loading} className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" form="createLessonForm" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </>
        )}
      >
        <form id="createLessonForm" onSubmit={create}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={createForm.title}
              onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Content URL (optional)</label>
            <input
              type="url"
              value={createForm.content_url}
              onChange={(e) => setCreateForm({...createForm, content_url: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="https://example.com/document.pdf or https://youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Add links to PDFs, videos, Google Docs, or other learning materials
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Content Text (optional)</label>
            <textarea
              value={createForm.content}
              onChange={(e) => setCreateForm({...createForm, content: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="4"
              placeholder="Lesson content text..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <input
              type="number"
              value={createForm.display_order}
              onChange={(e) => setCreateForm({...createForm, display_order: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="1"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={createForm.is_published}
                onChange={(e) => setCreateForm({...createForm, is_published: e.target.checked})}
                className="mr-2"
              />
              Published
            </label>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        title="Edit Lesson"
        onClose={() => setShowEdit(false)}
        footer={(
          <>
            <button onClick={() => setShowEdit(false)} disabled={loading} className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" form="editLessonForm" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Updating...' : 'Update'}
            </button>
          </>
        )}
      >
        <form id="editLessonForm" onSubmit={update}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Content URL (optional)</label>
            <input
              type="url"
              value={editForm.content_url}
              onChange={(e) => setEditForm({...editForm, content_url: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="https://example.com/document.pdf or https://youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Add links to PDFs, videos, Google Docs, or other learning materials
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Content Text (optional)</label>
            <textarea
              value={editForm.content}
              onChange={(e) => setEditForm({...editForm, content: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="4"
              placeholder="Lesson content text..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <input
              type="number"
              value={editForm.display_order}
              onChange={(e) => setEditForm({...editForm, display_order: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="1"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editForm.is_published}
                onChange={(e) => setEditForm({...editForm, is_published: e.target.checked})}
                className="mr-2"
              />
              Published
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}