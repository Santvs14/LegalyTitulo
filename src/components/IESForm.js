import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mesy from '../image/mesy.png'; // Ajusta la ruta según tu estructura de carpetas
import styled from 'styled-components';

const IESForm = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    carrera: '',
    matricula: '',
    universidad: '',
  });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [iesRecords, setIesRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch data on component mount
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

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    Array.from(files).forEach((file) => data.append('documentos', file));

    try {
      const response = await axios.post(`${apiUrl}/api/ies`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Registro creado exitosamente');
      setIesRecords((prev) => [...prev, response.data]);
      setFormData({
        nombres: '',
        apellidos: '',
        carrera: '',
        matricula: '',
        universidad: '',
      });
      setFiles([]);
    } catch (error) {
      console.error('Error al enviar el formulario:', error.response?.data || error.message);
      setMessage(error.response?.data?.error || 'Error al crear el registro');
    } finally {
      setUploading(false);
    }
  };

  // Handle modal open/close
  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Container>
      <Banner>
        <Logo src={mesy} alt="Logo" />
      </Banner>

      <FormWrapper>
        <Form onSubmit={handleSubmit}>
        <TitleContainer>
  <h2>Envío de datos egresado IES</h2>
</TitleContainer>

          {message && <Message>{message}</Message>}

          <FormGroup>
            <Label htmlFor="nombres">Nombres</Label>
            <Input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="apellidos">Apellidos</Label>
            <Input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              type="text"
              name="matricula"
              value={formData.matricula}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="carrera">Carrera</Label>
            <Select
              name="carrera"
              onChange={handleInputChange}
              value={formData.carrera}
              required
            >
              <option value="">Selecciona la carrera que estudiaste</option>
              <option value="Doctor en Odontologia">Doctor en Odontologia</option>
              <option value="Doctor en Medicina">Doctor en Medicina</option>
              <option value="Doctor en Leyes">Doctor en Leyes</option>
              <option value="Ingenieria en Sistemas">Ingenieria en Sistemas</option>
              <option value="Ingenieria Industrial">Ingenieria Industrial</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="universidad">Universidad</Label>
            <Select
              name="universidad"
              onChange={handleInputChange}
              value={formData.universidad}
              required
            >
              <option value="">Selecciona tu universidad</option>
              <option value="Universidad Nacioanal(UNPHU)">Universidad Nacioanal(UNPHU)</option>
              <option value="Universidad Dominicana O&M">Universidad Dominicana O&M</option>
              <option value="Universidad Católica Santo Domingo(UCSD)">Universidad Católica Santo Domingo(UCSD)</option>
              <option value="Universidad Católica Madre y Maestra (PUCMM)">Universidad Católica Madre y Maestra (PUCMM)</option>
              <option value="Universidad Autónoma de Santo Domingo(UASD)">Universidad Autónoma de Santo Domingo(UASD)</option>
              <option value="Universidad Iberoamericana(UNIBE)">Universidad Iberoamericana(UNIBE)</option>
              <option value="Universidad APEC">Universidad APEC</option>
              <option value="Instituto Tecnológico de Santo Domingo(INTEC)">Instituto Tecnológico de Santo Domingo(INTEC)</option>
              <option value="Universidad Tecnológica de Santiago(UTESA)">Universidad Tecnológica de Santiago(UTESA)</option>
              <option value="Universidad del Caribe (UNICARIBE)">Universidad del Caribe (UNICARIBE)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="documentos">Documentos</Label>
            <Input
              type="file"
              name="documentos"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={uploading}>
            {uploading ? 'Subiendo...' : 'Enviar'}
          </SubmitButton>
        </Form>
      </FormWrapper>

      <Button onClick={handleModalToggle}>Ver Registros Existentes</Button>

      {modalOpen && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={handleModalToggle}>X</CloseButton>
            <h3>Registros IES ({iesRecords.length})</h3>
            {iesRecords.map((record, index) => (
              <RecordCard key={index}>
                <p><strong>Nombres:</strong> {record.nombres}</p>
                <p><strong>Apellidos:</strong> {record.apellidos}</p>
                <p><strong>Carrera:</strong> {record.carrera}</p>
                <p><strong>Matrícula:</strong> {record.matricula}</p>
                <p><strong>Universidad:</strong> {record.universidad}</p>

                {record.documentos && (
                  <DocumentsContainer>
                    <strong>Documentos:</strong>
                    {record.documentos.map((doc, i) => (
                      <DocumentPreview key={i} src={doc} alt={`Documento ${i + 1}`} />
                    ))}
                  </DocumentsContainer>
                )}
              </RecordCard>
            ))}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

// Styled-components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
    background-color: #f0f4f8;
      height: 93vh; /* Usar la altura de la ventana */
  overflow: hidden; /* Quitar el scroll */

`;


const Banner = styled.div`
  
  padding: 0.5rem; /* Reducir el padding para estar más cerca */
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem; /* Reducir el espacio debajo del logo */
`;

const Logo = styled.img`
  height: 93px;
    z-index: 10; /* Asegúrate de que el logo esté al frente */

  /* Si es necesario, ajusta la altura del logo */
`;



const TitleContainer = styled.div`
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  height: 100px; /* Asegura que tenga altura para centrar verticalmente */
`;


const FormWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin-top: -3rem; /* Reducir el margen superior */
  display: flex;
  justify-content: center;
  flex-direction: column; /* Aseguramos que el formulario y el logo estén en columna */
  align-items: center; /* Centra el contenido */
  
`;


const Form = styled.form`
  width: 100%;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  &:disabled {
    background-color: #b0b0b0;
  }
`;

const Message = styled.p`
  color: green;
  font-weight: bold;
  font-size: 1.3rem;
  text-align: center; /* Centrar el texto */
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-height: 80%;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background-color: transparent; /* Fondo transparente */
  color: #ff0000; /* Color del texto */
  font-size: 1.5rem;
  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 70px;
`;


const RecordCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
`;

const DocumentsContainer = styled.div`
  margin-top: 1rem;
`;

const DocumentPreview = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

export default IESForm;
