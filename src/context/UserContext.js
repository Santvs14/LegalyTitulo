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
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Función para iniciar sesión
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Guarda el usuario en localStorage
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
       // localStorage.removeItem('user'); // Elimina el usuario de localStorage
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
