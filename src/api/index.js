// frontend/src/api/index.js
const API_URL = 'http://localhost:5000'; // Cambia esto a la URL de tu backend

export const notifyStatusChange = async (status) => {
    try {
        const response = await fetch(`${API_URL}/notify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }), // Asegúrate de enviar el 'status' y cualquier otro campo necesario
        });
        return await response.json();
    } catch (error) {
        console.error('Error al notificar el cambio de estado:', error);
    }
};

