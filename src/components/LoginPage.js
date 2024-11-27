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
                navigate('/verify');
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
                        <SubmitButton type="submit">Iniciar Sesión</SubmitButton>
                    </Form>
                </LoginCard>
            </LoginContainer>
        </PageContainer>
    );
};

// Estilos con styled-components

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f4f8;
    padding: 1rem;
`;

const BackButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #007bff;
    
    &:hover {
        color: #0056b3;
    }
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 800px;  // Para limitar el ancho en pantallas grandes
    margin-top: 3rem;
    flex-wrap: wrap;
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #96d5ec;
    width: 100%;
    padding: 2rem;
    border-radius: 20px;
    margin-bottom: 2rem;
    
    @media (max-width: 768px) {
        width: 90%;
        margin-bottom: 1rem;
    }
`;

const StyledImage = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        width: 100px;
        height: 100px;
    }
`;

const WelcomeText = styled.h3`
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.3rem;
    
    @media (max-width: 768px) {
        font-size: 1rem;
        margin-bottom: 10px;
    }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 16px;
  margin-bottom: 15px;
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

    @media (max-width: 768px) {
        padding: 20px;
        width: 90%;
    }
`;

const Title = styled.h2`
    font-size: 2rem;
    color: #007bff;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        font-size: 1.6rem;
    }
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

    @media (max-width: 768px) {
        padding: 10px;
        font-size: 0.9rem;
    }
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

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 8px 16px;
    }
`;


export default LoginPage;

