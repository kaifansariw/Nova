import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Kanban, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Settings, 
  Edit3, 
  Trash2, 
  UserPlus, 
  ArrowLeft,
  ListTodo
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProjectModal } from '../components/projects/ProjectModal';
import { InviteMemberModal } from '../components/team/InviteMemberModal';
import { format } from 'date-fns';

export const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProject, currentProject, isLoadingCurrentProject, deleteProject } = useProjectStore();
  const { user } = useAuthStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id, fetchProject]);

  if (isLoadingCurrentProject || !currentProject) {
    return <LoadingSpinner size="lg" className="h-96" />;
  }

  const isOwner = currentProject.owner?._id === user?.id || currentProject.owner === user?.id;
  const stats = currentProject.taskStats || {
    total: 0,
    completed: 0,
    todo: 0,
    inProgress: 0,
    review: 0,
    progressPercentage: 0
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${currentProject.name}" and all associated tasks? This cannot be undone.`)) {
      const res = await deleteProject(currentProject._id);
      if (res.success) {
        navigate('/projects');
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(`/projects/${currentProject._id}/board`)}
            className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold
              bg-[#3B82F6] hover:bg-blue-600 text-white shadow-sm hover:shadow-glow-primary transition-all cursor-pointer"
          >
            <Kanban className="w-4 h-4" />
            <span>Open Kanban Board</span>
          </button>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold
              bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Invite Member</span>
          </button>

          {isOwner && (
            <>
              <button
                onClick={() => setIsEditModalOpen(true)}
                title="Edit Project"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 dark:border-slate-700/60 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={handleDelete}
                title="Delete Project"
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 dark:border-slate-700/60 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Project Banner & Overview */}
      <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        {currentProject.coverImageUrl && (
          <div className="h-44 w-full overflow-hidden relative">
            <img
              src={currentProject.coverImageUrl}
              alt={currentProject.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#1E293B] via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {currentProject.name}
                </h1>
                <StatusBadge status={currentProject.status} />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {currentProject.description || 'No description provided.'}
              </p>
            </div>

            {/* Progress Gauge */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shrink-0">
              <div className="text-right">
                <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 block">Overall Progress</span>
                <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
                  {stats.progressPercentage}%
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-cyan-500 border-r-cyan-500 flex items-center justify-center font-bold text-xs text-slate-900 dark:text-white">
                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
              </div>
            </div>
          </div>

          {/* Timeline & Metadata */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            {currentProject.startDate && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Started: {format(new Date(currentProject.startDate), 'MMM d, yyyy')}
              </span>
            )}
            {currentProject.deadline && (
              <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                Target Deadline: {format(new Date(currentProject.deadline), 'MMM d, yyyy')}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              {(currentProject.members || []).length} Team Members
            </span>
          </div>
        </div>
      </div>

      {/* Task Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate(`/projects/${currentProject._id}/board`)}
          className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors cursor-pointer shadow-sm"
        >
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">To Do</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.todo}</span>
        </div>

        <div 
          onClick={() => navigate(`/projects/${currentProject._id}/board`)}
          className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer shadow-sm"
        >
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">In Progress</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</span>
        </div>

        <div 
          onClick={() => navigate(`/projects/${currentProject._id}/board`)}
          className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-colors cursor-pointer shadow-sm"
        >
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">In Review</span>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.review}</span>
        </div>

        <div 
          onClick={() => navigate(`/projects/${currentProject._id}/board`)}
          className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors cursor-pointer shadow-sm"
        >
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">Done</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</span>
        </div>
      </div>

      {/* Team Roster Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Assigned Team Members
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Collaborators who have access to this workspace</p>
          </div>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Teammate
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(currentProject.members || []).map((m, idx) => {
            const u = m.userId;
            if (!u) return null;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80"
              >
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    {u.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {u.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-cyan-400 border border-slate-300 dark:border-slate-700">
                  {m.role}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectToEdit={currentProject}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={currentProject._id}
        onMemberInvited={() => fetchProject(currentProject._id)}
      />
    </div>
  );
};
