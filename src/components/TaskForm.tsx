import React, { useState, useEffect } from 'react';
import { Task, QuadrantType, PriorityLevel } from '../types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialTask?: Task | null;
  initialQuadrant?: QuadrantType;
}

const quadrantOptions = [
  { value: 'urgent-important', label: 'Do First (Urgent & Important)' },
  { value: 'not-urgent-important', label: 'Schedule (Important, Not Urgent)' },
  { value: 'urgent-not-important', label: 'Delegate (Urgent, Not Important)' },
  { value: 'not-urgent-not-important', label: 'Eliminate (Neither Urgent nor Important)' },
];

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  initialQuadrant,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quadrant, setQuadrant] = useState<QuadrantType>('urgent-important');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setQuadrant(initialTask.quadrant);
      setPriority(initialTask.priority || 'medium');
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : '');
      setTags(initialTask.tags?.join(', ') || '');
    } else {
      setTitle('');
      setDescription('');
      setQuadrant(initialQuadrant || 'urgent-important');
      setPriority('medium');
      setDueDate('');
      setTags('');
    }
  }, [initialTask, initialQuadrant, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      quadrant,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      completed: false,
      tags: taskTags,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTags('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm"
                placeholder="Enter task title"
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-3">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-900 shadow-sm"
                placeholder="Enter task description (optional)"
                rows={3}
              />
            </div>

            {/* Priority and Due Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-900 mb-3">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm appearance-none"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-900 mb-3">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm"
                />
              </div>
            </div>

            {/* Quadrant */}
            <div>
              <label htmlFor="quadrant" className="block text-sm font-semibold text-gray-900 mb-3">
                Quadrant
              </label>
              <select
                id="quadrant"
                value={quadrant}
                onChange={(e) => setQuadrant(e.target.value as QuadrantType)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm appearance-none"
              >
                {quadrantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 mb-3">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 shadow-sm"
                placeholder="Enter tags separated by commas (optional)"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors duration-200 font-medium shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm"
              >
                {initialTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;