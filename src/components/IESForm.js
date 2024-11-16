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
      
      // Agregar los archivos
      for (let i = 0; i < formData.documentos.length; i++) {
        form.append('documentos', formData.documentos[i]);
      }
  
      const response = await fetch(`${apiUrl}/api/ies/create`, {
        method: 'POST',
        body: form,
      });
  
      // Verifica si la respuesta es correcta
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la solicitud:', errorText);
        setMessage('Error al enviar los datos al servidor. Intenta nuevamente.');
        return;
      }
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      setMessage(data.message);
      
      // Limpiar formulario
      setFormData({
        nombres: '',
        apellidos: '',
        carrera: '',
        matricula: '',
        documentos: [],
      });
    } catch (error) {
      console.error('Error en la solicitud:', error);
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
