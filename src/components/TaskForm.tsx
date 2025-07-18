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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'visible' : 'invisible'}`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <div className="h-1 w-16 bg-indigo-500 rounded-full mt-2"></div>
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 text-gray-900 font-medium border-solid ${
                hasFieldError('title', errors) && touched.title
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50/30'
                  : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 resize-none text-gray-900 font-medium border-solid ${
                hasFieldError('description', errors) && touched.description
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50/30'
                  : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
              }`}
              placeholder="Enter task description (optional)"
              rows={3}
            />
            <ErrorMessage message={touched.description ? getFieldError('description', errors) : undefined} />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 text-gray-900 appearance-none font-medium border-solid ${
                  hasFieldError('priority', errors) && touched.priority
                    ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50/30'
                    : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 text-gray-900 font-medium border-solid ${
                  hasFieldError('dueDate', errors) && touched.dueDate
                    ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50/30'
                    : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 text-gray-900 appearance-none font-medium border-solid ${
                hasFieldError('quadrant', errors) && touched.quadrant
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50/30'
                  : initialQuadrant 
                    ? 'border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50/30'
                    : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-all duration-200 text-gray-900 font-medium border-solid ${
                hasFieldError('tags', errors) && touched.tags
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400 bg-red-50/30'
                  : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
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
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={Object.keys(errors).length > 0}
              className={`px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 ${
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
    );
  };


export default TaskForm;