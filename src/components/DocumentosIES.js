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

  // Estilo para las imágenes de los documentos
  const styles = {
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

      <table>
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Carrera</th>
            <th>Matricula</th>
            <th>Universidad</th>
            <th>Documentos</th>
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((record) => (
            <tr key={record.matricula}>
              <td>{record.nombres}</td>
              <td>{record.apellidos}</td>
              <td>{record.carrera}</td>
              <td>{record.matricula}</td>
              <td>{record.universidad}</td>
              <td>
                <strong>Documentos:</strong>
                {Array.isArray(record.documentos) && record.documentos.length > 0 ? (
                  record.documentos.map((doc, i) => (
                    <img
                      key={i}
                      src={doc}
                      alt={`Documento ${i + 1}`}
                      style={styles.documentImage}
                    />
                  ))
                ) : (
                  <span>No hay documentos disponibles</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentosIES;
