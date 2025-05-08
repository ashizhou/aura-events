import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification, ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UIContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  activeView: 'canvas' | 'tasks' | 'budget' | 'vendors' | 'collaboration';
  setActiveView: (view: 'canvas' | 'tasks' | 'budget' | 'vendors' | 'collaboration') => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (userId: string, content: string) => void;
  isChatOpen: boolean;
  toggleChat: () => void;
  canvasZoom: number;
  setCanvasZoom: (zoom: number) => void;
  canvasPosition: { x: number; y: number };
  setCanvasPosition: (position: { x: number; y: number }) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'canvas' | 'tasks' | 'budget' | 'vendors' | 'collaboration'>('canvas');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: uuidv4(),
      title: 'New task assigned',
      message: 'You have been assigned a new task: Book flights',
      timestamp: new Date(),
      read: false,
      type: 'info',
    },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      userId: uuidv4(),
      content: 'Hi team, let\'s finalize our London itinerary!',
      timestamp: new Date(),
    },
  ]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: uuidv4(),
      ...notification,
      timestamp: new Date(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const addChatMessage = (userId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      userId,
      content,
      timestamp: new Date(),
    };
    setChatMessages([...chatMessages, newMessage]);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <UIContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        activeView,
        setActiveView,
        notifications,
        addNotification,
        markNotificationAsRead,
        removeNotification,
        chatMessages,
        addChatMessage,
        isChatOpen,
        toggleChat,
        canvasZoom,
        setCanvasZoom,
        canvasPosition,
        setCanvasPosition,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};