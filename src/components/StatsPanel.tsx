import React from 'react';
import { Task } from '../types';

interface StatsPanelProps {
  tasks: Task[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
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

  // Time-based analytics
  const today = new Date();
  const todayStr = today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const todayTasks = tasks.filter(task => 
    new Date(task.createdAt).toDateString() === todayStr
  ).length;

  const weeklyCompleted = tasks.filter(task => 
    task.completed && new Date(task.updatedAt) >= lastWeek
  ).length;

  const averageTasksPerDay = totalTasks > 0 ? Math.round(totalTasks / 7) : 0;

  // Productivity insights
  const productivityScore = Math.min(100, Math.round(
    (completionRate * 0.4) + 
    (Math.min(100, weeklyCompleted * 10) * 0.3) + 
    (Math.min(100, (activeTasks / Math.max(1, totalTasks)) * 100) * 0.3)
  ));

  // Progress bar component
  const ProgressBar: React.FC<{ value: number; max: number; color: string; label: string }> = ({ value, max, color, label }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 font-medium">{label}</span>
          <span className="text-slate-900 font-semibold">{value}/{max}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="glass-effect border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold gradient-text">Analytics Dashboard</h2>
            <p className="text-slate-600 text-sm font-medium mt-1">Insights into your productivity patterns</p>
          </div>
          <div className="card px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">Productivity Score</div>
            <div className="text-2xl font-bold text-indigo-700">{productivityScore}/100</div>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mb-8">
          <div className="card p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Total</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-700">{totalTasks}</div>
              </div>
            </div>
          </div>
          
          <div className="card p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Done</div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-700">{completedTasks}</div>
              </div>
            </div>
          </div>
          
          <div className="card p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-orange-600 font-semibold uppercase tracking-wide">Active</div>
                <div className="text-xl sm:text-2xl font-bold text-orange-700">{activeTasks}</div>
              </div>
            </div>
          </div>
          
          <div className="card p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-purple-600 font-semibold uppercase tracking-wide">Rate</div>
                <div className="text-xl sm:text-2xl font-bold text-purple-700">{completionRate}%</div>
              </div>
            </div>
          </div>
          
          <div className="card p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-slate-600 font-semibold uppercase tracking-wide">Today</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-700">{todayTasks}</div>
              </div>
            </div>
          </div>
          
          <div className="card p-4 sm:p-6 bg-gradient-to-br from-rose-50 to-red-50 border-rose-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-rose-600 font-semibold uppercase tracking-wide">Overdue</div>
                <div className="text-xl sm:text-2xl font-bold text-rose-700">{overdueTasks}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Priority Analysis */}
          <div className="card p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Priority Analysis</h3>
            </div>
            <div className="space-y-4">
              <ProgressBar value={priorityStats.high} max={totalTasks} color="bg-gradient-to-r from-red-500 to-red-600" label="High Priority" />
              <ProgressBar value={priorityStats.medium} max={totalTasks} color="bg-gradient-to-r from-yellow-500 to-amber-500" label="Medium Priority" />
              <ProgressBar value={priorityStats.low} max={totalTasks} color="bg-gradient-to-r from-green-500 to-emerald-500" label="Low Priority" />
            </div>
          </div>

          {/* Quadrant Distribution */}
          <div className="card p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Quadrant Distribution</h3>
            </div>
            <div className="space-y-4">
              <ProgressBar value={quadrantStats['urgent-important']} max={totalTasks} color="bg-gradient-to-r from-red-500 to-red-600" label="Do First" />
              <ProgressBar value={quadrantStats['not-urgent-important']} max={totalTasks} color="bg-gradient-to-r from-blue-500 to-blue-600" label="Schedule" />
              <ProgressBar value={quadrantStats['urgent-not-important']} max={totalTasks} color="bg-gradient-to-r from-yellow-500 to-amber-500" label="Delegate" />
              <ProgressBar value={quadrantStats['not-urgent-not-important']} max={totalTasks} color="bg-gradient-to-r from-gray-500 to-slate-500" label="Eliminate" />
            </div>
          </div>

          {/* Weekly Insights */}
          <div className="card p-6 lg:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Weekly Insights</h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-600">Completed This Week</span>
                <span className="text-lg font-bold text-emerald-600">{weeklyCompleted}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-600">Daily Average</span>
                <span className="text-lg font-bold text-blue-600">{averageTasksPerDay}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-600">Created Today</span>
                <span className="text-lg font-bold text-purple-600">{todayTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;