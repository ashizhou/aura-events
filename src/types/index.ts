export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  type: EventType;
  budget: Budget;
  tasks: Task[];
  collaborators: User[];
  vendors: Vendor[];
  canvasPosition: CanvasPosition;
}

export enum EventType {
  WEDDING = 'wedding',
  CORPORATE = 'corporate',
  TRAVEL = 'travel',
  BIRTHDAY = 'birthday',
  CUSTOM = 'custom',
}

export interface Budget {
  id: string;
  total: number;
  spent: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  assignedTo?: User;
  dependencies: string[]; // Task IDs
  priority: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: string;
  contact: string;
  price: number;
  rating: number;
  booked: boolean;
}

export interface CanvasPosition {
  x: number;
  y: number;
  scale: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}