import React, { useState, useContext, useEffect } from 'react';
import { Route, Link, Routes, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext'; // Asegúrate de tener este contexto configurado

// Importar las páginas
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import AdminRegisterPage from './components/AdminRegisterPage';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import WelcomeAdmin from './components/WelcomeAdmin';
import LegalizationPage from './components/LegalizationPage';
import AdminWelcomePage from './components/AdminWelcomePage'; // Página de bienvenida para administradores
import LoginAdmin from './components/LoginAdmin'; // Página de bienvenida para administradores
import UserProfile from './components/UserProfile ';

const App = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext); // Usar el contexto para obtener la información del usuario
  
  // Si no hay usuario, redirige al login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div>
      {/* Barra de navegación */}
      

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminRegisterPage />} />
        <Route path="/loginAdmin" element={<LoginAdmin />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/welcomeAdmin" element={<WelcomeAdmin />} />
        <Route path="/legalization" element={<LegalizationPage />} />
        <Route path="/admin/welcome" element={<AdminWelcomePage />} />
        <Route path="/userPerfil" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default App;
