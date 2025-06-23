import { Task } from '@/types';

// Local storage keys
const TASKS_STORAGE_KEY = 'eisenhower-matrix-tasks';

/**
 * Load tasks from local storage
 * @returns Array of tasks or empty array if none found
 */
export const loadTasks = (): Task[] => {
  try {
    const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
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
    const tasksJson = localStorage.getItem(userKey);
    return tasksJson ? JSON.parse(tasksJson) : [];
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
