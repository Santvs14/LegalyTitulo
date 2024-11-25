import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa'; // Importa el icono de una flecha moderna
import imagenLogin from '../image/mesy.png'; // Ajusta la ruta según tu estructura de carpetas

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({ cedula: '', contraseña: '' });
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState(''); // Declara el estado para el email

    const [step, setStep] = useState('login'); // 'login', 'verify'
    const [verificationCode, setVerificationCode] = useState('');


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            //const response = await fetch('http://localhost:5000/api/users/login', {
                const response = await fetch(`${apiUrl}/api/users/login`, {


                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify(formData),
            });

            const data = await response.json();
        
            if (response.ok) {
                console.log('Autenticación exitosa:', data);
                login(data.user);
            // Si las credenciales son correctas, guarda el token y redirige al dashboard

                localStorage.setItem("token", data.token);
                navigate('/welcome');
            } else {
                setErrorMessage(data.message || "Credenciales incorrectas");
                console.error('Error de autenticación:', data.message);
            }
        } catch (error) {
            setErrorMessage("Error de conexión con el servidor");
            console.error('Error:', error);
        }
    };

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
    
            const data = await response.json();
            
            if (response.ok) {
                console.log('Código de verificación enviado:', data);
                setStep('verify');  // Cambia el paso al formulario de verificación
                setErrorMessage('');
            } else {
                setErrorMessage(data.message || "Error al enviar el código");
            }
        } catch (error) {
            setErrorMessage("Error de conexión con el servidor");
            console.error(error);
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
    
            const data = await response.json();
            if (response.ok) {
                setStep('login');
                setErrorMessage('');
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
                <StyledImage src={imagenLogin} alt="Imagen de Inicio" />
                <WelcomeText style={{fontSize:33}}>Egresados</WelcomeText>
                <WelcomeText style={{fontSize:23,marginBottom:133}}>Bienvenidos al sistema automatizado de legalización de documentos</WelcomeText>
            </ImageContainer>
            <BackButton onClick={handleGoBack}>
                <FaArrowLeft /> {/* Icono moderno de regresar */}
            </BackButton>
            <LoginContainer>
                <LoginCard>
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <Title>Iniciar Sesión</Title>
                    
                    {step === 'login' && (
                        <Form onSubmit={handleSubmit}>
                            <Input 
                                type="text" 
                                name="cedula" 
                                placeholder="Cédula" 
                                onChange={handleChange} 
                                required 
                            />
                            <Input 
                                type="password" 
                                name="contraseña" 
                                placeholder="Contraseña" 
                                onChange={handleChange} 
                                required 
                            />
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
    height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: #f0f4f8;
`;

// Contenedor para la imagen a la izquierda
const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #96d5ec;
    width: 80%;
    height: 530px;
    border-radius: 20px;
    margin-right: 3px; /* Espacio entre la imagen y el formulario */
    margin-left: 53px;
`;

// Estilo de la imagen dentro del contenedor azul
const StyledImage = styled.img`
    width: 250px;
    height: 250px;
    border-radius: 50%; /* Borde circular */
    margin-bottom: 20px; /* Eleva la imagen */
`;

// Texto de bienvenida debajo de la imagen
const WelcomeText = styled.h3`
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.3rem;
`;
const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 16px;
  margin-bottom: 15px;
`;

// Botón de regresar con un icono moderno
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

// Contenedor del formulario de inicio de sesión a la derecha
const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    
`;

// Tarjeta de inicio de sesión
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

// Título de la tarjeta
const Title = styled.h2`
    font-size: 2rem;
    color: #007bff;
    margin-bottom: 20px;
`;

// Formulario estilizado
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

// Botón de envío estilizado
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

export default LoginPage;

