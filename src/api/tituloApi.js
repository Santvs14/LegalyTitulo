// src/api/tituloApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/titulos';

// Función para obtener todos los títulos
export const getTitulos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener los títulos: ' + error.message);
    }
};

// Función para crear un nuevo título
export const createTitulo = async (tituloData) => {
    try {
        const response = await axios.post(API_URL, tituloData);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear el título: ' + error.message);
    }

    
};


