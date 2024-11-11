import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import gob from "../image/gob.png";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log('piUrl--Backend produccion', apiUrl)
  
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const response = await fetch("http://localhost:5000/api/admins/login", {
        const response = await fetch(`${apiUrl}/api/admins/login`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, codigo }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si las credenciales son correctas, guarda el token y redirige al dashboard
        localStorage.setItem("token", data.token);
        navigate("/welcomeAdmin");
      } else {
        setErrorMessage(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      setErrorMessage("Error de conexión con el servidor");
    }
  };

  // Función para manejar la redirección al registro
  const handleRegister = () => {
    navigate("/admin");
  };

  return (
    <Container>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Inicio de Sesión</Title>
        <img style={{ width: 400, height: 230 }} src={gob} alt="Logo" />

        <InputContainer>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </InputContainer>
        <InputContainer>
          <Label htmlFor="codigo">Código</Label>
          <Input
            type="password"
            id="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
        </InputContainer>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Button type="submit">Iniciar Sesión</Button>
        <RegisterButton type="button" onClick={handleRegister}>
          Registrarse
        </RegisterButton>
      </LoginForm>
    </Container>
  );
};

export default LoginAdmin;

// Estilos con styled-components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

`;

const LoginForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 3, 0, 0.5);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: #2c3e50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Sombra para mejorar la visibilidad sobre el fondo */
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  color: #34495e;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;
  transition: border 0.3s ease;

  &:focus {
    border-color: #3498db;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 15px;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  font-size: 16px;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s ease;

  &:hover {
    background: #2980b9;
  }
`;

const RegisterButton = styled.button`
  background: #27ae60;
  color: white;
  font-size: 16px;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
  transition: background 0.3s ease;

  &:hover {
    background: #2ecc71;
  }
`;
