import React, { useState } from 'react';
import axios from 'axios';

const IESForm = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [carrera, setCarrera] = useState('');
  const [matricula, setMatricula] = useState('');
  const [documentos, setDocumentos] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleFileChange = (e) => {
    setDocumentos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombres', nombres);
    formData.append('apellidos', apellidos);
    formData.append('carrera', carrera);
    formData.append('matricula', matricula);

    for (let i = 0; i < documentos.length; i++) {
      formData.append('documentos', documentos[i]);
    }

    try {
      //const response = await axios.post('http://localhost:5000/api/registro-ies', formData, {
        const response = await axios.post(`${apiUrl}/api/registro-ies`, formData, {   



        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Registro exitoso:', response.data);
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombres"
        value={nombres}
        onChange={(e) => setNombres(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Apellidos"
        value={apellidos}
        onChange={(e) => setApellidos(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Carrera"
        value={carrera}
        onChange={(e) => setCarrera(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Matrícula"
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
        required
      />
      <input type="file" multiple onChange={handleFileChange} required />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default IESForm;
