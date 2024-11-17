import React, { useState, useEffect } from 'react';
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
  const [iesRecords, setIesRecords] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/ies`);
        setIesRecords(response.data);
      } catch (error) {
        console.error('Error al obtener los registros:', error);
      }
    };

    fetchRecords();
  }, [apiUrl]);

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
      const response = await axios.post(`${apiUrl}/api/ies`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Registro creado exitosamente');
      setIesRecords((prev) => [...prev, response.data]); // Agregar el nuevo registro a la lista
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
    <div style={styles.container}>
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

      <div style={styles.records}>
        <h2>Registros IES</h2>
        {iesRecords.map((record, index) => (
          <div key={index} style={styles.recordCard}>
            <p><strong>Nombres:</strong> {record.nombres}</p>
            <p><strong>Apellidos:</strong> {record.apellidos}</p>
            <p><strong>Carrera:</strong> {record.carrera}</p>
            <p><strong>Matrícula:</strong> {record.matricula}</p>
            {record.documentos && (
              <div>
                <strong>Documentos:</strong>
                {record.documentos.map((doc, i) => (
                  <img
                    key={i}
                    src={doc}
                    alt={`Documento ${i + 1}`}
                    style={styles.documentImage}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Estilos básicos
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
  },
  form: {
    flex: 1,
    marginRight: '1rem',
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
  records: {
    flex: 1,
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  recordCard: {
    marginBottom: '1rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  documentImage: {
    maxWidth: '100%',
    maxHeight: '150px',
    display: 'block',
    marginBottom: '0.5rem',
  },
};

export default IESForm;
