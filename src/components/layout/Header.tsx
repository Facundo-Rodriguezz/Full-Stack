import React, { useState } from 'react';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-neutral-50 bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Inventario Elohim</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-sm focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="hidden md:block font-medium text-gray-700">
                    {user?.name || 'User'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4" />
                        Configuraciones
                      </button>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;