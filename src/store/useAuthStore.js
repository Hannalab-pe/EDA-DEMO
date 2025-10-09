import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      role: null,
      permissions: [],
      isAuthenticated: false,
      loading: false,
      error: null,
      initialized: false,

      // Acciones de autenticación
      login: (userData) => {
        console.log('🔐 Iniciando sesión como:', userData.user.rol, userData.user.fullName);
        
        // Guardar token en localStorage
        localStorage.setItem('token', userData.token);
        
        // Actualizar estado de Zustand
        set({
          user: userData.user,
          token: userData.token,
          role: userData.role,
          permissions: userData.permissions || [],
          isAuthenticated: true,
          error: null,
        });
        
        console.log('✅ Sesión guardada correctamente');
      },

      logout: async () => {
        try {
          // Llamar al servicio de logout para limpiar en el backend
          const { authService } = await import('../services/authService');
          await authService.logout();
        } catch (error) {
          console.log('Error al cerrar sesión en backend:', error);
        }
        
        // Limpiar estado de Zustand
        set({
          user: null,
          token: null,
          role: null,
          permissions: [],
          isAuthenticated: false,
          loading: false,
          error: null,
          initialized: false,
        });
        
        // Limpiar localStorage completamente
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        
        // Redirigir al login
        window.location.href = '/login';
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Actualizar perfil de usuario
      updateProfile: (profileData) => {
        set((state) => ({
          user: { ...state.user, ...profileData },
        }));
      },

      // Actualizar usuario completo
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      // Verificar si el usuario tiene un permiso específico
      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      // Verificar si el usuario tiene un rol específico
      hasRole: (roleName) => {
        const { role } = get();
        return role?.nombre === roleName;
      },

      // Verificar si es admin
      isAdmin: () => {
        const { role } = get();
        return role?.nombre === 'admin' || role?.nombre === 'administrador';
      },

      // Verificar si es profesor/trabajador
      isTrabajador: () => {
        const { role } = get();
        return role?.nombre === 'profesor' || role?.nombre === 'trabajador';
      },

      // Verificar si es padre
      isPadre: () => {
        const { role } = get();
        return role?.nombre === 'padre' || role?.nombre === 'parent';
      },

      // Verificar si es especialista
      isEspecialista: () => {
        const { role } = get();
        return role?.nombre === 'especialista' || role?.nombre === 'specialist';
      },

      // Limpiar completamente el estado y localStorage (para debug)
      clearAll: () => {
        console.log('🧹 Limpiando completamente el estado de autenticación');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        
        // Resetear estado
        set({
          user: null,
          token: null,
          role: null,
          permissions: [],
          isAuthenticated: false,
          loading: false,
          error: null,
          initialized: false,
        });
        
        console.log('✅ Estado limpiado completamente');
      },

      // Obtener el ID del rol para APIs
      getRoleId: () => {
        const { role } = get();
        return role?.id || null;
      },

      // Inicializar desde token existente
      initializeAuth: async () => {
        const { initialized } = get();
        if (initialized) return; // Evitar múltiples inicializaciones
        
        set({ loading: true, initialized: true });
        
        const token = localStorage.getItem('token');
        if (token) {
          // Solo para tokens demo válidos
          if (token.startsWith('demo-token-')) {
            try {
              const { authService } = await import('../services/authService');
              const validation = await authService.validateToken(token);
              
              if (validation.valid) {
                console.log('🔄 Restaurando sesión demo válida:', validation.user.rol);
                set({ 
                  user: validation.user,
                  token, 
                  isAuthenticated: true, 
                  role: validation.role,
                  permissions: validation.permissions || [],
                  loading: false 
                });
                return;
              }
            } catch (error) {
              console.log('❌ Error validando token demo:', error);
              // Si falla la validación, limpiar todo
              localStorage.removeItem('token');
              localStorage.removeItem('auth-storage');
            }
          } else {
            // Si no es un token demo válido, limpiar todo
            console.log('🧹 Token no válido, limpiando localStorage');
            localStorage.removeItem('token');
            localStorage.removeItem('auth-storage');
          }
        }
        
        // Si llegamos aquí, no hay sesión válida
        set({ 
          user: null,
          token: null,
          role: null,
          permissions: [],
          isAuthenticated: false,
          loading: false,
          error: null
        });
      },
    }),
    {
      name: 'auth-storage', // Nombre para localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };
