// client/src/components/IESForm.js
import React, { useState } from 'react';
import axios from 'axios';

const IESForm = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    carrera: '',
    matricula: '',
  });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const data = new FormData();

    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    Array.from(files).forEach((file) => data.append('documentos', file));

    try {
      //const response = await axios.post('http://localhost:5000/api/ies', data, {
        const response = await axios.post(`${apiUrl}/api/ies`, data, {  
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Registro creado exitosamente');
      console.log(response.data);
      // Opcional: limpiar el formulario
      setFormData({
        nombres: '',
        apellidos: '',
        carrera: '',
        matricula: '',
      });
      setFiles([]);
    } catch (error) {
      console.error('Error al enviar el formulario:', error.response?.data || error.message);
      setMessage(error.response?.data?.error || 'Error al crear el registro');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Crear Registro IES</h2>
      {message && <p>{message}</p>}
      <label style={styles.label}>
        Nombres:
        <input
          type="text"
          name="nombres"
          value={formData.nombres}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Apellidos:
        <input
          type="text"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Carrera:
        <input
          type="text"
          name="carrera"
          value={formData.carrera}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Matrícula:
        <input
          type="text"
          name="matricula"
          value={formData.matricula}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Documentos:
        <input
          type="file"
          name="documentos"
          multiple
          onChange={handleFileChange}
          accept="image/*"
          required
          style={styles.input}
        />
      </label>
      <button type="submit" disabled={uploading} style={styles.button}>
        {uploading ? 'Subiendo...' : 'Enviar'}
      </button>
    </form>
  );
};

// Opcional: estilos básicos
const styles = {
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.25rem',
    marginBottom: '1rem',
    borderRadius: '3px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '3px',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default IESForm;
