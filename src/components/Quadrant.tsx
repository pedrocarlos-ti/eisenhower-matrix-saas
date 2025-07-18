import React, { useMemo, useCallback } from 'react';
import { Task, QuadrantConfig, QuadrantType } from '../types';
import { Plus } from 'lucide-react';
import TaskItem from './TaskItem';

interface QuadrantProps {
  config: QuadrantConfig;
  tasks: Task[];
  onAddTask: (quadrant: QuadrantType) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newQuadrant: QuadrantType) => void;
  onToggleComplete: (taskId: string) => void;
}

const Quadrant: React.FC<QuadrantProps> = React.memo(({
  config,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onToggleComplete,
}) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onMoveTask(taskId, config.id);
  }, [onMoveTask, config.id]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleAddTask = useCallback(() => {
    onAddTask(config.id);
  }, [onAddTask, config.id]);

  const taskStats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = tasks.length - completedTasks;
    return { completedTasks, activeTasks };
  }, [tasks]);

  const quadrantClasses: Record<QuadrantType, string> = {
    'urgent-important': 'bg-red-50',
    'not-urgent-important': 'bg-blue-50',
    'urgent-not-important': 'bg-yellow-50',
    'not-urgent-not-important': 'bg-gray-50',
  };

  const titleClasses: Record<QuadrantType, string> = {
    'urgent-important': 'text-red-600',
    'not-urgent-important': 'text-blue-600',
    'urgent-not-important': 'text-yellow-600',
    'not-urgent-not-important': 'text-gray-600',
  };



  return (
    <div 
      className={`h-full ${quadrantClasses[config.id]} flex flex-col rounded-2xl p-4`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h3 className={`font-bold ${titleClasses[config.id]}`}>{config.title}</h3>
          <p className="text-sm text-gray-500">{config.description}</p>
        </div>
        <button
          onClick={handleAddTask}
          className="bg-white hover:bg-gray-50 text-gray-600 font-medium py-1 px-3 rounded-full shadow-sm text-xs flex items-center"
        >
          <Plus size={14} className="mr-1" />
          Add
        </button>
      </div>
      <div className="flex items-center space-x-2 px-2 mb-4">
        <div className="text-sm font-medium text-gray-600">{taskStats.activeTasks} active</div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3 pr-1 max-h-[320px]">
        {/* Show only first 5 tasks to prevent layout issues */}
        {tasks.slice(0, 5).map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onToggleComplete={onToggleComplete}
          />
        ))}
        {tasks.length > 5 && (
          <div className="text-center py-2 text-xs text-gray-500">
            +{tasks.length - 5} more tasks
          </div>
        )}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10 border border-dashed border-gray-300 rounded-xl">
            <p className="text-sm font-medium">No tasks yet.</p>
            <p className="text-xs">Add a task to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Quadrant;
