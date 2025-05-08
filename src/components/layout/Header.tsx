import React, { useState } from 'react';
import {
  Menu,
  Bell,
  MessageSquare,
  Search,
  User,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { Button } from '../ui/Button';
import { useEvent } from '../../context/EventContext';

const SearchInput: React.FC = () => {
  return (
    <div className="relative max-w-md w-full">
      <input
        type="text"
        placeholder="Search events, tasks, or vendors..."
        className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      <Search
        size={18}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      />
    </div>
  );
};

const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
      {count > 9 ? '9+' : count}
    </span>
  );
};

const NotificationItem: React.FC<{
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
}> = ({ title, message, time, type, read }) => {
  const colors = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
  };

  return (
    <div
      className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
        read ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start">
        <div
          className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
            colors[type].split(' ')[0]
          }`}
        ></div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-xs text-gray-600 mt-1">{message}</p>
          <span className="text-xs text-gray-500 mt-1 block">{time}</span>
        </div>
      </div>
    </div>
  );
};

export const Header: React.FC = () => {
  const { toggleSidebar, notifications, isChatOpen, toggleChat } = useUI();
  const { selectedEvent, processNaturalLanguageInput } = useEvent();
  const [showNotifications, setShowNotifications] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiInput.trim()) {
      processNaturalLanguageInput(aiInput);
      setAiInput('');
      setShowAiInput(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <button
          className="p-2 mr-4 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>

        {selectedEvent && (
          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
            {selectedEvent.title}
          </h1>
        )}
      </div>

      <div className="hidden md:block flex-1 mx-8">
        <SearchInput />
      </div>

      <div className="flex items-center space-x-1 md:space-x-3">
        <div className="relative">
          <button
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => setShowAiInput(!showAiInput)}
          >
            <Plus size={20} />
          </button>
          {showAiInput && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
              <form onSubmit={handleAiSubmit}>
                <input
                  type="text"
                  placeholder="Describe your event in plain language..."
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  autoFocus
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!aiInput.trim()}
                  >
                    Create
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <NotificationBadge count={unreadNotifications} />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <button className="text-xs text-purple-600 hover:text-purple-800">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      title={notification.title}
                      message={notification.message}
                      time={notification.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      type={notification.type}
                      read={notification.read}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200">
                  <button className="text-sm text-center w-full text-purple-600 hover:text-purple-800">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 relative"
          onClick={toggleChat}
        >
          <MessageSquare size={20} />
          {!isChatOpen && <NotificationBadge count={2} />}
        </button>

        <div className="relative">
          <button className="flex items-center space-x-2 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <ChevronDown size={16} className="text-gray-600 hidden md:block" />
          </button>
        </div>
      </div>
    </header>
  );
};