import React, { useState } from 'react';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { Calendar, ArrowUpDown, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export const TaskList = ({ tasks = [], onTaskClick }) => {
  const [sortField, setSortField] = useState('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };

  const sortedTasks = [...tasks].sort((a, b) => {
    let diff = 0;
    if (sortField === 'title') {
      diff = a.title.localeCompare(b.title);
    } else if (sortField === 'priority') {
      diff = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
    } else if (sortField === 'status') {
      diff = a.status.localeCompare(b.status);
    } else if (sortField === 'dueDate') {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      diff = dateA - dateB;
    }
    return sortAsc ? diff : -diff;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
          <tr>
            <th 
              onClick={() => handleSort('title')}
              className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                Task
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('status')}
              className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                Status
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('priority')}
              className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                Priority
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('dueDate')}
              className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                Due Date
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </th>
            <th className="py-3 px-4 font-semibold">Assignees</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
          {sortedTasks.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-400">
                No tasks match the current filter.
              </td>
            </tr>
          ) : (
            sortedTasks.map((task) => (
              <tr
                key={task._id}
                onClick={() => onTaskClick(task)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-900 dark:text-white hover:text-blue-500 transition-colors">
                    {task.title}
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-1">
                      {task.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={task.status} />
                </td>
                <td className="py-3 px-4">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                  {task.dueDate ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </div>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {(task.assignees || []).map((u, idx) => (
                      u?.avatarUrl ? (
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
                          title={u?.name}
                          className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 ring-2 ring-white dark:ring-slate-800 flex items-center justify-center text-[10px] font-bold"
                        >
                          {u?.name?.charAt(0) || 'U'}
                        </div>
                      )
                    ))}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
