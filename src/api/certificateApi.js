// api/certificateApi.js


export const generarCertificadoApi = async (solicitudId) => {
    try {
        const API_BASE_URL = 'http://localhost:5000';  // Base URL de la API
        console.log("Solicitud ID a enviar:", solicitudId);  // Verifica el ID que se envía
        const apiUrl = process.env.REACT_APP_API_URL;

        //const response = await fetch(`${API_BASE_URL}/certificate/request/${solicitudId}`);
        const response = await fetch(`${apiUrl}/certificate/request/${solicitudId}`)

        console.log("Respuesta de la API:", response);  // Verifica la respuesta

        if (!response.ok) {
            throw new Error('Error al generar el certificado');
        }

        // Extraemos el objeto JSON con la URL del certificado
        const { certificateUrl } = await response.json();
        console.log('Certificado generado en la URL:', certificateUrl);

        // Si la URL está disponible, la devolvemos
        return certificateUrl;




    } catch (error) {
        console.error('Error al generar el certificado:', error);
        alert('Hubo un error al intentar generar el certificado.');
        return null;
    }
};
