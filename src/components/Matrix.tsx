import React, { useMemo } from "react";
import { Task, QuadrantConfig, QuadrantType } from "../types";
import Quadrant from "./Quadrant";

interface MatrixProps {
  tasks: Task[];
  onAddTask: (quadrant: QuadrantType) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newQuadrant: QuadrantType) => void;
  onToggleComplete: (taskId: string) => void;
}

const quadrantConfigs: QuadrantConfig[] = [
  {
    id: "urgent-important",
    title: "Do First",
    description: "Urgent & Important",
    color: "text-red-600",
    bgColor: "bg-red-50/60",
  },
  {
    id: "not-urgent-important",
    title: "Schedule",
    description: "Important, Not Urgent",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50/60",
  },
  {
    id: "urgent-not-important",
    title: "Delegate",
    description: "Urgent, Not Important",
    color: "text-amber-600",
    bgColor: "bg-amber-50/60",
  },
  {
    id: "not-urgent-not-important",
    title: "Eliminate",
    description: "Neither Urgent nor Important",
    color: "text-gray-600",
    bgColor: "bg-gray-50/60",
  },
];

const Matrix: React.FC<MatrixProps> = React.memo(
  ({
    tasks,
    onAddTask,
    onEditTask,
    onDeleteTask,
    onMoveTask,
    onToggleComplete,
  }) => {
    // Memoize task filtering to prevent unnecessary re-computation
    const tasksByQuadrant = useMemo(() => {
      return quadrantConfigs.reduce((acc, config) => {
        acc[config.id] = tasks.filter((task) => task.quadrant === config.id);
        return acc;
      }, {} as Record<QuadrantType, Task[]>);
    }, [tasks]);

    return (
      <div className="w-full">
        {/* Matrix Grid Layout with Axes */}
        <div className="mb-4">
          <div className="relative">

            {/* Eisenhower Matrix - Proper Grid Design */}
            <div className="max-w-7xl mx-auto">
              {/* Matrix Title with Modern Styling */}
             

              {/* Modern Matrix Container with 3D Effects */}
              <div className="relative">
                
                {/* Simple Urgency Axis - Top - Hidden on mobile, visible on md screens and up */}
                <div className="relative h-8 mb-6 mx-auto w-3/4 hidden md:block">
                  {/* Horizontal line */}
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-indigo-500 to-red-500 transform -translate-y-1/2"></div>
                  
                  {/* Left arrow */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2 12l5-5v10l-5-5z" />
                    </svg>
                  </div>
                  
                  {/* Right arrow */}
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12l-5 5V7l5 5z" />
                    </svg>
                  </div>
                  
                  {/* Label */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="px-3 py-1 bg-white rounded-md border border-gray-100 shadow-sm">
                      <span className="text-xs font-bold text-gray-600">URGENCY</span>
                    </div>
                  </div>
                  
                  {/* Left label */}
                  <div className="absolute left-0 bottom-0 transform -translate-x-1/2 translate-y-full mt-1">
                    <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Not Urgent</span>
                  </div>
                  
                  {/* Right label */}
                  <div className="absolute right-0 bottom-0 transform translate-x-1/2 translate-y-full mt-1">
                    <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Urgent</span>
                  </div>
                </div>

                {/* Main Matrix Grid */}
                <div className="relative">
                  {/* Simple Importance Axis - Left - Hidden on mobile, visible on md screens and up */}
                  <div className="absolute -left-16 top-0 h-full hidden md:flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative h-64 w-8">
                        {/* Vertical line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 to-gray-400 transform -translate-x-1/2"></div>
                        
                        {/* Top arrow */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L7 7h10l-5-5z" />
                          </svg>
                        </div>
                        
                        {/* Bottom arrow */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22l5-5H7l5 5z" />
                          </svg>
                        </div>
                        
                        {/* Label */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -ml-10">
                          <div className="px-2 py-1 bg-white rounded-md border border-gray-100 shadow-sm translate-x-6 rotate-90">
                            <span className="text-xs font-bold text-gray-600 transform -rotate-180 block whitespace-nowrap">IMPORTANCE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty div to remove duplicate axis */}

                  {/* Modern Matrix Grid with 3D Dividers */}
                  <div className="relative">
                    {/* Fixed height container to ensure consistent divider positioning */}
                    <div className="relative h-[600px]">
                      {/* Vertical Divider with 3D Effect - Using fixed height instead of top/bottom */}
                      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2 z-10"></div>
                      {/* Horizontal Divider with 3D Effect - Using fixed width instead of left/right */}
                      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 transform -translate-y-1/2 z-10"></div>
                      
                      {/* Center intersection point */}
                      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-indigo-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
                      
                      {/* 2x2 Grid with Fixed Height */}
                      <div className="grid grid-cols-2 gap-0 h-full md:ml-8">
                      {quadrantConfigs.map((config, index) => (
                        <div
                          key={config.id}
                          className={`p-4 ${index === 0 ? 'pr-2 pb-2' : index === 1 ? 'pl-2 pb-2' : index === 2 ? 'pr-2 pt-2' : 'pl-2 pt-2'}`}
                          style={{
                            animationDelay: `${index * 150}ms`,
                            animation: "fadeInScale 0.8s ease-out forwards",
                          }}
                        >
                          <div className="h-full">
                            <Quadrant
                              config={config}
                              tasks={tasksByQuadrant[config.id]}
                              onAddTask={onAddTask}
                              onEditTask={onEditTask}
                              onDeleteTask={onDeleteTask}
                              onMoveTask={onMoveTask}
                              onToggleComplete={onToggleComplete}
                            />
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export { Matrix };
