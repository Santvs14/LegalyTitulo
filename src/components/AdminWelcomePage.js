//AdminWelcomePage
import React, { useEffect, useState, useRef,useContext } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FaPen } from 'react-icons/fa';
import mesy from '../image/mesy.png'; // Ajusta la ruta según tu estructura de carpetas
import axios from 'axios';
import { UserContext } from '../context/UserContext'; // Asegúrate de tener el contexto de usuario
import { useNavigate } from 'react-router-dom';
import { generarCertificadoApi } from '../api/certificateApi';

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






const AdminWelcomePage = () => {
    const { user } = useContext(UserContext); // Obtén el usuario del contexto
    const navigate = useNavigate();
console.log('disponibilidad user 2:', user)

const apiUrl = process.env.REACT_APP_API_URL;

    const [solicitudes, setSolicitudes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const solicitudesPorPagina = 4;
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [signature, setSignature] = useState(null);
    const [isSigning, setIsSigning] = useState(false);
    const signaturePadRef = useRef(null);


    const [contadorSolicitudes, setContadorSolicitudes] = useState(0);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [showUniversityModal, setShowUniversityModal] = useState(false);
    const [showDocumentosIESModal, setShowDocumentosIESModal] = useState(false);
    const [iesRecords, setIesRecords] = useState([]);
    const [relatedRecord, setRelatedRecord] = useState(null);
  

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                //const response = await fetch('http://localhost:5000/api/legalization/requests');
                const response = await fetch(`${apiUrl}/api/legalization/requests`);

                           // Imprimir los encabezados para verificar CORS
               console.log('Response Headers:', response.headers);

                
                const data = await response.json();
                setSolicitudes(data);
                setContadorSolicitudes(data.length); // Actualizar el contador

                console.log('FechSolicitudes:',data)
                
            } catch (error) {
                console.error('Error al obtener las solicitudes:', error);
            }
        };

        fetchSolicitudes();
    }, []);

    const handleSolicitudClick = async (solicitud) => {
        setSelectedSolicitud(solicitud);
        if (solicitud.estado === "pendiente") {
            try {
                //const response = await fetch(`http://localhost:5000/api/legalization/requests/${solicitud._id}`, {
                    const response = await fetch(`${apiUrl}/api/legalization/requests/${solicitud._id}`, {

               method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },


                    body: JSON.stringify({ estado: "revisión" })
                });
    
                if (response.ok) {
                    setSelectedSolicitud({ ...solicitud, estado: "revisión" });
                 // Obtener el email del usuario relacionado con la solicitud
                 const userEmail = solicitud.email; 
                 console.log('Email del usuario:', userEmail);
 
                 // Envía la notificación al usuario a través del endpoint
                 //const notifyResponse = await fetch('http://localhost:5000/notify', {
                    const notifyResponse = await fetch(`${apiUrl}/notify`,{


                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },


                     body: JSON.stringify({ email: userEmail, estado: "revisión" })
                 });
 
                 if (!notifyResponse.ok) {
                     throw new Error('Error al enviar notificación');
                 }
             } else {
                 console.error('Error al actualizar el estado:', response.statusText);
             }
         } catch (error) {
             console.error('Error al actualizar el estado:', error);
         }
     }
        // Aquí debes cargar la firma de la solicitud
      //  setSignature(solicitud.firma); // Cargar la firma existente
    };
    

    const handleCloseSolicitudModal = () => {
        setSelectedSolicitud(null);
        setSignature(null);
        setIsSigning(false);
    };

    const clearSignature = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
        setSignature(null);
    };

    const saveSignature = async () => {
        if (signaturePadRef.current) {
          const dataUrl = signaturePadRef.current.getTrimmedCanvas().toDataURL();
          setSignature(dataUrl);
          setIsSigning(false);
          console.log('disponibilidad user 3:', user)

          console.log("Usuario en saveSignature:", user);

      
          try {
            //const response = await axios.post('http://localhost:5000/api/legalization/save-signature', {
                const response = await axios.post(`${apiUrl}/api/legalization/save-signature`,{

              
              firmaDataUrl: dataUrl,
              solicitudId: selectedSolicitud._id,
              adminId: user?.adminId, // Asegúrate de que el ID del admin esté disponible en el contexto del usuario
            });
      
            if (response.status === 201) {
              setSelectedSolicitud({ ...selectedSolicitud, estado: "verificado" });
            // Obtener el email del usuario relacionado con la solicitud
            const userEmail = selectedSolicitud.email;
            console.log('Email del usuario:', userEmail);

            // Envía la notificación al usuario a través del endpoint
            //const notifyResponse = await fetch('http://localhost:5000/notify', {
                const notifyResponse = await fetch(`${apiUrl}/notify`,{

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },


                body: JSON.stringify({ email: userEmail, estado: "verificado" })
            });

            if (!notifyResponse.ok) {
                throw new Error('Error al enviar notificación');
            }
        } else {
            console.error('Error al guardar la firma en la colección:', response.statusText);
        }
    } catch (error) {
        console.error('Error al guardar la firma en la colección:', error);
    }
        }
      };
      
    

    

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

// Nueva función para generar el certificado
const generarCerti = async (solicitudId) => {
    try {
        // Llama a la API para generar el certificado y obtener la URL
        const certificateUrl = await generarCertificadoApi(solicitudId);
        console.log('Certificado generado en Cloudinary en el frontend:', certificateUrl);

        if (certificateUrl) {
            // Abrir el PDF en una nueva pestaña
            window.open(certificateUrl, '_blank');
            alert(`Certificado generado: ${certificateUrl}`);
        }
    } catch (error) {
        console.error('Error al generar el certificado:', error);
        alert('Hubo un error al intentar abrir el certificado.');
    }
};



    const handleAprobar = async () => {
        if (selectedSolicitud) {
            try {
                const solicitudId = selectedSolicitud._id;
    
                console.log('Aprobando la solicitud con ID:', solicitudId);
    
                // 1. Actualizar el estado de la solicitud a "aprobada"
                //const response = await fetch(`http://localhost:5000/api/legalization/requests/${solicitudId}`, {
                    const response = await fetch(`${apiUrl}/api/legalization/requests/${solicitudId}`, {


                method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },


                    body: JSON.stringify({ estado: "aprobada" })
                });
                
    
                const responseData = await response.json();
                console.log('Respuesta del servidor al actualizar:', responseData);
    
                if (!response.ok) {
                    throw new Error(`Error al aprobar la solicitud: ${responseData.message || response.statusText}`);
                }
    
                console.log('Estado de la solicitud actualizado:', responseData);
   
                      /////////////////////////////////////////////////////////////////
                // 2. Actualizar el estado local de la solicitud
                setSelectedSolicitud({ ...selectedSolicitud, estado: "aprobada" });
                alert("Solicitud aprobada y certificado generado.");
    
                // 3. Obtener el email del usuario relacionado con la solicitud
                const userEmail = selectedSolicitud.email; 
                console.log('Email del usuario:', userEmail);
    
                // 4. Enviar la notificación al usuario a través del endpoint


                //const notifyResponse = await fetch('http://localhost:5000/notify', {
                    const notifyResponse = await fetch(`${apiUrl}/notify`,{


                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },


                    body: JSON.stringify({ 
                        email: userEmail, 
                        estado: "aprobado",


 

                    })
                    
                });
               
                const notifyResponseData = await notifyResponse.json();
                console.log('Respuesta del servidor al enviar notificación:', notifyResponseData);

                if (!notifyResponse.ok) {
                    throw new Error(`Error al enviar notificación: ${notifyResponseData.message || notifyResponse.statusText}`);
                } else {
                    console.log('Notificación enviada con éxito:', notifyResponseData);
                }
    
            } catch (error) {
                console.error('Error al procesar la solicitud:', error.message);
                alert('Hubo un error al procesar la solicitud. Por favor, intenta de nuevo.');
            } finally {
                handleCloseSolicitudModal(); // Cierra el modal independientemente del resultado
            }
        } else {
            console.error('No hay ninguna solicitud seleccionada para aprobar.');
        }
    };
    
    
    
    
    const handleDeclinar = async () => {
        if (selectedSolicitud) {
            try {
                const solicitudId = selectedSolicitud._id;
                //const response = await fetch(`http://localhost:5000/api/legalization/requests/${solicitudId}`, {
                    const response = await fetch(`${apiUrl}/api/legalization/requests/${solicitudId}`, {


                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },


                    body: JSON.stringify({ estado: "rechazada" })
                });
    
                if (!response.ok) {
                    throw new Error('Error al declinar la solicitud');
                }
    
                
    
                // Actualiza el estado local de la solicitud
                setSelectedSolicitud({ ...selectedSolicitud, estado: "rechazada" });
                alert("No cumple con los términos de legalización.");
                 // Obtener el email del usuario relacionado con la solicitud
            const userEmail = selectedSolicitud.email; 
            console.log('Email del usuario:', userEmail);

            // Envía la notificación al usuario a través del endpoint
            //const notifyResponse = await fetch('http://localhost:5000/notify', {
                const notifyResponse = await fetch(`${apiUrl}/notify`,{


                method: 'POST',
                headers: { 'Content-Type': 'application/json' },


                body: JSON.stringify({ email: userEmail, estado: "rechazada" })
            });

            if (!notifyResponse.ok) {
                throw new Error('Error al enviar notificación');
            }
        } catch (error) {
                console.error('Error al actualizar el estado:', error);
            }
            
            handleCloseSolicitudModal(); // Cierra el modal
        }
    };
    

    const indexOfLastSolicitud = currentPage * solicitudesPorPagina;
    const indexOfFirstSolicitud = indexOfLastSolicitud - solicitudesPorPagina;
    const currentSolicitudes = solicitudes.slice(indexOfFirstSolicitud, indexOfLastSolicitud);
    const totalPages = Math.ceil(solicitudes.length / solicitudesPorPagina);

        const getCardColor = (estado) => {
            switch (estado) {
                case "aprobada":
                    return '#94e097'; // Verde claro
                case "rechazada":
                    return '#ea6a6a'; // Rosado claro
                default:
                    return '#FFF'; // Blanco por defecto
            }
        };
    
        const handleGoBack = () => {
            // Navega a la página anterior
            navigate('/welcomeAdmin'); // Redirige a la página de bienvenida
        };


    // Agrupamos las solicitudes por universidad
// Lógica para obtener universidades únicas
const universidades = [...new Set(solicitudes.map(solicitud => solicitud.universidad))];
console.log('Universidades:',universidades)

// Lógica para mostrar el modal de universidad
const handleUniversityClick = (university) => {
    // Normalizar el valor de university para evitar problemas con espacios o capitalización inconsistente
    const normalizedUniversity = university.trim(); // Eliminar espacios extra
    console.log("Universidad seleccionada:", normalizedUniversity);  // Verifica el valor

    // Asignar el valor normalizado a selectedUniversity
    setSelectedUniversity(normalizedUniversity);
    setShowUniversityModal(true);
};

const handleCloseUniversityModal = () => {
    setSelectedUniversity(null);
    setShowUniversityModal(false);
};

// Verificar qué universidades están presentes en las solicitudes
solicitudes.forEach(solicitud => {
    console.log("Universidad de solicitud:", solicitud.universidad);
});

// Agrupa las solicitudes por universidad
const solicitudesPorUniversidad = solicitudes.reduce((acc, solicitud) => {
    if (!acc[solicitud.universidad]) acc[solicitud.universidad] = [];
    acc[solicitud.universidad].push(solicitud);
    return acc;
}, {});
console.log(solicitudesPorUniversidad);




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
    "Universidad del Caribe (UNICARIBE)": unicariLogo
};          

//Datos del documentoIES
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

    // Función para buscar el registro relacionado con la matrícula
  const handleOpenModal = () => {
    const record = iesRecords.find((rec) => rec.matricula === selectedSolicitud.matricula);
    setRelatedRecord(record);
    setShowDocumentosIESModal(true);
  };

    return (
        <div style={styles.container}>
            <header style={styles.banner}>
            <img src={mesy} alt="Logo" style={styles.logo}/>
                <h1 style={styles.title}>Recepción de solicitudes</h1>
            </header>


                {/* Contador de solicitudes */}
                <div style={styles.solicitudesCounter}>
                    <span style={{ color: '#333', fontWeight: 'bold' }}>
                        Todas las solicitudes: {solicitudes.length}
                    </span>
                </div>
            <br></br>
            <br></br>
            <br></br>


            <button onClick={handleGoBack} style={styles.backButton}>Regresar</button>



            {currentSolicitudes.length > 0 ? (
                
                <div style={styles.cardContainer}>
                    {currentSolicitudes.map((solicitud) => (
                        <div
                        key={solicitud._id}
                        style={{ ...styles.card, background: getCardColor(solicitud.estado) }}
                        onClick={() => handleSolicitudClick(solicitud)}
                    >
                                            {/* Fecha en el extremo derecho */}
                {/* Generar la fecha actual al mostrar la solicitud */}
                <span style={styles.solicitudFecha}>
                    {new Date().toLocaleDateString('es-ES')} {/* Muestra la fecha del sistema */}
                </span>


                            <h3>{solicitud.nombre} {solicitud.apellido}</h3>

                            <p>Universidad: {solicitud.universidad}</p>
                            <p>Carrera: {solicitud.carrera}</p>
                            <p>Estado: {solicitud.estado}</p>
                        </div>
                    ))}
                    
                </div>
            ) : (
                <p>No hay solicitudes disponibles</p>
            )}


            {/* Paginación */}
            <div style={styles.pagination}>
    {Array.from({ length: totalPages }, (_, index) => (
        <button 
            key={index + 1} 
            style={{
                ...styles.pageButton,
                backgroundColor: currentPage === index + 1 ? '#333' : '', // Cambia el color solo si la página está activa
                color: currentPage === index + 1 ? '#fff' : '', // Cambia el color del texto para mejorar la visibilidad
            }}
            onClick={() => handlePageChange(index + 1)}
        >
            {index + 1}
        </button>
    ))}
</div>

{/* Sección de Solicitudes por Universidad */}
<section style={styles.universitySection}>
    <h2>Solicitudes por universidad</h2>

    {/* Modal para mostrar solicitudes de la universidad seleccionada */}
    {showUniversityModal && selectedUniversity && (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContent}>
                <button onClick={handleCloseUniversityModal} style={styles.closeButton}>Cerrar</button>
                
                {/* Encabezado de la universidad con logo */}
                <div style={styles.universityHeader}>
                    {logos[selectedUniversity] && (
                        <img 
                            src={logos[selectedUniversity]}  // Usa el objeto logos en lugar de universidades
                            alt={`Logo ${selectedUniversity}`}
                            style={styles.universityLogo}
                        />
                    )}
                    <h2>Solicitudes de {selectedUniversity}</h2>
                </div>
                
                {/* Lista de solicitudes */}
                <div style={styles.solicitudesList}>
                    {solicitudesPorUniversidad[selectedUniversity].map((solicitud) => (
                        <div
                            key={solicitud._id}
                            style={{ ...styles.solicitudCard, background: getCardColor(solicitud.estado) }}
                            onClick={() => handleSolicitudClick(solicitud)}
                        >
                            <h4>{solicitud.nombre} {solicitud.apellido}</h4>
                            <p>Carrera: {solicitud.carrera}</p>
                            <p>Estado: {solicitud.estado}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )}
</section>

{/* Lista de tarjetas de universidades */}
<div style={styles.cardContainer2}>
    {Object.keys(solicitudesPorUniversidad).map((university) => (
        <div
            key={university}
            style={styles.universityCard}
            onClick={() => handleUniversityClick(university)}
        >
            {/* Mostrar logo de la universidad */}
            {logos[university] && (
                <img 
                    src={logos[university]}  // Usa el objeto logos en lugar de universidades
                    alt={`Logo ${university}`}
                    style={styles.universityLogo}
                />
            )}
                {/* Nombre de la universidad y total de solicitudes a la derecha */}
                <div style={styles.universityInfo}>

            <h3 style={styles.universityName}>{university}</h3>
            <p style={styles.universityTotalSolicitudes}>Total de solicitudes: {solicitudesPorUniversidad[university].length}</p>
        </div>
        </div>
    ))}
</div>


            {/* Modal para mostrar la solicitud seleccionada */}
            {selectedSolicitud && (
                <div style={styles.modalFullScreen} onClick={handleCloseSolicitudModal}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>Detalles de Solicitud</h2>
                        <p><strong>Nombre:</strong> {selectedSolicitud.nombre} {selectedSolicitud.apellido}</p>
                        <p><strong>Cédula:</strong> {selectedSolicitud.cedula}</p>
                        <p><strong>Email:</strong> {selectedSolicitud.email}</p>
                        <p><strong>Universidad:</strong> {selectedSolicitud.universidad}</p>
                        <p><strong>Matricula:</strong> {selectedSolicitud.matricula}</p>
                        <p><strong>Carrera:</strong> {selectedSolicitud.carrera}</p>
                        <p><strong>Estado:</strong> {selectedSolicitud.estado}</p>

                        <div style={styles.imagesContainer}>
                            <h4>Comprobante de pago:</h4>
                            {selectedSolicitud.archivos && selectedSolicitud.archivos.map((archivo, index) => (
                                <img 
                                    key={index} 
                                    src={archivo} 
                                    alt="Archivo subido" 
                                    style={styles.image} 
                                    onClick={() => window.open(archivo)} // Abre la imagen en nueva pestaña
                                />
                            ))}
                        </div>

                        <div style={styles.imagesContainer}>
                            <h4>Documentos:</h4>
                            {selectedSolicitud.documentos && selectedSolicitud.documentos.map((documento, index) => (
                                <img 
                                    key={index} 
                                    src={documento} 
                                    alt="Documento subido" 
                                    style={styles.image} 
                                    onClick={() => window.open(documento)} // Abre la imagen en nueva pestaña
                                />
                            ))}
                        </div>

                        <div style={styles.signatureContainer}>
                                  {/* Botón para abrir el modal DocumentosIES */}
      <div style={styles.buttonContainer}>
      <h3 style={{display:'flex',flexDirection:'column',alignItems:'flex-end'}}>Paso 1:</h3>
        <button onClick={handleOpenModal} style={styles.IESButton}>
          DocumentoIES
        </button>
      </div>
      
      {/* Modal DocumentosIES */}
      {showDocumentosIESModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDocumentosIESModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>DocumentoIES</h3>
            {relatedRecord ? (
              <div>
                <p>
                  <strong>Nombres:</strong> {relatedRecord.nombres}
                </p>
                <p>
                  <strong>Apellidos:</strong> {relatedRecord.apellidos}
                </p>
                <p>
                  <strong>Carrera:</strong> {relatedRecord.carrera}
                </p>
                <p>
                  <strong>Universidad:</strong> {relatedRecord.universidad}
                </p>
                <p>
                  <strong>Matrícula:</strong> {relatedRecord.matricula}
                </p>
                <div>
                  <strong>Documentos:</strong>
                  {relatedRecord.documentos && relatedRecord.documentos.length > 0 ? (
                    relatedRecord.documentos.map((doc, index) => (
                      <img
                        key={index}
                        src={doc}
                        alt={`Documento ${index + 1}`}
                        style={styles.documentImage}
                        onClick={() => window.open(doc)}
                      />
                    ))
                  ) : (
                    <p>No hay documentos disponibles.</p>
                  )}
                </div>
              </div>
            ) : (
              <p>No se encontró un registro relacionado con esta matrícula.</p>
            )}
            <button onClick={() => setShowDocumentosIESModal(false)} style={styles.closeButton}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    

                            <h2>Paso 2: Firma Digital</h2>


                        {/* Nuevo botón para generar certificado */}
                        <div style={styles.certificadoContainer}>
                <p>Paso 3: Si aprobara la solicitud, genere un certificado y luego aprueve.</p>
                <button onClick={() => generarCerti(selectedSolicitud._id)}>Generar Certificado</button>

                  
            </div>





                            {signature ? (
                                <img src={signature} alt="Firma" style={styles.signatureImage} />
                            ) : (
                                <>
                                    {isSigning ? (
                                        <SignatureCanvas
                                            penColor='black'
                                            canvasProps={{ width: 500, height: 200, className: 'signatureCanvas' }}
                                            ref={signaturePadRef}
                                        />
                                    ) : (
                                        <FaPen 
                                            onClick={() => setIsSigning(true)} 
                                            style={styles.penIcon} 
                                        />
                                    )}
                                    <div>
                                        <button onClick={clearSignature} style={styles.clearButton}>Limpiar Firma</button>
                                        <button onClick={saveSignature} style={styles.saveButton}>Guardar Firma</button>
                                    </div>
                                </>
                            )}
                            
                        </div>

                        <div style={styles.buttonContainer}>
                            <button onClick={handleAprobar} style={styles.approveButton}>Aprobar</button>
                            <button onClick={handleDeclinar} style={styles.declineButton}>Declinar</button>
                        </div>
                        

                        <button onClick={handleCloseSolicitudModal} style={styles.closeButton}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>






    );
};

// Estilos
const styles = {
    container: {
        padding: '20px',
        position: 'relative',
    },
    solicitudesCounter: {
        position: 'absolute',
        top: '20px',
        right: '20px',
    },


    banner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#bcceda',
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
        color: '#333'
    },

    solicitudFecha: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '14px',
        color: '#555',
    },
    documentImage: {
        maxWidth: '100px',
        maxHeight: '100px',
        margin: '5px',
        cursor: 'pointer',
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
    cardContainer2: { display: 'flex', flexWrap: 'wrap', gap: '1rem' },
    universityCard: { padding: '1rem', background: '#3331', borderRadius: '8px', cursor: 'pointer' },
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },

    solicitudesList: { display: 'grid', gap: '1rem',background: '#3334',        
        maxHeight: '400px', // Limita la altura de la lista
        overflowY: 'auto',  // Agrega scroll vertical 
        },
    
    solicitudCard: { padding: '1rem', borderRadius: '8px', cursor: 'pointer' },
    
    universityInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',  // Alinea el nombre y el total al lado derecho
    },
    universityName: {
        fontSize: '14px',
        fontWeight: 'bold',
    },
    universityTotalSolicitudes: {
        fontSize: '18px',
        color: '#666',  // Color más tenue para el total de solicitudes
    },



    universityHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',  // Para colocar el nombre en el extremo derecho
        marginBottom: '20px',
        borderBottom: '1px solid #E0E0E0',
        paddingBottom: '10px',
        
    },

    universityLogo: {
        width: '73px',  // Ajusta el tamaño del logo según prefieras
        height: '73px',
        marginLeft: 50
        

    },
    certificadoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end', // Posiciona el contenedor hacia la derecha
        
    },



    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '80px',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: '8px',
        boxShadow: '0 5px 8px rgba(0, 0, 0, 0.1)',
        padding: '15px',
        border: '1px solid #E0E0E0',
        width: 'calc(25% - 20px)',
        boxSizing: 'border-box',
        maxHeight: '300px',
        overflow: 'hidden',
        cursor: 'pointer',
        marginTop: -33,
        position: 'relative',  // Necesario para posicionar la fecha

    },
    modalFullScreen: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        overflowY: 'auto',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        width: '100%',
        maxWidth: '1000px',
        position: 'relative',
    },
    
    universitySection: {
        margin: '20px',
        textAlign: 'center',
        

    },
    IESButton: {
        backgroundColor: '#007BFF',
        color: '#FFF',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
    },
    universityButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
//dentro de la solicitud
    closeButton: {
        marginTop: '10px',
        backgroundColor: '#ff4747',
        color: '#fff',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',


    },





    imagesContainer: {
        margin: '20px 0',
    },
    image: {
        width: '80px',
        height: 'auto',
        margin: '5px',
        cursor: 'pointer',
    },
    signatureContainer: {
        margin: '16px 0',
    },
    signatureImage: {
        width: '123px',
        height: 'auto',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '25px',
    },
    approveButton: {
        backgroundColor: 'green',
        color: '#FFF',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    declineButton: {
        backgroundColor: 'red',
        color: '#FFF',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    clearButton: {
        marginRight: '10px',
    },
    saveButton: {
        marginLeft: '10px',
    },
    pagination: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    pageButton: {
        padding: '10px 15px',
        fontSize: '16px',
        backgroundColor: '#f0f0f0',
        color: '#333',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    penIcon: {
        cursor: 'pointer',
        marginTop: '10px',
        fontSize: '24px',
    },
};

export default AdminWelcomePage;
