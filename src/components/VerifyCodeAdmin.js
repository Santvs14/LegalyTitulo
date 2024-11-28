import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import gob from "../image/gob.png";

const VerifyCodeAdmin = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState(''); // Declara el estado para el email

  const [step, setStep] = useState('login'); // 'login', 'verify'
  const [verificationCode, setVerificationCode] = useState('');

  
///////////////////////
const handleSendCode = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMessage("Por favor, introduce un correo electrónico válido.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/send-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.message || "Error desconocido");
            console.error('Error al enviar el código:', data.message);
        } else {
            const data = await response.json();
            console.log('Código de verificación enviado:', data);
            setStep('verify');  // Cambia el paso al formulario de verificación
            setErrorMessage('');
        }
    } catch (error) {
        setErrorMessage("Error de conexión con el servidor");
        console.error('Error de red o conexión:', error);
    }
};


const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
        setErrorMessage("El código de verificación debe tener 6 dígitos.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/verify-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, verificationCode }),
            
        });
        console.log({ email, verificationCode });

        const data = await response.json();
        
        if (response.ok) {
            setStep('login');
            setErrorMessage('');
            navigate("/welcomeAdmin");

        } else {
            setErrorMessage(data.message || "Código incorrecto o expirado");
        }
    } catch (error) {
        setErrorMessage("Error de conexión con el servidor");
        console.error(error);
    }
};







  return (
    <Container>
      <LoginForm>
        <Title>Validar Inicio de Sesión</Title>
        <img style={{ width: 400, height: 230 }} src={gob} alt="Logo" />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        {step === 'login' && (
                        <Form>
                          
                            <Input
                                type="email"
                                placeholder="Correo Electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Usa setEmail para actualizar el estado
                                required
                            />
                            <SubmitButton type="button" onClick={handleSendCode}>
                                Enviar Código
                            </SubmitButton>
                        </Form>
                    )}

                    {step === 'verify' && (
                        <Form>
                            <Input
                                type="text"
                                placeholder="Código de Verificación"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                            <SubmitButton type="button" onClick={handleVerifyCode}>
                                Verificar Código
                            </SubmitButton>
                        </Form>
                    )}
      </LoginForm>
    </Container>
  );
};

export default VerifyCodeAdmin;

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
const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const SubmitButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 12px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
    }
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
