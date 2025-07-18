import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Matrix } from '../components/Matrix';
import { Task, QuadrantType } from '../types';
import { loadTasks, saveTasks, generateId } from '../utils/storage';
import {
  Plus,
  ChevronRight,
  LayoutGrid,
  BarChart3,
  CheckCircle2,
  PercentCircle,
  Rocket,
  BadgePercent,
  User,
  ListChecks,
  DollarSign,
  MessageCircle,
  Search,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import ProUpgradePrompt from '../components/ProUpgradePrompt';
import UserProfile from '../components/UserProfile';
import TaskForm from '../components/TaskForm';
import ErrorBoundary from '../components/ErrorBoundary';
import { useDebounce } from '../hooks/useDebounce';

const Dashboard: React.FC = () => {
  const { user, logout, upgradeAccount } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentQuadrant, setCurrentQuadrant] = useState<QuadrantType>('urgent-important');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  const handleAddTask = useCallback((quadrant: QuadrantType) => {
    setCurrentTask(null);
    setCurrentQuadrant(quadrant);
    setIsFormOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  const handleMoveTask = useCallback((taskId: string, newQuadrant: QuadrantType) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, quadrant: newQuadrant } : task
      )
    );
  }, []);

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (currentTask) {
      const updatedTask = {
        ...currentTask,
        ...taskData,
        updatedAt: new Date(),
      };
      setTasks(tasks.map((t) => (t.id === currentTask.id ? updatedTask : t)));
    } else {
      const newTask: Task = {
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...taskData,
      };
      setTasks([...tasks, newTask]);
    }
    setIsFormOpen(false);
  };

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        debouncedSearchTerm === '' ||
        task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        false;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesCompletion = showCompleted || !task.completed;

      return matchesSearch && matchesPriority && matchesCompletion;
    });
  }, [tasks, debouncedSearchTerm, priorityFilter, showCompleted]);

  const taskStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, completionRate };
  }, [tasks]);

  const isFreePlan = user?.plan === 'free';

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex relative overflow-hidden">
        <aside className="w-80 h-screen bg-white border-r border-gray-200 flex-shrink-0 hidden xl:flex flex-col p-6 space-y-6 h-auto">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
              <LayoutGrid className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Eisenhower</h1>
              <p className="text-sm text-gray-500">Task Matrix</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:shadow transition" onClick={() => setIsUserProfileOpen(true)}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800">{user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.plan} Plan</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 px-2">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-600"><ListChecks className="w-4 h-4 text-indigo-500" />Total Tasks</span>
                  <span className="text-sm font-bold text-gray-800">{taskStats.totalTasks}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" />Completed</span>
                  <span className="text-sm font-bold text-gray-800">{taskStats.completedTasks}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-600"><PercentCircle className="w-4 h-4 text-indigo-600" />Progress</span>
                  <span className="text-sm font-bold text-gray-800">{taskStats.completionRate}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 px-2">Navigation</h3>
              <nav className="space-y-1">
                <a href="/#features" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-gray-600 hover:text-indigo-700">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm font-medium">Features</span>
                </a>
                <a href="/#pricing" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-gray-600 hover:text-indigo-700">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm font-medium">Pricing</span>
                </a>
                <a href="/#testimonials" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-gray-600 hover:text-indigo-700">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Testimonials</span>
                </a>
              </nav>
            </div>
          </div>

          {isFreePlan && (
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-5 h-5 text-yellow-300" />
                <h4 className="font-bold text-md">Upgrade to Pro</h4>
              </div>
              <p className="text-sm opacity-80 mb-4">Unlock all features and get unlimited access.</p>
              <button onClick={() => setIsProModalOpen(true)} className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-2 px-4 text-sm font-medium transition-colors duration-200">
                <BadgePercent className="w-4 h-4 inline mr-2" />Upgrade Now
              </button>
            </div>
          )}
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/50 backdrop-blur-sm border-b border-gray-200 flex-shrink-0">
            <div className="px-6 h-20 flex items-center justify-between">
              <div className="hidden xl:block">
                <h2 className="text-xl font-bold text-gray-800">Welcome back, {user?.name}</h2>
                <p className="text-sm text-gray-500">Ready to tackle your priorities?</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="bg-white border border-gray-200 border-solid focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg pl-10 pr-4 py-2 w-full text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40 bg-white border-gray-200 text-sm">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center space-x-2 bg-white hover:bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 text-sm font-medium text-gray-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    id="showCompleted"
                    checked={showCompleted}
                    onChange={() => setShowCompleted(!showCompleted)}
                    className="rounded text-purple-500 focus:ring-purple-500 w-fit"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>Show completed</span>
                </button>
                <button onClick={() => handleAddTask('urgent-important')} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-full flex items-center gap-2 shadow transition">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">New Task</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
            <Matrix
              tasks={filteredTasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
              onToggleComplete={handleToggleComplete}
            />
          </main>
        </div>

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

        {isProModalOpen && (
          <ProUpgradePrompt
            variant="modal"
            onClose={() => setIsProModalOpen(false)}
            onUpgrade={upgradeAccount}
            feature="Premium Features"
          />
        )}

        {isFormOpen && (
          <TaskForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSaveTask}
            initialTask={currentTask}
            initialQuadrant={currentQuadrant}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;