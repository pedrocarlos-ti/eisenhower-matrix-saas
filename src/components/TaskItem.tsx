import React, { useMemo, useCallback } from 'react';
import { Task } from '../types';
import { Check, Pencil, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, onEdit, onDelete, onToggleComplete }) => {
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
  }, [task.id]);

  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [onDelete, task.id]);

  const handleToggleComplete = useCallback(() => {
    onToggleComplete(task.id);
  }, [onToggleComplete, task.id]);

  const priorityBadgeClasses = useMemo(() => {
    switch (task.priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }, [task.priority]);

  return (
    <div
      className={`bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md cursor-grab transition-all duration-300 group relative ${task.completed ? 'opacity-60' : ''}`}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={handleToggleComplete}
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 mt-1 flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-purple-500'}`}>
          {task.completed && <Check className="w-4 h-4" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-gray-800 ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${priorityBadgeClasses}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-500">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={handleEdit} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default TaskItem;