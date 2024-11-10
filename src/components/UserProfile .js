import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';

// Modal para mostrar la solicitud
const Modal = ({ isOpen, onClose, request }) => {
    if (!isOpen) return null;

    return (
<ModalOverlay>
            <ModalContent>
                <CloseButton onClick={onClose}>Cerrar</CloseButton>
                <h2>Detalles de la Solicitud</h2>
                <p><strong>Estado:</strong> {request.estado}</p>
                <p><strong>Universidad:</strong> {request.universidad}</p>
                <p><strong>Carrera:</strong> {request.carrera}</p>
                <p><strong>Cédula:</strong> {request.cedula}</p>
                <p><strong>Nombre:</strong> {request.nombre} {request.apellido}</p>

                {/* Mostrar mensaje solo si la solicitud está aprobada */}
                {request.estado === 'aprobado' && (
                    <Message className="approved">
                        <p>
                            ¡Felicidades, su solicitud fue aprobada! Revise su correo para tener acceso a su certificación legalizada.
                        </p>
                    </Message>
                )}
            </ModalContent>
        </ModalOverlay>
    );
};

const GlobalStyle = createGlobalStyle`
    body {
        background-color: #333;
        margin: 0;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        min-height: 100vh;
    }
`;

const UserProfile = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Obtener el usuario logueado
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRequest, setUserRequest] = useState(null);
    const [solicitudes, setSolicitudes] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            console.error('El usuario no está disponible.');
            return;
        }
    
        const fetchSolicitudes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/legalization/requests');
                const data = await response.json();
                setSolicitudes(data);
    
                // Filtrar la solicitud del usuario logueado
                const solicitudDelUsuario = data.find(solicitud => solicitud.cedula === user.cedula);
                setUserRequest(solicitudDelUsuario);
    
                if (solicitudDelUsuario) {
                    const estadoSolicitud = solicitudDelUsuario.estado?.toLowerCase().trim(); // Convertir a minúsculas y eliminar espacios
    
                    console.log("Estado de la solicitud:", estadoSolicitud);
    
                    // Mostrar el mensaje solo si el estado es "aprobado"
                    if (estadoSolicitud === 'aprobado') {
                        setMessage('¡Felicidades, su solicitud fue aprobada! Revise su correo para tener acceso a su certificación legalizada.');
                    } else {
                        setMessage(''); // No mostrar mensaje para otros estados
                    }
                } else {
                    setMessage(''); // No mostrar mensaje si no hay solicitud para el usuario
                }
            } catch (error) {
                console.error('Error al obtener las solicitudes:', error);
            }
        };
    
        fetchSolicitudes();
    }, [user]); // Dependencia para volver a ejecutar cuando cambie el usuario
            
    

    const handleGoBack = () => {
        navigate('/welcome');
    };

    const handleEdit = () => {
        navigate('/edit-profile');
    };

    const handleLogout = () => {
        navigate('/logout');
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <BackButton onClick={handleGoBack}>
                    <FaArrowLeft style={{ marginRight: '8px' }} /> Regresar
                </BackButton>
                <Title>Perfil de {user ? `${user.nombre} ${user.apellido}` : 'Cargando...'}</Title>
                <ProfileInfo>
                    <InfoItem><strong>Cédula:</strong> {user ? user.cedula : 'Cargando...'}</InfoItem>
                    <InfoItem><strong>Email:</strong> {user ? user.email : 'Cargando...'}</InfoItem>
                    <InfoItem><strong>Teléfono:</strong> {user ? user.telefono : 'Cargando...'}</InfoItem>
                    <InfoItem><strong>Universidad:</strong> {user ? user.universidad : 'Cargando...'}</InfoItem>
                    <InfoItem><strong>Carrera:</strong> {user ? user.carrera : 'Cargando...'}</InfoItem>
                </ProfileInfo>

                {/* Mostrar el mensaje destacado si la solicitud fue aprobada o rechazada */}
                {message && <Message>{message}</Message>}
            </Container>
            <ButtonContainer>
                <ActionButton onClick={() => setIsModalOpen(true)}>Ver Mi Solicitud</ActionButton>
            </ButtonContainer>

            {/* Modal para mostrar la solicitud */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} request={userRequest} />
        </>
    );
};

export default UserProfile;



// Estilos con styled-components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    background-color: #1a1a1a;
    color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 1000px;
    margin: 20px auto;
    position: relative;
    top: 0;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 24px;
    color: #39a4cb;
`;

const ProfileInfo = styled.div`
    font-size: 1rem;
    width: 100%;
    line-height: 1.8;
`;

const InfoItem = styled.p`
    margin: 8px 0;
    color: #f0f0f0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 8px;
`;

const BackButton = styled.button`
    align-self: flex-start;
    display: flex;
    align-items: center;
    background-color: #39a4cb;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 20px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #2a8fb3;
    }

    svg {
        font-size: 1.2rem;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 50px;
`;

const ActionButton = styled.button`
    background-color: #39a4cb;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: #2a8fb3;
    }
`;

const Message = styled.div`
    margin-top: 20px;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    &.approved {
        background-color: #28a745; /* Verde */
        color: white;
    }

    &.rejected {
        background-color: #28a745; /* Rojo */
        color: white;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    max-width: 600px;
    width: 100%;
    color: #333;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
    background-color: #ff3b3b;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    position: absolute;
    top: 10px;
    right: 10px;

    &:hover {
        background-color: #e02d2d;
    }
`;
