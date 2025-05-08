import React, { useState, useRef, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useEvent } from '../../context/EventContext';
import { X, Send, Paperclip, User, Smile } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const { chatMessages, addChatMessage, isChatOpen, toggleChat } = useUI();
  const { selectedEvent } = useEvent();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedEvent) {
      // Use the first collaborator as the sender for the demo
      const senderId = selectedEvent.collaborators[0]?.id || 'user-1';
      addChatMessage(senderId, message.trim());
      setMessage('');
    }
  };
  
  if (!isChatOpen) return null;
  
  return (
    <div className="fixed bottom-0 right-4 w-80 flex flex-col rounded-t-lg shadow-lg border border-gray-200 bg-white z-20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-purple-600 text-white rounded-t-lg">
        <h3 className="font-medium truncate">
          {selectedEvent ? `${selectedEvent.title} Chat` : 'Chat'}
        </h3>
        <button
          className="p-1 text-white hover:bg-purple-700 rounded focus:outline-none"
          onClick={toggleChat}
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-96 p-4 space-y-4">
        {chatMessages.map((msg) => {
          const user = selectedEvent?.collaborators.find((u) => u.id === msg.userId);
          const isOwnMessage = user && user.id === selectedEvent?.collaborators[0]?.id;
          
          return (
            <div
              key={msg.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              {!isOwnMessage && (
                <div className="flex-shrink-0 mr-2">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={14} className="text-gray-600" />
                    </div>
                  )}
                </div>
              )}
              
              <div className={`max-w-[70%]`}>
                {!isOwnMessage && (
                  <div className="text-xs text-gray-500 mb-1">{user?.name || 'Unknown user'}</div>
                )}
                <div
                  className={`px-3 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    isOwnMessage ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Paperclip size={16} />
          </button>
          
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Smile size={16} />
          </button>
          
          <button
            type="submit"
            className={`p-2 rounded-lg focus:outline-none ${
              message.trim()
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!message.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};