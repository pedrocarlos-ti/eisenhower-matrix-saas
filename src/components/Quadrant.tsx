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
        return 'border-red-300 bg-red-50';
      case 'not-urgent-important':
        return 'border-blue-300 bg-blue-50';
      case 'urgent-not-important':
        return 'border-yellow-300 bg-yellow-50';
      case 'not-urgent-not-important':
        return 'border-slate-300 bg-slate-50';
      default:
        return 'border-gray-300';
    }
  };

  const getIndicatorColor = (quadrant: QuadrantType) => {
    switch (quadrant) {
      case 'urgent-important':
        return 'bg-red-500';
      case 'not-urgent-important':
        return 'bg-blue-500';
      case 'urgent-not-important':
        return 'bg-yellow-500';
      case 'not-urgent-not-important':
        return 'bg-slate-500';
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
      className={`min-h-[520px] ${getQuadrantColor(config.id)} border-2 transition-all duration-300 hover:shadow-lg`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getQuadrantEmoji(config.id)}</div>
              <div className={`w-4 h-4 rounded-full ${getIndicatorColor(config.id)} shadow-lg`} />
            </div>
            <CardTitle className="text-xl font-bold text-slate-800">{config.title}</CardTitle>
          </div>
          <button
            onClick={() => onAddTask(config.id)}
            className="bg-primary hover:bg-primary-hover text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow hover:shadow-md flex items-center space-x-2"
          >
            <Plus size={16} />
            <span className="text-sm">Add Task</span>
          </button>
        </div>
        <p className="text-base text-slate-600 font-medium mt-2">{config.description}</p>
        <div className="flex items-center space-x-3 mt-4">
          <Badge className="bg-white/80 text-slate-700 shadow-sm border border-white/40 px-3 py-1">
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {activeTasks} active
          </Badge>
          {completedTasks > 0 && (
            <Badge className="bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200 px-3 py-1">
              <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {completedTasks} done
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
              <div className="w-20 h-20 rounded-2xl bg-white/60 flex items-center justify-center mb-6 shadow-lg">
                <div className="text-3xl">{getQuadrantEmoji(config.id)}</div>
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2">No tasks in this quadrant</p>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Click the "Add Task" button above to start organizing your priorities in this category
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Quadrant;