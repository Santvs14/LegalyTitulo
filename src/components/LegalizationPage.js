import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Importa el contexto
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/solid';

const LegalizationPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Obtén el usuario del contexto
    const apiUrl = process.env.REACT_APP_API_URL;

    // Maneja la inicialización del estado
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono:'',
        cedula: '',
        universidad: '',
        matricula: '',
        carrera: '',
        estado: 'pendiente',
        archivos: [],
        documentos: [],
        haPagado: 'no', // Se añadió este campo
    });
    
    const [comprobanteHabilitado, setComprobanteHabilitado] = useState(false); // Estado para habilitar o deshabilitar el archivo de comprobante
    const [mensaje, setMensaje] = useState(''); // Para mostrar mensajes de éxito o error
    const [loading, setLoading] = useState(false); // Para mostrar el loading
    const [formEnviado, setFormEnviado] = useState(false); // Estado para mostrar página de éxito



    // Efecto para cargar la información del usuario
    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
            apellido: user.apellido || '',
            email: user.email || '',
            telefono: user.telefono || '',
            cedula: user.cedula || '',
            universidad: user.universidad || '',
            matricula: user.matricula || '',
            carrera: user.carrera || '',
                estado: 'pendiente',  // Mantén "pendiente" como valor inicial del estado
                haPagado: '',
                archivos: null,
                documentos: null,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, archivos: e.target.files });
    };

    const handleDocumentChange = (e) => {
        setFormData({ ...formData, documentos: e.target.files });
    };

    const handleGoBack = () => {
        // Navega a la página anterior
        navigate('/welcome'); // Redirige a la página de bienvenida
    };

    // Lógica para habilitar el campo de comprobante o mostrar el link de pago
    const handlePagoChange = (e) => {
        const haPagado = e.target.value === 'si';
        setComprobanteHabilitado(haPagado);
        setFormData({ ...formData, haPagado: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Inicia el loading


    // Validación: Verifica si los archivos o documentos han sido adjuntados
    if ((!formData.archivos || formData.archivos.length === 0) && 
        (!formData.documentos || formData.documentos.length === 0)) {
        setMensaje('Por favor, adjunta el comprobante de pago(archivo) y los documentos.');
        console.log('adjunta documentos y archivos')
        setLoading(false);
        return; // No enviar el formulario si no hay archivos o documentos
    }





        const formDataToSend = new FormData(); // Usar FormData para manejar archivos
    
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('apellido', formData.apellido);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('telefono', formData.telefono);
        formDataToSend.append('estado', formData.estado); // El estado será "pendiente"
        formDataToSend.append('cedula', formData.cedula);
        formDataToSend.append('universidad', formData.universidad);
        formDataToSend.append('matricula', formData.matricula);
        formDataToSend.append('carrera', formData.carrera);
        formDataToSend.append('haPagado', formData.haPagado);
    
        
        // Agregar archivos y documentos a FormData
        if (formData.archivos && formData.archivos.length > 0) {
            Array.from(formData.archivos).forEach(file => {
                formDataToSend.append('archivos', file);
            });
        }
        
        if (formData.documentos && formData.documentos.length > 0) {
            Array.from(formData.documentos).forEach(file => {
                formDataToSend.append('documentos', file);
            });
        }
        
    
        try {
            //const response = await fetch('http://localhost:5000/api/solicitud', {
                const response = await fetch(`${apiUrl}/api/solicitud`, {

                  
                method: 'POST',


                body: formDataToSend, // Enviar FormData
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMensaje('Solicitud enviada correctamente');
                setFormEnviado(true); // Redirige a la página de éxito

                console.log('Datos enviados correctamente:', data);
                console.log('Datos del formulario:', formData);

            } else {
                setMensaje('Error al enviar la solicitud: ' + data.message);
            }
        } catch (error) {
            setMensaje('Error al enviar la solicitud');
            console.log("Error en la solicitud:", JSON.stringify(error));
            


        }finally {
            setLoading(false); // Finaliza el loading
        }
    };
    if (formEnviado) {
        return (
            <div style={styles.modalContainer}>
                <div style={styles.modalContent}>
                <CheckCircleIcon style={styles.checkIcon} />

                    <h2>¡Formulario enviado con éxito!</h2>
                    <button onClick={handleGoBack} style={styles.backButton}>Ir al inicio</button>
                </div>
            </div>
        );
    }


    return (
        <div style={styles.container}>
            {!loading && (
        <div style={styles.loadingOverlay}>
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p style={styles.loadingText}>Enviando formulario...</p>
            </div>
        </div>
    )}
<br></br>


           <button onClick={handleGoBack} style={styles.backButton}>Regresar</button>

            <h2 style={styles.title}>Formulario de Legalización</h2>

            {mensaje && <p style={styles.message}>{mensaje}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} readOnly style={styles.input} />
                <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} readOnly style={styles.input} />
                <input type="email" name="email" placeholder="Email" value={formData.email} readOnly style={styles.input} />
                <input type="telefono" name="telefono" placeholder="telefono" value={formData.telefono} readOnly style={styles.input} />
                <input type="text" name="cedula" placeholder="Cedula" value={formData.cedula} readOnly style={styles.input} />
                <input type="text" name="universidad" placeholder="Universidad" value={formData.universidad} readOnly style={styles.input} />
                <input type="text" name="matricula" placeholder="matricula" value={formData.matricula} readOnly style={styles.input} />
                <input type="text" name="carrera" placeholder="Carrera" value={formData.carrera} readOnly style={styles.input} />
               
                <input type="text" name="estado" placeholder="Estado" 
                    value={formData.estado} // Esto asegura que se muestre el valor "pendiente" del estado
                    readOnly  // El usuario no podrá modificarlo ya que es "pendiente" por defecto

                onChange={handleChange} required style={styles.input} />

                <label style={styles.label}>¿Ha pagado el servicio?,abjunta el comprobante.</label>
                <div style={styles.radioContainer}>
                    <label style={styles.radioLabel}>
                        <input type="radio" name="haPagado" value="si" onChange={handlePagoChange} /> Sí
                    </label>
                    <label style={styles.radioLabel}>
                        <input type="radio" name="haPagado" value="no" onChange={handlePagoChange} /> No
                    </label>
                </div>

                {/* Si ha pagado, habilitar el campo de archivos, si no, mostrar el enlace de pago */}
                {comprobanteHabilitado ? (
                    <input type="file" name="archivos" onChange={handleFileChange} multiple required style={styles.fileInput} />
                ) : formData.haPagado === 'no' ? (
                    <div style={styles.paymentInfo}>
                        <p>No ha pagado. Puede pagar en línea o dirigirse a las oficinas.</p>
                        <a href="https://mescyt.gob.do/wp-content/uploads/2023/10/GUIA-INDUCTIVA-PARA-TRAMITAR-PAGO-EN-LINEA.pdf" target="_blank" rel="noopener noreferrer" style={styles.link}>
                            Guía para pagar en línea
                        </a>
                    </div>
                ) : null}

                {/* Campo adicional para subir documentos */}
                <label style={styles.label}>Subir documentos para validar la legalización</label>
                <label style={{fontSize:11}}>*Copia del documento de identidad.</label>
                <label style={{fontSize:11}}>*Copia del titulo.</label>
                <label style={{fontSize:11}}>*Carta de grado(contine informacion sobre la investidura entre otras cosas).</label>
                <input type="file" name="documentos" onChange={handleDocumentChange} multiple style={styles.fileInput} />

                <button type="submit" style={styles.button}>Enviar</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px',
        backgroundColor: '#f0f0f0',
        position: 'relative', // Permite que el loader esté en un contenedor posicionado
        minHeight: '100vh', // Asegura que el contenedor ocupe toda la altura de la pantalla
    },
    title: {
        fontSize: '1.5rem',
        marginBottom: '20px',
        color: '#39a4cb', // Azul oscuro (color de la bandera dominicana)
 
    },
    form: {
        width: '80%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        fontSize: '1rem',
        margin: '5px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    radioContainer: {
        display: 'flex',
        gap: '20px',
    },
    radioLabel: {
        fontSize: '1rem',
    },
    fileInput: {
        padding: '10px',
        fontSize: '1rem',
        margin: '5px 0',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '1.2rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    backButton: {
        marginBottom: '20px',
        backgroundColor: '#39a4cb',
        color: '#fff',
 
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#39a4cb', // Rojo (color de la bandera dominicana)
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    loadingOverlay: {
        position: 'fixed', // Fija el overlay en la pantalla
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
        display: 'flex',
        justifyContent: 'center', // Centra el loader horizontalmente
        alignItems: 'center', // Centra el loader verticalmente
        zIndex: 1000, // Asegura que el loader esté por encima de otros elementos
    },
    // Animación de giro
    '@keyframes spin': {
        '0%': {
            transform: 'rotate(0deg)',
        },
        '100%': {
            transform: 'rotate(360deg)',
        },
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '20px',
    },
    loader: {
        border: '6px solid #f3f3f3',
        borderTop: '6px solid #3498db',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 2s linear infinite',
    },
    loadingText: {
        marginTop: '10px',
        fontSize: '1.5rem',
        color: '#ffff'
    },
    message: {
        color: 'red',
    },
    modalContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
    },
    checkIcon: {
        color: 'green',
        width: '50px',
        height: '50px',
    },
    paymentInfo: {
        marginTop: '20px',
        fontSize: '1rem',
        color: '#555',
    },
    paymentLink: {
        color: '#007BFF',
        textDecoration: 'none',
    },
};

export default LegalizationPage;

