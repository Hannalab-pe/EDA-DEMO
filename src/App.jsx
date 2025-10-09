import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { useAuthStore } from './store';
import { ProtectedRoute } from './components/auth';
import ChangePasswordModal from './components/auth/ChangePasswordModal';
import Login from './pages/auth/Login';
import Dashboard from './pages/auth/Dashboard';

// Configuración del QueryClient con cache de 5-10 minutos
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos - tiempo antes de considerar datos obsoletos
      gcTime: 10 * 60 * 1000, // 10 minutos - tiempo antes de limpiar cache (antes cacheTime)
      retry: 1, // Reintentar una vez en caso de error
      refetchOnWindowFocus: false, // No refetch al cambiar de ventana
      refetchOnReconnect: true, // Refetch al reconectar internet
    },
    mutations: {
      retry: 1, // Reintentar mutaciones una vez
    },
  },
});

function App() {
  const { initializeAuth, isAuthenticated, loading, user, clearAll } = useAuthStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Inicializar autenticación al cargar la app
  useEffect(() => {
    initializeAuth();
    
    // Agregar función de debug global para limpiar estado
    if (typeof window !== 'undefined') {
      window.clearAuthState = () => {
        console.log('🔧 Ejecutando limpieza de estado desde consola...');
        clearAll();
        window.location.reload();
      };
      
      window.debugAuth = () => {
        const currentState = useAuthStore.getState();
        console.log('🔍 Estado actual de autenticación:', {
          isAuthenticated: currentState.isAuthenticated,
          user: currentState.user,
          role: currentState.role,
          token: currentState.token?.substring(0, 20) + '...',
          localStorage: {
            token: localStorage.getItem('token')?.substring(0, 20) + '...',
            authStorage: localStorage.getItem('auth-storage') ? 'Presente' : 'Ausente'
          }
        });
      };
      
      console.log('🔧 Funciones de debug disponibles:');
      console.log('  - window.clearAuthState() - Limpia completamente el estado');
      console.log('  - window.debugAuth() - Muestra el estado actual');
    }
  }, []);

  // Verificar si necesita cambiar contraseña después de autenticarse
  // DESHABILITADO: Ahora se maneja en cada dashboard individualmente
  /*
  useEffect(() => {
    if (isAuthenticated && user && user.cambioContrasena === false) {
      setShowPasswordModal(true);
    } else {
      setShowPasswordModal(false);
    }
  }, [isAuthenticated, user]);
  */

  const handlePasswordChangeSuccess = (success) => {
    if (success) {
      setShowPasswordModal(false);
      // Actualizar el estado del usuario para indicar que ya cambió la contraseña
      // Esto evitará que el modal se muestre nuevamente
      useAuthStore.setState(state => ({
        ...state,
        user: {
          ...state.user,
          cambioContrasena: true
        }
      }));
    }
  };

  // Mostrar loading mientras se inicializa la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container min-h-screen bg-gray-50">
        <Router future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
          <Routes>
            {/* Ruta raíz - redirige según autenticación */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Navigate to="/login" replace />
              } 
            />
            
            {/* Login - solo accesible si no está autenticado */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Login />
              } 
            />
            
            {/* Dashboard protegido */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta 404 */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Página no encontrada</p>
                    <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                  </div>
                </div>
              } 
            />
          </Routes>
        </Router>
        
        {/* Toaster para notificaciones globales */}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          duration={4000}
        />

        {/* Modal de cambio de contraseña obligatorio */}
        {showPasswordModal && user && (
          <ChangePasswordModal
            isOpen={showPasswordModal}
            onClose={handlePasswordChangeSuccess}
            userId={user.id}
            userName={user.nombre || user.fullName}
          />
        )}
      </div>
      
      {/* React Query DevTools - solo en desarrollo */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
