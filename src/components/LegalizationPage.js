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
            {loading && (
                <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p style={styles.loadingText}>Enviando formulario...</p>
            </div>

            )}

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
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#333',
        padding: '20px',
    },
    checkIcon: {
        color: 'green',
        width: '40px',
        height: '40px',
        marginRight: '10px', // Espacio entre el ícono y el texto
    },
    modalContainer: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
    },

    loadingContainer: {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    loader: {
        border: '8px solid #f3f3f3',
        borderTop: '8px solid #39a4cb',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 2s linear infinite',
    },
    loadingText: {
        marginTop: '10px',
        color: '#fff',
        fontSize: '23px',
    },

    title: {
        marginBottom: '20px',
        color: '#39a4cb', // Azul oscuro (color de la bandera dominicana)
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '800px', // Máximo de ancho para pantallas grandes
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '123px',
    },
    
    input: {
        marginBottom: '15px',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        outline: 'none',
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
    },
    message: {
        color: '#d9534f',
        margin: '10px 0',
        textAlign: 'center',
    },
    radioContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        margin: '10px 0',
    },
    radioLabel: {
        margin: '0 10px',
    },
    fileInput: {
        marginBottom: '15px',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    paymentInfo: {
        marginBottom: '15px',
    },
    link: {
        color: '#0056b3',
        textDecoration: 'underline',
    },
};


export default LegalizationPage;

