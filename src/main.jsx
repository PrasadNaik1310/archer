import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Standard path for App in the src folder
import './index.css';       // Core styles including Tailwind and animations

/**
 * Main Entry Point:
 * 
 * This file boots up the React application. 
 * - StrictMode: Enabled to catch lifecycle issues and deprecated APIs.
 * - index.css: Must be imported here to ensure Tailwind and Global Animations 
 *   (like the 'animate-flow-line') are available throughout the app.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);