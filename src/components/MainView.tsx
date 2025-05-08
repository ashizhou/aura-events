import React from 'react';
import { useUI } from '../context/UIContext';
import { Canvas } from './canvas/Canvas';
import { TaskList } from './tasks/TaskList';
import { BudgetOverview } from './budget/BudgetOverview';
import { VendorList } from './vendors/VendorList';
import { CollaborationHub } from './collaboration/CollaborationHub';

export const MainView: React.FC = () => {
  const { activeView } = useUI();
  
  return (
    <div className="flex-1 h-full overflow-hidden">
      {activeView === 'canvas' && <Canvas />}
      {activeView === 'tasks' && <TaskList />}
      {activeView === 'budget' && <BudgetOverview />}
      {activeView === 'vendors' && <VendorList />}
      {activeView === 'collaboration' && <CollaborationHub />}
    </div>
  );
};