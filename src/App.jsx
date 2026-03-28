import React from 'react';
import StoryPage from './pages/StoryPage';
import './App.css';

function App() {
  return (
    <div className="h-screen w-full bg-slate-50 overflow-hidden selection:bg-blue-500/20 selection:text-blue-900">
      <StoryPage />
    </div>
  );
}

export default App;