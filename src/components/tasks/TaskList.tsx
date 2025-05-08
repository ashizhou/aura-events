import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Task } from '../../types';
import { 
  CheckSquare, 
  Square, 
  Calendar, 
  User, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Filter,
  SortAsc,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const { selectedEvent, updateTask, deleteTask } = useEvent();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleComplete = () => {
    if (selectedEvent) {
      updateTask(selectedEvent.id, task.id, {
        completed: !task.completed,
      });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedEvent) {
      deleteTask(selectedEvent.id, task.id);
    }
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const isOverdue = new Date() > task.dueDate && !task.completed;
  
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div
        className={`flex items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
          task.completed ? 'opacity-60' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button
          className="p-1 mr-3 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleComplete();
          }}
        >
          {task.completed ? (
            <CheckSquare size={18} className="text-purple-600" />
          ) : (
            <Square size={18} className="text-gray-400" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h4>
          
          <div className="flex items-center mt-1 space-x-3">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={12} className="mr-1" />
              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                {task.dueDate.toLocaleDateString()}
              </span>
            </div>
            
            <div className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
              {task.priority}
            </div>
          </div>
        </div>
        
        <button
          onClick={(e) => handleDelete(e)}
          className="p-1 text-gray-400 hover:text-red-500 focus:outline-none"
        >
          <X size={16} />
        </button>
        
        <button className="p-1 ml-1 text-gray-400 focus:outline-none">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="px-10 py-3 bg-gray-50 text-sm text-gray-700">
          <p className="mb-2">{task.description}</p>
          
          {task.assignedTo && (
            <div className="flex items-center mt-2">
              <User size={14} className="mr-2 text-gray-500" />
              <span>Assigned to: {task.assignedTo.name}</span>
            </div>
          )}
          
          {task.dependencies.length > 0 && (
            <div className="mt-2">
              <p className="font-medium mb-1">Dependencies:</p>
              <ul className="list-disc pl-5">
                {task.dependencies.map((depId) => {
                  const dependencyTask = selectedEvent?.tasks.find(t => t.id === depId);
                  return (
                    <li key={depId}>{dependencyTask?.title || 'Unknown task'}</li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const TaskList: React.FC = () => {
  const { selectedEvent, addTask } = useEvent();
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium',
  });
  
  if (!selectedEvent) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Select an event to view tasks</p>
      </div>
    );
  }
  
  const handleCreateTask = () => {
    if (selectedEvent && newTask.title) {
      addTask(selectedEvent.id, newTask);
      setNewTask({
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 'medium',
      });
      setIsCreateFormOpen(false);
    }
  };
  
  let filteredTasks = [...selectedEvent.tasks];
  
  // Apply filter
  if (filter === 'completed') {
    filteredTasks = filteredTasks.filter(task => task.completed);
  } else if (filter === 'incomplete') {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  }
  
  // Apply sorting
  filteredTasks.sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else if (sortBy === 'priority') {
      const priorityValue = { 'low': 0, 'medium': 1, 'high': 2 };
      return priorityValue[b.priority] - priorityValue[a.priority];
    } else {
      return a.title.localeCompare(b.title);
    }
  });
  
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsCreateFormOpen(!isCreateFormOpen)}
          >
            New Task
          </Button>
        </div>
        
        {isCreateFormOpen && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium mb-3">Create Task</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateTask}
                  disabled={!newTask.title}
                >
                  Create Task
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter size={14} />}
              className="text-xs"
            >
              {filter === 'all' ? 'All Tasks' : filter === 'completed' ? 'Completed' : 'Incomplete'}
              <ChevronDown size={14} className="ml-1" />
            </Button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 hidden group-hover:block">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setFilter('all')}
              >
                All Tasks
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setFilter('incomplete')}
              >
                Incomplete
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<SortAsc size={14} />}
              className="text-xs"
            >
              Sort: {sortBy === 'dueDate' ? 'Due Date' : sortBy === 'priority' ? 'Priority' : 'Title'}
              <ChevronDown size={14} className="ml-1" />
            </Button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 hidden group-hover:block">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setSortBy('dueDate')}
              >
                Due Date
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setSortBy('priority')}
              >
                Priority
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setSortBy('title')}
              >
                Title
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredTasks.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <Clock className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-gray-500 mb-1">No tasks found</p>
              <p className="text-xs text-gray-400">
                {filter !== 'all' ? 'Try changing your filter' : 'Get started by adding a new task'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        {selectedEvent.tasks.length} task{selectedEvent.tasks.length !== 1 ? 's' : ''} total • 
        {selectedEvent.tasks.filter(t => t.completed).length} completed
      </div>
    </div>
  );
};