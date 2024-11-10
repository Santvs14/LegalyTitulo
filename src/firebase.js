// src/firebase.js

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCX8wjuNc5ez0JRhAih4NJ-LR-jS1j_W_A",
  authDomain: "legalytitulord.firebaseapp.com",
  projectId: "legalytitulord",
  storageBucket: "legalytitulord.appspot.com",
  messagingSenderId: "531012896294",
  appId: "1:531012896294:web:6e14a9299f2044189a08e7",
  measurementId: "G-WN1P2CVHKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
console.log('Iniciacion de firebase:', app)

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: 'BJ1Z7cVupHKfVsUQGqtIjB16YCV9ZWwa1UlOxj6teoIQ_y5VHBSPAGxo3uzWA0UixJj3tRpn5hY-LSqgVmRJHR8	' });
    if (currentToken) {
      console.log('Token obtenido:', currentToken);
      return currentToken;
    } else {
      console.log('No se encontró token de dispositivo.');
    }
  } catch (error) {
    console.error('Error al obtener el token', error);
  }
};

export const onMessageListener = () => 
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
