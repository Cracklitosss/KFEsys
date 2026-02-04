import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Bienvenido, {user?.fullName}
        </h2>
        <p className="text-gray-600 mb-6">
          Has iniciado sesión correctamente en el sistema KFE.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800 font-medium">
            Rol actual: <span className="uppercase">{user?.role}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
