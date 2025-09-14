import { useState, useEffect } from 'react';

const MyBoltComponent = () => {
  const [data, setData] = useState<string | null>(null);
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null); // Estado para el mensaje de conexión

  useEffect(() => {
    // Función asíncrona para obtener los datos desde el backend de Django
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/');
        if (response.ok) {
          const result = await response.json();
          setData(result.message); // Actualiza el estado con los datos obtenidos
          setConnectionMessage("Conectado al backend exitosamente"); // Mensaje de conexión exitosa
        } else {
          console.error("Error al obtener datos:", response.status);
          setConnectionMessage("Error al conectar con el backend"); // Mensaje de error
        }
      } catch (error) {
        console.error("Error en la llamada a la API:", error);
        setConnectionMessage("Error en la llamada a la API"); // Mensaje de error en la llamada
      }
    };

    fetchData();
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <div>
      <h1>Datos desde el backend:</h1>
      <p>{data ? data : "Cargando datos..."}</p>
      {connectionMessage && ( // Mostrar el mensaje de conexión si existe
        <p>{connectionMessage}</p>
      )}
    </div>
  );
};

export default MyBoltComponent;
