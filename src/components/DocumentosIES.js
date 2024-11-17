import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentosIES = () => {
  const [iesRecords, setIesRecords] = useState([]);
  const [universidad, setUniversidad] = useState('');

  // Obtener los registros desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/ies'); // Ajusta la URL a tu ruta de API
        setIesRecords(response.data);
      } catch (error) {
        console.error('Error al obtener los registros:', error);
      }
    };

    fetchData();
  }, []);

  // Filtrar registros por universidad
  const registrosFiltrados = universidad
    ? iesRecords.filter((record) => record.universidad === universidad)
    : iesRecords;

  // Estilo para las tarjetas y las imágenes
  const styles = {
    recordCard: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
    },
    documentImage: {
      maxWidth: '100px', // Tamaño máximo de las imágenes
      margin: '5px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
  };

  return (
    <div>
      <h1>Documentos IES</h1>
      <div>
        <label htmlFor="universidad">Filtrar por Universidad:</label>
        <select
          id="universidad"
          value={universidad}
          onChange={(e) => setUniversidad(e.target.value)}
        >
          <option value="">Selecciona una universidad</option>
          {Array.from(new Set(iesRecords.map((record) => record.universidad))).map(
            (uni, index) => (
              <option key={index} value={uni}>
                {uni}
              </option>
            )
          )}
        </select>
      </div>

      {registrosFiltrados.map((record, index) => (
        <div key={index} style={styles.recordCard}>
          <p><strong>Nombres:</strong> {record.nombres}</p>
          <p><strong>Apellidos:</strong> {record.apellidos}</p>
          <p><strong>Carrera:</strong> {record.carrera}</p>
          <p><strong>Matrícula:</strong> {record.matricula}</p>
          <p><strong>Universidad:</strong> {record.universidad}</p>
          {record.documentos && record.documentos.length > 0 && (
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

export default DocumentosIES;
