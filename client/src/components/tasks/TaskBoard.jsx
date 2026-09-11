import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import { Plus, CheckCircle2, Clock, Eye, ListTodo } from 'lucide-react';
import confetti from 'canvas-confetti';

const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    icon: ListTodo,
    color: 'border-slate-500/30',
    headerBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    icon: Clock,
    color: 'border-blue-500/30',
    headerBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
  },
  {
    id: 'review',
    title: 'Review',
    icon: Eye,
    color: 'border-amber-500/30',
    headerBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  },
  {
    id: 'done',
    title: 'Done',
    icon: CheckCircle2,
    color: 'border-emerald-500/30',
    headerBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  }
];

export const TaskBoard = ({
  tasks = [],
  onTaskClick,
  onTaskStatusChange,
  onAddTask
}) => {
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Dropped in same column at same index
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    onTaskStatusChange(draggableId, newStatus, destination.index);

    // Fire celebratory confetti if task was moved to Done
    if (newStatus === 'done' && source.droppableId !== 'done') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          const Icon = column.icon;

          return (
            <div
              key={column.id}
              className="flex flex-col rounded-2xl bg-slate-100/90 dark:bg-[#111C30]/70 border border-slate-200 dark:border-slate-800/80 p-3.5 shadow-sm"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${column.headerBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onAddTask(column.id)}
                  title={`Add task to ${column.title}`}
                  className="p-1 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[360px] flex flex-col gap-3 rounded-xl transition-colors p-1 ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-500/10 ring-1 ring-blue-500/30'
                        : ''
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-transform duration-100 ${
                              snapshot.isDragging ? 'rotate-1 scale-105 shadow-2xl z-50' : ''
                            }`}
                          >
                            <TaskCard task={task} onClick={onTaskClick} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Quick Add Button inside column bottom */}
                    {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div
                        onClick={() => onAddTask(column.id)}
                        className="h-28 border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-700 dark:border-slate-800/80 dark:hover:border-slate-700 dark:text-slate-500 dark:hover:text-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all"
                      >
                        <Plus className="w-5 h-5 mb-1" />
                        <span className="text-xs">No tasks yet. Click to add</span>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
