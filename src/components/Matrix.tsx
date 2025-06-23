import React from 'react';
import { Task, QuadrantConfig } from '../types';
import { Card } from '@/components/ui/card';
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
      <div className="mb-10 text-center">
        <div className="card-gradient inline-flex items-center space-x-10 px-8 py-5 rounded-2xl">
          <span className="font-semibold flex items-center text-base text-slate-700">
            <svg className="w-5 h-5 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Not Urgent
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
          <span className="font-semibold flex items-center text-base text-slate-700">
            Urgent
            <svg className="w-5 h-5 ml-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
        <p className="mt-6 text-base text-slate-600 font-medium">
          📋 Categorize your tasks using the proven Eisenhower Decision Matrix
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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