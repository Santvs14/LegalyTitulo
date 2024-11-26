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

  return (
    <Container>
      <Banner>
        <Logo src={mesy} alt="Logo" />
      </Banner>

      <Form onSubmit={handleSubmit}>
        <h2>Envio de datos egresado IES</h2>
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

      <Records>
        <RecordsHeader>
          <p>Registros IES ({iesRecords.length})</p>
        </RecordsHeader>

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
      </Records>
    </Container>
  );
};

// Styled-components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
`;

const Banner = styled.div`
  background-color: #f0f4f8;
  padding: 1rem 0;
  display: flex;
  justify-content: center;
`;

const Logo = styled.img`
  height: 93px;
  width: auto;
`;

const Form = styled.form`
  margin-top: 1.5rem;
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
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  &:disabled {
    background-color: #b0b0b0;
  }
`;

const Message = styled.div`
  background-color: #f9f9f9;
  color: #333;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const Records = styled.div`
  margin-top: 2rem;
`;

const RecordsHeader = styled.div`
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 5px;
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
