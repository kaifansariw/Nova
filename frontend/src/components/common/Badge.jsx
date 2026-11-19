import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-slate-700/60 text-slate-300 border-slate-600',
    primary: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    accent: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}>
      {children}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const map = {
    low: { variant: 'default', label: 'Low', dot: 'bg-slate-400' },
    medium: { variant: 'primary', label: 'Medium', dot: 'bg-blue-400' },
    high: { variant: 'warning', label: 'High', dot: 'bg-amber-400' },
    critical: { variant: 'danger', label: 'Critical', dot: 'bg-rose-500 animate-pulse' }
  };

  const item = map[priority] || map.medium;

  return (
    <Badge variant={item.variant} className="gap-1.5 font-medium">
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </Badge>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    'todo': { variant: 'default', label: 'To Do' },
    'in-progress': { variant: 'primary', label: 'In Progress' },
    'review': { variant: 'warning', label: 'Review' },
    'done': { variant: 'success', label: 'Done' }
  };

  const item = map[status] || { variant: 'default', label: status };

  return <Badge variant={item.variant}>{item.label}</Badge>;
};
