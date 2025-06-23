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
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Eisenhower Matrix</h1>
                <p className="text-muted-foreground text-sm hidden sm:block">Organize tasks by urgency and importance</p>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStats(!showStats)}
                  className="relative"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden sm:inline">{showStats ? 'Hide Analytics' : 'Analytics'}</span>
                  <span className="sm:hidden">Stats</span>
                  <Badge variant="secondary" className="absolute -top-2 -right-2 px-1 text-xs">PRO</Badge>
                </Button>
                
                <ExportMenu tasks={tasks} />
              </div>
              
              <div className="flex space-x-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalTasks}</div>
                  <div className="text-xs text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{todaysTasks}</div>
                  <div className="text-xs text-muted-foreground">Today</div>
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