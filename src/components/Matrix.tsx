import React from 'react';
import { Task, QuadrantConfig, QuadrantType } from '../types';
import Quadrant from './Quadrant';

interface MatrixProps {
  tasks: Task[];
  onAddTask: (quadrant: QuadrantType) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newQuadrant: QuadrantType) => void;
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
  const getTasksForQuadrant = (quadrant: QuadrantType) => {
    return tasks.filter((task) => task.quadrant === quadrant);
  };

  return (
    <div className="w-full">
      {/* Axis Labels */}
      <div className="mb-12 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 inline-flex items-center space-x-12 px-10 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-lg text-gray-700">Not Urgent</span>
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-lg text-gray-700">Urgent</span>
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-base font-semibold text-gray-700">
              Categorize your tasks using the proven Eisenhower Decision Matrix
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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