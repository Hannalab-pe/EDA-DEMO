// Interceptor común para servicios que manejan modo demo
import { DEMO_MODE } from './demoService';

export const createDemoInterceptor = (api) => {
  // Interceptor para requests
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor para responses con manejo de modo demo
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // En modo demo, no mostrar errores de red ni redirigir
      if (DEMO_MODE) {
        console.log('🎭 Demo mode: Interceptando error de red', error.message);
        // Retornar el error pero sin logging agresivo
        return Promise.reject(error);
      }

      // En modo normal, comportamiento original
      console.error('Error en la respuesta del API:', error);
      
      // Si el token expiró, redirigir al login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );

  return api;
};

export default createDemoInterceptor;