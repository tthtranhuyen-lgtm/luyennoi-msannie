import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

function renderApp() {
  const rootEl = document.getElementById('root');
  if (rootEl) {
    try {
      const root = createRoot(rootEl);
      root.render(
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      );
      console.log('HanYu FeiXing: App mounted successfully.');
    } catch (err) {
      console.error('HanYu FeiXing: Mount error', err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

