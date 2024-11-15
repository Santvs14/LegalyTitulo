import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { FaBars } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import mesy from '../image/mesy.png';

const WelcomePage = () => {
    const { user, logout } = useContext(UserContext);
    const [redirectToProfile, setRedirectToProfile] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    const handleToggleServices = () => setShowServices(!showServices);
    const handleToggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
    const handleViewProfile = () => setRedirectToProfile(true);

    if (redirectToProfile) return <Navigate to="/userPerfil" />;

    return (
        <Container>
            <Sidebar>
                <MenuButton onClick={handleToggleServices}>
                    <FaBars size={20} color="#fff" />
                    <MenuText>Servicios de Legalizado</MenuText>
                </MenuButton>
                {showServices && (
                    <Services>
                        <ServiceButton onClick={() => window.location.href = '/legalization'}>
                            Título
                        </ServiceButton>
                    </Services>
                )}
            </Sidebar>
            <MainContent expanded={showServices}>
                <Logo src={mesy} alt="Logo" />
                <Title>Sistema De Automatización Para La Legalización De Documentos</Title>
                <Subtitle>Bienvenido, {user.nombre} {user.apellido}</Subtitle>
                <ProfileContainer>
                    <ProfileName>{user.nombre} {user.apellido}</ProfileName>
                    <ProfileButton onClick={handleToggleProfileMenu}>▼</ProfileButton>
                    {showProfileMenu && (
                        <ProfileMenu>
                            <ProfileMenuButton onClick={handleViewProfile}>Ver Perfil</ProfileMenuButton>
                            <ProfileMenuButton onClick={handleLogout}>Cerrar Sesión</ProfileMenuButton>
                        </ProfileMenu>
                    )}
                </ProfileContainer>
            </MainContent>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    height: 100vh;
    background-color: #1a1a1a;
    color: #fff;
    font-family: Arial, sans-serif;
`;

const Sidebar = styled.div`
    width: 200px;
    padding: 10px;
    background-color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: width 0.3s;
`;

const MenuButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
`;

const MenuText = styled.span`
    margin-left: 10px;
    color: #fff;
    font-size: 14px;
`;

const MainContent = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    transition: margin-left 0.3s;
    ${({ expanded }) => expanded && `margin-left: 200px;`}
`;

const Logo = styled.img`
    width: 193px;
    height: 193px;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #39a4cb;
`;

const Subtitle = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
`;

const Services = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
`;

const ServiceButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: #444;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #555;
    }
`;

const ProfileContainer = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    align-items: center;
`;

const ProfileName = styled.span`
    margin-right: 10px;
    font-size: 18px;
    color: #fff;
`;

const ProfileButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #fff;
`;

const ProfileMenu = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #333;
    border-radius: 5px;
    padding: 10px 0;
    z-index: 1000;
`;

const ProfileMenuButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    &:hover {
        background-color: #444;
    }
`;

export default WelcomePage;
