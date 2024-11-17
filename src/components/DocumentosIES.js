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


// Imágenes de universidades
const ies = {
    "Universidad Nacioanal(UNPHU)": unphuLogo,
    "Universidad Dominicana O&M": oymLogo,
    "Universidad Católica Santo Domingo(UCSD)": ucsdLogo,
    "Universidad Católica Madre y Maestra (PUCMM)": pucmmLogo,
    "Universidad Autónoma de Santo Domingo(UASD)": uasLogo,
    "Universidad Iberoamericana(UNIBE)": unibeLogo,
    "Universidad APEC": apecLogo,
    "Instituto Tecnológico de Santo Domingo(INTEC)": inteLogo,
    "Universidad Tecnológica de Santiago(UTESA)": utesaLogo,
    "Universidad del Caribe (UNICARIBE)": unicariLogo
};          

const DocumentosIES = () => {
  const [iesRecords, setIesRecords] = useState([]);

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
    logo: {
      maxWidth: '80px', // Tamaño del logo
      marginRight: '10px',
    }
  };

  return (
    <div>
      <h1>Documentos IES</h1>

      {iesRecords.map((record, index) => (
        <div key={index} style={styles.recordCard}>
          <p><strong>Nombres:</strong> {record.nombres}</p>
          <p><strong>Apellidos:</strong> {record.apellidos}</p>
          <p><strong>Carrera:</strong> {record.carrera}</p>
          <p><strong>Matrícula:</strong> {record.matricula}</p>
          <p><strong>Universidad:</strong> {record.universidad}</p>

          {/* Mostrar el logo de la universidad */}
          {ies[record.universidad] && (
            <img
              src={ies[record.universidad]}
              alt={`${record.universidad} logo`}
              style={styles.logo}
            />
          )}

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
