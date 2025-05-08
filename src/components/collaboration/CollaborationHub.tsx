import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { User } from '../../types';
import { 
  Users, 
  UserPlus, 
  Clock, 
  Calendar,
  Mail,
  Trash2,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const CollaborationHub: React.FC = () => {
  const { selectedEvent, addCollaborator, removeCollaborator } = useEvent();
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState<Partial<User>>({
    name: '',
    email: '',
  });
  
  if (!selectedEvent) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Select an event to view collaborators</p>
      </div>
    );
  }
  
  const handleAddCollaborator = () => {
    if (newCollaborator.name && newCollaborator.email) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCollaborator.name,
        email: newCollaborator.email,
      };
      addCollaborator(selectedEvent.id, newUser);
      setNewCollaborator({ name: '', email: '' });
      setIsAddingCollaborator(false);
    }
  };
  
  const handleRemoveCollaborator = (userId: string) => {
    removeCollaborator(selectedEvent.id, userId);
  };
  
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Collaboration Hub</h2>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus size={14} />}
            onClick={() => setIsAddingCollaborator(!isAddingCollaborator)}
          >
            Invite Collaborator
          </Button>
        </div>
        
        {isAddingCollaborator && (
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium mb-3">Invite Collaborator</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newCollaborator.name || ''}
                  onChange={(e) => setNewCollaborator({ ...newCollaborator, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newCollaborator.email || ''}
                  onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingCollaborator(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddCollaborator}
                  disabled={!newCollaborator.name || !newCollaborator.email}
                >
                  Invite
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Team Members</h3>
            
            <div className="space-y-3">
              {selectedEvent.collaborators.length > 0 ? (
                selectedEvent.collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      {collaborator.avatar ? (
                        <img
                          src={collaborator.avatar}
                          alt={collaborator.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="text-lg font-medium text-purple-600">
                            {collaborator.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800">{collaborator.name}</h4>
                        <p className="text-sm text-gray-500">{collaborator.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full focus:outline-none"
                        title="Send email"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full focus:outline-none"
                        title="Remove collaborator"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <Users className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-gray-500 mb-1">No team members yet</p>
                  <p className="text-xs text-gray-400">
                    Invite collaborators to work together
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Activities</h3>
            
            <div className="space-y-3">
              <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Team Meeting</h4>
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    Tomorrow
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock size={14} className="mr-2 text-gray-400" />
                  <span>10:00 AM - 11:00 AM</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={14} className="mr-2 text-gray-400" />
                  <span>All team members</span>
                </div>
              </div>
              
              <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Task Deadline</h4>
                  <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                    In 3 days
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar size={14} className="mr-2 text-gray-400" />
                  <span>Book accommodation</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={14} className="mr-2 text-gray-400" />
                  <span>Assigned to: {selectedEvent.collaborators[0]?.name || 'You'}</span>
                </div>
              </div>
              
              <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Vendor Meeting</h4>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Next week
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock size={14} className="mr-2 text-gray-400" />
                  <span>2:00 PM - 3:00 PM</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={14} className="mr-2 text-gray-400" />
                  <span>You, {selectedEvent.collaborators[1]?.name || 'Team member'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};