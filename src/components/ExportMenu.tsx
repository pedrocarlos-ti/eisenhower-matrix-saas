import React, { useState } from 'react';
import { Task } from '../types';
import { Button } from '@/components/ui/button';

interface ExportMenuProps {
  tasks: Task[];
}

const ExportMenu: React.FC<ExportMenuProps> = ({ tasks }) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    const headers = ['Title', 'Description', 'Priority', 'Quadrant', 'Status', 'Created At', 'Updated At'];
    const csvContent = [
      headers.join(','),
      ...tasks.map(task => [
        `"${task.title.replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        task.priority,
        task.quadrant,
        task.completed ? 'Completed' : 'Active',
        new Date(task.createdAt).toLocaleDateString(),
        new Date(task.updatedAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `priority-matrix-tasks-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsOpen(false);
  };

  const exportToPDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const quadrantNames = {
      'urgent-important': 'Do First (Urgent & Important)',
      'not-urgent-important': 'Schedule (Important, Not Urgent)',
      'urgent-not-important': 'Delegate (Urgent, Not Important)',
      'not-urgent-not-important': 'Eliminate (Neither Urgent nor Important)'
    };

    const groupedTasks = tasks.reduce((acc, task) => {
      if (!acc[task.quadrant]) acc[task.quadrant] = [];
      acc[task.quadrant].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Priority Matrix Export</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1f2937;
              margin: 0 0 10px 0;
              font-size: 2.5rem;
            }
            .header p {
              color: #6b7280;
              margin: 0;
              font-size: 1.1rem;
            }
            .stats {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 20px;
              margin-bottom: 40px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .stat {
              text-align: center;
            }
            .stat-value {
              font-size: 2rem;
              font-weight: bold;
              color: #1f2937;
            }
            .stat-label {
              font-size: 0.9rem;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .quadrant {
              margin-bottom: 40px;
              break-inside: avoid;
            }
            .quadrant-header {
              background: #f3f4f6;
              padding: 15px 20px;
              border-radius: 8px 8px 0 0;
              border-left: 4px solid #6366f1;
            }
            .quadrant-title {
              font-size: 1.25rem;
              font-weight: bold;
              color: #1f2937;
              margin: 0;
            }
            .task {
              padding: 15px 20px;
              border-bottom: 1px solid #e5e7eb;
              background: white;
            }
            .task:last-child {
              border-bottom: none;
              border-radius: 0 0 8px 8px;
            }
            .task-title {
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 5px;
            }
            .task-description {
              color: #6b7280;
              font-size: 0.9rem;
              margin-bottom: 8px;
            }
            .task-meta {
              font-size: 0.8rem;
              color: #9ca3af;
            }
            .priority-high { color: #dc2626; }
            .priority-medium { color: #d97706; }
            .priority-low { color: #059669; }
            .completed { opacity: 0.7; text-decoration: line-through; }
            .empty-quadrant {
              padding: 20px;
              text-align: center;
              color: #9ca3af;
              font-style: italic;
              background: white;
              border-radius: 0 0 8px 8px;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .header h1 { font-size: 2rem; }
              .stat-value { font-size: 1.5rem; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Priority Matrix</h1>
            <p>Task Export - ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-value">${tasks.length}</div>
              <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat">
              <div class="stat-value">${tasks.filter(t => t.completed).length}</div>
              <div class="stat-label">Completed</div>
            </div>
            <div class="stat">
              <div class="stat-value">${tasks.filter(t => !t.completed).length}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat">
              <div class="stat-value">${tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</div>
              <div class="stat-label">Completion Rate</div>
            </div>
          </div>

          ${Object.entries(quadrantNames).map(([quadrant, name]) => `
            <div class="quadrant">
              <div class="quadrant-header">
                <h2 class="quadrant-title">${name}</h2>
              </div>
              ${groupedTasks[quadrant]?.length > 0 ? 
                groupedTasks[quadrant].map(task => `
                  <div class="task ${task.completed ? 'completed' : ''}">
                    <div class="task-title">${task.title}</div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    <div class="task-meta">
                      Priority: <span class="priority-${task.priority}">${task.priority.toUpperCase()}</span> | 
                      Status: ${task.completed ? 'Completed' : 'Active'} | 
                      Created: ${new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                `).join('') :
                '<div class="empty-quadrant">No tasks in this quadrant</div>'
              }
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
    
    setIsOpen(false);
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
        <svg className={`w-3 h-3 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border z-20 overflow-hidden">
            <button
              onClick={exportToCSV}
              className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center space-x-3 border-b"
            >
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <div className="font-medium text-foreground">Export to CSV</div>
                <div className="text-xs text-muted-foreground">Spreadsheet format</div>
              </div>
            </button>
            
            <button
              onClick={exportToPDF}
              className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center space-x-3"
            >
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <div className="font-medium text-foreground">Export to PDF</div>
                <div className="text-xs text-muted-foreground">Print-ready format</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportMenu;