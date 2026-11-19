import React from 'react';
import { Calendar, MessageSquare, Tag, Paperclip, Clock } from 'lucide-react';
import { PriorityBadge } from '../common/Badge';
import { format, isPast } from 'date-fns';

export const TaskCard = ({ task, onClick }) => {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';

  return (
    <div
      onClick={() => onClick(task)}
      className="group relative rounded-xl p-4 transition-all duration-150 cursor-pointer
        bg-white dark:bg-[#1E293B]
        border border-slate-200 dark:border-slate-800/80
        hover:border-cyan-500/50 hover:shadow-card hover:-translate-y-0.5 shadow-sm"
    >
      {/* Top row: Priority & Tags */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <PriorityBadge priority={task.priority} />

        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-1 overflow-hidden">
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 truncate max-w-[90px]">
              {task.tags[0]}
            </span>
            {task.tags.length > 1 && (
              <span className="text-[10px] text-slate-500">
                +{task.tags.length - 1}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors mb-2 line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Bottom metadata row */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-rose-500 font-medium' : ''}`}>
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}

          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1 hover:text-cyan-500 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              {task.comments.length}
            </span>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5" />
              {task.attachments.length}
            </span>
          )}
        </div>

        {/* Assignees avatars */}
        <div className="flex -space-x-1.5 overflow-hidden">
          {(task.assignees || []).map((u, idx) => (
            u?.avatarUrl ? (
              <img
                key={idx}
                src={u.avatarUrl}
                alt={u.name}
                title={u.name}
                className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
              />
            ) : (
              <div
                key={idx}
                title={u?.name}
                className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-600/30 dark:text-blue-400 ring-2 ring-white dark:ring-slate-800 flex items-center justify-center text-[9px] font-bold"
              >
                {u?.name?.charAt(0) || 'U'}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};
