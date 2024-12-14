import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Package } from 'lucide-react';
import axios from 'axios';

interface Movimiento {
  id: number;
  fecha: string;
  codigo: string;
  producto_nombre: string;
  tipo_movimiento: string;
  cantidad: number;
  comentario: string;
}

const Inventory = () => {
  const [movements, setMovements] = useState<Movimiento[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/movimientos-stock/', ).then((res) => {
      setMovements(res.data.map((movement: any) => ({
        id: movement.id,
        fecha: movement.fecha,
        codigo: movement.producto_codigo,
        tipo_movimiento: movement.tipo_movimiento,
        cantidad: movement.cantidad,
        producto_nombre: movement.producto_nombre,
        comentario: movement.comentario,
      })));
    });
  }, []);

  function getTipoMovimiento(movimiento: Movimiento): React.ReactNode {
    const { tipo_movimiento, comentario } = movimiento;
    
    switch (tipo_movimiento) {
      case 'entrada':
        return (
          <div title={comentario} className="flex items-center">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <span className="ml-1">Entrada</span>
          </div>
        );
      case 'salida':
        return (
          <div title={comentario} className="flex items-center">
            <ArrowDown className="h-4 w-4 text-red-500" />
            <span className="ml-1">Salida</span>
          </div>
        );
      case 'eliminacion':
        return (
          <div title={comentario} className="flex items-center">
            <ArrowDown className="h-4 w-4 text-red-500" />
            <span className="ml-1">Eliminación</span>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Registro de Inventario</h1>
        <div className="flex space-x-3">
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Movimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(movement.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {movement.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{movement.producto_nombre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        movement.tipo_movimiento == 'entrada'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {getTipoMovimiento(movement)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {movement.cantidad} Unidades
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;