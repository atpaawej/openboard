import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar.js';
import { DashboardView } from './views/DashboardView.js';
import { BoardCanvasView } from './views/BoardCanvasView.js';
import { SettingsView } from './views/SettingsView.js';

export const App: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/board/:id" element={<BoardCanvasView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};
