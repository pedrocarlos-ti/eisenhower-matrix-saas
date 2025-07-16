import React, { useMemo, useCallback } from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, onEdit, onDelete, onToggleComplete }) => {
  // Memoize drag handler to prevent unnecessary re-renders
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
  }, [task.id]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [onDelete, task.id]);

  const handleToggleComplete = useCallback(() => {
    onToggleComplete(task.id);
  }, [onToggleComplete, task.id]);

  // Memoize computed values to prevent unnecessary recalculation
  const priorityBadgeStyle = useMemo(() => {
    switch (task.priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }, [task.priority]);

  const isOverdue = useMemo(() => {
    return task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  }, [task.dueDate, task.completed]);

  const formattedDueDate = useMemo(() => {
    return task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';
  }, [task.dueDate]);

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg hover:shadow-xl hover:bg-white cursor-move transition-all duration-300 group relative overflow-hidden ${task.completed ? 'opacity-75' : 'hover:scale-[1.02] hover:-translate-y-1'}`}
      draggable
      onDragStart={handleDragStart}
    >
      {/* Priority color strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
        task.priority === 'high' ? 'bg-gradient-to-b from-red-500 to-red-600' :
        task.priority === 'medium' ? 'bg-gradient-to-b from-amber-500 to-amber-600' :
        'bg-gradient-to-b from-green-500 to-green-600'
      }`}></div>

      {/* Header with checkbox and title */}
      <div className="flex items-start space-x-4 mb-4">
        <button
          onClick={handleToggleComplete}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 mt-0.5 flex-shrink-0 ${
            task.completed
              ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-md'
              : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-sm'
          }`}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`font-bold text-base leading-tight ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {/* Actions */}
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
              <button
                onClick={handleEdit}
                className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-all duration-200"
                title="Edit task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-all duration-200"
                title="Delete task"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{task.description}</p>
          )}

          {/* Priority and metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${priorityBadgeStyle}`}>
                {task.priority}
              </span>
              
              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={`text-sm font-medium ${
                    isOverdue ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {isOverdue ? 'Overdue' : formattedDueDate}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center space-x-2 mt-3">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm font-medium">
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-gray-400 text-sm">+{task.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default TaskItem;