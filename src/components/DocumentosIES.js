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
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);  // Número de registros por página
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

  // Lógica para paginación
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={styles.container}>
      <div style={styles.banner}>
        <h2>Documentos de las IES</h2>
      </div>

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
              {currentRecords.length > 0 ? (
                currentRecords.map((record, index) => (
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
                    {/* Agregando documentos */}
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

            {/* Paginación */}
            <div style={styles.pagination}>
              {Array.from({ length: Math.ceil(filteredRecords.length / recordsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  style={styles.pageButton}
                >
                  {i + 1}
                </button>
              ))}
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
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#1a1a1a',
    padding: '10px 20px',
    color: '#FFF',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '80%',
    maxWidth: '900px',
    padding: '1rem',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '5px',
    width: '100%',
    maxHeight: '500px',
    overflowY: 'auto',
    position: 'relative',
  },
  documentImage: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    margin: "8px 0",
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '2rem',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  pageButton: {
    margin: '0 5px',
    padding: '8px 16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  label: {
    marginRight: '10px',
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  recordsContainer: {
    marginTop: '1rem',
  },
  recordCard: {
    border: '1px solid #ddd',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default DocumentosIES;
