import axios from 'axios';
import { demoAuthService } from './demoAuthService';

// Base URL del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nidopro.up.railway.app/api/v1';

// Configuración de axios para auth
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para controlar si usar modo demo
const DEMO_MODE = true; // Cambiar a false para usar backend real

export const authService = {
  // Login con backend real o demo
  async login(credentials) {
    // En modo demo, usar el servicio demo
    if (DEMO_MODE) {
      // Si credentials tiene roleKey, usar directamente
      if (credentials.roleKey) {
        return await demoAuthService.loginDemo(credentials.roleKey);
      }
      
      // Fallback para compatibilidad con login tradicional
      console.log('🎭 Modo Demo activado - Redirigiendo a selector de roles');
      throw new Error('DEMO_MODE_REDIRECT');
    }

    try {
      const payload = {
        usuario: credentials.email,
        contrasena: credentials.password
      };
      
      const response = await authApi.post('/auth/login', payload);
      const { data } = response;
      
      // Estructura del backend real con mapeo de roles
      const getRoleMappingForUser = (backendRole) => {
        if (backendRole === 'DIRECTORA' || backendRole === 'Admin') {
          return { id: '1', nombre: 'admin', permissions: ['all'] };
        } else if (backendRole === 'ESTUDIANTE') {
          return { id: '3', nombre: 'padre', permissions: ['read_own_data', 'view_grades'] };
        } else if (backendRole === 'SECRETARIA') {
          return { id: '4', nombre: 'SECRETARIA', permissions: ['read_students', 'write_students', 'academic_access'] };
        } else {
          return { id: '2', nombre: 'trabajador', permissions: ['read_students', 'write_students'] };
        }
      };

      const roleMapping = getRoleMappingForUser(data.usuario.rol);

      const authResponse = {
        token: data.access_token,
        user: {
          id: data.usuario.sub,
          email: data.usuario.usuario,
          nombre: data.usuario.fullName?.split(' ')[0] || data.usuario.usuario,
          apellido: data.usuario.fullName?.split(' ').slice(1).join(' ') || '',
          fullName: data.usuario.fullName || data.usuario.usuario,
          tipo: data.usuario.tipo,
          rol: data.usuario.rol,
          entidadId: data.usuario.entidadId,
          cambioContrasena: data.usuario.cambioContrasena,
          role: { 
            id: roleMapping.id, 
            nombre: roleMapping.nombre
          },
          permissions: roleMapping.permissions
        },
        role: { 
          id: roleMapping.id, 
          nombre: roleMapping.nombre
        },
        permissions: roleMapping.permissions
      };

      return authResponse;
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      }
      if (error.response?.status === 404) {
        throw new Error('Usuario no encontrado');
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
      }
      
      throw new Error(error.response?.data?.message || 'Error de conexión. Intenta nuevamente.');
    }
  },

  // Login de desarrollo (fallback) - DEPRECADO en modo demo
  async loginDev(credentials) {
    if (DEMO_MODE) {
      console.log('🎭 Usando modo demo en lugar de loginDev');
      return await demoAuthService.loginDemo('docente'); // Default a docente
    }

    try {
      // Simulación para desarrollo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuarios de prueba
      const testUsers = {
        'admin@nidopro.com': {
          id: '1',
          email: 'admin@nidopro.com',
          nombre: 'Administrador',
          apellido: 'Sistema',
          role: { id: '1', nombre: 'admin' },
          permissions: ['all']
        },
        'trabajador@nidopro.com': {
          id: '2', 
          email: 'trabajador@nidopro.com',
          nombre: 'Juan',
          apellido: 'Pérez',
          role: { id: '2', nombre: 'trabajador' },
          permissions: ['read_students', 'write_students']
        }
      };

      const user = testUsers[credentials.email];
      if (!user || credentials.password !== '123456') {
        throw new Error('Credenciales inválidas');
      }

      return {
        token: `dev-token-${user.id}`,
        user,
        role: user.role,
        permissions: user.permissions
      };
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    if (DEMO_MODE) {
      return await demoAuthService.logoutDemo();
    }

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await authApi.post('/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    } finally {
      // Siempre limpiar el localStorage
      localStorage.removeItem('token');
    }
  },

  // Validar token
  async validateToken(token) {
    if (DEMO_MODE) {
      return await demoAuthService.validateTokenDemo(token);
    }

    try {
      // Para tokens reales del backend
      const response = await authApi.get('/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const { data } = response;
      
      return {
        valid: true,
        user: {
          id: data.usuario.sub,
          email: data.usuario.usuario,
          nombre: data.usuario.usuario,
          apellido: '',
          role: { 
            id: (data.usuario.rol === 'DIRECTORA' || data.usuario.rol === 'Admin') ? '1' : '2', 
            nombre: (data.usuario.rol === 'DIRECTORA' || data.usuario.rol === 'Admin') ? 'admin' : 'trabajador'
          },
          permissions: (data.usuario.rol === 'DIRECTORA' || data.usuario.rol === 'Admin') ? ['all'] : ['read_students', 'write_students']
        },
        role: { 
          id: (data.usuario.rol === 'DIRECTORA' || data.usuario.rol === 'Admin') ? '1' : '2', 
          nombre: (data.usuario.rol === 'DIRECTORA' || data.usuario.rol === 'Admin') ? 'admin' : 'trabajador'
        },
        permissions: (data.usuario.rol === 'DIRECTORA' || data.usuario.rol === 'Admin') ? ['all'] : ['read_students', 'write_students']
      };
    } catch (error) {
      console.error('Token inválido:', error);
      return { valid: false };
    }
  },

  // Obtener perfil del usuario
  async getProfile() {
    if (DEMO_MODE) {
      return await demoAuthService.getProfileDemo();
    }

    try {
      const token = localStorage.getItem('token');
      const response = await authApi.get('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Error al obtener perfil de usuario');
    }
  },

  // Actualizar perfil
  async updateProfile(profileData) {
    if (DEMO_MODE) {
      return await demoAuthService.updateProfileDemo(profileData);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await authApi.put('/auth/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar perfil');
    }
  },

  // Cambiar contraseña
  async changePassword(userId, passwordData) {
    if (DEMO_MODE) {
      return await demoAuthService.changePasswordDemo(userId, passwordData);
    }

    try {
      const token = localStorage.getItem('token');
      
      console.log('🔐 Cambiando contraseña para usuario:', userId);
      
      const response = await authApi.patch(`/usuario/${userId}/cambiar-contrasena`, passwordData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('✅ Contraseña cambiada exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error);
      throw new Error(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  }
};

// Interceptor para manejar errores de autenticación globalmente
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - solo limpiar localStorage
      // NO redirigir automáticamente para evitar loops
      localStorage.removeItem('token');
      console.log('Token expirado, limpiando localStorage');
    }
    return Promise.reject(error);
  }
);
