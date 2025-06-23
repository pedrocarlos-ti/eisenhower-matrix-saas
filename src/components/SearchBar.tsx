import React from 'react';
import { PriorityLevel } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterPriority: PriorityLevel | 'all';
  onFilterChange: (priority: PriorityLevel | 'all') => void;
  showCompleted: boolean;
  onToggleCompleted: (show: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  filterPriority,
  onFilterChange,
  showCompleted,
  onToggleCompleted,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
      {/* Search Input */}
      <div className="flex-1 sm:max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/90 text-sm font-medium shadow-sm backdrop-blur-sm"
        />
      </div>

      <div className="flex space-x-3 sm:space-x-4">
        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => onFilterChange(e.target.value as PriorityLevel | 'all')}
          className="flex-1 sm:flex-none px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/90 text-sm font-medium shadow-sm backdrop-blur-sm"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        {/* Show Completed Toggle */}
        <button
          onClick={() => onToggleCompleted(!showCompleted)}
          className={`flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
            showCompleted
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:shadow-md border border-emerald-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md border border-slate-200'
          }`}
        >
          <span className="sm:hidden">{showCompleted ? 'Hide Done' : 'Show Done'}</span>
          <span className="hidden sm:inline">{showCompleted ? 'Hide Completed' : 'Show Completed'}</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;