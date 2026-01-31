import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);

  // Simple state-based routing for this SPA
  // In a real app, use React Router or similar
  
  if (!hasStarted) {
    return <LandingPage onGetStarted={() => setHasStarted(true)} />;
  }

  return <Dashboard />;
}
