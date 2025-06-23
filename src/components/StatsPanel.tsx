import React from 'react';
import { Task } from '../types';

interface StatsPanelProps {
  tasks: Task[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityStats = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length,
  };

  const quadrantStats = {
    'urgent-important': tasks.filter(task => task.quadrant === 'urgent-important').length,
    'not-urgent-important': tasks.filter(task => task.quadrant === 'not-urgent-important').length,
    'urgent-not-important': tasks.filter(task => task.quadrant === 'urgent-not-important').length,
    'not-urgent-not-important': tasks.filter(task => task.quadrant === 'not-urgent-not-important').length,
  };

  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Statistics</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Total Tasks</div>
            <div className="text-2xl font-bold text-blue-700">{totalTasks}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Completed</div>
            <div className="text-2xl font-bold text-green-700">{completedTasks}</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">Completion Rate</div>
            <div className="text-2xl font-bold text-purple-700">{completionRate}%</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm text-red-600 font-medium">Overdue</div>
            <div className="text-2xl font-bold text-red-700">{overdueTasks}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Priority Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Priority Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Priority</span>
                <span className="text-sm font-medium text-red-600">{priorityStats.high}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medium Priority</span>
                <span className="text-sm font-medium text-yellow-600">{priorityStats.medium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Priority</span>
                <span className="text-sm font-medium text-green-600">{priorityStats.low}</span>
              </div>
            </div>
          </div>

          {/* Quadrant Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quadrant Distribution</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Do First</span>
                <span className="text-sm font-medium text-red-600">{quadrantStats['urgent-important']}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Schedule</span>
                <span className="text-sm font-medium text-blue-600">{quadrantStats['not-urgent-important']}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Delegate</span>
                <span className="text-sm font-medium text-yellow-600">{quadrantStats['urgent-not-important']}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Eliminate</span>
                <span className="text-sm font-medium text-gray-600">{quadrantStats['not-urgent-not-important']}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;