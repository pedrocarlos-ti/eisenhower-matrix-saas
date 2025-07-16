import { Task } from '@/types';

// Local storage keys
const TASKS_STORAGE_KEY = 'eisenhower-matrix-tasks';

/**
 * Generate a unique ID for tasks
 * @returns A unique string ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Load tasks from local storage with data transformation
 * @returns Array of tasks or empty array if none found
 */
export const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    return tasks.map((task: any) => ({
      ...task,
      priority: task.priority || 'medium',
      completed: task.completed || false,
      tags: task.tags || [],
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading tasks from local storage:', error);
    return [];
  }
};

/**
 * Save tasks to local storage
 * @param tasks Array of tasks to save
 */
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to local storage:', error);
  }
};

/**
 * Clear all tasks from local storage
 */
export const clearTasks = (): void => {
  try {
    localStorage.removeItem(TASKS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tasks from local storage:', error);
  }
};

/**
 * Get user-specific storage key
 * This is useful when implementing multi-user support
 * @param userId User ID
 * @param key Base storage key
 * @returns User-specific storage key
 */
export const getUserStorageKey = (userId: string, key: string): string => {
  return `${key}-${userId}`;
};

/**
 * Load user-specific tasks from local storage
 * @param userId User ID
 * @returns Array of tasks or empty array if none found
 */
export const loadUserTasks = (userId: string): Task[] => {
  try {
    const userKey = getUserStorageKey(userId, TASKS_STORAGE_KEY);
    const stored = localStorage.getItem(userKey);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    return tasks.map((task: any) => ({
      ...task,
      priority: task.priority || 'medium',
      completed: task.completed || false,
      tags: task.tags || [],
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading user tasks from local storage:', error);
    return [];
  }
};

/**
 * Save user-specific tasks to local storage
 * @param userId User ID
 * @param tasks Array of tasks to save
 */
export const saveUserTasks = (userId: string, tasks: Task[]): void => {
  try {
    const userKey = getUserStorageKey(userId, TASKS_STORAGE_KEY);
    localStorage.setItem(userKey, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving user tasks to local storage:', error);
  }
};

/**
 * Clear user-specific tasks from local storage
 * @param userId User ID
 */
export const clearUserTasks = (userId: string): void => {
  try {
    const userKey = getUserStorageKey(userId, TASKS_STORAGE_KEY);
    localStorage.removeItem(userKey);
  } catch (error) {
    console.error('Error clearing user tasks from local storage:', error);
  }
};