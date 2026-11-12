import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

function mountApp() {
  const rootEl = document.getElementById('root');
  if (rootEl) {
    createRoot(rootEl).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
