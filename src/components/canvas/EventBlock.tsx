import React, { useState } from 'react';
import { Event, EventType } from '../../types';
import { useEvent } from '../../context/EventContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  CheckSquare,
  Store,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/Button';

interface EventBlockProps {
  event: Event;
  onDragStart?: (e: React.MouseEvent) => void;
}

export const EventBlock: React.FC<EventBlockProps> = ({ event, onDragStart }) => {
  const { updateEvent, deleteEvent } = useEvent();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const typeColorMap = {
    [EventType.WEDDING]: 'bg-pink-100 border-pink-300',
    [EventType.CORPORATE]: 'bg-blue-100 border-blue-300',
    [EventType.TRAVEL]: 'bg-teal-100 border-teal-300',
    [EventType.BIRTHDAY]: 'bg-yellow-100 border-yellow-300',
    [EventType.CUSTOM]: 'bg-purple-100 border-purple-300',
  };

  const typeIconColorMap = {
    [EventType.WEDDING]: 'text-pink-500',
    [EventType.CORPORATE]: 'text-blue-500',
    [EventType.TRAVEL]: 'text-teal-500',
    [EventType.BIRTHDAY]: 'text-yellow-500',
    [EventType.CUSTOM]: 'text-purple-500',
  };

  const { x, y } = event.canvasPosition;

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    onDragStart?.(e);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Update event position
    updateEvent(event.id, {
      canvasPosition: {
        ...event.canvasPosition,
        x: newX,
        y: newY,
      },
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDeleteEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEvent(event.id);
    setShowMenu(false);
  };

  const completedTasks = event.tasks.filter(task => task.completed).length;
  const totalTasks = event.tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const startDate = event.startDate.toLocaleDateString(undefined, dateOptions);
  const endDate = event.endDate.toLocaleDateString(undefined, dateOptions);

  return (
    <div
      className={`event-block absolute cursor-grab ${isDragging ? 'cursor-grabbing z-10' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: '300px',
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
    >
      <div
        className={`
          p-4 rounded-lg border-2 shadow-sm transition-all
          ${typeColorMap[event.type]}
          ${isDragging ? 'shadow-lg' : ''}
          ${isHovered ? 'shadow-md' : ''}
        `}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Calendar className={`mr-2 ${typeIconColorMap[event.type]}`} size={18} />
            <h3 className="font-semibold text-gray-800">{event.title}</h3>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal size={16} />
            </Button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  onClick={handleDeleteEvent}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete Event
                </button>
              </div>
            )}
          </div>
        </div>
        
        {event.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <Clock size={14} className="mr-1" />
            <span>{startDate} - {endDate}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-xs text-gray-600">
              <MapPin size={14} className="mr-1" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex flex-col items-center p-2 bg-white bg-opacity-60 rounded">
            <CheckSquare size={14} className="mb-1 text-gray-600" />
            <span className="text-xs font-medium">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-white bg-opacity-60 rounded">
            <Users size={14} className="mb-1 text-gray-600" />
            <span className="text-xs font-medium">
              {event.collaborators.length}
            </span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-white bg-opacity-60 rounded">
            <Store size={14} className="mb-1 text-gray-600" />
            <span className="text-xs font-medium">
              {event.vendors.length}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-600">
            <DollarSign size={14} className="mr-1" />
            <span>${event.budget.spent} / ${event.budget.total}</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-20 h-1.5 bg-gray-200 rounded-full mr-2">
              <div
                className={`h-full rounded-full ${
                  taskProgress > 75 ? 'bg-green-500' : taskProgress > 25 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${taskProgress}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-600">{taskProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};