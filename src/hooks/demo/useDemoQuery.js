import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockData, simulateApiDelay, generateId } from '../../data/mockData';

// Variable para controlar el modo demo
const DEMO_MODE = true;

/**
 * Hook personalizado para consultas demo que simula useQuery
 * @param {Object} options - Opciones del query
 * @param {string} options.queryKey - Clave única para la consulta
 * @param {Function} options.queryFn - Función que retorna datos demo
 * @param {*} options.defaultData - Datos por defecto
 * @returns {Object} - Resultado similar a useQuery
 */
export const useDemoQuery = ({
  queryKey,
  queryFn,
  defaultData = [],
  enabled = true,
  staleTime = 5 * 60 * 1000,
  ...options
}) => {
  if (!DEMO_MODE) {
    // En modo no demo, usar useQuery normal
    return useQuery({
      queryKey,
      queryFn,
      staleTime,
      enabled,
      ...options
    });
  }

  // En modo demo, simular la consulta
  return useQuery({
    queryKey,
    queryFn: async () => {
      await simulateApiDelay(300, 800);
      return await queryFn();
    },
    staleTime,
    enabled,
    initialData: defaultData,
    ...options
  });
};

/**
 * Hook personalizado para mutaciones demo que simula useMutation
 * @param {Object} options - Opciones de la mutación
 * @param {Function} options.mutationFn - Función de mutación demo
 * @param {Function} options.onSuccess - Callback de éxito
 * @param {Function} options.onError - Callback de error
 * @returns {Object} - Resultado similar a useMutation
 */
export const useDemoMutation = ({
  mutationFn,
  onSuccess,
  onError,
  ...options
}) => {
  const queryClient = useQueryClient();

  if (!DEMO_MODE) {
    // En modo no demo, usar useMutation normal
    return useMutation({
      mutationFn,
      onSuccess,
      onError,
      ...options
    });
  }

  // En modo demo, simular la mutación
  return useMutation({
    mutationFn: async (variables) => {
      await simulateApiDelay(500, 1200);
      const result = await mutationFn(variables);
      console.log('🎭 Demo Mutation:', { variables, result });
      return result;
    },
    onSuccess: (data, variables, context) => {
      console.log('🎭 Demo Mutation Success:', data);
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.log('🎭 Demo Mutation Error:', error);
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...options
  });
};

/**
 * Generador de funciones query para datos específicos
 */
export const createDemoQueryFn = (dataKey, filters = {}) => {
  return async () => {
    const data = mockData[dataKey] || [];
    
    // Aplicar filtros si se proporcionan
    if (Object.keys(filters).length > 0) {
      return data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null || value === '') {
            return true;
          }
          return item[key] === value;
        });
      });
    }
    
    return data;
  };
};

/**
 * Generador de funciones de mutación para operaciones CRUD
 */
export const createDemoMutationFn = (operation, dataKey) => {
  return async (variables) => {
    const data = mockData[dataKey] || [];
    
    switch (operation) {
      case 'create':
        const newItem = {
          id: generateId(),
          ...variables,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString()
        };
        console.log(`🎭 Demo: Creando ${dataKey}`, newItem);
        return newItem;
        
      case 'update':
        const { id, ...updateData } = variables;
        const existingItem = data.find(item => item.id === id);
        if (!existingItem) {
          throw new Error(`${dataKey} con ID ${id} no encontrado`);
        }
        const updatedItem = {
          ...existingItem,
          ...updateData,
          fechaActualizacion: new Date().toISOString()
        };
        console.log(`🎭 Demo: Actualizando ${dataKey}`, updatedItem);
        return updatedItem;
        
      case 'delete':
        const itemToDelete = data.find(item => item.id === variables.id);
        if (!itemToDelete) {
          throw new Error(`${dataKey} con ID ${variables.id} no encontrado`);
        }
        console.log(`🎭 Demo: Eliminando ${dataKey}`, itemToDelete);
        return { success: true, deletedItem: itemToDelete };
        
      default:
        throw new Error(`Operación no soportada: ${operation}`);
    }
  };
};

/**
 * Hook para invalidar queries en modo demo
 */
export const useDemoQueryInvalidation = () => {
  const queryClient = useQueryClient();
  
  const invalidateQueries = (queryKey) => {
    if (DEMO_MODE) {
      console.log('🎭 Demo: Invalidando queries', queryKey);
    }
    return queryClient.invalidateQueries({ queryKey });
  };
  
  return { invalidateQueries };
};

export default {
  useDemoQuery,
  useDemoMutation,
  createDemoQueryFn,
  createDemoMutationFn,
  useDemoQueryInvalidation
};