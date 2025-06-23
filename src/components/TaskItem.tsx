import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      className={`bg-white p-3 rounded-md border border-gray-200 cursor-move hover:shadow-sm transition-all duration-200 group ${task.completed ? 'opacity-70' : ''}`}
      draggable
      onDragStart={handleDragStart}
    >
      {/* Header with checkbox and priority */}
      <div className="flex items-start space-x-3 mb-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-gray-700 border-gray-700 text-white'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {task.completed && (
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm leading-tight ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Priority indicator */}
          <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`} title={`${task.priority} priority`}></div>
          
          {/* Actions */}
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
              title="Edit task"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
              title="Delete task"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer with date and tags */}
      <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-xs">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
          {task.dueDate && (
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              isOverdue 
                ? 'bg-gray-100 text-red-600' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;