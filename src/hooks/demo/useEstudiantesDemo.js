import { useDemoQuery, useDemoMutation, createDemoQueryFn, createDemoMutationFn } from './useDemoQuery';
import { mockData } from '../../data/mockData';

/**
 * Hook para obtener todos los estudiantes
 */
export const useEstudiantesDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ['estudiantes', filters],
    queryFn: createDemoQueryFn('estudiantes', filters),
    defaultData: []
  });
};

/**
 * Hook para obtener estudiantes por aula
 */
export const useEstudiantesPorAulaDemo = (aulaId) => {
  return useDemoQuery({
    queryKey: ['estudiantes', 'aula', aulaId],
    queryFn: async () => {
      const estudiantes = mockData.estudiantes.filter(e => e.aulaId === aulaId);
      return estudiantes;
    },
    enabled: !!aulaId,
    defaultData: []
  });
};

/**
 * Hook para obtener un estudiante por ID
 */
export const useEstudianteDemo = (estudianteId) => {
  return useDemoQuery({
    queryKey: ['estudiante', estudianteId],
    queryFn: async () => {
      const estudiante = mockData.estudiantes.find(e => e.id === estudianteId);
      if (!estudiante) {
        throw new Error('Estudiante no encontrado');
      }
      return estudiante;
    },
    enabled: !!estudianteId,
    defaultData: null
  });
};

/**
 * Hook para crear estudiante
 */
export const useCrearEstudianteDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn('create', 'estudiantes'),
    onSuccess: (data) => {
      console.log('🎭 Demo: Estudiante creado exitosamente', data);
    }
  });
};

/**
 * Hook para actualizar estudiante
 */
export const useActualizarEstudianteDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn('update', 'estudiantes'),
    onSuccess: (data) => {
      console.log('🎭 Demo: Estudiante actualizado exitosamente', data);
    }
  });
};

/**
 * Hook para eliminar estudiante
 */
export const useEliminarEstudianteDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn('delete', 'estudiantes'),
    onSuccess: (data) => {
      console.log('🎭 Demo: Estudiante eliminado exitosamente', data);
    }
  });
};