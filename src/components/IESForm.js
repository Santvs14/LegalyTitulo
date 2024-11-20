import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mesy from '../image/mesy.png'; // Ajusta la ruta según tu estructura de carpetas
const IESForm = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    carrera: '',
    matricula: '',
    universidad: '',
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
        universidad: '',
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
            {/* Banner superior */}
            <div style={styles.banner}>
        <img
          src={mesy}// Cambia esta ruta al logo que quieras usar
          alt="Logo"
          style={styles.logo}
        />
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Enviar dato egresado IES</h2>
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

        
                 <select
                    name="carrera"
                    onChange={handleInputChange}
                    value={formData.carrera}
                    required
                    style={styles.input}
                >
                    <option value="">Selecciona la carrera que estudiaste</option>
                    <option value="Doctor en Odontologia">Doctor en Odontologia</option>
                    <option value="Doctor en Medicina">Doctor en Medicina</option>
                    <option value="Doctor en Leyes">Doctor en Leyes</option>
                    <option value="Ingenieria en Sistemas">Ingenieria en Sistemas</option>
                    <option value="Ingenieria Industrial">Ingenieria Industrial</option>
                </select>
                <select
                    name="universidad"
                    onChange={handleInputChange}
                    value={formData.universidad}
                    required
                    style={styles.input}
                >
                    <option value="">Selecciona tu universidad</option>
                    <option value="Universidad Nacioanal(UNPHU)">Universidad Nacioanal(UNPHU)</option>
                    <option value="Universidad Dominicana O&M">Universidad Dominicana O&M</option>
                    <option value="Universidad Católica Santo Domingo(UCSD)">Universidad Católica Santo Domingo(UCSD)</option>
                    <option value="Universidad Católica Madre y Maestra (PUCMM)">Universidad Católica Madre y Maestra (PUCMM)</option>
                    <option value="Universidad Autónoma de Santo Domingo(UASD)">Universidad Autónoma de Santo Domingo(UASD)</option>
                    <option value="Universidad Iberoamericana(UNIBE)">Universidad Iberoamericana(UNIBE)</option>
                    <option value="Universidad APEC">Universidad APEC</option>
                    <option value="Instituto Tecnológico de Santo Domingo(INTEC)">Instituto Tecnológico de Santo Domingo(INTEC)</option>
                    <option value="Universidad Tecnológica de Santiago(UTESA)">Universidad Tecnológica de Santiago(UTESA)</option>
                    <option value="Universidad del Caribe (UNICARIBE)">Universidad del Caribe (UNICARIBE)</option>
                </select>
        


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
        
        <div style={styles.solicitudesCounter}>
                    <span style={{ color: '#000', fontWeight: 'bold',marginRight:5}}>
                        Todos los registros: {iesRecords.length}
                    </span>
                    </div>
        <h2>Registros IES</h2>
        {iesRecords.map((record, index) => (
          <div key={index} style={styles.recordCard}>
            <p><strong>Nombres:</strong> {record.nombres}</p>
            <p><strong>Apellidos:</strong> {record.apellidos}</p>
            <p><strong>Carrera:</strong> {record.carrera}</p>
            <p><strong>Matrícula:</strong> {record.matricula}</p>
            <p><strong>Universidad:</strong> {record.universidad}</p>
            
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
  banner: {
    backgroundColor: '#333',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '73px',
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
  solicitudesCounter: {
    position: 'absolute',
    top: '20px',
    right: '20px',
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
    height: 190
  },
  documentImage: {
    maxWidth: '23%',
    maxHeight: '23px',
    display: 'block',
    marginBottom: '0.5rem',
  },
};

export default IESForm;
