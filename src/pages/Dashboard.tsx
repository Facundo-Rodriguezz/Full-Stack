import axios from 'axios';
import {
  BarChart3,
  Package,
  Truck,
  AlertTriangle,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const stats = [
  {
    name: 'Total Procutos',
    value: '2,651',
    icon: Package,
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Ingreso de Productos',
    value: '15',
    icon: AlertTriangle,
    change: '+1.39%',
    changeType: 'positive',
  },
  {
    name: 'Productos en Falta',
    value: '50',
    icon: Truck,
    change: '-2.35%',
    changeType: 'negative',
  },
  {
    name: 'Presupuesto de Compra.',
    value: '$45,871',
    icon: DollarSign,
    change: '+8.32%',
    changeType: 'positive',
  },
];

const Dashboard = () => {

  const [movements, setMovements] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/movimientos-stock/', ).then((res) => {
      console.log(res);
      setMovements(res.data);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Panel</h1>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <TrendingUp className="h-4 w-4 mr-2" />
            Generar Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-blue-500 rounded-md p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Descripcion general del inventario</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Actividades Recientes</h2>
          </div>
          <div className="flow-root">
            <ul className="-mb-8">
            {movements && movements.length > 0 ? (
              movements.map((movement, idx) => (
                <li key={movement.id}>
                  <div className="relative pb-8">
                    {idx !== movements.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <Package className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Producto <span className="font-medium text-gray-900">{movement.producto.nombre}</span>{' '}
                            {movement.tipo_movimiento}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={movement.fecha}>
                            {formatRelativeTime(movement.fecha)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay movimientos registrados
              </div>
            )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;