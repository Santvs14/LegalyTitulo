import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Usar useNavigate en lugar de useHistory

const DocumentosIES = () => {
  const [iesRecords, setIesRecords] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  
  // Usando useNavigate para regresar a la página anterior
  const navigate = useNavigate();

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
    setSelectedCareer(''); // Reset the career filter when university changes
    if (university) {
      const filteredByUniversity = iesRecords.filter(record => record.universidad === university);
      setFilteredRecords(filteredByUniversity);
    } else {
      setFilteredRecords([]);
    }
  };

  const handleCareerChange = (event) => {
    const career = event.target.value;
    setSelectedCareer(career);
    if (career) {
      const filteredByCareer = filteredRecords.filter(record => record.carrera === career);
      setFilteredRecords(filteredByCareer);
    } else {
      handleUniversityChange({ target: { value: selectedUniversity } }); // Reapply university filter
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
    setSelectedUniversity('');
    setSelectedCareer('');
  };

  // Function to go back to the previous page
  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Extract unique universities and careers
  const universities = Array.from(new Set(iesRecords.map(record => record.universidad)));
  const careers = selectedUniversity ? Array.from(new Set(filteredRecords.map(record => record.carrera))) : [];

  return (
    <div style={styles.container}>
      <button
        onClick={handleGoBack}
        style={styles.backButton}
      >
        Regresar
      </button>
      <h2>Ver Registros IES por Universidad y Carrera</h2>
      <label style={styles.label}>
        Seleccionar Universidad:
        <select
          value={selectedUniversity}
          onChange={handleUniversityChange}
          style={styles.select}
        >
          <option value="">Seleccione una universidad</option>
          {universities.map((university, index) => (
            <option key={index} value={university}>{university}</option>
          ))}
        </select>
      </label>

      {selectedUniversity && (
        <label style={styles.label}>
          Seleccionar Carrera:
          <select
            value={selectedCareer}
            onChange={handleCareerChange}
            style={styles.select}
          >
            <option value="">Seleccione una carrera</option>
            {careers.map((career, index) => (
              <option key={index} value={career}>{career}</option>
            ))}
          </select>
        </label>
      )}

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
            <h2>Registros de {selectedUniversity} {selectedCareer && ` - Carrera: ${selectedCareer}`}</h2>
            <div style={styles.recordsContainer}>
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
                <p>No se encontraron registros para esta universidad y carrera.</p>
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
    position: 'relative',
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
  backButton: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '3px',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly darker background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '5px',
    width: '95%',
    height: '95%',
    overflowY: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  recordsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '1rem',
    overflowY: 'auto',
    height: '90%',
    padding: '1rem',
  },
  recordCard: {
    width: 'calc(33.33% - 1rem)',
    boxSizing: 'border-box',
    marginBottom: '1rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
  },
  documentImage: {
    maxWidth: '100%',
    maxHeight: '120px',
    display: 'block',
    marginBottom: '0.5rem',
  },
};

export default DocumentosIES;
