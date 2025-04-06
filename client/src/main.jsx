import { createRoot } from 'react-dom/client'; // Import createRoot
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Store from './store';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Now this works

root.render(
  <StrictMode>
    <Provider store={Store}> {/* Use lowercase 'store' (React is case-sensitive) */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

