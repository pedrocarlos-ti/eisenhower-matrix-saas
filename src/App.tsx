import React, { useState, useEffect } from 'react';
import { Task, QuadrantType, PriorityLevel } from './types';
import { loadTasks, saveTasks, generateId } from './utils/localStorage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Matrix from './components/Matrix';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import StatsPanel from './components/StatsPanel';
import ExportMenu from './components/ExportMenu';
import ProUpgradePrompt from './components/ProUpgradePrompt';
import ProBadge from './components/ProBadge';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<PriorityLevel | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [showProModal, setShowProModal] = useState(false);

  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, isLoaded]);

  const handleAddTask = (quadrant: string) => {
    setSelectedQuadrant(quadrant as QuadrantType);
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setSelectedQuadrant(undefined);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleMoveTask = (taskId: string, newQuadrant: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, quadrant: newQuadrant as QuadrantType, updatedAt: new Date() }
        : task
    ));
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, ...taskData, updatedAt: now }
          : task
      ));
    } else {
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCompleted = showCompleted || !task.completed;
    
    return matchesSearch && matchesPriority && matchesCompleted;
  });

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    setSelectedQuadrant(undefined);
  };

  const totalTasks = tasks.length;
  const todaysTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.createdAt);
    return taskDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Eisenhower Matrix</h1>
                <p className="text-slate-600 text-base font-medium hidden sm:block">Master your productivity with the proven decision framework</p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-6">
              <button
                onClick={() => setShowProModal(true)}
                className="btn-primary-large relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Upgrade to Pro
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="btn-secondary-large relative"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden sm:inline">{showStats ? 'Hide Analytics' : 'Analytics'}</span>
                  <span className="sm:hidden">Stats</span>
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2">PRO</Badge>
                </button>
                
                <ExportMenu tasks={tasks} />
              </div>
              
              <div className="flex space-x-4">
                <div className="text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold">{totalTasks}</div>
                  <div className="text-xs opacity-90">Total Tasks</div>
                </div>
                <div className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold">{todaysTasks}</div>
                  <div className="text-xs opacity-90">Today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterPriority={filterPriority}
              onFilterChange={setFilterPriority}
              showCompleted={showCompleted}
              onToggleCompleted={setShowCompleted}
            />
          </div>
        </div>
      </header>

      {/* Pro Upgrade Banner */}
      {showUpgradeBanner && tasks.length > 3 && (
        <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg">🚀 You're getting productive! Time to unlock Pro features</p>
                  <p className="text-white/90 text-sm">Get cloud sync, team collaboration, and advanced analytics</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowProModal(true)}
                  className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Upgrade Now
                </button>
                <button 
                  onClick={() => setShowUpgradeBanner(false)}
                  className="text-white/80 hover:text-white transition-colors p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Panel */}
      {showStats && (
        <StatsPanel tasks={tasks} />
      )}

      <main className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Matrix
            tasks={filteredTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onToggleComplete={handleToggleComplete}
          />
          
          {/* Pro Features Showcase */}
          {tasks.length >= 5 && tasks.length <= 15 && (
            <div className="mt-12">
              <div className="card-gradient p-8 rounded-3xl border-2 border-purple-200 shadow-2xl">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold gradient-text mb-3">
                      🌟 Ready for the next level?
                    </h3>
                    <p className="text-slate-600 mb-4 text-lg">
                      You're managing {tasks.length} tasks like a pro! Unlock cloud sync, team collaboration, and advanced analytics to supercharge your productivity.
                    </p>
                    <button 
                      onClick={() => setShowProModal(true)}
                      className="btn-primary-large"
                    >
                      ✨ Discover Pro Features
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTask}
        initialTask={editingTask}
        initialQuadrant={selectedQuadrant}
      />

      {/* Pro Upgrade Modal */}
      {showProModal && (
        <ProUpgradePrompt 
          variant="modal" 
          onClose={() => setShowProModal(false)}
        />
      )}
    </div>
  );
};

export default App;