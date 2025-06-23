import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import Matrix from '../components/Matrix';
import { Task, QuadrantType } from '../types';
import { loadTasks, saveTasks } from '../utils/storage';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Eisenhower Matrix</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isFreePlan && (
              <Button 
                onClick={() => setIsProModalOpen(true)}
                variant="outline" 
                className="hidden md:flex bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200"
              >
                Upgrade to Pro
              </Button>
            )}
            
            <button 
              onClick={() => setIsUserProfileOpen(true)}
              className="flex items-center space-x-2 rounded-full bg-gray-100 p-1 pr-4 hover:bg-gray-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{user?.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search and filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Task Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm text-indigo-700 font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-indigo-900">{totalTasks}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">Completed Tasks</p>
              <p className="text-2xl font-bold text-green-900">{completedTasks}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-700 font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-900">{completionRate}%</p>
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
