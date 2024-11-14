import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Package, Plus } from 'lucide-react';

interface Product {
    id: number;
    nombre: string;
    sku?: string;
    stock: number;
    precio: number;
    categoria: string;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState<Product>({
        id: 0,
        nombre: '',
        sku: '',
        stock: 0,
        precio: 0,
        categoria: '',
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>('http://localhost:8000/api/product/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [token]);

    // Función para manejar el cambio en los inputs de los formularios
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (productToEdit) {
            setProductToEdit((prevProduct) => ({
                ...prevProduct!,
                [name]: value || "",
            }));
        } else {
            setNewProduct((prevProduct) => ({
                ...prevProduct,
                [name]: value,
            }));
        }
    };

    // Función para agregar un producto
    const handleAddProduct = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/product/', newProduct, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setProducts((prev) => [...prev, response.data]);
            setIsAddModalOpen(false);
            setNewProduct({
                id: 0,
                nombre: '',
                sku: '',
                stock: 0,
                precio: 0,
                categoria: '',
            });
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    };

    // Función para editar un producto
    const handleEditProduct = async () => {
        if (productToEdit) {
            try {
                const response = await axios.put(
                    `http://localhost:8000/api/product/${productToEdit.id}/`,
                    productToEdit,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                setProducts((prev) =>
                    prev.map((product) =>
                        product.id === productToEdit.id ? response.data : product
                    )
                );
                setIsEditModalOpen(false);
                setProductToEdit(null);
            } catch (error) {
                console.error('Error al editar el producto:', error);
            }
        }
    };

    // Función para eliminar un producto
    const handleDeleteProduct = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8000/api/product/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    // Filtrado de productos
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getStockStatus = (stock: number) => {
        if (stock <= 0) return <span className="text-red-500">Sin stock</span>;
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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
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
                                        <Package size={20} className="mr-2 text-blue-500" />
                                        {product.nombre}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{product.sku}</td>
                                <td className="px-6 py-4">{getStockStatus(product.stock)}</td>
                                <td className="px-6 py-4">{product.precio}</td>
                                <td className="px-6 py-4">{product.categoria}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => {
                                            setProductToEdit(product);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="text-red-600 hover:text-red-800 ml-4"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
                {/* Modal de Editar Producto */}
                {isEditModalOpen && productToEdit && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Editar Producto</h2>
                            <input
                                type="text"
                                name="nombre"
                                value={productToEdit.nombre}
                                onChange={handleInputChange}
                                placeholder="Nombre del Producto"
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                name="sku"
                                value={productToEdit.sku}
                                onChange={handleInputChange}
                                placeholder="SKU"
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="number"
                                name="stock"
                                value={productToEdit.stock || ''}
                                onChange={handleInputChange}
                                placeholder="Stock"
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="number"
                                name="precio"
                                value={productToEdit.precio || ''}
                                onChange={handleInputChange}
                                placeholder="Precio"
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <select
                                name="categoria"
                                value={productToEdit.categoria}
                                onChange={handleInputChange}
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            >
                                <option value="">Seleccione Categoría</option>
                                <option value="Muebles">Muebles</option>
                                <option value="Vasos">Vasos</option>
                                <option value="MDF">MDF</option>
                                <option value="Bolsas">Bolsas</option>
                            </select>
                            <div className="flex justify-end">
                            <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="mr-2 text-gray-600 hover:text-gray-900"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleEditProduct}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Modal de Añadir Producto */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Añadir Producto</h2>
                            <input
                                type="text"
                                name="nombre"
                                value={newProduct.nombre}
                                onChange={handleInputChange}
                                placeholder="Nombre del Producto"
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                name="sku"
                                value={newProduct.sku}
                                onChange={handleInputChange}
                                placeholder="SKU"
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="number"
                                name="stock"
                                value={newProduct.stock || ''}
                                onChange={handleInputChange}
                                placeholder="Stock"
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />
                            <input
                                type="number"
                                name="precio"
                                value={newProduct.precio || ''}
                                onChange={handleInputChange}
                                placeholder="Precio"
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            />


                            <select
                                name="categoria"
                                value={newProduct.categoria}
                                onChange={handleInputChange}
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                            >
                                <option value="">Seleccione Categoría</option>
                                <option value="Muebles">Muebles</option>
                                <option value="Vasos">Vasos</option>
                                <option value="MDF">MDF</option>
                                <option value="Bolsas">Bolsas</option>
                            </select>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="mr-2 text-gray-600 hover:text-gray-900"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddProduct}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    
    };
    
    export default ProductList;