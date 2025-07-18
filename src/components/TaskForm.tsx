import React, { useState, useEffect } from 'react';
import { Task, QuadrantType, PriorityLevel } from '../types';
import { taskSchema, validateData, getFieldError, hasFieldError } from '../utils/validation';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
    // Reset errors and touched state when form is opened/reset
    setErrors({});
    setTouched({});
  }, [initialTask, initialQuadrant, isOpen]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
          handleSubmit(e as any);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, errors, onClose]);

  // Validate a single field
  const validateField = (fieldName: string, value: any) => {
    const formData = getFormData();
    (formData as any)[fieldName] = value;
    
    const validation = validateData(taskSchema, formData);
    
    if (validation.success) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } else {
      setErrors(prev => ({
        ...prev,
        ...validation.errors,
      }));
    }
  };

  // Get current form data in the format expected by the schema
  const getFormData = () => {
    const taskTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    return {
      title: title.trim(),
      description: description.trim() || undefined,
      quadrant,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      completed: false,
      tags: taskTags,
    };
  };

  // Handle field blur events for validation
  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Only validate if field has been touched and has a value, or if it's required
    if (fieldName === 'title' || (fieldName !== 'title' && touched[fieldName])) {
      const fieldValue = getFieldValue(fieldName);
      validateField(fieldName, fieldValue);
    }
  };

  // Get field value for validation
  const getFieldValue = (fieldName: string) => {
    switch (fieldName) {
      case 'title':
        return title.trim();
      case 'description':
        return description.trim() || undefined;
      case 'quadrant':
        return quadrant;
      case 'priority':
        return priority;
      case 'dueDate':
        return dueDate ? new Date(dueDate) : undefined;
      case 'tags':
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
      quadrant: true,
      priority: true,
      dueDate: true,
      tags: true,
    });

    const formData = getFormData();
    const validation = validateData(taskSchema, formData);
    
    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }

    // Clear errors on successful validation
    setErrors({});

    onSave({
      title: formData.title,
      description: formData.description,
      quadrant: formData.quadrant,
      priority: formData.priority,
      dueDate: formData.dueDate,
      completed: false,
      tags: formData.tags,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTags('');
    setErrors({});
    setTouched({});
    onClose();
  };

  // Error message component
  const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;
    
    return (
      <div className="flex items-center mt-2 text-red-600">
        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-gradient rounded-3xl shadow-2xl w-full max-w-lg border-2 border-white/60 animate-fade-in-scale">
        <div className="p-10">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-3xl font-black gradient-text">
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (touched.title) {
                    validateField('title', e.target.value.trim());
                  }
                }}
                onBlur={() => handleBlur('title')}
                className={`w-full px-6 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 shadow-lg backdrop-blur-sm font-medium ${
                  hasFieldError('title', errors) && touched.title
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80'
                }`}
                placeholder="Enter task title"
                autoFocus
              />
              <ErrorMessage message={touched.title ? getFieldError('title', errors) : undefined} />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-3">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (touched.description) {
                    validateField('description', e.target.value.trim() || undefined);
                  }
                }}
                onBlur={() => handleBlur('description')}
                className={`w-full px-6 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none text-gray-900 shadow-lg backdrop-blur-sm font-medium ${
                  hasFieldError('description', errors) && touched.description
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80'
                }`}
                placeholder="Enter task description (optional)"
                rows={3}
              />
              <ErrorMessage message={touched.description ? getFieldError('description', errors) : undefined} />
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
                  onChange={(e) => {
                    setPriority(e.target.value as PriorityLevel);
                    if (touched.priority) {
                      validateField('priority', e.target.value);
                    }
                  }}
                  onBlur={() => handleBlur('priority')}
                  className={`w-full px-6 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 shadow-lg appearance-none backdrop-blur-sm font-medium ${
                    hasFieldError('priority', errors) && touched.priority
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80'
                  }`}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <ErrorMessage message={touched.priority ? getFieldError('priority', errors) : undefined} />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-900 mb-3">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (touched.dueDate) {
                      validateField('dueDate', e.target.value ? new Date(e.target.value) : undefined);
                    }
                  }}
                  onBlur={() => handleBlur('dueDate')}
                  className={`w-full px-6 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 shadow-lg backdrop-blur-sm font-medium ${
                    hasFieldError('dueDate', errors) && touched.dueDate
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80'
                  }`}
                />
                <ErrorMessage message={touched.dueDate ? getFieldError('dueDate', errors) : undefined} />
              </div>
            </div>

            {/* Quadrant */}
            <div>
              <label htmlFor="quadrant" className="block text-sm font-semibold text-gray-900 mb-3">
                Quadrant
                {initialQuadrant && (
                  <span className="ml-2 text-xs text-blue-600 font-medium">
                    (Pre-selected)
                  </span>
                )}
              </label>
              <select
                id="quadrant"
                value={quadrant}
                onChange={(e) => {
                  setQuadrant(e.target.value as QuadrantType);
                  if (touched.quadrant) {
                    validateField('quadrant', e.target.value);
                  }
                }}
                onBlur={() => handleBlur('quadrant')}
                className={`w-full px-6 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 shadow-lg appearance-none backdrop-blur-sm font-medium ${
                  hasFieldError('quadrant', errors) && touched.quadrant
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50'
                    : initialQuadrant 
                      ? 'border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50/50'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80'
                }`}
              >
                {quadrantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorMessage message={touched.quadrant ? getFieldError('quadrant', errors) : undefined} />
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
                onChange={(e) => {
                  setTags(e.target.value);
                  if (touched.tags) {
                    const tagArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                    validateField('tags', tagArray);
                  }
                }}
                onBlur={() => handleBlur('tags')}
                className={`w-full px-6 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-gray-900 shadow-lg backdrop-blur-sm font-medium ${
                  hasFieldError('tags', errors) && touched.tags
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80'
                }`}
                placeholder="Enter tags separated by commas (optional)"
              />
              <ErrorMessage message={touched.tags ? getFieldError('tags', errors) : undefined} />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-8">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary-large transform hover:scale-105 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={Object.keys(errors).length > 0}
                className={`btn-primary-large transform hover:scale-105 transition-all duration-300 ${
                  Object.keys(errors).length > 0
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
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