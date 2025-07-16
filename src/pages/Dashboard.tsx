import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import Matrix from "../components/Matrix";
import { Task, QuadrantType } from "../types";
import { loadTasks, saveTasks, generateId } from "../utils/storage";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import ProUpgradePrompt from "../components/ProUpgradePrompt";
import UserProfile from "../components/UserProfile";
import TaskForm from "../components/TaskForm";
import ErrorBoundary from "../components/ErrorBoundary";
import { useDebounce } from "../hooks/useDebounce";

const Dashboard: React.FC = () => {
  const { user, logout, upgradeAccount } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // Used when adding/editing tasks
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [currentQuadrant, setCurrentQuadrant] =
    useState<QuadrantType>("urgent-important");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  // Debounce search term to improve performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  // Memoize task handlers to prevent unnecessary re-renders
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

  const handleMoveTask = useCallback(
    (taskId: string, newQuadrant: QuadrantType) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, quadrant: newQuadrant } : task
        )
      );
    },
    []
  );

  // Used when saving a task from the task form
  const handleSaveTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (currentTask) {
      // Edit existing task
      const updatedTask = {
        ...currentTask,
        ...taskData,
        updatedAt: new Date(),
      };
      setTasks(tasks.map((t) => (t.id === currentTask.id ? updatedTask : t)));
    } else {
      // Add new task
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

  // Memoize filtered tasks to prevent unnecessary re-computation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        debouncedSearchTerm === "" ||
        task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        task.description
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        false;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesCompletion = showCompleted || !task.completed;

      return matchesSearch && matchesPriority && matchesCompletion;
    });
  }, [tasks, debouncedSearchTerm, priorityFilter, showCompleted]);

  // Memoize task statistics to prevent unnecessary recalculation
  const taskStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, completionRate };
  }, [tasks]);

  // Check if user is on free plan to show appropriate upgrade prompts
  const isFreePlan = user?.plan === "free";

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col">
        {/* Background Pattern */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-40 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.8),rgba(255,255,255,0.4))]"></div>
        </div>

        <header className="relative z-10 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 shadow-sm flex-shrink-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Eisenhower Matrix
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">
                    Welcome back, {user?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Compact Stats */}
                <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      {taskStats.totalTasks} Tasks
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      {taskStats.completionRate}% Complete
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddTask("urgent-important")}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Task
                </button>

                <button
                  onClick={() => setIsUserProfileOpen(true)}
                  className="flex items-center space-x-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 p-2 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Compact Search and filters */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/40 p-2">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="block w-full rounded-lg border border-gray-200 py-1.5 pl-8 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 placeholder:text-gray-500 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-32 h-8 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 bg-white text-sm">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">🔴 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showCompleted"
                    checked={showCompleted}
                    onChange={() => setShowCompleted(!showCompleted)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                  />
                  <label
                    htmlFor="showCompleted"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Show completed
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        {tasks.length === 0 && (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl shadow-lg border border-indigo-100 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to Your Productivity Journey!
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                Ready to master your priorities? Start by adding your first task
                to any quadrant. The Eisenhower Matrix will help you focus on
                what truly matters.
              </p>
              <button
                onClick={() => handleAddTask("urgent-important")}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Create Your First Task</span>
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 pb-6">
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
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex-shrink-0">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-xl shadow-lg p-2 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Upgrade to Pro</h3>
                    <p className="text-xs text-indigo-100">
                      Unlock advanced features and unlimited tasks
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProModalOpen(true)}
                  className="bg-white text-indigo-600 px-2 py-1 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-md text-xs"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compact Stats sidebar */}
        <div className="fixed right-6 top-32 z-40 hidden xl:block">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/40 p-4 w-48">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900">Statistics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">
                    Total
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {taskStats.totalTasks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">
                    Done
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {taskStats.completedTasks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">
                    Rate
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {taskStats.completionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Quick Add Button (Mobile) */}
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <button
            onClick={() => handleAddTask("urgent-important")}
            className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl hover:scale-110 transition-all duration-200"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>

        {/* User Profile Modal */}
        {isUserProfileOpen && (
          <UserProfile
            name={user?.name || "User"}
            email={user?.email || ""}
            plan={user?.plan || "free"}
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
    </ErrorBoundary>
  );
};

export default Dashboard;
