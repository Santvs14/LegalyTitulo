import React, { useState } from 'react';
import axios from 'axios';

const IESForm = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    carrera: '',
    matricula: '',
    documentos: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log('servidor en produccion:', apiUrl)
  // Manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar cambios en la selección de archivos
  const handleFileChange = (e) => {
    setFormData({ ...formData, documentos: e.target.files });
  };

  // Enviar formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append('nombres', formData.nombres);
      form.append('apellidos', formData.apellidos);
      form.append('carrera', formData.carrera);
      form.append('matricula', formData.matricula);

      // Agregar los archivos al FormData
      for (let i = 0; i < formData.documentos.length; i++) {
        form.append('documentos', formData.documentos[i]);
      }

      // Enviar datos al backend
     // const response = await axios.post('http://localhost:5000/api/ies/create', form, {
      const response = await axios.post('https://serverlegalyt.onrender.com/ies/create', form,  {

        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('ruta Ies:', response)
      setMessage(response.data.message);
      setFormData({
        nombres: '',
        apellidos: '',
        carrera: '',
        matricula: '',
        documentos: [],
      });
      console.log('contenido del formulario:',setFormData)
    } catch (error) {
      console.error(error);
      setMessage('Error al enviar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Registro IES</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombres</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Carrera</label>
          <input
            type="text"
            name="carrera"
            value={formData.carrera}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Matrícula</label>
          <input
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Documentos</label>
          <input
            type="file"
            name="documentos"
            multiple
            onChange={handleFileChange}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007BFF',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Enviando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default IESForm;
