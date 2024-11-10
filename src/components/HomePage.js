import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import miImagen from '../image/gob.png'; // Ajusta la ruta según tu estructura de carpetas
import ban from '../image/ban.png'; // Ajusta la ruta según tu estructura de carpetas

// Contenedor principal
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 93vh;
  background-color: #f0f2f5;
  position: relative;
  padding: 2rem;
    overflow: hidden;

`;

// Caja contenedora central
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 480px;
  text-align: center;
  margin-top: 2rem;
`;

// Título e imagen superior
const TitleContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const ImageTop = styled.img`
  width: 300px;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #01254f;
`;

// Botones estilizados
const StyledButton = styled.button`
  background-color: #01254f;
  color: #fff;
  padding: 0.8rem 2rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.02);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.4);
  }
`;

// Imagen inferior izquierda
const ImageBottomLeft = styled.img`
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 60px;
  opacity: 0.8;
`;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <TitleContainer>
          <ImageTop src={miImagen} alt="Logo Superior" />
          <Title>Sistema de Legalización</Title>
        </TitleContainer>
        <StyledButton onClick={() => navigate('/login')}>Iniciar Sesión</StyledButton>
        <StyledButton onClick={() => navigate('/register')}>Registro</StyledButton>
      </ContentWrapper>
      <ImageBottomLeft src={ban} alt="Logo Inferior Izquierda" />
    </Container>
  );
};

export default HomePage;
