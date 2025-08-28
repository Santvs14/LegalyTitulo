import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import imagenLogin from '../image/mesy.png';
import gob from '../image/gob.png';


// Componente principal
const LoginIES = () => {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({ cedula: '', contraseña: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [showLogin, setShowLogin] = useState(false); // Estado para mostrar/ocultar el inicio de sesión

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                login(data.user);
                localStorage.setItem('token', data.token);
                navigate('/verifyIES');
            } else {
                setErrorMessage(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            setErrorMessage('Error de conexión con el servidor');
        }
    };

    const handleGoBack = () => navigate('/');

    return (
        <Container>
            <ContentSection>
                <StyledImage src={gob} alt="Imagen de inicio" />
                <TextContainer>
                    <TitleText>Universidades IES</TitleText>
                    <SubtitleText>
                        Bienvenidos al sistema lotes de egresados
                    </SubtitleText>
                </TextContainer>
                <EnterButton onClick={() => setShowLogin(true)}>
                    Ingresar
                </EnterButton>
            </ContentSection>
            {showLogin && (
                <LoginSection>

                    <LoginCard>
                        <Title>Iniciar Sesión</Title>
                        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                        <LoginForm onSubmit={handleSubmit}>
                            <Input
                                type="text"
                                name="cedula"
                                placeholder="Cédula"
                                value={formData.cedula}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="password"
                                name="contraseña"
                                placeholder="Contraseña"
                                value={formData.contraseña}
                                onChange={handleChange}
                                required
                            />
                            <SubmitButton type="submit">Ingresar</SubmitButton>
                        </LoginForm>
                    </LoginCard>
                </LoginSection>
            )}
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
@media (max-width: 768px) {
        width: 100%;
        padding: 20px;
    }
`;

const StyledImage = styled.img`
    width: 300px;
    height: 200px;
    border-radius: 50%;
    margin-bottom: 20px;
 @media (max-width: 768px) {
        width: 120px;
        height: 120px;
    }
`;

const TextContainer = styled.div`
    text-align: center;
`;

const TitleText = styled.h3`
    color: #333;
    font-size: 2rem;
    margin-bottom: 10px;
@media (max-width: 768px) {
        font-size: 1.6rem;
    }
`;

const SubtitleText = styled.p`
    color: #555;
    font-size: 1.2rem;
@media (max-width: 768px) {
        font-size: 1rem;
    }
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
 @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 10px 20px;
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

 @media (max-width: 768px) {
        width: 90%;
    }
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
 @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

const SubmitButton = styled.button`
    padding: 10px;
    border: none;
    border-radius: 8px;
    background-color: #007bff;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
@media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 8px 16px;
    }
`;

const ErrorMessage = styled.p`
    color: #e74c3c;
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 10px;
`;


export default LoginIES;
