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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  EM
                </div>
              </div>
              <div className="ml-4 text-xl font-semibold text-gray-800">Eisenhower Matrix</div>
            </div>
            <div className="flex items-center space-x-4">
              {isFreePlan && (
                <>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="ml-3 inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                  >
                    <FunnelIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Filter
                  </button>
                  <button
                    onClick={() => handleAddTask('urgent-important')}
                    className="ml-3 inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Add Task
                  </button>
                </>
              )}
              <button 
                onClick={() => setIsUserProfileOpen(true)}
                className="flex items-center space-x-2 rounded-full bg-gray-100 p-1 pr-4 hover:bg-gray-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-96">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showCompleted"
                checked={showCompleted}
                onChange={() => setShowCompleted(!showCompleted)}
                className="rounded text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="showCompleted" className="text-sm text-gray-700">
                Show completed tasks
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Task Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-sm text-gray-600 font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-sm text-gray-600 font-medium">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-sm text-gray-600 font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
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
