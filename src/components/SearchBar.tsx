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
    <div className="flex items-center space-x-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
        />
      </div>

      {/* Priority Filter */}
      <select
        value={filterPriority}
        onChange={(e) => onFilterChange(e.target.value as PriorityLevel | 'all')}
        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
      >
        <option value="all">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>

      {/* Show Completed Toggle */}
      <button
        onClick={() => onToggleCompleted(!showCompleted)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          showCompleted
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {showCompleted ? 'Hide Completed' : 'Show Completed'}
      </button>
    </div>
  );
};

export default SearchBar;