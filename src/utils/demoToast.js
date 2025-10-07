import { toast as originalToast } from 'sonner';

// Lista de errores de backend que debemos interceptar en modo demo
const BACKEND_ERRORS = [
  'Error de conexión',
  'Error de red',
  'Network Error',
  'ERR_NETWORK',
  'Failed to fetch',
  'Connection refused',
  'CORS error',
  'Backend no disponible',
  'Error al conectar con el servidor',
  '500 Internal Server Error',
  '502 Bad Gateway',
  '503 Service Unavailable',
  '504 Gateway Timeout'
];

// Mensajes demo amigables para diferentes contextos
const DEMO_MESSAGES = {
  success: {
    login: '🎭 ¡Acceso al demo exitoso!',
    create: '✨ Creado exitosamente en el demo',
    update: '📝 Actualizado exitosamente en el demo',
    delete: '🗑️ Eliminado exitosamente en el demo',
    save: '💾 Guardado exitosamente en el demo',
    default: '✅ Operación completada en el demo'
  },
  info: {
    demo: '🎭 Modo Demo - Datos ficticios',
    loading: '⏳ Cargando datos del demo...',
    default: 'ℹ️ Información del demo'
  },
  warning: {
    demo: '⚠️ Recuerda: Estás en modo demo',
    validation: '⚠️ Revisa los datos ingresados',
    default: '⚠️ Advertencia del demo'
  },
  error: {
    demo: '🎭 Error simulado en el demo',
    network: '🎭 Demo: Sin conexión real al backend',
    validation: '❌ Error de validación',
    permission: '🔒 Sin permisos para esta acción',
    notFound: '🔍 Elemento no encontrado en el demo',
    default: '❌ Error en el demo'
  }
};

// Variable para controlar si estamos en modo demo
const isDemoMode = () => {
  const token = localStorage.getItem('token');
  return token && token.startsWith('demo-token-');
};

// Función para determinar si un mensaje de error es de backend
const isBackendError = (message) => {
  if (!message || typeof message !== 'string') return false;
  
  return BACKEND_ERRORS.some(error => 
    message.toLowerCase().includes(error.toLowerCase())
  );
};

// Wrapper para toast que intercepta errores de backend en modo demo
export const toast = {
  success: (message, options = {}) => {
    if (isDemoMode() && typeof message === 'string') {
      // Hacer el mensaje más amigable para demo
      if (message.includes('exitoso') || message.includes('success')) {
        message = `🎭 ${message} (Demo)`;
      }
    }
    return originalToast.success(message, options);
  },

  error: (message, options = {}) => {
    if (isDemoMode() && typeof message === 'string') {
      // Interceptar errores de backend y convertirlos en mensajes amigables
      if (isBackendError(message)) {
        const demoMessage = '🎭 Demo Mode: Todas las operaciones son simuladas y no requieren conexión al servidor';
        return originalToast.info(demoMessage, {
          ...options,
          description: 'Los datos mostrados son ficticios para demostración',
          duration: 4000
        });
      }
      
      // Para otros errores, hacerlos más amigables
      if (message.includes('Error') && !message.includes('Demo')) {
        message = `🎭 Demo: ${message.replace('Error al ', 'Simulando ')}`;
      }
    }
    return originalToast.error(message, options);
  },

  warning: (message, options = {}) => {
    if (isDemoMode() && typeof message === 'string') {
      if (!message.includes('Demo') && !message.includes('🎭')) {
        message = `🎭 Demo: ${message}`;
      }
    }
    return originalToast.warning(message, options);
  },

  info: (message, options = {}) => {
    if (isDemoMode() && typeof message === 'string') {
      if (!message.includes('Demo') && !message.includes('🎭')) {
        message = `🎭 ${message}`;
      }
    }
    return originalToast.info(message, options);
  },

  loading: (message, options = {}) => {
    if (isDemoMode() && typeof message === 'string') {
      message = `🎭 Demo: ${message}`;
    }
    return originalToast.loading(message, options);
  },

  // Método especial para mostrar notificación de demo
  demo: (message, type = 'info', options = {}) => {
    const demoMessage = `🎭 Demo: ${message}`;
    const defaultOptions = {
      description: 'Modo demostración con datos ficticios',
      duration: 3000,
      ...options
    };

    switch (type) {
      case 'success':
        return originalToast.success(demoMessage, defaultOptions);
      case 'error':
        return originalToast.error(demoMessage, defaultOptions);
      case 'warning':
        return originalToast.warning(demoMessage, defaultOptions);
      default:
        return originalToast.info(demoMessage, defaultOptions);
    }
  },

  // Método para mostrar que estamos en modo demo
  showDemoMode: () => {
    if (isDemoMode()) {
      return originalToast.info('🎭 Modo Demo Activo', {
        description: 'Todos los datos son ficticios para demostración',
        duration: 3000
      });
    }
  },

  // Pasar métodos originales que no necesitan modificación
  dismiss: originalToast.dismiss,
  promise: originalToast.promise,
  custom: originalToast.custom
};

// Función de utilidad para manejar errores de manera consistente
export const handleDemoError = (error, context = 'operación') => {
  console.log(`🎭 Demo Error en ${context}:`, error);
  
  if (isDemoMode()) {
    // En modo demo, convertir errores en notificaciones informativas
    if (isBackendError(error.message)) {
      toast.info(`🎭 Demo: ${context} simulada correctamente`, {
        description: 'Sin conexión real al backend requerida'
      });
    } else {
      toast.demo(`Error simulado en ${context}`, 'error');
    }
  } else {
    // En modo normal, mostrar el error real
    toast.error(error.message || `Error en ${context}`);
  }
};

// Función para simular operaciones exitosas
export const simulateSuccess = (operation, message) => {
  if (isDemoMode()) {
    toast.demo(message || `${operation} exitosa`, 'success');
  }
};