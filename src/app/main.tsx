import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { store } from './store';
import { HomePage } from '@/pages/home';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HomePage />
    </Provider>
  </StrictMode>,
);
