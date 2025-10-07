import axios from 'axios';
import { estudiantesDemoService, aulasDemoService, planificacionesDemoService, DEMO_MODE } from './demoService';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nidopro.up.railway.app/api/v1';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
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

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!DEMO_MODE) {
      console.error('Error en estudianteService:', error);
      
      // Si el token expiró, redirigir al login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Servicio para gestión de estudiantes
 */
export const estudianteService = {
  /**
   * Obtener estudiantes por aula
   * @param {string} idAula - ID del aula
   * @returns {Promise} Lista de estudiantes del aula
   */
  getEstudiantesPorAula: async (idAula) => {
    if (DEMO_MODE) {
      try {
        const result = await estudiantesDemoService.getByAula(idAula);
        return result.data;
      } catch (error) {
        console.error('🎭 Demo Error:', error.message);
        throw new Error('Error al obtener estudiantes del aula en modo demo');
      }
    }

    try {
      const response = await api.get(`/estudiante/aula/${idAula}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estudiantes por aula:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener estudiantes del aula');
    }
  },

  /**
   * Obtener un estudiante específico por ID
   * @param {string} idEstudiante - ID del estudiante
   * @returns {Promise<Object>} Datos completos del estudiante
   */
  obtenerEstudiantePorId: async (idEstudiante) => {
    if (DEMO_MODE) {
      try {
        const result = await estudiantesDemoService.getById(idEstudiante);
        return result.data;
      } catch (error) {
        console.error('🎭 Demo Error:', error.message);
        throw new Error('Error al obtener datos del estudiante en modo demo');
      }
    }

    try {
      // Incluir parámetros para traer relaciones necesarias
      const response = await api.get(`/estudiante/${idEstudiante}`, {
        params: {
          include: 'matriculas,aula,matriculaAula' // Incluir relaciones
        }
      });
      
      // Verificar estructura de respuesta
      if (response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener datos del estudiante');
    }
  },

  /**
   * Obtener cronograma de un aula específica
   * @param {string} idAula - ID del aula
   * @returns {Promise<Array>} Lista de actividades del cronograma
   */
  obtenerCronogramaPorAula: async (idAula) => {
    if (DEMO_MODE) {
      try {
        // Validar que el idAula sea válido
        if (!idAula || idAula === 'undefined' || idAula === 'null') {
          throw new Error('ID de aula no válido');
        }

        // Obtener planificaciones para el aula
        const result = await planificacionesDemoService.getAll({ gradoId: idAula });
        return result.data || [];
      } catch (error) {
        console.error('🎭 Demo Error:', error.message);
        return []; // Retornar array vacío en caso de error en demo
      }
    }

    try {
      // Validar que el idAula sea válido antes de hacer la petición
      if (!idAula || idAula === 'undefined' || idAula === 'null') {
        throw new Error('ID de aula no válido');
      }
      
      const response = await api.get(`/cronograma/aula/${idAula}`);
      
      // Manejar diferentes estructuras de respuesta del backend
      if (response.data?.success && response.data?.cronogramas) {
        return response.data.cronogramas;
      } else if (response.data?.success && response.data?.cronograma) {
        return response.data.cronograma;
      } else if (response.data?.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener cronograma del aula');
    }
  },

  /**
   * Obtener todos los estudiantes
   * @returns {Promise<Array>} Lista de todos los estudiantes
   */
  obtenerTodosLosEstudiantes: async () => {
    if (DEMO_MODE) {
      try {
        const result = await estudiantesDemoService.getAll();
        return result.data;
      } catch (error) {
        console.error('🎭 Demo Error:', error.message);
        throw new Error('Error al obtener estudiantes en modo demo');
      }
    }

    try {
      const response = await api.get('/estudiante');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estudiantes:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener estudiantes');
    }
  },

  /**
   * Crear nuevo estudiante
   * @param {Object} estudianteData - Datos del estudiante
   * @returns {Promise<Object>} Estudiante creado
   */
  crearEstudiante: async (estudianteData) => {
    if (DEMO_MODE) {
      try {
        const result = await estudiantesDemoService.create(estudianteData);
        return result.data;
      } catch (error) {
        console.error('🎭 Demo Error:', error.message);
        throw new Error('Error al crear estudiante en modo demo');
      }
    }

    try {
      const response = await api.post('/estudiante', estudianteData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear estudiante:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al crear estudiante');
    }
  },

  /**
   * Actualizar estudiante
   * @param {string} idEstudiante - ID del estudiante
   * @param {Object} estudianteData - Datos actualizados
   * @returns {Promise<Object>} Estudiante actualizado
   */
  actualizarEstudiante: async (idEstudiante, estudianteData) => {
    if (DEMO_MODE) {
      try {
        const result = await estudiantesDemoService.update(idEstudiante, estudianteData);
        return result.data;
      } catch (error) {
        console.error('🎭 Demo Error:', error.message);
        throw new Error('Error al actualizar estudiante en modo demo');
      }
    }

    try {
      const response = await api.put(`/estudiante/${idEstudiante}`, estudianteData);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar estudiante:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al actualizar estudiante');
    }
  },

  /**
   * Eliminar estudiante
   * @param {string} idEstudiante - ID del estudiante
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  eliminarEstudiante: async (idEstudiante) => {
    if (DEMO_MODE) {
      try {
        const result = await estudiantesDemoService.delete(idEstudiante);
        return result;
      } catch (error) {
        console.error('🎭 Demo Error:', error.message);
        throw new Error('Error al eliminar estudiante en modo demo');
      }
    }

    try {
      const response = await api.delete(`/estudiante/${idEstudiante}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar estudiante:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error al eliminar estudiante');
    }
  }
};

export default {
  getEstudiantesPorAula: estudianteService.getEstudiantesPorAula,
  obtenerEstudiantePorId: estudianteService.obtenerEstudiantePorId,
  obtenerCronogramaPorAula: estudianteService.obtenerCronogramaPorAula,
  obtenerTodosLosEstudiantes: estudianteService.obtenerTodosLosEstudiantes,
  crearEstudiante: estudianteService.crearEstudiante,
  actualizarEstudiante: estudianteService.actualizarEstudiante,
  eliminarEstudiante: estudianteService.eliminarEstudiante
};
