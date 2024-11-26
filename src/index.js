import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Importa el UserProvider

import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import AdminRegisterPage from './components/AdminRegisterPage';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import WelcomeAdmin from './components/WelcomeAdmin';
import LegalizationPage from './components/LegalizationPage';
import AdminWelcomePage from './components/AdminWelcomePage'; // Página de bienvenida para administradores
import LoginAdmin from './components/LoginAdmin'; // Página de bienvenida para administradores
import IESForm  from './components/IESForm'; // Página de bienvenida para administradores
import DocumentosIES  from './components/DocumentosIES'; // Página de bienvenida para administradores
import VerifyCode  from './components/VerifyCode'; // Página de bienvenida para administradores
import VerifyCodeAdmin  from './components/VerifyCodeAdmin'; // Página de bienvenida para administradores
import LoginIES  from './components/LoginIES'; // Página de bienvenida para administradores
import VerifyCodeIES  from './components/VerifyCodeIES'; // Página de bienvenida para administradores





import UserProfile from './components/UserProfile '

const root = ReactDOM.createRoot(document.getElementById('root'));

//<Route path="/loginAdmin" element={<LoginAdmin />} />

root.render(
  <React.StrictMode>
    <UserProvider>
    <Router> {/* Asegúrate de usar BrowserRouter aquí */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loginIES" element={<LoginIES />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminRegisterPage />} />
          <Route path="/loginAdmin" element={<LoginAdmin />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/welcomeAdmin" element={<WelcomeAdmin />} />

          <Route path="/verify" element={<VerifyCode />} />
          <Route path="/verifyAdmin" element={<VerifyCodeAdmin />} />
          <Route path="/verifyIES" element={<VerifyCodeIES />} />
          <Route path="/Ies" element={<IESForm />} />
          <Route path="/DocumentosIES" element={<DocumentosIES/>} />
          <Route path="/legalization" element={<LegalizationPage />} />
          <Route path="/admin/welcome" element={<AdminWelcomePage/>} />
          <Route path="/userPerfil" element={<UserProfile/>} />
        </Routes>
      </Router>
    </UserProvider>
  </React.StrictMode>
);

