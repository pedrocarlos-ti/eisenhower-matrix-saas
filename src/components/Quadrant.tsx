import React from 'react';
import { Task, QuadrantConfig } from '../types';
import TaskItem from './TaskItem';

interface QuadrantProps {
  config: QuadrantConfig;
  tasks: Task[];
  onAddTask: (quadrant: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newQuadrant: string) => void;
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

  return (
    <div
      className={`${config.bgColor} rounded-2xl p-6 min-h-[400px] flex flex-col border border-white/20 transition-all duration-200 hover:shadow-lg`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${config.color === 'text-red-700' ? 'bg-red-500' : config.color === 'text-blue-700' ? 'bg-blue-500' : config.color === 'text-yellow-700' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
            <h2 className={`text-xl font-bold ${config.color}`}>{config.title}</h2>
          </div>
          <p className="text-sm text-gray-600 ml-6 mb-3">{config.description}</p>
          <div className="ml-6 flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/80 text-gray-700">
              {activeTasks} active
            </span>
            {completedTasks > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {completedTasks} done
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onAddTask(config.id)}
          className="bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-xl w-11 h-11 flex items-center justify-center transition-all duration-200 border border-white/50"
          title="Add task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      {/* Tasks */}
      <div className="flex-1 space-y-3">
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
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No tasks yet</p>
            <p className="text-gray-400 text-xs mt-1">Click the + button to add your first task</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quadrant;