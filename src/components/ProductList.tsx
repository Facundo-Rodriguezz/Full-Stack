import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Search, Plus } from 'lucide-react';

interface Product {
    id: number;
    nombre: string;
    codigo: string;
    cantidad_disponible: number;
    precio: number;
    categoria: string;
}

const ProductList: React.FC = () => {
    const [error, setError] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productCategory, setProductCategory] = useState<number | null>(null);

    const [newProduct, setNewProduct] = useState<Product>({
        id: 0,
        nombre: '',
        codigo: '',
        cantidad_disponible: 0,
        precio: 0,
        categoria: '',
    });

    interface Category {
        id: number;
        nombre: string;
    }
    const resetAddProductForm = () => {
        setNewProduct({
            id: 0,
            nombre: '',
            codigo: '',
            cantidad_disponible: 0,
            precio: 0,
            categoria: '',
        });
    };

    const [categories, setCategories] = useState<Category[]>([]);

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
            } catch (err) {
                console.error('Error fetching products:', err);
                alert('No se pudieron cargar los productos. Inténtalo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get<Category[]>('http://localhost:8000/api/category', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchProducts();
        fetchCategories();
    }, [token]);




    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;


        if (productToEdit) {
            setProductToEdit((prevProduct) =>
                prevProduct ? { ...prevProduct, [name]: value } : null
            );
        } else {
            setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
        }
    };


    const handleAddProduct = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!newProduct.nombre || !newProduct.codigo || !newProduct.cantidad_disponible || !newProduct.precio || !productCategory) {
            setError('Por favor, complete todo los campos.');
        } else if (isNaN(Number(newProduct.cantidad_disponible)) || isNaN(Number(newProduct.precio))) {
            setError('Por favor, ingresa valores válidos en los campos de cantidad y precio.');
        } else {
            setError('');
            try {
                const response = await axios.post("http://localhost:8000/api/product/", {
                    nombre: newProduct.nombre,
                    codigo: newProduct.codigo,
                    cantidad_disponible: newProduct.cantidad_disponible,
                    precio: newProduct.precio,
                    categoria: productCategory,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });


                const addedProduct = {
                    id: response.data.id,
                    nombre: response.data.nombre,
                    codigo: response.data.codigo,
                    cantidad_disponible: response.data.cantidad_disponible,
                    precio: response.data.precio,
                    categoria: productCategory.toString(),
                };


                setProducts((prevProducts) => [...prevProducts, addedProduct]);


                setIsAddModalOpen(false);

                const categoryExists = categories.some(cat => cat.id === productCategory);
                if (!categoryExists) {
                    const newCategory = {
                        id: productCategory,
                        nombre: addedProduct.categoria,
                    };
                    setCategories((prevCategories) => [...prevCategories, newCategory]);
                }

                setNewProduct({
                    id: 0,
                    nombre: '',
                    codigo: '',
                    cantidad_disponible: 0,
                    precio: 0,
                    categoria: '',
                });

                setProductCategory(null);
                setError('');
            } catch (err) {
                console.error("Error al agregar el producto:", err);
                alert("Hubo un error al intentar añadir el producto. Por favor, intenta nuevamente.");
            }
        }
    };





    const handleEditProduct = async () => {
        if (!productToEdit?.nombre || !productToEdit?.codigo || !productToEdit?.cantidad_disponible || !productToEdit?.precio || !productCategory) {
            setError('Por favor, complete todo los campos.');
        } else if (isNaN(Number(newProduct.cantidad_disponible)) || isNaN(Number(newProduct.precio))) {
            setError('Por favor, ingresa valores válidos en los campos de cantidad y precio.');
        } else {
            setError('');
            try {

                const updatedProduct = {
                    ...productToEdit,
                    categoria: productCategory,
                };

                const response = await axios.put(
                    `http://localhost:8000/api/product/${productToEdit.id}/`,
                    updatedProduct,
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
                setProductCategory(null);
                setError('');
            } catch (error) {
                console.error('Error editing product:', error);
            }
        }
    };


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
            console.error('Error deleting product:', error);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || product.categoria == selectedCategory;
        return matchesSearch && matchesCategory;
    });


    const getcantidad_disponibleStatus = (cantidad_disponible: number) => {
        if (cantidad_disponible <= 0) return <span className="text-red-500">Sin stock</span>;
        return <span className="text-green-600">{cantidad_disponible} en stock</span>;
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
                <div className="mb-4">
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                            <option value="Todos">Todos</option>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.nombre}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No hay categorías disponibles</option>
                            )}
                        </select>

                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PRODUCTO
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CODIGO
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
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
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.codigo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getcantidad_disponibleStatus(product.cantidad_disponible)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.precio}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categories.find((x) => x.id.toString() == product.categoria)?.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                    <button
                                        onClick={() => {
                                            setProductToEdit(product);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="ml-4 text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Añadir Producto */}
            {isAddModalOpen && (
                <div className="modal">
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                            <h2 className="text-xl font-bold mb-4">Añadir Producto</h2>

                            {/* Cartel de error */}
                            {error && (
                                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    <strong>¡Error!</strong> {error}
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Nombre"
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!newProduct.nombre && error ? 'border-red-500' : ''}`}
                                    value={newProduct.nombre}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
                                    Código <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="codigo"
                                    name="codigo"
                                    placeholder="Código"
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!newProduct.codigo && error ? 'border-red-500' : ''}`}
                                    value={newProduct.codigo}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="cantidad_disponible" className="block text-sm font-medium text-gray-700">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="cantidad_disponible"
                                    name="cantidad_disponible"
                                    placeholder="Stock"
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${(!newProduct.cantidad_disponible || isNaN(Number(newProduct.cantidad_disponible))) && error ? 'border-red-500' : ''}`}
                                    value={newProduct.cantidad_disponible}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                                    Precio <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    placeholder="Precio"
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${(!newProduct.precio || isNaN(Number(newProduct.precio))) && error ? 'border-red-500' : ''}`}
                                    value={newProduct.precio}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                                    Categoría <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={productCategory ?? ""}
                                        onChange={(e) => setProductCategory(Number(e.target.value) || null)}
                                        className={`mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${(!productCategory && error) ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button

                                    onClick={() => {
                                        resetAddProductForm(); // Limpia el formulario
                                        setError('');
                                        setIsAddModalOpen(false); // Cierra el modal
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddProduct}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Añadir Producto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}










            {isEditModalOpen && productToEdit && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>

                        {/* Nombre */}
                        <div className="mb-4">
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!productToEdit.nombre ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                value={productToEdit.nombre || ''}
                                onChange={handleInputChange}
                                required
                            />
                            {!productToEdit.nombre && (
                                <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
                            )}
                        </div>

                        {/* Código */}
                        <div className="mb-4">
                            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
                                Código <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="codigo"
                                name="codigo"
                                placeholder="Código"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!productToEdit.codigo ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                value={productToEdit.codigo || ''}
                                onChange={handleInputChange}
                                required
                            />
                            {!productToEdit.codigo && (
                                <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="mb-4">
                            <label htmlFor="cantidad_disponible" className="block text-sm font-medium text-gray-700">
                                Stock <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="cantidad_disponible"
                                name="cantidad_disponible"
                                placeholder="Stock"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!productToEdit.cantidad_disponible ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                value={productToEdit.cantidad_disponible || ''}
                                onChange={handleInputChange}
                                required
                            />
                            {!productToEdit.cantidad_disponible && (
                                <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
                            )}
                        </div>

                        {/* Precio */}
                        <div className="mb-4">
                            <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                                Precio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="precio"
                                name="precio"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!productToEdit.precio ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                value={productToEdit.precio || ''}
                                onChange={handleInputChange}
                                required
                            />
                            {!productToEdit.precio && (
                                <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
                            )}
                        </div>

                        {/* Categoría */}
                        <div className="mb-4">
                            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={productCategory ?? ''}
                                onChange={(e) => setProductCategory(Number(e.target.value) || null)}
                                className={`mt-1 block w-full px-4 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!productCategory ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.nombre}
                                    </option>
                                ))}
                            </select>
                            {!productCategory && (
                                <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEditProduct}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default ProductList;
