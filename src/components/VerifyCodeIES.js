import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import imagenLogin from '../image/mesy.png';

// Componente principal
const VerifyCodeIES = () => {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({ cedula: '', contraseña: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [showLogin, setShowLogin] = useState(false); // Estado para mostrar/ocultar el inicio de sesión
    const [email, setEmail] = useState(''); // Declara el estado para el email

    const [step, setStep] = useState('login'); // 'login', 'verify'
    const [verificationCode, setVerificationCode] = useState('');

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                navigate('/Ies'); // Redirige a la página de bienvenida

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
            <ContentSection>
                <StyledImage src={imagenLogin} alt="Imagen de inicio" />
                <TextContainer>
                    <TitleText>Universidades IES</TitleText>
                    <SubtitleText>
                        Bienvenidos al sistema lotes de egresados
                    </SubtitleText>
                </TextContainer>

            </ContentSection>

                <LoginSection>

                    <LoginCard>
                        <Title>Verificar Inicio de Sesión</Title>
                        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                        <LoginForm >
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
                    </LoginCard>
                </LoginSection>
            
        </Container>
    );
};

// Estilos con styled-components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f7fa;
    padding: 20px;
`;

const ContentSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #d0e7f9;
    width: 70%;
    border-radius: 16px;
    padding: 40px;
    margin-bottom: 30px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
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


const StyledImage = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-bottom: 20px;
`;

const TextContainer = styled.div`
    text-align: center;
`;

const TitleText = styled.h3`
    color: #333;
    font-size: 2rem;
    margin-bottom: 10px;
`;

const SubtitleText = styled.p`
    color: #555;
    font-size: 1.2rem;
`;

const EnterButton = styled.button`
    padding: 12px 24px;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const LoginSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const BackButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background: transparent;
    border: none;
    color: #007bff;
    font-size: 1.5rem;
    cursor: pointer;

    &:hover {
        color: #0056b3;
    }
`;

const LoginCard = styled.div`
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 23%;
    margin: 0 auto; /* Centrado */

`;

const Title = styled.h2`
    color: #007bff;
    text-align: center;
    margin-bottom: 20px;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;



const ErrorMessage = styled.p`
    color: #e74c3c;
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 10px;
`;

export default VerifyCodeIES;
