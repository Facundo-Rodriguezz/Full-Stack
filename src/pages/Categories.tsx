import axios from "axios";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  nombre: string;
  cantidad_productos?: number;
}

const CategoriesList: React.FC = () => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [modalCategoria, setModalCategoria] = useState(false);
  
  const abrirModalCategoria = () => {
    setModalCategoria(true);
  }

  const cancelarCategoria = () => {
    document.getElementById("nombre")?.setAttribute("value", "");
    setModalCategoria(false);
  }

  const guardarCategoria = async () => {
    const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
    try {
      await axios.post(
        "http://localhost:8000/api/category/",
        {
          nombre,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setModalCategoria(false);
      document.getElementById("nombre")?.setAttribute("value", "");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  const editarCategoria = async (id: number) => {
    const nombre = prompt("Ingrese el nuevo nombre de la categoría");
    if (nombre) {
      try {
        await axios.put(
          `http://localhost:8000/api/category/${id}/`,
          {
            nombre,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const newCategories = categorias.map((categoria) => {
          if (categoria.id === id) {
            categoria.nombre = nombre;
          }
          return categoria;
        });
        setCategorias(newCategories);
      } catch (err) {
        console.error("Error:", err);
      }
    }
  }

  const eliminarCategoria = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/category/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const newCategories = categorias.filter((categoria) => categoria.id !== id);
      setCategorias(newCategories);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>(
          "http://localhost:8000/api/category/?enviar_cantidades=true",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCategorias(response.data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchCategories();
    setLoading(false);
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Categorias</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" onClick={abrirModalCategoria}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Categoria
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        {<div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar categoria..."
            />
          </div>
        </div> }

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad de Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right  text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categorias.length == 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No hay categorías disponibles.
                  </td>
                </tr>
              ) : (
                categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {categoria.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        {categoria.cantidad_productos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Activo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => editarCategoria(categoria.id)}>
                        Editar
                      </button>
                      <button className="ml-2 text-red-600 hover:text-red-900" onClick={() => eliminarCategoria(categoria.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      { modalCategoria && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center margin-0">
          <div className="bg-white p-6 w-96 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900">Agregar Categoria</h2>
            <form className="mt-4 space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" onClick={guardarCategoria}>
                  Guardar
                </button>
                <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 ml-2" onClick={cancelarCategoria}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
    )}
    </div>
  );
};

export default CategoriesList;
