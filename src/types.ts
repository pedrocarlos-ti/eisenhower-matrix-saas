export interface Task {
  id: string;
  title: string;
  description?: string;
  quadrant: QuadrantType;
  priority: PriorityLevel;
  dueDate?: Date;
  completed: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type QuadrantType = 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface QuadrantConfig {
  id: QuadrantType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export interface AppSettings {
  darkMode: boolean;
  showCompletedTasks: boolean;
  defaultPriority: PriorityLevel;
  autoArchiveCompleted: boolean;
}