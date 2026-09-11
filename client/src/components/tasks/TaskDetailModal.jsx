import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { 
  Calendar, 
  Trash2, 
  MessageSquare, 
  History, 
  Send, 
  Tag, 
  User as UserIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';

export const TaskDetailModal = ({ isOpen, onClose, task, onUpdate }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'activity'

  const { addCommentToTask, updateTaskDetails, archiveTask, currentProject } = useProjectStore();
  const { user } = useAuthStore();

  if (!task) return null;

  const handleStatusChange = async (newStatus) => {
    await updateTaskDetails(task._id, { status: newStatus });
    if (onUpdate) onUpdate();
  };

  const handlePriorityChange = async (newPriority) => {
    await updateTaskDetails(task._id, { priority: newPriority });
    if (onUpdate) onUpdate();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    await addCommentToTask(task._id, commentText.trim());
    setCommentText('');
    setIsSubmittingComment(false);
    if (onUpdate) onUpdate();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to archive this task?')) {
      setIsDeleting(true);
      await archiveTask(task._id);
      setIsDeleting(false);
      onClose();
      if (onUpdate) onUpdate();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
            TASK-{task._id.substring(task._id.length - 4).toUpperCase()}
          </span>
          <span className="text-base font-semibold text-slate-900 dark:text-white truncate max-w-md">
            {task.title}
          </span>
        </div>
      }
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Quick controls row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Status
            </label>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full text-xs font-medium rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Priority
            </label>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="w-full text-xs font-medium rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Due Date
            </label>
            <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Actions
            </label>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline py-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Archive Task
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Description
          </h4>
          <div className="text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 whitespace-pre-wrap leading-relaxed">
            {task.description || 'No detailed description provided.'}
          </div>
        </div>

        {/* Assignees & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Assignees
            </h4>
            <div className="flex flex-wrap gap-2">
              {(task.assignees || []).length === 0 ? (
                <span className="text-xs text-slate-400">Unassigned</span>
              ) : (
                task.assignees.map((u, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs"
                  >
                    {u?.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <UserIcon className="w-3 h-3 text-slate-400" />
                    )}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {u?.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(task.tags || []).length === 0 ? (
                <span className="text-xs text-slate-400">No tags</span>
              ) : (
                task.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tabs: Comments vs Activity Log */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-4 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex items-center gap-1.5 text-xs font-semibold pb-1 transition-colors ${
                activeTab === 'comments'
                  ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Comments ({(task.comments || []).length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-1.5 text-xs font-semibold pb-1 transition-colors ${
                activeTab === 'activity'
                  ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Activity Log ({(task.activityLog || []).length})
            </button>
          </div>

          {activeTab === 'comments' ? (
            <div className="space-y-4">
              {/* Comment Thread */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {(task.comments || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    No comments yet. Start the conversation below.
                  </p>
                ) : (
                  task.comments.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs"
                    >
                      {c.author?.avatarUrl ? (
                        <img src={c.author.avatarUrl} alt={c.author.name} className="w-6 h-6 rounded-full object-cover mt-0.5" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-600/30 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] mt-0.5">
                          {c.author?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {c.author?.name || 'Team Member'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type a comment or status update..."
                  className="flex-1 rounded-lg text-xs bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  loading={isSubmittingComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          ) : (
            /* Activity Feed */
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {(task.activityLog || []).length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No recorded activity yet.</p>
              ) : (
                [...(task.activityLog || [])].reverse().map((a, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-slate-500 py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800/30"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="flex-1 text-slate-800 dark:text-slate-300">
                      {a.action}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {format(new Date(a.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
