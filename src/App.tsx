import React, { useState, useEffect } from 'react';
import { Task, QuadrantType, PriorityLevel } from './types';
import { loadTasks, saveTasks, generateId } from './utils/localStorage';
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 shadow-modern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Priority Matrix</h1>
                <p className="text-slate-600 text-xs sm:text-sm font-medium hidden sm:block">Master your productivity with the Eisenhower Method</p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="btn-secondary text-sm flex-1 sm:flex-none justify-center sm:justify-start relative"
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="sm:hidden">Analytics</span>
                  <span className="hidden sm:inline">{showStats ? 'Hide Analytics' : 'View Analytics'}</span>
                  <ProBadge variant="small" className="absolute -top-1 -right-1" />
                </button>
                
                <ExportMenu tasks={tasks} />
              </div>
              
              <div className="flex space-x-3 overflow-x-auto pb-2 sm:pb-0">
                <div className="card px-4 sm:px-5 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 min-w-0 flex-shrink-0">
                  <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Total</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-700">{totalTasks}</div>
                </div>
                <div className="card px-4 sm:px-5 py-3 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100 min-w-0 flex-shrink-0">
                  <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Today</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-700">{todaysTasks}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterPriority={filterPriority}
            onFilterChange={setFilterPriority}
            showCompleted={showCompleted}
            onToggleCompleted={setShowCompleted}
          />
        </div>
      </header>

      {/* Pro Upgrade Banner */}
      {showUpgradeBanner && (
        <ProUpgradePrompt 
          variant="banner" 
          onClose={() => setShowUpgradeBanner(false)}
        />
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
              <ProUpgradePrompt 
                variant="inline" 
                feature="Cloud Sync"
              />
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