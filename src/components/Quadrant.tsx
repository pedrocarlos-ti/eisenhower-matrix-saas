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
      className={`card ${config.bgColor} p-4 sm:p-6 lg:p-8 min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] flex flex-col shadow-modern hover:shadow-xl transition-all duration-300 border-2 ${config.color === 'text-red-700' ? 'border-red-200 hover:border-red-300' : config.color === 'text-blue-700' ? 'border-blue-200 hover:border-blue-300' : config.color === 'text-yellow-700' ? 'border-yellow-200 hover:border-yellow-300' : 'border-gray-200 hover:border-gray-300'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6 sm:mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-sm ${config.color === 'text-red-700' ? 'bg-gradient-to-br from-red-400 to-red-600' : config.color === 'text-blue-700' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : config.color === 'text-yellow-700' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}></div>
            <h2 className={`text-xl sm:text-2xl font-bold ${config.color} truncate`}>{config.title}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium ml-6 sm:ml-8 mb-3 sm:mb-4">{config.description}</p>
          <div className="ml-6 sm:ml-8 flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-semibold bg-white/90 text-slate-700 shadow-sm border border-slate-200">
              <svg className="w-3 h-3 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {activeTasks} active
            </div>
            {completedTasks > 0 && (
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200">
                <svg className="w-3 h-3 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {completedTasks} done
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onAddTask(config.id)}
          className="btn-primary w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex-shrink-0 ml-3"
          title="Add new task"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-center py-6 sm:py-8 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-slate-600 text-sm sm:text-base font-semibold mb-2">No tasks in this quadrant</p>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xs">Click the + button above to add your first task and start organizing your priorities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quadrant;