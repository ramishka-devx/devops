import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../lib/api';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';

export default function AdminMonths() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [months, setMonths] = useState([]);
  const [createForm, setCreateForm] = useState({ title: '', month_index: '', price: '', is_published: true });
  const [editForm, setEditForm] = useState({ title: '', month_index: '', price: '', is_published: true });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      // Load course info
      const coursesData = await apiGet('/api/admin/courses');
      const foundCourse = coursesData.courses.find(c => c.course_id === Number(courseId));
      setCourse(foundCourse);

      // Load months for this course
      const monthsData = await apiGet(`/api/courses/${courseId}/months`);
      setMonths(monthsData.months || []);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => { load(); }, [courseId]);

  const openEdit = (month) => {
    setSelectedMonth(month);
    setEditForm({
      title: month.title || '',
      month_index: month.month_index || '',
      price: month.price || '',
      is_published: month.is_published === 1 || month.is_published === true
    });
    setShowEdit(true);
  };

  const create = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost(`/api/admin/courses/${courseId}/months`, {
        ...createForm,
        month_index: Number(createForm.month_index),
        price: Number(createForm.price) || 0,
        is_published: createForm.is_published ? 1 : 0
      });
      toast.success('Month created');
      setCreateForm({ title: '', month_index: '', price: '', is_published: true });
      setShowCreate(false);
      load();
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const update = async (e) => {
    e.preventDefault();
    if (!selectedMonth) return;
    setLoading(true);
    try {
      await apiPatch(`/api/admin/months/${selectedMonth.month_id}`, {
        ...editForm,
        month_index: Number(editForm.month_index),
        price: Number(editForm.price) || 0,
        is_published: editForm.is_published ? 1 : 0
      });
      toast.success('Month updated');
      setShowEdit(false);
      setSelectedMonth(null);
      load();
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const remove = async (monthId) => {
    if (!confirm('Are you sure you want to delete this month?')) return;
    try {
      await apiDelete(`/api/admin/months/${monthId}`);
      toast.success('Month deleted');
      load();
    } catch (e) { toast.error(e.message); }
  };

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Manage Months</h1>
          <p className="text-gray-600">Course: {course.title}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/courses" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Courses
          </Link>
          <button onClick={() => setShowCreate(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Month
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Index</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrollments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {months.map(month => (
              <tr key={month.month_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {month.month_index}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {month.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  LKR {month.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {month.enrollment_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    month.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {month.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link to={`/admin/months/${month.month_id}/lessons`} className="text-blue-600 hover:text-blue-900">
                    Lessons
                  </Link>
                  <button onClick={() => openEdit(month)} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </button>
                  <button onClick={() => remove(month.month_id)} className="text-red-600 hover:text-red-900">
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
        title="Create Month"
        onClose={() => setShowCreate(false)}
        footer={(
          <>
            <button onClick={() => setShowCreate(false)} disabled={loading} className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" form="createMonthForm" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </>
        )}
      >
        <form id="createMonthForm" onSubmit={create}>
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
            <label className="block text-sm font-medium text-gray-700">Month Index</label>
            <input
              type="number"
              value={createForm.month_index}
              onChange={(e) => setCreateForm({...createForm, month_index: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              value={createForm.price}
              onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
        title="Edit Month"
        onClose={() => setShowEdit(false)}
        footer={(
          <>
            <button onClick={() => setShowEdit(false)} disabled={loading} className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" form="editMonthForm" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Updating...' : 'Update'}
            </button>
          </>
        )}
      >
        <form id="editMonthForm" onSubmit={update}>
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
            <label className="block text-sm font-medium text-gray-700">Month Index</label>
            <input
              type="number"
              value={editForm.month_index}
              onChange={(e) => setEditForm({...editForm, month_index: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              value={editForm.price}
              onChange={(e) => setEditForm({...editForm, price: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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