import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar.js';
import { DashboardView } from './views/DashboardView.js';
import { BoardCanvasView } from './views/BoardCanvasView.js';
import { SettingsView } from './views/SettingsView.js';
import { DocsView } from './views/DocsView.js';
import { ToastProvider } from './components/ui/ToastContext.js';

export const App: React.FC = () => {
  const location = useLocation();
  const isBoardRoute = location.pathname.startsWith('/board/');

  return (
    <ToastProvider>
      <div className={`app-layout ${isBoardRoute ? 'layout-board-mode' : ''}`}>
        {!isBoardRoute && <Sidebar />}
        <main className={`app-main-content ${isBoardRoute ? 'app-main-fullscreen' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/board/:id" element={<BoardCanvasView />} />
            <Route path="/docs" element={<DocsView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </ToastProvider>
  );
};
