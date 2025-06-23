import React from 'react';
import { PriorityLevel } from '../types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex space-x-3">
        {/* Priority Filter */}
        <Select value={filterPriority} onValueChange={(value) => onFilterChange(value as PriorityLevel | 'all')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>

        {/* Show Completed Toggle */}
        <Button
          variant={showCompleted ? "default" : "outline"}
          onClick={() => onToggleCompleted(!showCompleted)}
          size="sm"
        >
          <span className="sm:hidden">{showCompleted ? 'Hide Done' : 'Show Done'}</span>
          <span className="hidden sm:inline">{showCompleted ? 'Hide Completed' : 'Show Completed'}</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;