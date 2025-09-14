import { Building, Mail, Globe, Bell, Lock, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Configuraciones</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Informacion de la empresa
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                  Nombre de la empresa
                </label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Sitio Web
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <Globe className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="website"
                    id="website"
                    className="flex-1 block w-full border border-gray-300 rounded-none rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Configuracion de correo electronico
            </h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                    Notificaciones por correo electronico
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="marketing-emails"
                    name="marketing-emails"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="marketing-emails" className="ml-2 block text-sm text-gray-900">
                  Correos electrónicos de marketing
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notificaciones
            </h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="push-notifications"
                    name="push-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-900">
                    Enviar notificaciones
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="stock-alerts"
                    name="stock-alerts"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="stock-alerts" className="ml-2 block text-sm text-gray-900">
                    Alertas de stock bajo
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Seguridad
            </h3>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                <Lock className="h-4 w-4 mr-2" />
                Cambiar la contraseña
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 flex items-center justify-end rounded-b-lg">
          <button className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancelar
          </button>
          <button className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;