import React from 'react';
import ReactDOM from 'react-dom/client';  // Nota el cambio aquí
import App from './App';
import { UserProvider } from './context/UserContext';

import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Usando createRoot

root.render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </UserProvider>, document.getElementById('root'));
