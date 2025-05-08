import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, Task, User, Vendor, EventType, Budget, BudgetCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface EventContextType {
  events: Event[];
  selectedEvent: Event | null;
  createEvent: (event: Partial<Event>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  selectEvent: (id: string) => void;
  addTask: (eventId: string, task: Partial<Task>) => void;
  updateTask: (eventId: string, taskId: string, task: Partial<Task>) => void;
  deleteTask: (eventId: string, taskId: string) => void;
  addCollaborator: (eventId: string, user: User) => void;
  removeCollaborator: (eventId: string, userId: string) => void;
  addVendor: (eventId: string, vendor: Partial<Vendor>) => void;
  updateVendor: (eventId: string, vendorId: string, vendor: Partial<Vendor>) => void;
  removeVendor: (eventId: string, vendorId: string) => void;
  updateBudget: (eventId: string, budget: Partial<Budget>) => void;
  addBudgetCategory: (eventId: string, category: Partial<BudgetCategory>) => void;
  updateBudgetCategory: (eventId: string, categoryId: string, category: Partial<BudgetCategory>) => void;
  removeBudgetCategory: (eventId: string, categoryId: string) => void;
  processNaturalLanguageInput: (input: string) => void;
}

const initialEvents: Event[] = [
  {
    id: uuidv4(),
    title: 'Weekend in London',
    description: 'A fun weekend trip with friends',
    startDate: new Date(2025, 5, 10),
    endDate: new Date(2025, 5, 12),
    location: 'London, UK',
    type: EventType.TRAVEL,
    budget: {
      id: uuidv4(),
      total: 1500,
      spent: 500,
      categories: [
        {
          id: uuidv4(),
          name: 'Accommodation',
          allocated: 600,
          spent: 300,
        },
        {
          id: uuidv4(),
          name: 'Transportation',
          allocated: 400,
          spent: 200,
        },
        {
          id: uuidv4(),
          name: 'Activities',
          allocated: 300,
          spent: 0,
        },
        {
          id: uuidv4(),
          name: 'Food',
          allocated: 200,
          spent: 0,
        },
      ],
    },
    tasks: [
      {
        id: uuidv4(),
        title: 'Book flights',
        description: 'Find and book return flights to London',
        dueDate: new Date(2025, 4, 15),
        completed: true,
        priority: 'high',
        dependencies: [],
      },
      {
        id: uuidv4(),
        title: 'Book hotel',
        description: 'Book hotel near city center',
        dueDate: new Date(2025, 4, 20),
        completed: false,
        priority: 'high',
        dependencies: [],
      },
      {
        id: uuidv4(),
        title: 'Plan activities',
        description: 'Research and plan activities for the weekend',
        dueDate: new Date(2025, 5, 1),
        completed: false,
        priority: 'medium',
        dependencies: [],
      },
    ],
    collaborators: [
      {
        id: uuidv4(),
        name: 'Alex Johnson',
        email: 'alex@example.com',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2',
      },
      {
        id: uuidv4(),
        name: 'Sam Taylor',
        email: 'sam@example.com',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2',
      },
    ],
    vendors: [
      {
        id: uuidv4(),
        name: 'London Tours',
        type: 'Tour Guide',
        contact: 'info@londontours.com',
        price: 200,
        rating: 4.5,
        booked: false,
      },
    ],
    canvasPosition: {
      x: 100,
      y: 100,
      scale: 1,
    },
  },
];

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(initialEvents[0]);

  const createEvent = (event: Partial<Event>) => {
    const newEvent: Event = {
      id: uuidv4(),
      title: event.title || 'New Event',
      description: event.description || '',
      startDate: event.startDate || new Date(),
      endDate: event.endDate || new Date(),
      location: event.location || '',
      type: event.type || EventType.CUSTOM,
      budget: event.budget || {
        id: uuidv4(),
        total: 0,
        spent: 0,
        categories: [],
      },
      tasks: event.tasks || [],
      collaborators: event.collaborators || [],
      vendors: event.vendors || [],
      canvasPosition: event.canvasPosition || {
        x: 100,
        y: 100,
        scale: 1,
      },
    };
    setEvents([...events, newEvent]);
    setSelectedEvent(newEvent);
  };

  const updateEvent = (id: string, event: Partial<Event>) => {
    setEvents(
      events.map((e) => (e.id === id ? { ...e, ...event } : e))
    );
    if (selectedEvent?.id === id) {
      setSelectedEvent({ ...selectedEvent, ...event });
    }
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    if (selectedEvent?.id === id) {
      setSelectedEvent(events.length > 1 ? events.find((e) => e.id !== id) || null : null);
    }
  };

  const selectEvent = (id: string) => {
    const event = events.find((e) => e.id === id) || null;
    setSelectedEvent(event);
  };

  // Task management
  const addTask = (eventId: string, task: Partial<Task>) => {
    const newTask: Task = {
      id: uuidv4(),
      title: task.title || 'New Task',
      description: task.description || '',
      dueDate: task.dueDate || new Date(),
      completed: task.completed || false,
      assignedTo: task.assignedTo,
      dependencies: task.dependencies || [],
      priority: task.priority || 'medium',
    };

    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, tasks: [...e.tasks, newTask] } : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        tasks: [...selectedEvent.tasks, newTask],
      });
    }
  };

  const updateTask = (eventId: string, taskId: string, task: Partial<Task>) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              tasks: e.tasks.map((t) =>
                t.id === taskId ? { ...t, ...task } : t
              ),
            }
          : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        tasks: selectedEvent.tasks.map((t) =>
          t.id === taskId ? { ...t, ...task } : t
        ),
      });
    }
  };

  const deleteTask = (eventId: string, taskId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? { ...e, tasks: e.tasks.filter((t) => t.id !== taskId) }
          : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        tasks: selectedEvent.tasks.filter((t) => t.id !== taskId),
      });
    }
  };

  // Collaborator management
  const addCollaborator = (eventId: string, user: User) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? { ...e, collaborators: [...e.collaborators, user] }
          : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        collaborators: [...selectedEvent.collaborators, user],
      });
    }
  };

  const removeCollaborator = (eventId: string, userId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              collaborators: e.collaborators.filter((c) => c.id !== userId),
            }
          : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        collaborators: selectedEvent.collaborators.filter(
          (c) => c.id !== userId
        ),
      });
    }
  };

  // Vendor management
  const addVendor = (eventId: string, vendor: Partial<Vendor>) => {
    const newVendor: Vendor = {
      id: uuidv4(),
      name: vendor.name || 'New Vendor',
      type: vendor.type || '',
      contact: vendor.contact || '',
      price: vendor.price || 0,
      rating: vendor.rating || 0,
      booked: vendor.booked || false,
    };

    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, vendors: [...e.vendors, newVendor] } : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        vendors: [...selectedEvent.vendors, newVendor],
      });
    }
  };

  const updateVendor = (
    eventId: string,
    vendorId: string,
    vendor: Partial<Vendor>
  ) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              vendors: e.vendors.map((v) =>
                v.id === vendorId ? { ...v, ...vendor } : v
              ),
            }
          : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        vendors: selectedEvent.vendors.map((v) =>
          v.id === vendorId ? { ...v, ...vendor } : v
        ),
      });
    }
  };

  const removeVendor = (eventId: string, vendorId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? { ...e, vendors: e.vendors.filter((v) => v.id !== vendorId) }
          : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        vendors: selectedEvent.vendors.filter((v) => v.id !== vendorId),
      });
    }
  };

  // Budget management
  const updateBudget = (eventId: string, budget: Partial<Budget>) => {
    setEvents(
      events.map((e) =>
        e.id === eventId ? { ...e, budget: { ...e.budget, ...budget } } : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        budget: { ...selectedEvent.budget, ...budget },
      });
    }
  };

  const addBudgetCategory = (
    eventId: string,
    category: Partial<BudgetCategory>
  ) => {
    const newCategory: BudgetCategory = {
      id: uuidv4(),
      name: category.name || 'New Category',
      allocated: category.allocated || 0,
      spent: category.spent || 0,
    };

    setEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              budget: {
                ...e.budget,
                categories: [...e.budget.categories, newCategory],
              },
            }
          : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        budget: {
          ...selectedEvent.budget,
          categories: [...selectedEvent.budget.categories, newCategory],
        },
      });
    }
  };

  const updateBudgetCategory = (
    eventId: string,
    categoryId: string,
    category: Partial<BudgetCategory>
  ) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              budget: {
                ...e.budget,
                categories: e.budget.categories.map((c) =>
                  c.id === categoryId ? { ...c, ...category } : c
                ),
              },
            }
          : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        budget: {
          ...selectedEvent.budget,
          categories: selectedEvent.budget.categories.map((c) =>
            c.id === categoryId ? { ...c, ...category } : c
          ),
        },
      });
    }
  };

  const removeBudgetCategory = (eventId: string, categoryId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              budget: {
                ...e.budget,
                categories: e.budget.categories.filter(
                  (c) => c.id !== categoryId
                ),
              },
            }
          : e
      )
    );

    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        budget: {
          ...selectedEvent.budget,
          categories: selectedEvent.budget.categories.filter(
            (c) => c.id !== categoryId
          ),
        },
      });
    }
  };

  // AI functionality (simplified for the MVP)
  const processNaturalLanguageInput = (input: string) => {
    // For MVP just create a simple event based on the input
    if (input.toLowerCase().includes('weekend in')) {
      const location = input.split('weekend in ')[1].split(' ')[0];
      
      createEvent({
        title: `Weekend in ${location}`,
        description: input,
        type: EventType.TRAVEL,
        startDate: new Date(new Date().setDate(new Date().getDate() + 14)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 16)),
        location: location,
        tasks: [
          {
            id: uuidv4(),
            title: 'Book accommodation',
            description: `Find and book accommodation in ${location}`,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
            completed: false,
            priority: 'high',
            dependencies: [],
          },
          {
            id: uuidv4(),
            title: 'Plan transportation',
            description: `Research transportation options to ${location}`,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            completed: false,
            priority: 'high',
            dependencies: [],
          },
        ],
      });
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        selectedEvent,
        createEvent,
        updateEvent,
        deleteEvent,
        selectEvent,
        addTask,
        updateTask,
        deleteTask,
        addCollaborator,
        removeCollaborator,
        addVendor,
        updateVendor,
        removeVendor,
        updateBudget,
        addBudgetCategory,
        updateBudgetCategory,
        removeBudgetCategory,
        processNaturalLanguageInput,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};