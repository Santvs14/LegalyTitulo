import React, { useState, useEffect } from 'react';
import axios from 'axios';
import unphuLogo from '../image/UNPHU.png';
import oymLogo from '../image/oym.jpg';
import ucsdLogo from '../image/UCSD.png';
import pucmmLogo from '../image/PUMM.png';
import uasLogo from '../image/uasd.png';
import unibeLogo from '../image/Unibe.png';
import apecLogo from '../image/UNAPEC.png';
import inteLogo from '../image/INTEC.png';
import utesaLogo from '../image/UTESA.png';
import unicariLogo from '../image/unicaribe.png';

const logos = {
  "Universidad Nacioanal(UNPHU)": unphuLogo,
  "Universidad Dominicana O&M": oymLogo,
  "Universidad Católica Santo Domingo(UCSD)": ucsdLogo,
  "Universidad Católica Madre y Maestra (PUCMM)": pucmmLogo,
  "Universidad Autónoma de Santo Domingo(UASD)": uasLogo,
  "Universidad Iberoamericana(UNIBE)": unibeLogo,
  "Universidad APEC": apecLogo,
  "Instituto Tecnológico de Santo Domingo(INTEC)": inteLogo,
  "Universidad Tecnológica de Santiago(UTESA)": utesaLogo,
  "Universidad del Caribe (UNICARIBE)": unicariLogo,
};

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

  const universities = Array.from(
    new Set(iesRecords.map(record => record.universidad))
  );

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
      {/* Banner superior */}
      <div style={styles.banner}>
        <h2 style={styles.title}>Documentos de las IES</h2>
      </div>

      {/* Botón de regresar */}
      {modalVisible && (
        <button onClick={closeModal} style={styles.backButton}>Regresar</button>
      )}

      <div style={styles.universityContainer}>
        {universities.map((university, index) => (
          <div
            key={index}
            style={styles.universityCard}
            onClick={() => openModal(university)}
          >
            <img
              src={logos[university]}
              alt={university}
              style={styles.universityLogo}
            />
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
                    <div>
                      <strong>Documentos:</strong>
                      {record.documentos && record.documentos.length > 0 ? (
                        record.documentos.map((doc, i) => (
                          <img
                            key={i}
                            src={doc}
                            alt={`Documento ${i + 1}`}
                            style={styles.documentImage}
                          />
                        ))
                      ) : (
                        <p>No hay documentos disponibles.</p>
                      )}
                    </div>
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

const styles = {
  container: {
    padding: '1rem',
  },
  banner: {
    backgroundColor: '#333',
    padding: '1rem',
    textAlign: 'center',
    color: 'white',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
  },
  backButton: {
    backgroundColor: '#add8e6',
    border: 'none',
    padding: '0.5rem 1rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  universityContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
  },
  universityCard: {
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    flex: '1 1 calc(25% - 1rem)',
    textAlign: 'center',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    maxWidth: '150px',
  },
  universityLogo: {
    width: '60px',
    height: '60px',
    marginBottom: '0.5rem',
  },
  universityName: {
    fontSize: '0.875rem',
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
    width: '90%',
    maxHeight: '153%',
    overflowY: 'auto',
    position: 'relative',
  },
  documentImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    margin: '8px 0',
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
    flexDirection: 'column',
    gap: '1rem',
  },
  recordCard: {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default DocumentosIES;
