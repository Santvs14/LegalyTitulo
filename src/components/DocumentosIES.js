import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentosIES = () => {
  const [universidad, setUniversidad] = useState(''); // Filtro por universidad
  const [registros, setRegistros] = useState([]); // Datos de las IES
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // Función para obtener los registros de las IES
  const fetchRegistros = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ies'); // Ajusta el endpoint según tu backend
      setRegistros(response.data);
    } catch (err) {
      setError('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  // Llamada inicial para cargar los datos
  useEffect(() => {
    fetchRegistros();
  }, []);

  // Filtrar registros por universidad
  const registrosFiltrados = universidad
    ? registros.filter((registro) => registro.universidad === universidad)
    : registros;

  return (
    <div>
      <h1>Documentos de IES</h1>

      {/* Campo para seleccionar la universidad */}
      <div>
        <label htmlFor="universidad">Filtrar por universidad:</label>
        <input
          type="text"
          id="universidad"
          value={universidad}
          onChange={(e) => setUniversidad(e.target.value)}
          placeholder="Escribe el nombre de la universidad"
        />
      </div>

      {/* Mostrar mensaje de carga */}
      {loading && <p>Cargando registros...</p>}

      {/* Mostrar mensaje de error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar los registros */}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Carrera</th>
              <th>Matrícula</th>
              <th>Universidad</th>
              <th>Documentos</th>
            </tr>
          </thead>
          <tbody>
  {registrosFiltrados.map((registro) => (
    <tr key={registro.matricula}>
      <td>{registro.nombres}</td>
      <td>{registro.apellidos}</td>
      <td>{registro.carrera}</td>
      <td>{registro.matricula}</td>
      <td>{registro.universidad}</td>
      <td>
        {registro.documentos.length > 0 ? (
          registro.documentos.map((doc, index) => (
            <a key={index} href={doc} target="_blank" rel="noopener noreferrer">
              Documento {index + 1}
            </a>
          ))
        ) : (
          <span>No hay documentos</span>
        )}
      </td>
    </tr>
  ))}
</tbody>


        </table>
      )}

      {/* Mostrar mensaje si no hay registros */}
      {!loading && !error && registrosFiltrados.length === 0 && (
        <p>No se encontraron registros para esta universidad.</p>
      )}
    </div>
  );
};

export default DocumentosIES;
