import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useProjectStore } from '../../store/projectStore';
import { useNavigate } from 'react-router-dom';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
];

export const ProjectModal = ({ isOpen, onClose, projectToEdit = null }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [deadline, setDeadline] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { createProject, updateProject } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || '');
      setDescription(projectToEdit.description || '');
      setStatus(projectToEdit.status || 'active');
      setDeadline(
        projectToEdit.deadline
          ? new Date(projectToEdit.deadline).toISOString().split('T')[0]
          : ''
      );
      setCoverImageUrl(projectToEdit.coverImageUrl || '');
    } else {
      setName('');
      setDescription('');
      setStatus('active');
      setDeadline('');
      setCoverImageUrl(PRESET_COVERS[0]);
    }
    setError('');
  }, [projectToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      name: name.trim(),
      description: description.trim(),
      status,
      deadline: deadline ? new Date(deadline) : null,
      coverImageUrl
    };

    try {
      if (projectToEdit) {
        const res = await updateProject(projectToEdit._id, payload);
        if (res.success) {
          onClose();
        } else {
          setError(res.error);
        }
      } else {
        const res = await createProject(payload);
        if (res.success) {
          onClose();
          navigate(`/projects/${res.project._id}`);
        } else {
          setError(res.error);
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project' : 'Create New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Project Name"
          placeholder="e.g. Nova Mobile App"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief purpose, milestones, or team goals..."
            className="w-full rounded-lg text-sm bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F8FAFC] border border-slate-300 dark:border-slate-700 focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-500/20 focus:outline-none p-3 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg text-sm bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F8FAFC] border border-slate-300 dark:border-slate-700 focus:border-[#3B82F6] focus:outline-none p-2.5"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg text-sm bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F8FAFC] border border-slate-300 dark:border-slate-700 focus:border-[#3B82F6] focus:outline-none p-2.5"
            />
          </div>
        </div>

        {/* Cover image selector */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            Project Theme Banner
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {PRESET_COVERS.map((url, idx) => (
              <div
                key={idx}
                onClick={() => setCoverImageUrl(url)}
                className={`h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  coverImageUrl === url ? 'border-blue-500 scale-95 ring-2 ring-blue-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt="Cover" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <Input
            placeholder="Or enter custom image URL..."
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/60">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {projectToEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
