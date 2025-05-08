import React from 'react';
import { EventProvider } from './context/EventContext';
import { UIProvider } from './context/UIContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MainView } from './components/MainView';
import { ChatPanel } from './components/collaboration/ChatPanel';

function App() {
  return (
    <EventProvider>
      <UIProvider>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <MainView />
          </div>
          <ChatPanel />
        </div>
      </UIProvider>
    </EventProvider>
  );
}

export default App;