import React from 'react';
import { Task, QuadrantConfig, QuadrantType } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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

const Quadrant: React.FC<QuadrantProps> = ({
  config,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onToggleComplete,
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onMoveTask(taskId, config.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = tasks.length - completedTasks;

  const getQuadrantColor = (quadrant: QuadrantType) => {
    switch (quadrant) {
      case 'urgent-important':
        return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100/50';
      case 'not-urgent-important':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50';
      case 'urgent-not-important':
        return 'border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50';
      case 'not-urgent-not-important':
        return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50';
      default:
        return 'border-gray-200 bg-white';
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
    <Card 
      className={`min-h-[560px] ${getQuadrantColor(config.id)} border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-xl ${getIndicatorColor(config.id)} flex items-center justify-center shadow-sm`}>
              <div className="text-2xl">{getQuadrantEmoji(config.id)}</div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 mb-1">{config.title}</CardTitle>
              <p className="text-sm text-gray-600 font-medium">{config.description}</p>
            </div>
          </div>
          <button
            onClick={() => onAddTask(config.id)}
            className="bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white hover:border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            <span className="text-sm">Add</span>
          </button>
        </div>
        <div className="flex items-center space-x-3 mt-6">
          <Badge className={`${getTaskBadgeStyle(config.id, 'active')} px-3 py-1 text-xs font-semibold`}>
            {activeTasks} active
          </Badge>
          {completedTasks > 0 && (
            <Badge className={`${getTaskBadgeStyle(config.id, 'completed')} px-3 py-1 text-xs font-semibold`}>
              {completedTasks} completed
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
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
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className={`w-20 h-20 rounded-2xl ${getIndicatorColor(config.id)} flex items-center justify-center mb-6 shadow-sm`}>
                <div className="text-3xl opacity-80">{getQuadrantEmoji(config.id)}</div>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-3">No tasks yet</p>
              <p className="text-base text-gray-600 max-w-xs leading-relaxed mb-6">
                Add a task to this quadrant to start prioritizing your work
              </p>
              <button
                onClick={() => onAddTask(config.id)}
                className="inline-flex items-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus size={16} />
                <span>Add your first task</span>
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Quadrant;