import React from 'react';
import { useUI } from '../../context/UIContext';
import { useEvent } from '../../context/EventContext';
import { EventType } from '../../types';
import { 
  Calendar, 
  Users, 
  Clock, 
  DollarSign,
  Store,
  PlusCircle,
  Grid 
} from 'lucide-react';
import { Button } from '../ui/Button';

const SidebarItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => {
  return (
    <button
      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors
        ${
          active
            ? 'bg-purple-100 text-purple-800'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, isSidebarOpen } = useUI();
  const { events, selectedEvent, selectEvent, createEvent } = useEvent();

  const handleCreateEvent = () => {
    createEvent({
      title: 'New Event',
      description: '',
      type: EventType.CUSTOM,
    });
  };

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 h-screen flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">EventFlow</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <SidebarItem
          icon={<Grid size={18} />}
          label="Canvas"
          active={activeView === 'canvas'}
          onClick={() => setActiveView('canvas')}
        />
        <SidebarItem
          icon={<Clock size={18} />}
          label="Tasks"
          active={activeView === 'tasks'}
          onClick={() => setActiveView('tasks')}
        />
        <SidebarItem
          icon={<DollarSign size={18} />}
          label="Budget"
          active={activeView === 'budget'}
          onClick={() => setActiveView('budget')}
        />
        <SidebarItem
          icon={<Store size={18} />}
          label="Vendors"
          active={activeView === 'vendors'}
          onClick={() => setActiveView('vendors')}
        />
        <SidebarItem
          icon={<Users size={18} />}
          label="Collaboration"
          active={activeView === 'collaboration'}
          onClick={() => setActiveView('collaboration')}
        />
      </nav>

      <div className="p-4 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 mb-2">MY EVENTS</h2>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {events.map((event) => (
            <button
              key={event.id}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors
                ${
                  selectedEvent?.id === event.id
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => selectEvent(event.id)}
            >
              <div className="flex items-center">
                <Calendar size={14} className="mr-2" />
                <span className="truncate">{event.title}</span>
              </div>
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          leftIcon={<PlusCircle size={16} />}
          className="mt-4 w-full"
          onClick={handleCreateEvent}
        >
          New Event
        </Button>
      </div>
    </aside>
  );
};