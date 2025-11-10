import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../../lib/api';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [createForm, setCreateForm] = useState({ title: '', description: '', cover: '' });
  const [editForm, setEditForm] = useState({ title: '', description: '', cover: '', is_published: true });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await apiGet('/api/admin/courses');
    setCourses(data.courses || []);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (course) => {
    setSelectedCourse(course);
    setEditForm({
      title: course.title || '',
      description: course.description || '',
      cover: course.cover || '',
      is_published: course.is_published === 1 || course.is_published === true
    });
    setShowEdit(true);
  };

  const create = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost('/api/admin/courses', createForm);
      toast.success('Course created');
      setCreateForm({ title: '', description: '', cover: '' });
      setShowCreate(false);
      load();
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  const update = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setLoading(true);
    try {
      await apiPatch(`/api/admin/courses/${selectedCourse.course_id}`, {
        title: editForm.title,
        description: editForm.description,
        cover: editForm.cover,
        is_published: editForm.is_published ? 1 : 0
      });
      toast.success('Course updated');
      setShowEdit(false);
      setSelectedCourse(null);
      load();
    } catch (e2) { toast.error(e2.message); } finally { setLoading(false); }
  };

  const remove = async (course) => {
    if (!confirm('Delete this course?')) return;
    setLoading(true);
    try { await apiDelete(`/api/admin/courses/${course.course_id}`); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
  <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-700">Admin • Courses</h1>
        <button onClick={()=>setShowCreate(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">New Course</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(c => (
          <div key={c.course_id} className="group bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              {c.cover ? (
                <img src={c.cover} alt={c.title} className="w-full h-full object-cover" />
              ) : (
                <span>No cover</span>
              )}
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h2 className="font-semibold text-green-800 line-clamp-2 min-h-[3rem]">{c.title}</h2>
              <p className="text-xs text-gray-600 line-clamp-3 min-h-[3.5rem]">{c.description || 'No description'}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full border ${c.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{c.is_published ? 'Published' : 'Draft'}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-300">ID {c.course_id}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>openEdit(c)} className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm">Edit</button>
                <button onClick={()=>remove(c)} disabled={loading} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm disabled:opacity-60">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        open={showCreate}
        title="Create Course"
        onClose={()=>!loading && setShowCreate(false)}
        footer={(
          <>
            <button onClick={()=>setShowCreate(false)} disabled={loading} className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">Cancel</button>
            <button form="createCourseForm" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded shadow disabled:opacity-60">{loading ? 'Saving...' : 'Create'}</button>
          </>
        )}
      >
        <form id="createCourseForm" onSubmit={create} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input required value={createForm.title} onChange={e=>setCreateForm({...createForm, title:e.target.value})} className="mt-1 w-full border p-2 rounded" placeholder="Course title" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea value={createForm.description} onChange={e=>setCreateForm({...createForm, description:e.target.value})} className="mt-1 w-full border p-2 rounded min-h-[90px]" placeholder="Optional description" />
          </div>
            <div>
            <label className="text-sm font-medium text-gray-700">Cover URL</label>
            <input value={createForm.cover} onChange={e=>setCreateForm({...createForm, cover:e.target.value})} className="mt-1 w-full border p-2 rounded" placeholder="https://..." />
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        title={selectedCourse ? `Edit: ${selectedCourse.title}` : 'Edit Course'}
        onClose={()=>!loading && setShowEdit(false)}
        footer={(
          <>
            <button onClick={()=>setShowEdit(false)} disabled={loading} className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">Cancel</button>
            <button form="editCourseForm" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded shadow disabled:opacity-60">{loading ? 'Saving...' : 'Save Changes'}</button>
          </>
        )}
      >
        <form id="editCourseForm" onSubmit={update} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input required value={editForm.title} onChange={e=>setEditForm({...editForm, title:e.target.value})} className="mt-1 w-full border border-gray-300 p-2 rounded" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea value={editForm.description} onChange={e=>setEditForm({...editForm, description:e.target.value})} className="mt-1 w-full border border-gray-300 p-2 rounded min-h-[90px]" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Cover URL</label>
            <input value={editForm.cover} onChange={e=>setEditForm({...editForm, cover:e.target.value})} className="mt-1 w-full border border-gray-300 p-2 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPublished" checked={editForm.is_published} onChange={e=>setEditForm({...editForm, is_published:e.target.checked})} />
            <label htmlFor="isPublished" className="text-sm text-gray-700">Published</label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
