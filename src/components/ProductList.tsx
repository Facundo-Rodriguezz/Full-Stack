import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Package, Plus } from 'lucide-react';

// Actualiza la interfaz Product para que coincida con los campos del modelo Django
interface Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad_disponible: number; // Cambia la propiedad a 'cantidad_disponible'
    stock: number;
    categoria?: string; // Esto es opcional
    sku?: string; // Esto es opcional
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const token = localStorage.getItem('token'); // Obtén el token de localStorage

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>('http://localhost:8000/product', { 
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    },
                });

                setProducts(response.data); // Almacena los productos en el estado
                setLoading(false); // Actualiza el estado de carga
            } catch (err) {
                console.error('Error:', err);
                setLoading(false); // Asegúrate de detener la carga en caso de error
            }
        };

        fetchProducts();
    }, [token]); // Agrega 'token' como dependencia para que se actualice si cambia

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getStockStatus = (stock: number) => {
        if (stock === 0) return <span className="text-red-500">Sin stock</span>;
        return <span className="text-green-600">{stock} en stock</span>;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Productos</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={20} />
                    Añadir Producto
                </button>
            </div>

            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar Productos..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="Todos">Todas las categorías</option>
                    <option value="Muebles">Muebles</option>
                    <option value="Vasos">Vasos</option>
                    <option value="MDF">MDF</option>
                    <option value="Bolsas">Bolsas</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PRODUCTO
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STOCK
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PRECIO
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CATEGORÍA
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ACCIONES
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <Package className="h-8 w-8 text-gray-400" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {product.sku || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {getStockStatus(product.stock)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    ${product.precio}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {product.categoria || '-'}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                    <button className="text-red-600 hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
