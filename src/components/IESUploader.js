import React, { useState } from 'react';
import axios from 'axios';

const IESUploader = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    carrera: '',
    matricula: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [message, setMessage] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  // Manejar cambios en los campos de entrada
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar la selección de archivos
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage('Por favor, selecciona un archivo para subir.');
      return;
    }

    try {
      // Crear un nuevo registro IES
      //const createResponse = await axios.post('/api/ies/create', formData);
      const createResponse = await axios.post(`${apiUrl}/api/ies`, formData);
       console.log('contenido IES:', createResponse)
      const iesId = createResponse.data.data._id;

      // Configurar FormData para la carga del archivo
      const fileData = new FormData();
      fileData.append('document', selectedFile);

      // Enviar el archivo al backend para procesarlo y subirlo a Cloudinary
      //const uploadResponse = await axios.put(`/api/ies/${iesId}/add-document`, fileData, {
        const uploadResponse = await axios.put(`${apiUrl}/api/ies/${iesId}/documento`, fileData, {

        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedUrls(uploadResponse.data.data.documentos);
      setMessage('Documento subido exitosamente.');
    } catch (error) {
      console.error('Error al subir el documento:', error);
      setMessage('Hubo un error al subir el documento.');
    }
  };

  return (
    <div>
      <h2>Subir Documento IES</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombres:
          <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
        </label>
        <label>
          Apellidos:
          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
        </label>
        <label>
          Carrera:
          <input type="text" name="carrera" value={formData.carrera} onChange={handleChange} required />
        </label>
        <label>
          Matrícula:
          <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />
        </label>
        <label>
          Seleccionar documento:
          <input type="file" onChange={handleFileChange} required />
        </label>
        <button type="submit">Subir Documento</button>
      </form>
      {message && <p>{message}</p>}
      {uploadedUrls.length > 0 && (
        <div>
          <h3>Documentos Subidos</h3>
          {uploadedUrls.map((url, index) => (
            <img key={index} src={url} alt={`Documento ${index + 1}`} style={{ width: '200px', margin: '10px' }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IESUploader;
