import React, { useState, useEffect } from 'react';
import { Task, QuadrantType, PriorityLevel } from './types';
import { loadTasks, saveTasks, generateId } from './utils/localStorage';
import Matrix from './components/Matrix';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import StatsPanel from './components/StatsPanel';

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Eisenhower Matrix</h1>
                <p className="text-gray-500 text-sm">Organize by urgency and importance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
              <div className="flex space-x-3">
                <div className="bg-blue-50 rounded-lg px-4 py-2">
                  <div className="text-xs text-blue-600 font-medium">Total</div>
                  <div className="text-xl font-bold text-blue-700">{totalTasks}</div>
                </div>
                <div className="bg-green-50 rounded-lg px-4 py-2">
                  <div className="text-xs text-green-600 font-medium">Today</div>
                  <div className="text-xl font-bold text-green-700">{todaysTasks}</div>
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

      {/* Stats Panel */}
      {showStats && (
        <StatsPanel tasks={tasks} />
      )}

      <main className="py-8">
        <Matrix
          tasks={filteredTasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
          onToggleComplete={handleToggleComplete}
        />
      </main>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTask}
        initialTask={editingTask}
        initialQuadrant={selectedQuadrant}
      />
    </div>
  );
};

export default App;