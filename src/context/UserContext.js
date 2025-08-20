// context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

// Crea el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    
    // Cargar usuario desde localStorage al inicio
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parseando user de localStorage:", e);
                localStorage.removeItem('user');
            }
        }
    }, []);
    console.log('Cargar user:', user)

    // Función para iniciar sesión
    const login = (userData) => {
        if (!userData || !userData.adminId) {
            console.error("El userData que intentas guardar no tiene adminId:", userData);
        }
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };
    console.log('disponibilidad user 1:', user)

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Elimina el usuario de localStorage
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
