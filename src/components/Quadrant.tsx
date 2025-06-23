import React from 'react';
import { Task, QuadrantConfig } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TaskItem from './TaskItem';

interface QuadrantProps {
  config: QuadrantConfig;
  tasks: Task[];
  onAddTask: (quadrant: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newQuadrant: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const Quadrant: React.FC<QuadrantProps> = ({
  config,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onToggleComplete,
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onMoveTask(taskId, config.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = tasks.length - completedTasks;

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'urgent-important':
        return 'border-red-200 bg-red-50';
      case 'not-urgent-important':
        return 'border-blue-200 bg-blue-50';
      case 'urgent-not-important':
        return 'border-yellow-200 bg-yellow-50';
      case 'not-urgent-not-important':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200';
    }
  };

  const getIndicatorColor = (quadrant: string) => {
    switch (quadrant) {
      case 'urgent-important':
        return 'bg-red-500';
      case 'not-urgent-important':
        return 'bg-blue-500';
      case 'urgent-not-important':
        return 'bg-yellow-500';
      case 'not-urgent-not-important':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className={`min-h-[500px] ${getQuadrantColor(config.id)} transition-all duration-200 hover:shadow-lg`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getIndicatorColor(config.id)}`} />
            <CardTitle className="text-lg">{config.title}</CardTitle>
          </div>
          <Button
            onClick={() => onAddTask(config.id)}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{config.description}</p>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {activeTasks} active
          </Badge>
          {completedTasks > 0 && (
            <Badge variant="outline" className="text-xs">
              {completedTasks} done
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleComplete={onToggleComplete}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No tasks yet</p>
              <p className="text-xs text-muted-foreground">Click the + button to add your first task</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Quadrant;