// src/hooks/queries/useAsignacionCursosQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { demoAsignacionCursosService } from "../../services/demoAsignacionCursosService";

// Query keys para asignaciones de cursos
export const asignacionCursosKeys = {
  all: ["asignacion-cursos"],
  lists: () => [...asignacionCursosKeys.all, "list"],
  list: (filters) => [...asignacionCursosKeys.lists(), { filters }],
  details: () => [...asignacionCursosKeys.all, "detail"],
  detail: (id) => [...asignacionCursosKeys.details(), id],
};

// Hooks para asignaciones de cursos
export const useAsignacionCursos = (filters = {}) => {
  return useQuery({
    queryKey: asignacionCursosKeys.list(filters),
    queryFn: async () => {
      const response = await demoAsignacionCursosService.getAsignacionCursos(
        filters
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useAsignacionCurso = (id) => {
  return useQuery({
    queryKey: asignacionCursosKeys.detail(id),
    queryFn: async () => {
      const response = await demoAsignacionCursosService.getAsignacionCursoById(
        id
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateAsignacionCurso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (asignacionData) => {
      const response = await demoAsignacionCursosService.createAsignacionCurso(
        asignacionData
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Asignación de curso creada exitosamente");
      queryClient.invalidateQueries({ queryKey: asignacionCursosKeys.all });
    },
    onError: (error) => {
      console.error("Error al crear asignación de curso:", error);
      toast.error(error.message || "Error al crear asignación de curso");
    },
  });
};

export const useUpdateAsignacionCurso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await demoAsignacionCursosService.updateAsignacionCurso({
        id,
        data,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Asignación de curso actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: asignacionCursosKeys.all });
    },
    onError: (error) => {
      console.error("Error al actualizar asignación de curso:", error);
      toast.error(error.message || "Error al actualizar asignación de curso");
    },
  });
};

export const useDeleteAsignacionCurso = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await demoAsignacionCursosService.deleteAsignacionCurso(
        id
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Asignación de curso eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: asignacionCursosKeys.all });
    },
    onError: (error) => {
      console.error("Error al eliminar asignación de curso:", error);
      toast.error(error.message || "Error al eliminar asignación de curso");
    },
  });
};
