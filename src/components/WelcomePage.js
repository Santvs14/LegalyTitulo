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
                    <FaBars size={20} color="#333" />
                    <MenuText style={{color:'#333'}}>Servicios de Legalizado</MenuText>
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
                <Subtitle style={{color:'#333'}}>Bienvenido, {user.nombre} {user.apellido}</Subtitle>
                <ProfileContainer>
                    <ProfileName style={{color:'#333'}}>{user.nombre} {user.apellido}</ProfileName>
                    <ProfileButton style={{color:'#333'}} onClick={handleToggleProfileMenu}>▼</ProfileButton>
                    {showProfileMenu && (
                        <ProfileMenu >
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
    flex-direction: column;
    height: 100vh;
    background-color: #f0f4f8;
    color: #333;

    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const Sidebar = styled.div`
    width: 100%;
    padding: 10px;
    background-color: #d8dddf;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: width 0.3s;

    @media (min-width: 768px) {
        width: 200px;
    }
`;

const MenuButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
`;

const MenuText = styled.span`
    margin-left: 10px;
    font-size: 14px;
`;

const MainContent = styled.div`
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @media (min-width: 768px) {
        align-items: flex-start;
        text-align: left;
    }
`;

const Logo = styled.img`
    width: 150px;
    height: 150px;
    margin-bottom: 20px;

    @media (min-width: 768px) {
        width: 193px;
        height: 193px;
    }
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #39a4cb;

    @media (min-width: 768px) {
        font-size: 36px;
    }
`;

const Subtitle = styled.h2`
    font-size: 18px;
    margin-bottom: 20px;

    @media (min-width: 768px) {
        font-size: 24px;
    }
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
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 768px) {
        position: absolute;
        top: 10px;
        right: 10px;
    }
`;

const ProfileName = styled.span`
    font-size: 18px;
    margin-bottom: 10px;

    @media (min-width: 768px) {
        margin-right: 10px;
    }
`;

const ProfileButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
`;

const ProfileMenu = styled.div`
    margin-top: 10px;
    background-color: #d8dddf;
    border-radius: 5px;
    padding: 10px;
    text-align: center;

    @media (min-width: 768px) {
        position: absolute;
        top: 100%;
        right: 0;
    }
`;

export default WelcomePage;
