//Aplicación React se conecta con las rutas del backend.



import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [titulos, setTitulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para manejar el inicio de sesión
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(''); // Para almacenar el rol del usuario

  // Obtener títulos desde el backend (cuando el usuario está autenticado)
  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://localhost:5000/api/titulos')
        .then(response => {
          setTitulos(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error al obtener títulos:', error);
          setError('Error al obtener los títulos.');
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  // Función para manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token); // Almacenar el token
      setIsLoggedIn(true);
      setRole(response.data.role); // Asignar el rol desde la respuesta
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error en la autenticación: ' + error.response.data.message);
      console.error('Error en la autenticación:', error);
    }
  };

  // Si el usuario no está autenticado, mostrar el formulario de inicio de sesión
  if (!isLoggedIn) {
    return (
      <div>
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  // Si el usuario está autenticado, mostrar la lista de títulos
  return (
    <div>
      <h1>Legalización de Títulos</h1>
      <h2>Bienvenido, {role}</h2> {/* Mostrar el rol del usuario */}
      {loading && <p>Cargando títulos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {titulos.map(titulo => (
          <li key={titulo._id}>{titulo.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
