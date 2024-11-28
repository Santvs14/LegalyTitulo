import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa'; // Icono moderno para regresar
import mesy from '../image/mesy.png'; // Asegúrate de colocar la ruta correcta de la imagen

const RegisterPage = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const navigate = useNavigate(); // Inicializar useNavigate
    const [passwordError, setPasswordError] = useState('');
    const [attemptSubmit, setAttemptSubmit] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        cedula: '',
        email: '',
        carrera: '',
        matricula: '',
        universidad: '',
        contraseña: '',
        confirmarContraseña: '',
        telefono: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'contraseña') {
            validatePassword(value);
        }
    };

//Validar contraseña

const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
    if (!regex.test(password)) {
        setPasswordError(
            'La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.'
        );
    } else {
        setPasswordError('');
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAttemptSubmit(true);

        const passwordErrorMsg = validatePassword(formData.contraseña);
        setPasswordError(passwordErrorMsg);
        if (passwordErrorMsg) return;

        console.log("Datos del formulario:", formData);
        console.log("Formulario enviado",passwordErrorMsg);


        try {
            //const response = await fetch('http://localhost:5000/api/users/register', {
                const response = await fetch(`${apiUrl}/api/users/register`, {


                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (response.ok) {
                console.log('Dato del registro:', data.message);
                // Redirigir o mostrar un mensaje de éxito
                navigate('/login')
            } else {
                console.error('Error en los datos del registro:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para regresar a la página principal
    const handleGoBack = () => {
        navigate('/'); // Redirige a la página de inicio
    };

    return (
        <Container>
                        <ImageTopRight src={mesy} alt="Logo Mesy" />

            <BackButton onClick={handleGoBack}>
                <FaArrowLeft /> {/* Icono de regresar */}
            </BackButton>
            <Title>Registro</Title>


            <Form onSubmit={handleSubmit}>
                <Input 
                    type="text" 
                    name="nombre" 
                    placeholder="Nombre" 
                    onChange={handleChange} 
                    required 
                />
                <Input 
                    type="text" 
                    name="apellido" 
                    placeholder="Apellido" 
                    onChange={handleChange} 
                    required 
                />
                <Input 
                    type="text" 
                    name="cedula" 
                    placeholder="Cédula" 
                    onChange={handleChange} 
                    required 
                />
                <Input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    onChange={handleChange} 
                    required 
                />

                <Select
                    name="carrera"
                    onChange={handleChange}
                    value={formData.carrera}
                    required
                >
                    <option value="">Selecciona la carrera que estudiaste</option>
                    <option value="Doctor en Odontologia">Doctor en Odontologia</option>
                    <option value="Doctor en Medicina">Doctor en Medicina</option>
                    <option value="Doctor en Leyes">Doctor en Leyes</option>
                    <option value="Ingenieria en Sistemas">Ingenieria en Sistemas</option>
                    <option value="Ingenieria Industrial">Ingenieria Industrial</option>
                </Select>

                <Input 
                    type="text" 
                    name="matricula" 
                    placeholder="Matricula" 
                    onChange={handleChange} 
                    required 
                />


                <Select
                    name="universidad"
                    onChange={handleChange}
                    value={formData.universidad}
                    required
                >
                    <option value="">Selecciona tu universidad</option>
                    <option value="Universidad Nacioanal(UNPHU)">Universidad Nacioanal(UNPHU)</option>
                    <option value="Universidad Dominicana O&M">Universidad Dominicana O&M</option>
                    <option value="Universidad Católica Santo Domingo(UCSD)">Universidad Católica Santo Domingo(UCSD)</option>
                    <option value="Universidad Católica Madre y Maestra (PUCMM)">Universidad Católica Madre y Maestra (PUCMM)</option>
                    <option value="Universidad Autónoma de Santo Domingo(UASD)">Universidad Autónoma de Santo Domingo(UASD)</option>
                    <option value="Universidad Iberoamericana(UNIBE)">Universidad Iberoamericana(UNIBE)</option>
                    <option value="Universidad APEC">Universidad APEC</option>
                    <option value="Instituto Tecnológico de Santo Domingo(INTEC)">Instituto Tecnológico de Santo Domingo(INTEC)</option>
                    <option value="Universidad Tecnológica de Santiago(UTESA)">Universidad Tecnológica de Santiago(UTESA)</option>
                    <option value="Universidad del Caribe (UNICARIBE)">Universidad del Caribe (UNICARIBE)</option>
                </Select>

                <Input 
                    type="password" 
                    name="contraseña" 
                    placeholder="Contraseña" 
                    onChange={handleChange} 
                    required 
                />
                 {/* Mostrar el error justo debajo del campo de contraseña */}
    {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                <Input 
                    type="password" 
                    name="confirmarContraseña" 
                    placeholder="Confirmar Contraseña" 
                    onChange={handleChange} 
                    required 
                />

                   <Input 
                    type="text" 
                    name="telefono" 
                    placeholder="telefono" 
                    onChange={handleChange} 
                    required 
                />
                <SubmitButton type="submit">Registrar</SubmitButton>
            </Form>
        </Container>
    );
};

// Estilos con styled-components

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f0f4f8;
    padding: 20px;

    @media (max-width: 1024px) {
        padding: 10px;
    }
`;
const ErrorMessage = styled.p`
    color: red;
    font-size: 0.9rem;
    margin-bottom: 10px;
`;
const ImageTopRight = styled.img`
    position: absolute;
    top: 20px;
    right: 20px;
    width: 123px;
    opacity: 0.8;

    @media (max-width: 1024px) {
        width: 100px;
    }
`;

const BackButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: transparent;
    border: none;
    color: #007bff;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
        color: #0056b3;
    }

    @media (max-width: 600px) {
        font-size: 1.2rem;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    
    @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const Title = styled.h2`
    font-size: 2.5rem;
    color: #007bff;
    margin-right: 15px;

    @media (max-width: 600px) {
        font-size: 2rem;
        margin-right: 0;
    }
`;

const Logo = styled.img`
    width: 50px;
    opacity: 0.8;
    margin-top: 10px;

    @media (max-width: 600px) {
        width: 40px;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

    @media (max-width: 600px) {
        max-width: 90%;
        padding: 20px;
    }
`;

const Input = styled.input`
    padding: 12px 15px;
    margin-bottom: 20px;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #007bff;
    }

    @media (max-width: 600px) {
        font-size: 0.9rem;
    }
`;

const Select = styled.select`
    padding: 12px 15px;
    margin-bottom: 20px;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: #007bff;
    }

    @media (max-width: 600px) {
        font-size: 0.9rem;
        padding: 10px;
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

    @media (max-width: 600px) {
        font-size: 0.9rem;
    }
`;

export default RegisterPage;
