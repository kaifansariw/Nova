import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Users, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { format } from 'date-fns';

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const stats = project.taskStats || { total: 0, completed: 0, progressPercentage: 0 };

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group relative rounded-xl p-5 transition-all duration-200 cursor-pointer
        bg-white dark:bg-[#1E293B]
        border border-slate-200 dark:border-slate-800
        hover:border-blue-500/50 hover:shadow-card hover:-translate-y-0.5 flex flex-col justify-between shadow-sm"
    >
      <div>
        {/* Cover image if available */}
        {project.coverImageUrl && (
          <div className="h-32 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-xl">
            <img 
              src={project.coverImageUrl} 
              alt={project.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Header: Title & Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-1">
            {project.name}
          </h3>
          <StatusBadge status={project.status} />
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{stats.progressPercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Footer: Deadlines, Tasks count, Members */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              {stats.completed}/{stats.total} tasks
            </span>
            {project.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {format(new Date(project.deadline), 'MMM d')}
              </span>
            )}
          </div>

          {/* Member avatars stacked */}
          <div className="flex -space-x-2 overflow-hidden">
            {(project.members || []).slice(0, 3).map((m, idx) => {
              const u = m.userId;
              if (!u) return null;
              return u.avatarUrl ? (
                <img
                  key={idx}
                  src={u.avatarUrl}
                  alt={u.name}
                  title={u.name}
                  className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                />
              ) : (
                <div
                  key={idx}
                  title={u.name}
                  className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 ring-2 ring-white dark:ring-slate-800 flex items-center justify-center text-[10px] font-bold"
                >
                  {u.name ? u.name.charAt(0) : 'U'}
                </div>
              );
            })}
            {(project.members || []).length > 3 && (
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-2 ring-white dark:ring-slate-800 flex items-center justify-center text-[10px]">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
