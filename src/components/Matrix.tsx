import React from 'react';
import { Task, QuadrantConfig } from '../types';
import Quadrant from './Quadrant';

interface MatrixProps {
  tasks: Task[];
  onAddTask: (quadrant: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newQuadrant: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const quadrantConfigs: QuadrantConfig[] = [
  {
    id: 'urgent-important',
    title: 'Do First',
    description: 'Urgent & Important',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
  },
  {
    id: 'not-urgent-important',
    title: 'Schedule',
    description: 'Important, Not Urgent',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'urgent-not-important',
    title: 'Delegate',
    description: 'Urgent, Not Important',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
  },
  {
    id: 'not-urgent-not-important',
    title: 'Eliminate',
    description: 'Neither Urgent nor Important',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
  },
];

const Matrix: React.FC<MatrixProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onToggleComplete,
}) => {
  const getTasksForQuadrant = (quadrant: string) => {
    return tasks.filter((task) => task.quadrant === quadrant);
  };

  return (
    <div className="w-full">
      {/* Axis Labels */}
      <div className="mb-6 sm:mb-8 text-center">
        <div className="card inline-flex items-center space-x-4 sm:space-x-8 text-xs sm:text-sm text-slate-700 px-4 sm:px-8 py-3 sm:py-4 shadow-md">
          <span className="font-semibold flex items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span className="hidden sm:inline">Not Urgent</span>
            <span className="sm:hidden">Not Urgent</span>
          </span>
          <span className="text-slate-400">|</span>
          <span className="font-semibold flex items-center">
            <span className="hidden sm:inline">Urgent</span>
            <span className="sm:hidden">Urgent</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 font-medium px-4 sm:px-0">
          Categorize your tasks using the proven Eisenhower Decision Matrix
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {quadrantConfigs.map((config) => (
          <Quadrant
            key={config.id}
            config={config}
            tasks={getTasksForQuadrant(config.id)}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default Matrix;