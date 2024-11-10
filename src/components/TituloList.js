// src/components/TituloList.js
import React, { useEffect, useState } from 'react';
import { getTitulos } from '../api/tituloApi'; // Importa la función para obtener títulos

const TituloList = () => {
    const [titulos, setTitulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTitulos = async () => {
            try {
                const data = await getTitulos();
                setTitulos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTitulos();
    }, []);

    if (loading) return <div>Cargando títulos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Títulos</h1>
            <ul>
                {titulos.map((titulo) => (
                    <li key={titulo._id}>
                        <strong>{titulo.nombre}</strong> - {titulo.apellido} ({titulo.ubicacion}) - {titulo.carrera} - {titulo.fecha_investidura} - {titulo.universidad} - {titulo.fecha_registro}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TituloList;
