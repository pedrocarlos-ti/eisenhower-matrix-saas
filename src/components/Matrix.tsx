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
    color: "text-red-700",
    bgColor: "bg-red-50",
  },
  {
    id: "not-urgent-important",
    title: "Schedule",
    description: "Important, Not Urgent",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  {
    id: "urgent-not-important",
    title: "Delegate",
    description: "Urgent, Not Important",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
  {
    id: "not-urgent-not-important",
    title: "Eliminate",
    description: "Neither Urgent nor Important",
    color: "text-gray-700",
    bgColor: "bg-gray-50",
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
              <div className="flex items-center justify-center mb-8">
                <div className="text-center">
                  <h2 className="text-4xl font-black gradient-text mb-3">Eisenhower Decision Matrix</h2>
                  <p className="text-gray-600 text-lg font-medium">Organize tasks by urgency and importance</p>
                </div>
              </div>

              {/* Modern Matrix Container with 3D Effects */}
              <div className="relative">
                
                {/* Modern Urgency Axis - Top */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xl font-black text-gray-700">Not Urgent</span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-gray-400">
                    <div className="h-1 bg-gradient-to-r from-blue-400 to-red-400 flex-1 min-w-[250px] rounded-full shadow-sm"></div>
                    <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                      <span className="text-sm font-black text-gray-600">URGENCY</span>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-blue-400 to-red-400 flex-1 min-w-[250px] rounded-full shadow-sm"></div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-black text-gray-700">Urgent</span>
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Main Matrix Grid */}
                <div className="relative">
                  {/* Modern Importance Axis - Left */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between items-center -ml-24 w-20">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <span className="text-sm font-black text-gray-700 transform -rotate-90 whitespace-nowrap">Important</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-1 bg-gradient-to-b from-green-400 to-gray-400 h-20 rounded-full shadow-sm"></div>
                      <div className="px-2 py-1 bg-white rounded-md shadow-sm my-6">
                        <span className="text-xs font-black text-gray-600 transform -rotate-90 whitespace-nowrap block">IMPORTANCE</span>
                      </div>
                      <div className="w-1 bg-gradient-to-b from-green-400 to-gray-400 h-20 rounded-full shadow-sm"></div>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-3">
                      <span className="text-sm font-black text-gray-700 transform -rotate-90 whitespace-nowrap">Not Important</span>
                      <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Modern Matrix Grid with 3D Dividers */}
                  <div className="relative">
                    {/* Vertical Divider with 3D Effect */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 z-10"></div>
                    {/* Horizontal Divider with 3D Effect */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2 z-10"></div>
                    
                    {/* Center intersection point */}
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
                    
                    {/* 2x2 Grid with Enhanced Spacing */}
                    <div className="grid grid-cols-2 gap-0 min-h-[600px]">
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
    );
  }
);

export default Matrix;
