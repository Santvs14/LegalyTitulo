import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa'; // Importa el icono de una flecha moderna
import imagenLogin from '../image/mesy.png'; // Ajusta la ruta según tu estructura de carpetas
import gob from '../image/gob.png';

const VerifyCode = () => {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const apiUrl = process.env.REACT_APP_API_URL;


    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState(''); // Declara el estado para el email

    const [step, setStep] = useState('login'); // 'login', 'verify'
    const [verificationCode, setVerificationCode] = useState('');




    const handleGoBack = () => {
        navigate('/'); // Redirige a la página de bienvenida
    };

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
                navigate('/welcome'); // Redirige a la página de bienvenida

            } else {
                setErrorMessage(data.message || "Código incorrecto o expirado");
            }
        } catch (error) {
            setErrorMessage("Error de conexión con el servidor");
            console.error(error);
        }
    };

    return (
        <PageContainer>
            <ImageContainer>
                <StyledImage src={gob} alt="Imagen de Inicio" />
                <WelcomeText style={{fontSize:25}}>Egresados</WelcomeText>
                <WelcomeText style={{fontSize:16,marginBottom:130}}>Bienvenidos al sistema automatizado de legalización de documentos</WelcomeText>
            </ImageContainer>
            <BackButton onClick={handleGoBack}>
                <FaArrowLeft /> {/* Icono moderno de regresar */}
            </BackButton>
            <LoginContainer>
                <LoginCard>

                    <Title>Verificar Ingreso al Sistema</Title>
                    
                    {step === 'login' && (
                        <Form>
                                  {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

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

                </LoginCard>
            </LoginContainer>
        </PageContainer>
    );
};

// Estilos con styled-components

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;  // Asegura que la página ocupe toda la altura de la ventana
    justify-content: center;
    align-items: center;
    background-color: #f0f4f8;
    padding: 20px;
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #96d5ec;
    width: 90%;
    height: 450px; // Ajustamos la altura del contenedor para que no corte la imagen
    border-radius: 20px;
    margin-bottom: 10px;  // Añadimos espacio debajo de la imagen

    @media (max-width: 768px) {
        height: 300px; // Ajustamos la altura en pantallas pequeñas
        width: 100%;
    }
`;

const StyledImage = styled.img`
    width: 150px; /* Reducimos el tamaño del logo */
    height: 150px; /* Manteniendo la proporción */
    border-radius: 50%; /* Borde circular */
    margin-bottom: -7px; /* Espacio entre la imagen y el texto */
    @media (max-width: 768px) {
        width: 123px; /* Hacemos el logo aún más pequeño en pantallas pequeñas */
        height: 123px;
    }
`;

const WelcomeText = styled.h3`
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-size: 0.8rem;
    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 16px;
  margin-bottom: 15px;
`;

const BackButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #007bff;
    
    &:hover {
        color: #0056b3;
    }
`;

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const LoginCard = styled.div`
    background-color: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h2`
    font-size: 1rem;
    color: #007bff;
    margin-bottom: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Input = styled.input`
    padding: 12px 15px;
    margin-bottom: 15px;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #007bff;
    }
`;

const SubmitButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

export default VerifyCode;

