import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import Matrix from '../components/Matrix';
import { Task, QuadrantType } from '../types';
import { loadTasks, saveTasks } from '../utils/storage';
import { FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import ProUpgradePrompt from '../components/ProUpgradePrompt';
import UserProfile from '../components/UserProfile';
import TaskForm from '../components/TaskForm';

const Dashboard: React.FC = () => {
  const { user, logout, upgradeAccount } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // Used when adding/editing tasks
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentQuadrant, setCurrentQuadrant] = useState<QuadrantType>('urgent-important');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load tasks from storage on initial render
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    setIsLoaded(true);
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, isLoaded]);

  // Task handlers
  const handleAddTask = (quadrant: QuadrantType) => {
    // Store the quadrant in a separate state
    setCurrentTask(null);
    setCurrentQuadrant(quadrant);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleMoveTask = (taskId: string, newQuadrant: QuadrantType) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, quadrant: newQuadrant } : task
    ));
  };

  // Used when saving a task from the task form
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (currentTask) {
      // Edit existing task
      const updatedTask = {
        ...currentTask,
        ...taskData,
        updatedAt: new Date()
      };
      setTasks(tasks.map(t => t.id === currentTask.id ? updatedTask : t));
    } else {
      // Add new task
      const newTask: Task = {
        id: `task_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...taskData
      };
      setTasks([...tasks, newTask]);
    }
    setIsFormOpen(false);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Filter tasks based on search, priority, and completion status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCompletion = showCompleted || !task.completed;
    
    return matchesSearch && matchesPriority && matchesCompletion;
  });

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Check if user is on free plan to show appropriate upgrade prompts
  const isFreePlan = user?.plan === 'free';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  EM
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Eisenhower Matrix</h1>
                <p className="text-sm text-gray-500">Prioritize with purpose</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isFreePlan && (
                <>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center rounded-lg bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <FunnelIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Filters
                  </button>
                  <button
                    onClick={() => handleAddTask('urgent-important')}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Add Task
                  </button>
                </>
              )}
              <button 
                onClick={() => setIsUserProfileOpen(true)}
                className="flex items-center space-x-3 rounded-full bg-white border border-gray-200 p-1.5 pr-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-gray-500 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-40 border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                <input
                  type="checkbox"
                  id="showCompleted"
                  checked={showCompleted}
                  onChange={() => setShowCompleted(!showCompleted)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                />
                <label htmlFor="showCompleted" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Show completed
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Matrix 
          tasks={filteredTasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
          onToggleComplete={handleToggleComplete}
        />
        
        {/* Task Form Modal */}
        {isFormOpen && (
          <TaskForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSaveTask}
            initialTask={currentTask}
            initialQuadrant={currentQuadrant}
          />
        )}
      </main>

      {/* Pro upgrade banner (for free users) */}
      {isFreePlan && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ProUpgradePrompt 
            variant="banner" 
            onClose={() => {}}
            onUpgrade={() => setIsProModalOpen(true)} 
            feature="Premium Features"
          />
        </div>
      )}

      {/* Stats panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Task Statistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total Tasks</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{totalTasks}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Completed</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Completion Rate</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{completionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      {isUserProfileOpen && (
        <UserProfile
          name={user?.name || 'User'}
          email={user?.email || ''}
          plan={user?.plan || 'free'}
          onClose={() => setIsUserProfileOpen(false)}
          onLogout={logout}
          onUpgrade={upgradeAccount}
        />
      )}

      {/* Pro Upgrade Modal */}
      {isProModalOpen && (
        <ProUpgradePrompt
          variant="modal"
          onClose={() => setIsProModalOpen(false)}
          onUpgrade={upgradeAccount}
          feature="Premium Features"
        />
      )}
    </div>
  );
};

export default Dashboard;
