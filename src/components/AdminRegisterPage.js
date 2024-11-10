import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import gob from '../image/gob.png';
const AdminRegisterPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        codigo: '',
        departamento: 'Legalización', // Valor predeterminado
    });

    const navigate = useNavigate(); // Usamos el hook para navegación

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/admins/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                // Redirigir o mostrar un mensaje de éxito
                navigate('/welcomeAdmin'); // Redirigir al panel de bienvenida del admin
            } else {
                console.error(data.message);
                // Manejar errores (ej. mostrar un mensaje de error)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleBack = () => {
        navigate(-1); // Volver a la página anterior
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
            <img style={{width:400, height:230}} src= {gob}/>

                <Title>Registro de Administrador</Title>
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
                    name="codigo"
                    placeholder="Código"
                    onChange={handleChange}
                    required
                />
                <Input
                    type="text"
                    name="departamento"
                    value={formData.departamento}
                    readOnly
                />
                <Button type="submit">Registrar</Button>
                <BackButton type="button" onClick={handleBack}>Volver</BackButton>
            </Form>
        </Container>
    );
};

// Componentes estilizados
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f6f9;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    padding: 30px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
    color: #2c3e50;
`;

const Input = styled.input`
    padding: 12px;
    margin-bottom: 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    transition: border 0.3s ease;

    &:focus {
        border-color: #3498db;
    }
`;

const Button = styled.button`
    padding: 12px;
    background-color: #3498db;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
        background-color: #2980b9;
    }
`;

const BackButton = styled.button`
    padding: 12px;
    background-color: #95a5a6;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
    transition: background 0.3s ease;

    &:hover {
        background-color: #7f8c8d;
    }
`;

export default AdminRegisterPage;
