import { useState, useEffect } from 'react';
import Game from './components/Game';
import TestBench from './components/TestBench';
import './styles/theme.css';

// Simple URL-based routing
function getCurrentPath(): string {
  return window.location.pathname;
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  // Listen for URL changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getCurrentPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Re-check path periodically (for manual URL changes)
  useEffect(() => {
    const interval = setInterval(() => {
      const newPath = getCurrentPath();
      if (newPath !== currentPath) {
        setCurrentPath(newPath);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentPath]);

  // Route to appropriate component
  switch (currentPath) {
    case '/test-bench':
    case '/dev':
      return <TestBench />;
    case '/':
    case '/game':
    default:
      return <Game />;
  }
}

export default App;
