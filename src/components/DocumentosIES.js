import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentosIES = () => {
  const [iesRecords, setIesRecords] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState('');
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

  const openModal = (university) => {
    setSelectedUniversity(university);
    setFilteredRecords(
      iesRecords.filter(record => record.universidad === university)
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedUniversity(null);
    setSelectedCareer('');
    setFilteredRecords([]);
    setModalVisible(false);
  };

  const handleCareerChange = (event) => {
    const career = event.target.value;
    setSelectedCareer(career);

    if (career) {
      setFilteredRecords(
        iesRecords.filter(
          record =>
            record.universidad === selectedUniversity && record.carrera === career
        )
      );
    } else {
      setFilteredRecords(
        iesRecords.filter(record => record.universidad === selectedUniversity)
      );
    }
  };

  // Obtener universidades únicas
  const universities = Array.from(
    new Set(iesRecords.map(record => record.universidad))
  );

  // Obtener carreras únicas dentro de la universidad seleccionada
  const careers = selectedUniversity
    ? Array.from(
        new Set(
          iesRecords
            .filter(record => record.universidad === selectedUniversity)
            .map(record => record.carrera)
        )
      )
    : [];

  return (
    <div style={styles.container}>
      <h2>Universidades</h2>
      <div style={styles.universityContainer}>
        {universities.map((university, index) => (
          <div
            key={index}
            style={styles.universityCard}
            onClick={() => openModal(university)}
          >
            <p style={styles.universityName}>{university}</p>
          </div>
        ))}
      </div>

      {modalVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <span onClick={closeModal} style={styles.closeButton}>
              &times;
            </span>
            <h2>Registros de {selectedUniversity}</h2>
            <label style={styles.label}>
              Filtrar por Carrera:
              <select
                value={selectedCareer}
                onChange={handleCareerChange}
                style={styles.select}
              >
                <option value="">Todas las carreras</option>
                {careers.map((career, index) => (
                  <option key={index} value={career}>
                    {career}
                  </option>
                ))}
              </select>
            </label>
            <div style={styles.recordsContainer}>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <div key={index} style={styles.recordCard}>
                    <p>
                      <strong>Nombres:</strong> {record.nombres}
                    </p>
                    <p>
                      <strong>Apellidos:</strong> {record.apellidos}
                    </p>
                    <p>
                      <strong>Carrera:</strong> {record.carrera}
                    </p>
                    <p>
                      <strong>Matrícula:</strong> {record.matricula}
                    </p>
                  </div>
                ))
              ) : (
                <p>No se encontraron registros para esta universidad.</p>
              )}
            </div>
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
  universityContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
  },
  universityCard: {
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    flex: '1 1 calc(33.33% - 1rem)',
    textAlign: 'center',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
  },
  universityCardHover: {
    transform: 'scale(1.05)',
  },
  universityName: {
    fontSize: '1.2rem',
    color: '#333',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '5px',
    width: '80%',
    maxHeight: '90%',
    overflowY: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  label: {
    display: 'block',
    marginBottom: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.25rem',
    marginBottom: '1rem',
    borderRadius: '3px',
    border: '1px solid #ccc',
  },
  recordsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
  },
  recordCard: {
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    flex: '1 1 calc(33.33% - 1rem)',
    boxSizing: 'border-box',
  },
};

export default DocumentosIES;
