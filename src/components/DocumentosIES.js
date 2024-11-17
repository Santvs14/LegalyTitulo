import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentosIES = () => {
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

  return (
    <div style={styles.records}>
      <div style={styles.solicitudesCounter}>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>
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
  );
};

// Estilos básicos
const styles = {
  solicitudesCounter: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
  records: {
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
    maxWidth: '70%',
    maxHeight: '70px',
    display: 'block',
    marginBottom: '0.5rem',
  },
};

export default DocumentosIES;
