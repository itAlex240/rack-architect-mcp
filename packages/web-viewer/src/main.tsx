import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppDashboard } from './components/ui/AppDashboard.js';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <AppDashboard />
    </StrictMode>,
  );
}
