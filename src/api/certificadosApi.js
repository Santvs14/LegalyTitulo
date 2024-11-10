const API_URL = 'http://localhost:5000/api';  // URL del backend

// Función para obtener la URL del certificado usando el solicitudId
export const obtenerCertificadoUrl = async (solicitudId) => {
    try {
        const response = await fetch(`${API_URL}/certificado/${solicitudId}`);
        
        // Si la respuesta es exitosa, extraemos la URL del certificado
        const data = await response.json();

        if (response.ok) {
            return data.archivoCertificado;
        } else {
            throw new Error(data.message || 'Error al obtener el certificado.');
        }
    } catch (error) {
        console.error('Error al obtener la URL del certificado:', error);
        return null;  // Devuelve null si hubo un error
    }
};
