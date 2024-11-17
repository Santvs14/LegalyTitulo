import React, { useState } from 'react';

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

    if (documentos && documentos.length > 0) {
      for (let i = 0; i < documentos.length; i++) {
        formData.append('documentos', documentos[i]);
      }
    } else {
      console.error('No se seleccionaron documentos.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/registro-ies`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);
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
