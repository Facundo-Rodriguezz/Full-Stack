// src/services/apiService.ts
export const fetchDataFromDjango = async (): Promise<any> => {
  try {
    const response = await fetch('http://localhost:8000/api/'); // URL de tu API
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error en la llamada a la API:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};
