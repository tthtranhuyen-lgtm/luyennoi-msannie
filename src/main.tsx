import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

console.log('[HanYu FeiXing] main.tsx running...');

const rootEl = document.getElementById('root');
if (rootEl) {
  try {
    const root = createRoot(rootEl);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    console.log('[HanYu FeiXing] React root rendered successfully.');
  } catch (err: any) {
    console.error('[HanYu FeiXing] Fatal render error:', err);
    const box = document.getElementById('init-error-display');
    if (box) {
      box.style.display = 'block';
      box.textContent += 'Render error: ' + (err?.message || String(err)) + '\n';
    }
  }
} else {
  console.error('[HanYu FeiXing] Element #root not found!');
}
