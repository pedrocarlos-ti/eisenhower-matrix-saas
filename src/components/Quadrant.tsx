import React, { useMemo, useCallback } from 'react';
import { Task, QuadrantConfig, QuadrantType } from '../types';
import { Badge } from '../components/ui/badge';
import { Plus } from 'lucide-react';
import TaskItem from './TaskItem';

interface QuadrantProps {
  config: QuadrantConfig;
  tasks: Task[];
  onAddTask: (quadrant: QuadrantType) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newQuadrant: QuadrantType) => void;
  onToggleComplete: (taskId: string) => void;
}

const Quadrant: React.FC<QuadrantProps> = React.memo(({
  config,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onToggleComplete,
}) => {
  // Memoize drag handlers to prevent unnecessary re-renders
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onMoveTask(taskId, config.id);
  }, [onMoveTask, config.id]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleAddTask = useCallback(() => {
    onAddTask(config.id);
  }, [onAddTask, config.id]);

  // Memoize task statistics to prevent unnecessary recalculation
  const taskStats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = tasks.length - completedTasks;
    return { completedTasks, activeTasks };
  }, [tasks]);

  const getQuadrantColor = (quadrant: QuadrantType) => {
    switch (quadrant) {
      case 'urgent-important':
        return 'border-red-100/30 bg-gradient-to-br from-red-50/20 via-white/95 to-white/98 backdrop-blur-sm';
      case 'not-urgent-important':
        return 'border-blue-100/30 bg-gradient-to-br from-blue-50/20 via-white/95 to-white/98 backdrop-blur-sm';
      case 'urgent-not-important':
        return 'border-amber-100/30 bg-gradient-to-br from-amber-50/20 via-white/95 to-white/98 backdrop-blur-sm';
      case 'not-urgent-not-important':
        return 'border-gray-100/30 bg-gradient-to-br from-gray-50/20 via-white/95 to-white/98 backdrop-blur-sm';
      default:
        return 'border-gray-100/30 bg-white/95 backdrop-blur-sm';
    }
  };

  const getIndicatorColor = (quadrant: QuadrantType) => {
    switch (quadrant) {
      case 'urgent-important':
        return 'bg-gradient-to-br from-red-500 to-red-600';
      case 'not-urgent-important':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';
      case 'urgent-not-important':
        return 'bg-gradient-to-br from-amber-500 to-amber-600';
      case 'not-urgent-not-important':
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getTaskBadgeStyle = (quadrant: QuadrantType, type: 'active' | 'completed') => {
    const baseStyle = type === 'active' ? 'text-white' : 'text-white bg-opacity-80';
    switch (quadrant) {
      case 'urgent-important':
        return `${baseStyle} bg-red-500`;
      case 'not-urgent-important':
        return `${baseStyle} bg-blue-500`;
      case 'urgent-not-important':
        return `${baseStyle} bg-amber-500`;
      case 'not-urgent-not-important':
        return `${baseStyle} bg-gray-500`;
      default:
        return `${baseStyle} bg-gray-500`;
    }
  };

  const getQuadrantEmoji = (quadrant: QuadrantType) => {
    switch (quadrant) {
      case 'urgent-important':
        return '🔥';
      case 'not-urgent-important':
        return '📅';
      case 'urgent-not-important':
        return '👥';
      case 'not-urgent-not-important':
        return '🗑️';
      default:
        return '📋';
    }
  };

  return (
    <div 
      className={`h-full ${getQuadrantColor(config.id)} flex flex-col relative overflow-hidden transition-all duration-300`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Header */}
      <div className="p-6 pb-4 flex-shrink-0 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl ${getIndicatorColor(config.id)} flex items-center justify-center shadow-lg ring-2 ring-white/50`}>
              <div className="text-lg">{getQuadrantEmoji(config.id)}</div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{config.title}</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">{config.description}</p>
            </div>
          </div>
          <button
            onClick={handleAddTask}
            className="bg-white/95 backdrop-blur-sm border border-white/70 hover:bg-white hover:border-gray-200 hover:shadow-lg text-gray-700 font-semibold px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-xs group"
          >
            <Plus size={14} className="group-hover:scale-110 transition-transform" />
            <span>Add</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={`${getTaskBadgeStyle(config.id, 'active')} px-2 py-1 text-xs font-semibold shadow-sm`}>
            {taskStats.activeTasks} active
          </Badge>
          {taskStats.completedTasks > 0 && (
            <Badge className={`${getTaskBadgeStyle(config.id, 'completed')} px-2 py-1 text-xs font-semibold shadow-sm`}>
              {taskStats.completedTasks} completed
            </Badge>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 pb-6 flex-1 overflow-y-auto">
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleComplete={onToggleComplete}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className={`w-16 h-16 rounded-xl ${getIndicatorColor(config.id)} flex items-center justify-center mb-4 shadow-lg ring-4 ring-white/30`}>
                <div className="text-2xl">{getQuadrantEmoji(config.id)}</div>
              </div>
              <p className="text-sm font-bold text-gray-800 mb-2">No tasks yet</p>
              <p className="text-xs text-gray-600 max-w-xs leading-relaxed mb-6 px-2">
                Add a task to start prioritizing your work
              </p>
              <button
                onClick={handleAddTask}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg text-gray-700 font-semibold px-4 py-2 rounded-lg transition-all duration-200 text-xs group hover:scale-105"
              >
                <Plus size={14} className="group-hover:scale-110 transition-transform" />
                <span>Add first task</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Quadrant;