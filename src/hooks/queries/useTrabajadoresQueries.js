import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { demoTrabajadoresService } from "../../services/demoTrabajadoresService";
import demoComentariosDocentesService from "../../services/demoComentariosDocentesService";
import { mockData, generateId } from "../../data/mockData";

export const trabajadoresKeys = {
  all: ["trabajadores"],
  lists: () => [...trabajadoresKeys.all, "list"],
  list: (filters) => [...trabajadoresKeys.lists(), { filters }],
  details: () => [...trabajadoresKeys.all, "detail"],
  detail: (id) => [...trabajadoresKeys.details(), id],
  comentarios: () => ["comentarios-docentes"],
  comentario: (id) => [...trabajadoresKeys.comentarios(), id],
};

export const useTrabajadores = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: trabajadoresKeys.list(filters),
    queryFn: () => demoTrabajadoresService.getAllTrabajadores(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useDocentes = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: [...trabajadoresKeys.list(filters), "docentes"],
    queryFn: async () => {
      const response = await demoTrabajadoresService.getAllTrabajadores(
        filters
      );
      if (response && Array.isArray(response)) {
        return response.filter(
          (trabajador) =>
            trabajador.idRol?.nombre === "DOCENTE" ||
            trabajador.rol?.nombre === "DOCENTE"
        );
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useTrabajador = (id, options = {}) => {
  return useQuery({
    queryKey: trabajadoresKeys.detail(id),
    queryFn: () => demoTrabajadoresService.getTrabajadorById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useCreateTrabajador = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trabajadorData) =>
      demoTrabajadoresService.createTrabajador(trabajadorData),
    onMutate: () => {
      const loadingToast = toast.loading("Creando trabajador...", {
        description: "Guardando datos...",
      });
      return { loadingToast };
    },
    onSuccess: (newTrabajador, variables, context) => {
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
      toast.success("Trabajador creado exitosamente!", {
        id: context.loadingToast,
        description: `${newTrabajador.nombre} ${newTrabajador.apellido} ha sido agregado`,
      });
    },
    onError: (error, variables, context) => {
      toast.error("Error al crear trabajador", {
        id: context?.loadingToast,
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });
};

export const useUpdateTrabajador = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      demoTrabajadoresService.updateTrabajador(id, data),
    onMutate: () => {
      const loadingToast = toast.loading("Actualizando trabajador...", {
        description: "Guardando cambios...",
      });
      return { loadingToast };
    },
    onSuccess: (updatedTrabajador, variables, context) => {
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: trabajadoresKeys.detail(variables.id),
      });
      toast.success("Trabajador actualizado exitosamente", {
        id: context.loadingToast,
        description: `Los datos de ${updatedTrabajador.nombre} han sido actualizados`,
      });
    },
    onError: (error, variables, context) => {
      toast.error("Error al actualizar trabajador", {
        id: context?.loadingToast,
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });
};

export const useDeleteTrabajador = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => demoTrabajadoresService.deleteTrabajador(id),
    onMutate: () => {
      const loadingToast = toast.loading("Eliminando trabajador...", {
        description: "Procesando eliminación...",
      });
      return { loadingToast };
    },
    onSuccess: (data, id, context) => {
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
      queryClient.removeQueries({ queryKey: trabajadoresKeys.detail(id) });
      toast.success("Trabajador eliminado exitosamente", {
        id: context.loadingToast,
        description: "El registro ha sido eliminado del sistema",
      });
    },
    onError: (error, variables, context) => {
      toast.error("Error al eliminar trabajador", {
        id: context?.loadingToast,
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });
};

export const useToggleTrabajadorStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ trabajador }) => {
      const trabajadorId = trabajador.idTrabajador || trabajador.id;
      if (!trabajadorId) throw new Error("ID del trabajador no encontrado");
      return demoTrabajadoresService.toggleTrabajadorStatus(
        trabajadorId,
        !trabajador.estaActivo
      );
    },
    onMutate: ({ trabajador }) => {
      const action = trabajador.estaActivo ? "desactivando" : "activando";
      const loadingToast = toast.loading(
        `${action.charAt(0).toUpperCase() + action.slice(1)} trabajador...`
      );
      return { loadingToast, trabajador };
    },
    onSuccess: (response, variables, context) => {
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: trabajadoresKeys.detail(
          variables.trabajador.idTrabajador || variables.trabajador.id
        ),
      });
      const status = context.trabajador.estaActivo ? "desactivado" : "activado";
      toast.success(`Trabajador ${status} exitosamente`, {
        id: context.loadingToast,
        description: `${context.trabajador.nombre} ${context.trabajador.apellido} ha sido ${status}`,
      });
    },
    onError: (error, variables, context) => {
      const action = context.trabajador.estaActivo ? "desactivar" : "activar";
      toast.error(`Error al ${action} trabajador`, {
        id: context?.loadingToast,
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });
};

export const useInvalidateTrabajadores = () => {
  const queryClient = useQueryClient();
  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: trabajadoresKeys.all });
  }, [queryClient]);
  const invalidateLists = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: trabajadoresKeys.lists() });
  }, [queryClient]);
  const invalidateDetail = useCallback(
    (id) => {
      queryClient.invalidateQueries({ queryKey: trabajadoresKeys.detail(id) });
    },
    [queryClient]
  );
  return { invalidateAll, invalidateLists, invalidateDetail };
};

// ==========================================
// HOOKS PARA COMENTARIOS/EVALUACIONES DE DOCENTES
// ==========================================

/**
 * Hook para obtener todos los comentarios de docentes
 */
export const useComentariosDocentes = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: trabajadoresKeys.comentarios(),
    queryFn: async () => {
      console.log("[DEMO] Obteniendo comentarios con filtros:", filters);
      const response = await demoComentariosDocentesService.getAll(filters);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook para obtener un comentario específico por ID
 */
export const useComentarioDocente = (id, options = {}) => {
  return useQuery({
    queryKey: trabajadoresKeys.comentario(id),
    queryFn: async () => {
      console.log("[DEMO] Obteniendo comentario por ID:", id);
      const response = await demoComentariosDocentesService.getById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook para crear un nuevo comentario de docente
 */
export const useCreateComentarioDocente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comentarioData) => {
      console.log("[DEMO] Creando comentario:", comentarioData);
      const response = await demoComentariosDocentesService.create(
        comentarioData
      );
      return response.data;
    },
    onMutate: () => {
      const loadingToast = toast.loading("Creando evaluación...", {
        description: "Guardando datos...",
      });
      return { loadingToast };
    },
    onSuccess: (nuevoComentario, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: trabajadoresKeys.comentarios(),
      });
      toast.success("Evaluación creada exitosamente!", {
        id: context.loadingToast,
        description: "La evaluación ha sido registrada",
      });
    },
    onError: (error, variables, context) => {
      toast.error("Error al crear evaluación", {
        id: context?.loadingToast,
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });
};

/**
 * Hook para actualizar un comentario de docente
 */
export const useUpdateComentarioDocente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      console.log("[DEMO] Actualizando comentario:", id, data);
      const response = await demoComentariosDocentesService.update(id, data);
      return response.data;
    },
    onMutate: () => {
      const loadingToast = toast.loading("Actualizando evaluación...", {
        description: "Guardando cambios...",
      });
      return { loadingToast };
    },
    onSuccess: (updatedComentario, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: trabajadoresKeys.comentarios(),
      });
      queryClient.invalidateQueries({
        queryKey: trabajadoresKeys.comentario(variables.id),
      });
      toast.success("Evaluación actualizada exitosamente", {
        id: context.loadingToast,
        description: "Los cambios han sido guardados",
      });
    },
    onError: (error, variables, context) => {
      toast.error("Error al actualizar evaluación", {
        id: context?.loadingToast,
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });
};

/**
 * Hook para eliminar un comentario de docente
 */
export const useDeleteComentarioDocente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      console.log("[DEMO] Eliminando comentario:", id);
      const response = await demoComentariosDocentesService.delete(id);
      return response;
    },
    onMutate: () => {
      const loadingToast = toast.loading("Eliminando evaluación...", {
        description: "Procesando eliminación...",
      });
      return { loadingToast };
    },
    onSuccess: (data, id, context) => {
      queryClient.invalidateQueries({
        queryKey: trabajadoresKeys.comentarios(),
      });
      queryClient.removeQueries({ queryKey: trabajadoresKeys.comentario(id) });
      toast.success("Evaluación eliminada exitosamente", {
        id: context.loadingToast,
        description: "El registro ha sido eliminado del sistema",
      });
    },
    onError: (error, variables, context) => {
      toast.error("Error al eliminar evaluación", {
        id: context?.loadingToast,
        description: error.message || "Ha ocurrido un error inesperado",
      });
    },
  });
};
