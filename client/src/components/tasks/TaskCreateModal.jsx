import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useProjectStore } from '../../store/projectStore';

export const TaskCreateModal = ({
  isOpen,
  onClose,
  projectId,
  initialStatus = 'todo'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState('medium');
  const [tagsInput, setTagsInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { createTask, currentProject } = useProjectStore();

  useEffect(() => {
    setStatus(initialStatus || 'todo');
    setTitle('');
    setDescription('');
    setPriority('medium');
    setTagsInput('');
    setDueDate('');
    setSelectedAssignees([]);
    setError('');
  }, [isOpen, initialStatus]);

  const toggleAssignee = (userId) => {
    if (selectedAssignees.includes(userId)) {
      setSelectedAssignees(selectedAssignees.filter((id) => id !== userId));
    } else {
      setSelectedAssignees([...selectedAssignees, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    setError('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignees: selectedAssignees,
      tags,
      dueDate: dueDate ? new Date(dueDate) : null
    };

    const targetProjectId = projectId || currentProject?._id;
    const res = await createTask(targetProjectId, payload);

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error);
    }
  };

  const projectMembers = currentProject?.members || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Task Title"
          placeholder="e.g. Implement authentication rate limiting"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            placeholder="Key acceptance criteria or technical context..."
            className="w-full rounded-lg text-sm bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F8FAFC] border border-slate-300 dark:border-slate-700 focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-500/20 focus:outline-none p-3 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Column
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg text-sm bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F8FAFC] border border-slate-300 dark:border-slate-700 focus:border-[#3B82F6] focus:outline-none p-2.5"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg text-sm bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F8FAFC] border border-slate-300 dark:border-slate-700 focus:border-[#3B82F6] focus:outline-none p-2.5"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg text-sm bg-white dark:bg-[#1E293B] text-slate-900 dark:text-[#F8FAFC] border border-slate-300 dark:border-slate-700 focus:border-[#3B82F6] focus:outline-none p-2.5"
            />
          </div>
        </div>

        <Input
          label="Tags (comma separated)"
          placeholder="Frontend, Bug, HighPriority"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        {/* Assignees selection */}
        {projectMembers.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Assign to Team Members
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              {projectMembers.map((m, idx) => {
                const u = m.userId;
                if (!u) return null;
                const isSelected = selectedAssignees.includes(u._id);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => toggleAssignee(u._id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-100 dark:bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/50'
                        : 'bg-slate-100 text-slate-700 hover:text-slate-900 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-white border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center">
                        {u.name?.charAt(0)}
                      </span>
                    )}
                    <span>{u.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/60">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
