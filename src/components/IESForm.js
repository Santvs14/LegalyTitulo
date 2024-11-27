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
  padding: 1rem;
  font-family: 'Roboto', sans-serif;
  background-color: #f0f4f8;
  height: 93vh; /* Usar la altura de la ventana */
  overflow: hidden; /* Quitar el scroll */
`;

const Banner = styled.div`
  padding: 0.5rem; 
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem; 
`;

const Logo = styled.img`
  height: 80px;
  margin-top: -2rem; 
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 450px; /* Reducción del tamaño */
  margin: 0 auto;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.2rem;
`;

const Input = styled.input`
  padding: 0.6rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.6rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  background-color: #5e76e1;
  color: white;
  padding: 0.8rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
  &:hover {
    background-color: #4a62b2;
  }
`;

const Button = styled.button`
  background-color: #0069d9;
  color: white;
  padding: 0.8rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

const Message = styled.p`
  color: #28a745;
  font-size: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 80%;
  overflow-y: auto;
  max-height: 80%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
`;

const RecordCard = styled.div`
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const DocumentsContainer = styled.div`
  margin-top: 1rem;
`;

const DocumentPreview = styled.img`
  max-width: 200px;
  margin-top: 0.5rem;
  max-height: 150px;
  object-fit: cover;
`;


export default IESForm;
