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
    <div className="w-full max-w-7xl mx-auto px-6">
      {/* Axis Labels */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center space-x-8 text-sm text-gray-600">
          <span className="font-medium">← Not Urgent</span>
          <span className="text-gray-400">|</span>
          <span className="font-medium">Urgent →</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Use the matrix below to categorize tasks by urgency and importance
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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