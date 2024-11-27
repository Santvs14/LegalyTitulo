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
  height: 93vh;
  overflow: hidden;
`;

const Banner = styled.div`
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const Logo = styled.img`
  height: 108px;
  z-index: 10;
  margin-top: -3rem;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-bottom: 0.5rem;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 360px; /* Reducción del tamaño máximo del formulario */
  margin-top: -2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const Form = styled.form`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.85rem; /* Título de los campos más pequeño */
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.6rem;
  font-size: 0.85rem; /* Input más pequeño */
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 0.6rem;
  font-size: 0.85rem; /* Select más pequeño */
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const SubmitButton = styled.button`
  background-color: #0069d9;
  color: white;
  padding: 0.6rem;
  font-size: 0.9rem; /* Botón más pequeño */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  background-color: #0069d9;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  color: green;
  font-size: 0.9rem; /* Mensaje más pequeño */
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background-color: red;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const RecordCard = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid #e0e0e0;
  padding: 1rem;
  border-radius: 8px;
`;

const DocumentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const DocumentPreview = styled.img`
  width: 100%;
  max-width: 150px;
  height: auto;
  border-radius: 4px;
`;

export default IESForm;
