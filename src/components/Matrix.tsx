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
              {/* Matrix Axes Labels */}
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Eisenhower Decision Matrix</h2>
                  <p className="text-gray-600">Organize tasks by urgency and importance</p>
                </div>
              </div>

              {/* Matrix Container with Axes */}
              <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-8">
                
                {/* Urgency Axis - Top */}
                <div className="flex items-center justify-between mb-6 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-gray-700">Not Urgent</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="h-px bg-gradient-to-r from-blue-300 to-red-300 flex-1 min-w-[200px]"></div>
                    <span className="text-sm font-medium">URGENCY</span>
                    <div className="h-px bg-gradient-to-r from-blue-300 to-red-300 flex-1 min-w-[200px]"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-700">Urgent</span>
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Main Matrix Grid */}
                <div className="relative">
                  {/* Importance Axis - Left */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between items-center -ml-20 w-16">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-gray-700 transform -rotate-90 whitespace-nowrap">Important</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-px bg-gradient-to-b from-green-300 to-gray-300 h-16"></div>
                      <span className="text-xs font-medium text-gray-400 transform -rotate-90 whitespace-nowrap my-4">IMPORTANCE</span>
                      <div className="w-px bg-gradient-to-b from-green-300 to-gray-300 h-16"></div>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-sm font-bold text-gray-700 transform -rotate-90 whitespace-nowrap">Not Important</span>
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Matrix Grid with Dividers */}
                  <div className="relative">
                    {/* Vertical Divider */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 transform -translate-x-1/2 z-10"></div>
                    {/* Horizontal Divider */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 transform -translate-y-1/2 z-10"></div>
                    
                    {/* 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-0 min-h-[600px]">
                      {quadrantConfigs.map((config, index) => (
                        <div
                          key={config.id}
                          className={`p-3 ${index === 0 ? 'pr-1.5 pb-1.5' : index === 1 ? 'pl-1.5 pb-1.5' : index === 2 ? 'pr-1.5 pt-1.5' : 'pl-1.5 pt-1.5'}`}
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: "fadeInUp 0.6s ease-out forwards",
                          }}
                        >
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
