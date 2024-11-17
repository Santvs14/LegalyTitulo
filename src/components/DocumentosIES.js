import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentosIES = () => {
  const [iesRecords, setIesRecords] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
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

  const handleUniversityChange = (event) => {
    const university = event.target.value;
    setSelectedUniversity(university);
    if (university) {
      const filtered = iesRecords.filter(record => record.universidad === university);
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords([]);
    }
  };

  const handleOpenModal = () => {
    if (selectedUniversity) {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setFilteredRecords([]);
  };

  return (
    <div style={styles.container}>
      <h2>Ver Registros IES por Universidad</h2>
      <label style={styles.label}>
        Seleccionar Universidad:
        <select
          value={selectedUniversity}
          onChange={handleUniversityChange}
          style={styles.select}
        >
          <option value="">Seleccione una universidad</option>
          {Array.from(new Set(iesRecords.map(record => record.universidad)))
            .map((university, index) => (
              <option key={index} value={university}>{university}</option>
            ))}
        </select>
      </label>

      <button
        onClick={handleOpenModal}
        disabled={!selectedUniversity}
        style={styles.button}
      >
        Ver Registros
      </button>

      {modalVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <span onClick={handleCloseModal} style={styles.closeButton}>&times;</span>
            <h2>Registros de {selectedUniversity}</h2>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
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
              ))
            ) : (
              <p>No se encontraron registros para esta universidad.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos básicos
const styles = {
  container: {
    padding: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
  },
  select: {
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
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '5px',
    maxWidth: '80%',
    overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
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
