import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import mesy from '../image/gob.png';

const WelcomeAdmin = () => {
  
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Aquí se podría usar un contexto global o prop para obtener el nombre del usuario
  const userName = 'Admin'; // Ejemplo de un nombre de usuario estático o dinámico

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  const handleLogout = () => {
    // Lógica para cierre de sesión (eliminar token, limpiar estado, etc.)
    localStorage.removeItem('token');
    navigate('/loginAdmin'); // Redirigir al login
  };

  const handleSolicitudesClick = () => {
    navigate('/admin/welcome');
  };


  const handleDocumentClick = () => {
    navigate('/DocumentosIES');
  };


  return (
    <Container>
      <Logo src={mesy} alt="Logo del sistema" />

      {/* Menú del usuario */}
      <UserMenu onClick={toggleMenu}>
        {userName} <ArrowDown>&#9660;</ArrowDown>
      </UserMenu>

      {menuOpen && (
        <Dropdown>
          <DropdownItem onClick={handleLogout}>Cerrar sesión</DropdownItem>
        </Dropdown>
      )}

      <Title>Bienvenido al Sistema de recepción</Title>

      <ButtonGroup>
        <ActionButton onClick={handleSolicitudesClick}>Solicitudes</ActionButton>
        <ActionButton onClick={handleDocumentClick}>Documentos IES</ActionButton>

      </ButtonGroup>
    </Container>
  );
};

export default WelcomeAdmin;

// Estilos con styled-components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f5f7;
  color: #333;
  text-align: center;
  position: relative;
`;

const Logo = styled.img`
  width: 453px;
  height: auto;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #333;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
`;

const ActionButton = styled.button`
  padding: 16px 40px;
  font-size: 1.2rem;
  background-color: #39a4cb;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
  
  &:hover {
    transform: scale(1.05);
    background-color: #2c8fa4;
  }
`;

const UserMenu = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  color: #333;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #39a4cb;
  }
`;

const ArrowDown = styled.span`
  font-size: 1rem;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 12px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #f4f4f4;
  }
`;
