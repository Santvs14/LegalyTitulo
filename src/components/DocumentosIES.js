import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import mesy from '../image/mesy.png'; // Ajusta la ruta según tu estructura de carpetas
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


    const handleGoBack = () => {
        // Navega a la página anterior
        navigate('/welcomeAdmin'); // Redirige a la página de bienvenida
    };


  return (
    <div style={styles.container}>
                    <header style={styles.banner}>
            <img src={mesy} alt="Logo" style={styles.logo}/>
                <h1 style={styles.title}>Documentos de las IES</h1>
            </header>

            <br></br>
            <br></br>
<br></br>
<br></br>
      <button onClick={handleGoBack} style={styles.backButton}>Regresar</button>

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
                onClick={() => window.open(doc)} // Abre la imagen en nueva pestaña
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

// Estilos básicos
const styles = {
    container: {
      padding: '1rem',
    },
    banner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f0f4f8',
        padding: '10px 20px',
        color: '#FFF',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    logo: {
        width: '93px',
        height: '93px',
        marginRight: '10px',
    },
    title: {
        fontSize: '24px',
        margin: 0,
    },
    solicitudFecha: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '14px',
        color: '#555',
    },

    universityContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      marginTop: '1rem',
    },
    backButton: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#39a4cb',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '3px',
        alignSelf: 'flex-start',  // Esto moverá el botón al extremo izquierdo
        marginTop: 43
    },
    universityCard: {
      padding: '0.5rem', // Reducir el padding
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      cursor: 'pointer',
      flex: '1 1 calc(25% - 1rem)', // Ajustar tamaño a 25% del ancho
      textAlign: 'center',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s',
      maxWidth: '150px', // Limitar el ancho máximo
    },
    universityLogo: {
      width: '60px', // Reducir tamaño del logo
      height: '60px', // Reducir tamaño del logo
      marginBottom: '0.5rem',
    },
    universityName: {
      fontSize: '0.875rem', // Reducir tamaño del texto
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
        width: "100px",
        height: "100px",
        objectFit: "cover",
        margin: "8px 0",
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
