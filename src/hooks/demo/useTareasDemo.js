import { useDemoQuery, useDemoMutation, createDemoQueryFn, createDemoMutationFn } from './useDemoQuery';
import { mockData } from '../../data/mockData';

/**
 * Hook para obtener tareas
 */
export const useTareasDemo = (filters = {}) => {
  return useDemoQuery({
    queryKey: ['tareas', filters],
    queryFn: createDemoQueryFn('tareas', filters),
    defaultData: []
  });
};

/**
 * Hook para obtener tareas por estudiante
 */
export const useTareasPorEstudianteDemo = (estudianteId) => {
  return useDemoQuery({
    queryKey: ['tareas', 'estudiante', estudianteId],
    queryFn: async () => {
      // Obtener datos del estudiante
      const estudiante = mockData.estudiantes.find(e => e.id === estudianteId);
      if (!estudiante) return [];
      
      // Filtrar tareas por grado y aula del estudiante
      const tareas = mockData.tareas.filter(t => 
        t.gradoId === estudiante.gradoId || t.aulaId === estudiante.aulaId
      );
      
      // Simular estado de entrega para cada tarea
      return tareas.map(tarea => ({
        ...tarea,
        entregada: Math.random() > 0.3, // 70% probabilidad de estar entregada
        fechaEntrega: Math.random() > 0.5 ? new Date().toISOString() : null,
        calificacion: Math.random() > 0.4 ? ['A', 'B', 'C'][Math.floor(Math.random() * 3)] : null,
        comentarios: Math.random() > 0.6 ? 'Excelente trabajo' : null
      }));
    },
    enabled: !!estudianteId,
    defaultData: []
  });
};

/**
 * Hook para obtener tareas por aula
 */
export const useTareasPorAulaDemo = (aulaId) => {
  return useDemoQuery({
    queryKey: ['tareas', 'aula', aulaId],
    queryFn: async () => {
      const tareas = mockData.tareas.filter(t => t.aulaId === aulaId);
      
      // Agregar estadísticas de entrega
      return tareas.map(tarea => ({
        ...tarea,
        estadisticas: {
          totalEstudiantes: 15,
          entregadas: Math.floor(Math.random() * 15) + 1,
          pendientes: Math.floor(Math.random() * 5),
          calificadas: Math.floor(Math.random() * 12) + 1
        }
      }));
    },
    enabled: !!aulaId,
    defaultData: []
  });
};

/**
 * Hook para obtener tareas por docente
 */
export const useTareasPorDocenteDemo = (docenteId) => {
  return useDemoQuery({
    queryKey: ['tareas', 'docente', docenteId],
    queryFn: async () => {
      const tareas = mockData.tareas.filter(t => t.docenteId === docenteId);
      
      return tareas.map(tarea => ({
        ...tarea,
        estadisticas: {
          totalEstudiantes: 15,
          entregadas: Math.floor(Math.random() * 15) + 1,
          pendientes: Math.floor(Math.random() * 5),
          vencidas: Math.floor(Math.random() * 3)
        }
      }));
    },
    enabled: !!docenteId,
    defaultData: []
  });
};

/**
 * Hook para crear tarea
 */
export const useCrearTareaDemo = () => {
  return useDemoMutation({
    mutationFn: async (tareaData) => {
      const nuevaTarea = {
        id: Date.now().toString(),
        ...tareaData,
        fechaCreacion: new Date().toISOString(),
        estado: 'ACTIVO'
      };
      console.log('🎭 Demo: Creando tarea', nuevaTarea);
      return nuevaTarea;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Tarea creada exitosamente', data);
    }
  });
};

/**
 * Hook para actualizar tarea
 */
export const useActualizarTareaDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn('update', 'tareas'),
    onSuccess: (data) => {
      console.log('🎭 Demo: Tarea actualizada exitosamente', data);
    }
  });
};

/**
 * Hook para eliminar tarea
 */
export const useEliminarTareaDemo = () => {
  return useDemoMutation({
    mutationFn: createDemoMutationFn('delete', 'tareas'),
    onSuccess: (data) => {
      console.log('🎭 Demo: Tarea eliminada exitosamente', data);
    }
  });
};

/**
 * Hook para entregar tarea (estudiante)
 */
export const useEntregarTareaDemo = () => {
  return useDemoMutation({
    mutationFn: async ({ tareaId, estudianteId, archivo, comentarios }) => {
      const entrega = {
        id: Date.now().toString(),
        tareaId,
        estudianteId,
        fechaEntrega: new Date().toISOString(),
        archivo: archivo || null,
        comentarios: comentarios || '',
        estado: 'ENTREGADA'
      };
      console.log('🎭 Demo: Entregando tarea', entrega);
      return entrega;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Tarea entregada exitosamente', data);
    }
  });
};

/**
 * Hook para calificar tarea (docente)
 */
export const useCalificarTareaDemo = () => {
  return useDemoMutation({
    mutationFn: async ({ entregaId, calificacion, comentarios }) => {
      const calificacionData = {
        entregaId,
        calificacion,
        comentarios,
        fechaCalificacion: new Date().toISOString(),
        calificadoPor: '2' // ID del docente demo
      };
      console.log('🎭 Demo: Calificando tarea', calificacionData);
      return calificacionData;
    },
    onSuccess: (data) => {
      console.log('🎭 Demo: Tarea calificada exitosamente', data);
    }
  });
};