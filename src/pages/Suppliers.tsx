import React from 'react';
import { Plus, Search, Truck, Mail, Phone } from 'lucide-react';

const suppliers = [
  {
    id: 1,
    name: 'DPM.',
    contact: 'John Smith',
    email: 'john@officesupplies.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
  },
  {
    id: 2,
    name: 'Vasa SRL.',
    contact: 'Sarah Johnson',
    email: 'sarah@furniturewholesale.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
  },
  {
    id: 3,
    name: 'Food Solutions.',
    contact: 'Mike Wilson',
    email: 'mike@techdist.com',
    phone: '+1 (555) 345-6789',
    status: 'inactive',
  },
];

const Suppliers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Proveedores</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Proveedores
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar Proveedores..."
            />
          </div>
        </div>

        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <li key={supplier.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">{supplier.name}</h2>
                      <p className="text-sm text-gray-500">Contacto: {supplier.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        supplier.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {supplier.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-900">Editar</button>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {supplier.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {supplier.phone}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;