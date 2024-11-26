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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

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
      {/* Banner superior */}
      <Banner>
        <Logo src={mesy} alt="Logo" />
      </Banner>

      <Form onSubmit={handleSubmit}>
        <h2>Envio de datos egresado IES</h2>
        {message && <Message>{message}</Message>}

        <Label>
          Nombres:
          <Input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleInputChange}
            required
          />
        </Label>

        <Label>
          Apellidos:
          <Input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleInputChange}
            required
          />
        </Label>

        <Label>
          Matrícula:
          <Input
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={handleInputChange}
            required
          />
        </Label>

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

        <Label>
          Documentos:
          <Input
            type="file"
            name="documentos"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </Label>

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
                  <img
                    key={i}
                    src={doc}
                    alt={`Documento ${i + 1}`}
                    style={{ maxWidth: '100px', maxHeight: '100px', margin: '0.5rem' }}
                  />
                ))}
              </DocumentsContainer>
            )}
          </RecordCard>
        ))}
      </Records>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Banner = styled.div`
  background-color: #333;
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

const Logo = styled.img`
  height: 93px;
`;

const Form = styled.form`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Select = styled.select`
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
`;

const Message = styled.p`
  color: green;
  font-weight: bold;
`;

const Records = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const RecordsHeader = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const RecordCard = styled.div`
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const DocumentsContainer = styled.div`
  margin-top: 1rem;
`;

export default IESForm;
