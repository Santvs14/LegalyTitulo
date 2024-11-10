// api/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Asegúrate de tener un modelo de usuario
const router = express.Router();

// Ruta para registrar un nuevo usuario
// api/auth.js
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

      res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe.' });
      }
  
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear un nuevo usuario
      const newUser = new User({
        username,
        password: hashedPassword,
        role: 'usuario', // Puedes definir roles según tu lógica
      });
  
      // Guardar el usuario en la base de datos
      await newUser.save();
  
      // Generar un token JWT
      const token = jwt.sign({ id: newUser._id, role: newUser.role }, 'tu_secreto_aqui', {
        expiresIn: '1h',
      });
  
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        role: newUser.role,
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error); // Añadido para ver el error completo
      res.status(500).json({ message: 'Error en el servidor: ' + error.message }); // Mensaje de error más detallado
    }
  });
  