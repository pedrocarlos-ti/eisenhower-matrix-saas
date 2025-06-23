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
        return 'border-gray-200 bg-white';
      case 'not-urgent-important':
        return 'border-gray-200 bg-white';
      case 'urgent-not-important':
        return 'border-gray-200 bg-white';
      case 'not-urgent-not-important':
        return 'border-gray-200 bg-white';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getIndicatorColor = (quadrant: QuadrantType) => {
    switch (quadrant) {
      case 'urgent-important':
        return 'bg-red-500';
      case 'not-urgent-important':
        return 'bg-blue-500';
      case 'urgent-not-important':
        return 'bg-amber-500';
      case 'not-urgent-not-important':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
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
      className={`min-h-[520px] ${getQuadrantColor(config.id)} border transition-all duration-300 hover:shadow-md`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-1 h-12 rounded-sm ${getIndicatorColor(config.id)}`} />
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">{config.title}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{getQuadrantEmoji(config.id)} {config.description}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onAddTask(config.id)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center space-x-1 shadow-sm"
          >
            <Plus size={14} />
            <span className="text-xs">Add Task</span>
          </button>
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <Badge className="bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs">
            {activeTasks} active
          </Badge>
          {completedTasks > 0 && (
            <Badge className="bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs">
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <div className="text-2xl opacity-60">{getQuadrantEmoji(config.id)}</div>
              </div>
              <p className="text-base font-medium text-gray-700 mb-2">No tasks yet</p>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Add a task to this quadrant to start prioritizing your work
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Quadrant;