// src/utils/notificaciones.js
import axios from 'axios';

export const enviarNotificacionSMS = async (telefono, mensaje) => {
    try {
        const response = await axios.post('http://localhost:5000/api/legalization/notifications', {
            telefono,
            mensaje
        });
        return response.data; // Devuelve la respuesta del servidor si es necesario
    } catch (error) {
        console.error('Error al enviar la notificación SMS:', error.response ? error.response.data : error.message);
    }
};
