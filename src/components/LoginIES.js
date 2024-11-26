import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import imagenLogin from '../image/mesy.png';

const LoginIES = () => {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({ cedula: '', contraseña: '' });
    const [errorMessage, setErrorMessage] = useState('');

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
                navigate('/verify');
            } else {
                setErrorMessage(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            setErrorMessage('Error de conexión con el servidor');
        }
    };

    const handleGoBack = () => navigate('/');

    return (
        <PageContainer>
            <ImageSection>
                <StyledImage src={imagenLogin} alt="Imagen de Inicio" />
                <WelcomeText fontSize={33}>Universidades IES</WelcomeText>
                <WelcomeText fontSize={23} marginBottom={133}>
                    Bienvenidos al sistema automatizado de archivos de egresados
                </WelcomeText>
            </ImageSection>
            <BackButton onClick={handleGoBack}>
                <FaArrowLeft />
            </BackButton>
            <FormSection>
                <LoginCard>
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <Title>Iniciar Sesión</Title>
                    <LoginForm onSubmit={handleSubmit}>
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
                        <SubmitButton type="submit">Iniciar Sesión</SubmitButton>
                    </LoginForm>
                </LoginCard>
            </FormSection>
        </PageContainer>
    );
};

// Styled-components

const PageContainer = styled.div`
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
    position: relative;
`;

const ImageSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #d0e7f9;
    width: 50%;
    border-radius: 16px;
    padding: 20px;
`;

const StyledImage = styled.img`
    width: 220px;
    height: 220px;
    border-radius: 50%;
    margin-bottom: 20px;
`;

const WelcomeText = styled.h3`
    color: #333;
    text-align: center;
    margin-bottom: ${({ marginBottom }) => marginBottom || '20px'}px;
    font-size: ${({ fontSize }) => fontSize || '1.3rem'}px;
`;

const BackButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: #007bff;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
        color: #0056b3;
    }
`;

const FormSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40%;
`;

const LoginCard = styled.div`
    background: #fff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h2`
    font-size: 2rem;
    color: #007bff;
    text-align: center;
    margin-bottom: 20px;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    padding: 12px;
    margin-bottom: 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

const SubmitButton = styled.button`
    background: #007bff;
    color: white;
    padding: 12px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

const ErrorMessage = styled.p`
    color: #e74c3c;
    font-size: 0.9rem;
    margin-bottom: 15px;
    text-align: center;
`;

export default LoginIES;
