import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Role } from '../types/auth.types';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-600">KFE Cafetería</h1>
            
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className={`${
                  isActive('/') ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-orange-600'
                } transition-colors`}
              >
                Inicio
              </Link>

              {(user?.role === Role.ADMIN || user?.role === Role.CASHIER) && (
                <Link
                  to="/pos"
                  className={`${
                    isActive('/pos') ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-orange-600'
                  } transition-colors`}
                >
                  Punto de Venta
                </Link>
              )}

              {user?.role === Role.ADMIN && (
                <Link
                  to="/products"
                  className={`${
                    isActive('/products') ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-orange-600'
                  } transition-colors`}
                >
                  Productos
                </Link>
              )}

              {(user?.role === Role.ADMIN || user?.role === Role.MANAGER) && (
                <Link
                  to="/dashboard"
                  className={`${
                    isActive('/dashboard') ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-orange-600'
                  } transition-colors`}
                >
                  Dashboard
                </Link>
              )}

              <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-300">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
